import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Settings, FolderOpen, Image as ImageIcon, Camera, Share, CircleHelp as HelpCircle, Star, MessageCircle, Shield, Download, ChevronRight } from 'lucide-react-native';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  type: 'toggle' | 'action' | 'navigation';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function SettingsScreen() {
  const [autoSave, setAutoSave] = useState(true);
  const [highQuality, setHighQuality] = useState(true);
  const [autoEdgeDetection, setAutoEdgeDetection] = useState(true);
  const [defaultFilter, setDefaultFilter] = useState('blackwhite');
  const [saveLocation, setSaveLocation] = useState('/Downloads/BasakPDF');

  const selectSaveLocation = () => {
    Alert.alert(
      'Kayıt Konumu',
      'PDF dosyalarınızın kaydedileceği konumu seçin:',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Downloads', onPress: () => setSaveLocation('/Downloads/BasakPDF') },
        { text: 'Documents', onPress: () => setSaveLocation('/Documents/BasakPDF') },
        { text: 'Özel Konum', onPress: () => Alert.alert('Özel Konum', 'Dosya gezgini açılacak...') },
      ]
    );
  };

  const selectDefaultFilter = () => {
    Alert.alert(
      'Varsayılan Filtre',
      'Tarama yaparken kullanılacak varsayılan filtreyi seçin:',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Siyah Beyaz', onPress: () => setDefaultFilter('blackwhite') },
        { text: 'Renkli', onPress: () => setDefaultFilter('color') },
        { text: 'Gri Tonlama', onPress: () => setDefaultFilter('grayscale') },
        { text: 'Yüksek Kontrast', onPress: () => setDefaultFilter('contrast') },
      ]
    );
  };

  const settings: SettingItem[] = [
    {
      id: 'save_location',
      title: 'Kayıt Konumu',
      subtitle: saveLocation,
      icon: <FolderOpen size={24} color="#DC2626" />,
      type: 'navigation',
      onPress: selectSaveLocation,
    },
    {
      id: 'default_filter',
      title: 'Varsayılan Filtre',
      subtitle: defaultFilter === 'blackwhite' ? 'Siyah Beyaz' : 
                defaultFilter === 'color' ? 'Renkli' :
                defaultFilter === 'grayscale' ? 'Gri Tonlama' : 'Yüksek Kontrast',
      icon: <ImageIcon size={24} color="#DC2626" />,
      type: 'navigation',
      onPress: selectDefaultFilter,
    },
    {
      id: 'auto_edge',
      title: 'Otomatik Kenar Algılama',
      subtitle: 'Belge kenarlarını otomatik olarak algıla',
      icon: <Camera size={24} color="#DC2626" />,
      type: 'toggle',
      value: autoEdgeDetection,
      onToggle: setAutoEdgeDetection,
    },
    {
      id: 'high_quality',
      title: 'Yüksek Kalite',
      subtitle: 'Daha büyük dosya boyutu, daha iyi kalite',
      icon: <Settings size={24} color="#DC2626" />,
      type: 'toggle',
      value: highQuality,
      onToggle: setHighQuality,
    },
    {
      id: 'auto_save',
      title: 'Otomatik Kaydetme',
      subtitle: 'Tarama sonrası otomatik olarak kaydet',
      icon: <Download size={24} color="#DC2626" />,
      type: 'toggle',
      value: autoSave,
      onToggle: setAutoSave,
    },
  ];

  const actions: SettingItem[] = [
    {
      id: 'share_app',
      title: 'Uygulamayı Paylaş',
      subtitle: 'Arkadaşlarınızla BasakPDF\'i paylaşın',
      icon: <Share size={24} color="#6B7280" />,
      type: 'action',
      onPress: () => Alert.alert('Paylaş', 'Uygulama paylaşım linki kopyalandı!'),
    },
    {
      id: 'rate_app',
      title: 'Uygulamayı Değerlendir',
      subtitle: 'App Store\'da değerlendirin',
      icon: <Star size={24} color="#6B7280" />,
      type: 'action',
      onPress: () => Alert.alert('Değerlendirme', 'App Store sayfası açılacak...'),
    },
    {
      id: 'help',
      title: 'Yardım ve Destek',
      subtitle: 'Sık sorulan sorular ve destek',
      icon: <HelpCircle size={24} color="#6B7280" />,
      type: 'action',
      onPress: () => Alert.alert('Yardım', 'Yardım sayfası açılacak...'),
    },
    {
      id: 'feedback',
      title: 'Geri Bildirim',
      subtitle: 'Görüş ve önerilerinizi paylaşın',
      icon: <MessageCircle size={24} color="#6B7280" />,
      type: 'action',
      onPress: () => Alert.alert('Geri Bildirim', 'Geri bildirim formu açılacak...'),
    },
    {
      id: 'privacy',
      title: 'Gizlilik Politikası',
      subtitle: 'Gizlilik ve veri kullanım politikamız',
      icon: <Shield size={24} color="#6B7280" />,
      type: 'action',
      onPress: () => Alert.alert('Gizlilik', 'Gizlilik politikası sayfası açılacak...'),
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={item.onPress}
      disabled={item.type === 'toggle'}>
      <View style={styles.settingIcon}>
        {item.icon}
      </View>
      
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        {item.subtitle && (
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        )}
      </View>

      <View style={styles.settingAction}>
        {item.type === 'toggle' && (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#E5E7EB', true: '#FCA5A5' }}
            thumbColor={item.value ? '#DC2626' : '#FFFFFF'}
          />
        )}
        {item.type === 'navigation' && (
          <ChevronRight size={20} color="#9CA3AF" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <Text style={styles.headerSubtitle}>
          Uygulamayı tercihlerinize göre özelleştirin
        </Text>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uygulama Ayarları</Text>
        <View style={styles.settingsList}>
          {settings.map(renderSettingItem)}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diğer</Text>
        <View style={styles.settingsList}>
          {actions.map(renderSettingItem)}
        </View>
      </View>

      <View style={styles.appInfo}>


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
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  settingsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  settingAction: {
    marginLeft: 12,
  },
  appInfo: {
    alignItems: 'center',
    padding: 32,
    marginTop: 24,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  appCopyright: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});