import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Document {
  id: string;
  name: string;
  pages: number;
  createdAt: string;
  thumbnail: string;
  size: string;
  path: string;
  images: string[];
  filter: string;
}

const STORAGE_KEY = 'basak_documents';

export function useDocumentStorage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDocuments(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDocument = async (document: Document) => {
    try {
      const updated = [document, ...documents];
      setDocuments(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error saving document:', error);
      return false;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const updated = documents.filter(doc => doc.id !== id);
      setDocuments(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  };

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      const updated = documents.map(doc =>
        doc.id === id ? { ...doc, ...updates } : doc
      );
      setDocuments(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error updating document:', error);
      return false;
    }
  };

  return {
    documents,
    isLoading,
    saveDocument,
    deleteDocument,
    updateDocument,
    loadDocuments,
  };
}