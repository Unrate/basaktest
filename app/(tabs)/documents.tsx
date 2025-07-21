import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { FileText, Share, Trash2, CreditCard as Edit, Download, Search, Filter, Plus } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface Document {
  id: string;
  name: string;
  pages: number;
  createdAt: string;
  thumbnail: string;
  size: string;
  path: string;
}

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const stored = await AsyncStorage.getItem('basak_documents');
      if (stored) {
        setDocuments(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const deleteDocument = async (id: string) => {
    Alert.alert(
      'Belgeyi Sil',
      'Bu belgeyi silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            const updated = documents.filter(doc => doc.id !== id);
            setDocuments(updated);
            await AsyncStorage.setItem('basak_documents', JSON.stringify(updated));
          },
        },
      ]
    );
  };

  const shareDocument = (document: Document) => {
    Alert.alert('Paylaş', `"${document.name}" belgesi paylaşılacak.`);
  };

  const editDocument = (document: Document) => {
    Alert.alert('Düzenle', `"${document.name}" belgesi düzenlenecek.`);
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedDocuments = filteredDocuments.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        return parseFloat(a.size) - parseFloat(b.size);
      case 'date':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const renderDocument = ({ item }: { item: Document }) => (
    <View style={styles.documentCard}>
      <View style={styles.documentThumbnail}>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnailImage} />
        ) : (
          <FileText size={32} color="#DC2626" />
        )}
        <View style={styles.pageIndicator}>
          <Text style={styles.pageCount}>{item.pages}</Text>
        </View>
      </View>
      
      <View style={styles.documentInfo}>
        <Text style={styles.documentName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.documentMeta}>
          {new Date(item.createdAt).toLocaleDateString('tr-TR')} • {item.size}
        </Text>
      </View>

      <View style={styles.documentActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => shareDocument(item)}>
          <Share size={18} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => editDocument(item)}>
          <Edit size={18} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => deleteDocument(item.id)}>
          <Trash2 size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Belgelerim</Text>
        <Text style={styles.headerSubtitle}>
          {documents.length} belge • {Math.round(documents.reduce((acc, doc) => acc + parseFloat(doc.size), 0) * 10) / 10} MB
        </Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <Text style={styles.searchPlaceholder}>Belgeler içinde ara...</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#DC2626" />
        </TouchableOpacity>
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        {(['date', 'name', 'size'] as const).map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.sortButton,
              sortBy === option && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy(option)}>
            <Text
              style={[
                styles.sortButtonText,
                sortBy === option && styles.sortButtonTextActive,
              ]}>
              {option === 'date' ? 'Tarih' : option === 'name' ? 'İsim' : 'Boyut'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Documents List */}
      {sortedDocuments.length > 0 ? (
        <FlatList
          data={sortedDocuments}
          renderItem={renderDocument}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.documentsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <FileText size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Henüz belge yok</Text>
          <Text style={styles.emptySubtitle}>
            İlk belgenizi taramak için aşağıdaki butona dokunun
          </Text>
          <TouchableOpacity style={styles.scanButton}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.scanButtonText}>Belge Tara</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#DC2626',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FCA5A5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#9CA3AF',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sortContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sortButtonActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#FFFFFF',
  },
  documentsList: {
    paddingHorizontal: 20,
  },
  documentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  documentThumbnail: {
    width: 60,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  pageIndicator: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  documentInfo: {
    flex: 1,
    marginRight: 12,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  documentMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  documentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});