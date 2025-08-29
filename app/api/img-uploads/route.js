// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { uploadFile } from '@/lib/upload';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const maxSize = 5_000_000; // 5 MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5 MB limit' },
        { status: 413 }
      );
    }

    const url = await uploadFile(file);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}