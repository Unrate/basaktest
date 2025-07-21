import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { Folder, FolderPlus, MoveVertical as MoreVertical, FileText, Share, CreditCard as Edit3, Trash2 } from 'lucide-react-native';

interface FolderItem {
  id: string;
  name: string;
  documentCount: number;
  createdAt: string;
  color: string;
}

const FOLDER_COLORS = [
  '#DC2626', '#EA580C', '#D97706', '#CA8A04',
  '#65A30D', '#16A34A', '#059669', '#0891B2',
  '#0284C7', '#2563EB', '#7C3AED', '#C026D3',
];

export default function FoldersScreen() {
  const [folders, setFolders] = useState<FolderItem[]>([
    {
      id: '1',
      name: 'İş Belgeleri',
      documentCount: 12,
      createdAt: '2024-01-15',
      color: '#DC2626',
    },
    {
      id: '2',
      name: 'Faturalar',
      documentCount: 8,
      createdAt: '2024-01-10',
      color: '#059669',
    },
    {
      id: '3',
      name: 'Kimlik Belgeleri',
      documentCount: 5,
      createdAt: '2024-01-05',
      color: '#2563EB',
    },
  ]);

  const createFolder = () => {
    Alert.prompt(
      'Yeni Klasör',
      'Klasör adını girin:',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Oluştur',
          onPress: (text) => {
            if (text && text.trim()) {
              const newFolder: FolderItem = {
                id: Date.now().toString(),
                name: text.trim(),
                documentCount: 0,
                createdAt: new Date().toISOString().split('T')[0],
                color: FOLDER_COLORS[Math.floor(Math.random() * FOLDER_COLORS.length)],
              };
              setFolders(prev => [newFolder, ...prev]);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const editFolder = (folder: FolderItem) => {
    Alert.prompt(
      'Klasörü Düzenle',
      'Yeni klasör adını girin:',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Kaydet',
          onPress: (text) => {
            if (text && text.trim()) {
              setFolders(prev =>
                prev.map(f =>
                  f.id === folder.id ? { ...f, name: text.trim() } : f
                )
              );
            }
          },
        },
      ],
      'plain-text',
      folder.name
    );
  };

  const deleteFolder = (folder: FolderItem) => {
    Alert.alert(
      'Klasörü Sil',
      `"${folder.name}" klasörünü silmek istediğinizden emin misiniz? İçindeki tüm belgeler de silinecek.`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            setFolders(prev => prev.filter(f => f.id !== folder.id));
          },
        },
      ]
    );
  };

  const shareFolder = (folder: FolderItem) => {
    Alert.alert('Paylaş', `"${folder.name}" klasörü paylaşılacak.`);
  };

  const showFolderOptions = (folder: FolderItem) => {
    Alert.alert(
      folder.name,
      'Yapmak istediğiniz işlemi seçin:',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Düzenle', onPress: () => editFolder(folder) },
        { text: 'Paylaş', onPress: () => shareFolder(folder) },
        { text: 'Sil', style: 'destructive', onPress: () => deleteFolder(folder) },
      ]
    );
  };

  const renderFolder = ({ item }: { item: FolderItem }) => (
    <TouchableOpacity style={styles.folderCard}>
      <View style={styles.folderContent}>
        <View style={[styles.folderIcon, { backgroundColor: item.color }]}>
          <Folder size={32} color="#FFFFFF" />
        </View>
        
        <View style={styles.folderInfo}>
          <Text style={styles.folderName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.folderMeta}>
            <FileText size={12} color="#6B7280" />
            <Text style={styles.folderMetaText}>
              {item.documentCount} belge
            </Text>
            <Text style={styles.folderDate}>
              {new Date(item.createdAt).toLocaleDateString('tr-TR')}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() => showFolderOptions(item)}>
          <MoreVertical size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Klasörler</Text>
        <Text style={styles.headerSubtitle}>
          {folders.length} klasör • {folders.reduce((acc, folder) => acc + folder.documentCount, 0)} belge
        </Text>
      </View>

      {/* Create Folder Button */}
      <View style={styles.createContainer}>
        <TouchableOpacity style={styles.createButton} onPress={createFolder}>
          <FolderPlus size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Yeni Klasör Oluştur</Text>
        </TouchableOpacity>
      </View>

      {/* Folders List */}
      {folders.length > 0 ? (
        <FlatList
          data={folders}
          renderItem={renderFolder}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.foldersList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Folder size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Henüz klasör yok</Text>
          <Text style={styles.emptySubtitle}>
            Belgelerinizi organize etmek için klasörler oluşturun
          </Text>
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
  createContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  foldersList: {
    paddingHorizontal: 20,
  },
  folderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  folderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  folderIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  folderInfo: {
    flex: 1,
  },
  folderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  folderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  folderMetaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  folderDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  optionsButton: {
    padding: 8,
    borderRadius: 6,
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
  },
});