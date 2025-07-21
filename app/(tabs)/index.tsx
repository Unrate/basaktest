import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, FlashlightOff as FlashOff, Slash as FlashOn, RotateCcw, Check, X, Circle, FileText } from 'lucide-react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <Camera size={64} color="#DC2626" />
          <Text style={styles.permissionTitle}>Kamera İzni Gerekli</Text>
          <Text style={styles.permissionText}>
            Belgelerinizi taramak için kamera erişimine ihtiyacımız var.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>İzin Ver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(!flash);
  };

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: false,
        });
        if (photo) {
          setCapturedImages(prev => [...prev, photo.uri]);
        }
      } catch (error) {
        Alert.alert('Hata', 'Fotoğraf çekilirken bir hata oluştu.');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const clearImages = () => {
    setCapturedImages([]);
  };

  const processCapturedImages = () => {
    if (capturedImages.length === 0) {
      Alert.alert('Uyarı', 'Lütfen önce bir belge tarayın.');
      return;
    }
    router.push({
      pathname: '/process-document',
      params: { images: JSON.stringify(capturedImages) },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BasakPDF</Text>
        <Text style={styles.headerSubtitle}>
          {capturedImages.length > 0 
            ? `${capturedImages.length} sayfa tarandı` 
            : 'Belgeyi kamera alanına yerleştirin'}
        </Text>
      </View>

      {/* Camera */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flash ? 'on' : 'off'}>
          
          {/* Camera Overlay */}
          <View style={styles.overlay}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>
        </CameraView>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
            {flash ? (
              <FlashOn size={24} color="#FFFFFF" />
            ) : (
              <FlashOff size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
            <RotateCcw size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          {capturedImages.length > 0 && (
            <TouchableOpacity style={styles.secondaryButton} onPress={clearImages}>
              <X size={20} color="#DC2626" />
              <Text style={styles.secondaryButtonText}>Temizle</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.captureButton, isCapturing && styles.capturing]}
            onPress={takePicture}
            disabled={isCapturing}>
            <View style={styles.captureButtonInner}>
              <Circle size={32} color="#FFFFFF" strokeWidth={3} />
            </View>
          </TouchableOpacity>

          {capturedImages.length > 0 && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={processCapturedImages}>
              <Check size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Kaydet</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Image Counter */}
      {capturedImages.length > 0 && (
        <View style={styles.imageCounter}>
          <FileText size={16} color="#DC2626" />
          <Text style={styles.imageCounterText}>{capturedImages.length}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  permissionCard: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#DC2626',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
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
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: height * 0.4,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#DC2626',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  controls: {
    backgroundColor: '#1F2937',
    paddingBottom: 40,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  captureButton: {
    width: 80,
    height: 80,
    backgroundColor: '#DC2626',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  capturing: {
    opacity: 0.7,
  },
  captureButtonInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  secondaryButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
  imageCounter: {
    position: 'absolute',
    top: 120,
    right: 30,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  imageCounterText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: 'bold',
  },
});