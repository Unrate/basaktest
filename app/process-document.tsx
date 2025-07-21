import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  ArrowLeft,
  RotateCcw,
  Crop,
  Palette,
  Save,
  Share,
  Eye,
  Trash2,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

type FilterType = 'original' | 'blackwhite' | 'grayscale' | 'contrast' | 'bright';

interface FilterOption {
  id: FilterType;
  name: string;
  preview: string;
}

export default function ProcessDocumentScreen() {
  const { images } = useLocalSearchParams();
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('blackwhite');
  const [documentName, setDocumentName] = useState('');

  useEffect(() => {
    if (images) {
      const parsedImages = JSON.parse(images as string);
      setImageUris(parsedImages);
      setDocumentName(`Belge_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '_')}`);
    }
  }, [images]);

  const filters: FilterOption[] = [
    { id: 'original', name: 'Orijinal', preview: '🖼️' },
    { id: 'blackwhite', name: 'Siyah Beyaz', preview: '⚫' },
    { id: 'grayscale', name: 'Gri Tonlama', preview: '🔘' },
    { id: 'contrast', name: 'Yüksek Kontrast', preview: '🔆' },
    { id: 'bright', name: 'Parlak', preview: '☀️' },
  ];

  const getFilterStyle = (filter: FilterType) => {
    switch (filter) {
      case 'blackwhite':
        return { tintColor: '#000000' };
      case 'grayscale':
        return { opacity: 0.8 };
      case 'contrast':
        return { opacity: 1 };
      case 'bright':
        return { opacity: 0.9 };
      default:
        return {};
    }
  };

  const rotateImage = () => {
    Alert.alert('Döndür', 'Görüntü 90° döndürülecek.');
  };

  const cropImage = () => {
    Alert.alert('Kırp', 'Görüntü kırpma aracı açılacak.');
  };

  const deleteCurrentImage = () => {
    if (imageUris.length <= 1) {
      Alert.alert('Hata', 'En az bir sayfa olmalıdır.');
      return;
    }

    Alert.alert(
      'Sayfayı Sil',
      'Bu sayfayı silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            const newImages = imageUris.filter((_, index) => index !== currentImageIndex);
            setImageUris(newImages);
            if (currentImageIndex >= newImages.length) {
              setCurrentImageIndex(Math.max(0, newImages.length - 1));
            }
          },
        },
      ]
    );
  };

  const previewDocument = () => {
    Alert.alert('Önizleme', 'PDF önizlemesi açılacak.');
  };

  const saveDocument = async () => {
    try {
      const document = {
        id: Date.now().toString(),
        name: documentName,
        pages: imageUris.length,
        createdAt: new Date().toISOString(),
        thumbnail: imageUris[0],
        size: `${(imageUris.length * 0.5).toFixed(1)} MB`,
        path: `/storage/documents/${documentName}.pdf`,
        images: imageUris,
        filter: selectedFilter,
      };

      const existing = await AsyncStorage.getItem('basak_documents');
      const documents = existing ? JSON.parse(existing) : [];
      documents.unshift(document);
      await AsyncStorage.setItem('basak_documents', JSON.stringify(documents));

      Alert.alert(
        'Başarılı',
        'PDF başarıyla kaydedildi!',
        [
          { text: 'Tamam', onPress: () => router.replace('/(tabs)') },
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'PDF kaydedilirken bir hata oluştu.');
    }
  };

  const shareDocument = () => {
    Alert.alert('Paylaş', 'Belge paylaşım seçenekleri açılacak.');
  };

  if (imageUris.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Görüntüler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Belgeyi İşle</Text>
          <Text style={styles.headerSubtitle}>
            {currentImageIndex + 1} / {imageUris.length} sayfa
          </Text>
        </View>
        <TouchableOpacity style={styles.headerAction} onPress={saveDocument}>
          <Save size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Image Preview */}
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}>
          {imageUris.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={[styles.image, getFilterStyle(selectedFilter)]}
              resizeMode="contain"
            />
          ))}
        </ScrollView>
      </View>

      {/* Page Indicator */}
      <View style={styles.pageIndicator}>
        {imageUris.map((_, index) => (
          <View
            key={index}
            style={[
              styles.pageIndicatorDot,
              index === currentImageIndex && styles.pageIndicatorDotActive,
            ]}
          />
        ))}
      </View>

      {/* Tools */}
      <View style={styles.tools}>
        <TouchableOpacity style={styles.toolButton} onPress={rotateImage}>
          <RotateCcw size={20} color="#DC2626" />
          <Text style={styles.toolButtonText}>Döndür</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.toolButton} onPress={cropImage}>
          <Crop size={20} color="#DC2626" />
          <Text style={styles.toolButtonText}>Kırp</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.toolButton} onPress={deleteCurrentImage}>
          <Trash2 size={20} color="#EF4444" />
          <Text style={[styles.toolButtonText, { color: '#EF4444' }]}>Sil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.toolButton} onPress={previewDocument}>
          <Eye size={20} color="#DC2626" />
          <Text style={styles.toolButtonText}>Önizle</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.filtersHeader}>
          <Palette size={20} color="#DC2626" />
          <Text style={styles.filtersTitle}>Filtreler</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersList}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterOption,
                  selectedFilter === filter.id && styles.filterOptionActive,
                ]}
                onPress={() => setSelectedFilter(filter.id)}>
                <Text style={styles.filterPreview}>{filter.preview}</Text>
                <Text
                  style={[
                    styles.filterName,
                    selectedFilter === filter.id && styles.filterNameActive,
                  ]}>
                  {filter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.secondaryButton} onPress={shareDocument}>
          <Share size={20} color="#DC2626" />
          <Text style={styles.secondaryButtonText}>Paylaş</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.primaryButton} onPress={saveDocument}>
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>PDF Olarak Kaydet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#FCA5A5',
  },
  headerAction: {
    padding: 8,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#000000',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: width - 40,
    height: '100%',
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    gap: 8,
  },
  pageIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  pageIndicatorDotActive: {
    backgroundColor: '#DC2626',
  },
  tools: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  toolButton: {
    alignItems: 'center',
    gap: 4,
  },
  toolButtonText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  filtersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  filtersList: {
    flexDirection: 'row',
    gap: 12,
  },
  filterOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    minWidth: 80,
  },
  filterOptionActive: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  filterPreview: {
    fontSize: 24,
    marginBottom: 4,
  },
  filterName: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterNameActive: {
    color: '#DC2626',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  secondaryButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});