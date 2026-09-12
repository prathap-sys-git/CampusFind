import { supabase } from '../lib/supabase';

const BUCKET = 'item-images';
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface UploadResult {
  path: string;
  publicUrl: string;
}

/**
 * Validate a file before uploading.
 * Throws a user-friendly error string on failure.
 */
export function validateImageFile(file: File): void {
  if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
    throw new Error('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(`File too large (${mb} MB). Maximum allowed size is 10 MB.`);
  }
}

/**
 * Upload an item image to Supabase Storage.
 * Files are stored at: item-images/{userId}/{timestamp}-{random}.{ext}
 * Returns the storage path and public URL.
 */
export async function uploadItemImage(
  file: File,
  userId: string,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  validateImageFile(file);

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `${userId}/${fileName}`;

  onProgress?.(20);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  onProgress?.(90);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

  onProgress?.(100);

  return {
    path: filePath,
    publicUrl: data.publicUrl,
  };
}

/**
 * Delete an image from Supabase Storage by its path.
 */
export async function deleteItemImage(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    console.warn('Failed to delete image:', error.message);
  }
}

/**
 * Get the public URL for a storage path.
 */
export function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
