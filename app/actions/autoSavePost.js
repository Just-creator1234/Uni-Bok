'use server';
import { createPost } from './createPost';

export async function autoSavePost(formData) {
  // reuse createPost but force status = DRAFT
  formData.set('status', 'DRAFT');
  return createPost(formData);
}