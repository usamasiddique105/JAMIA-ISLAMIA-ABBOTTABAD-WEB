import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig';

/**
 * Upload a PDF, document, or image to Firebase Storage
 * @param file The browser File object
 * @param folder The storage folder (e.g. 'books', 'fatwas', 'receipts')
 * @returns The public HTTPS download URL
 */
export async function uploadFileToFirebaseStorage(
  file: File, 
  folder: 'books' | 'fatwas' | 'receipts' | 'media' | 'general' = 'general'
): Promise<{ url: string; fileName: string; fileSize: string }> {
  try {
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${folder}/${timestamp}_${cleanFileName}`;
    const storageRef = ref(storage, storagePath);

    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type || 'application/octet-stream',
    });

    const url = await getDownloadURL(snapshot.ref);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const fileSize = file.size > 1024 * 1024 ? `${sizeInMB} MB` : `${Math.round(file.size / 1024)} KB`;

    return {
      url,
      fileName: file.name,
      fileSize,
    };
  } catch (error) {
    console.error('Firebase Storage upload error:', error);
    throw error;
  }
}
