import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { CameraView, CameraType } from 'expo-camera';
import { Circle, FlashlightOff as FlashOff, Slash as FlashOn, RotateCcw } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface DocumentScannerProps {
  onCapture: (uri: string) => void;
  facing: CameraType;
  onToggleFacing: () => void;
}

export default function DocumentScanner({
  onCapture,
  facing,
  onToggleFacing,
}: DocumentScannerProps) {
  const [flash, setFlash] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: false,
        });
        if (photo) {
          onCapture(photo.uri);
        }
      } catch (error) {
        Alert.alert('Hata', 'Fotoğraf çekilirken bir hata oluştu.');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const toggleFlash = () => {
    setFlash(!flash);
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash ? 'on' : 'off'}>
        
        {/* Scanning Overlay */}
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
            {flash ? (
              <FlashOn size={24} color="#FFFFFF" />
            ) : (
              <FlashOff size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.captureButton, isCapturing && styles.capturing]}
            onPress={takePicture}
            disabled={isCapturing}>
            <View style={styles.captureButtonInner}>
              <Circle size={32} color="#FFFFFF" strokeWidth={3} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={onToggleFacing}>
            <RotateCcw size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: width * 0.8,
    height: height * 0.5,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#DC2626',
    borderWidth: 4,
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
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  controlButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
});