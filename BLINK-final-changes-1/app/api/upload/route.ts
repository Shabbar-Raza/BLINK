import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;
  
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  const filePath = path.join(uploadDir, file.name);
  
  try {
    await writeFile(filePath, new Uint8Array(bytes));

    const imageUrl = `/uploads/${file.name}`;
    return NextResponse.json({ imageUrl });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
