export type FilterType = 'original' | 'blackwhite' | 'grayscale' | 'contrast' | 'bright';

export interface ImageFilter {
  id: FilterType;
  name: string;
  description: string;
}

export const filters: ImageFilter[] = [
  {
    id: 'original',
    name: 'Orijinal',
    description: 'Değişiklik yapılmamış görüntü',
  },
  {
    id: 'blackwhite',
    name: 'Siyah Beyaz',
    description: 'Yüksek kontrast siyah beyaz',
  },
  {
    id: 'grayscale',
    name: 'Gri Tonlama',
    description: 'Gri tonlarda görüntü',
  },
  {
    id: 'contrast',
    name: 'Yüksek Kontrast',
    description: 'Geliştirilmiş kontrast',
  },
  {
    id: 'bright',
    name: 'Parlak',
    description: 'Parlaklık artırılmış',
  },
];

export function getFilterStyle(filter: FilterType) {
  switch (filter) {
    case 'blackwhite':
      return {
        filter: 'contrast(2) brightness(1.2)',
        tintColor: undefined,
      };
    case 'grayscale':
      return {
        filter: 'grayscale(1)',
        tintColor: undefined,
      };
    case 'contrast':
      return {
        filter: 'contrast(1.5) brightness(1.1)',
        tintColor: undefined,
      };
    case 'bright':
      return {
        filter: 'brightness(1.3)',
        tintColor: undefined,
      };
    default:
      return {
        filter: 'none',
        tintColor: undefined,
      };
  }
}

export function applyFilter(imageUri: string, filter: FilterType): Promise<string> {
  // In a real implementation, this would use image processing libraries
  // For now, we'll return the original URI as this is a demo
  return Promise.resolve(imageUri);
}

export function detectDocumentEdges(imageUri: string): Promise<{ x: number; y: number; width: number; height: number }> {
  // Mock implementation - in reality, this would use computer vision
  // to detect document edges automatically
  return Promise.resolve({
    x: 0.1,
    y: 0.15,
    width: 0.8,
    height: 0.7,
  });
}

export function cropImage(
  imageUri: string,
  cropArea: { x: number; y: number; width: number; height: number }
): Promise<string> {
  // Mock implementation for image cropping
  return Promise.resolve(imageUri);
}

export function rotateImage(imageUri: string, degrees: number): Promise<string> {
  // Mock implementation for image rotation
  return Promise.resolve(imageUri);
}