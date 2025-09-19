// src/app/api/folders/route.js
import { NextResponse } from 'next/server';
import { getFolders, addFolder, addFile } from '@/lib/data';

export async function GET() {
  // Mengembalikan semua folder beserta file-filenya
  return NextResponse.json(getFolders());
}

export async function POST(request) {
  const { name, folderId } = await request.json();
  if (folderId) {
    // Menambah file ke folder
    const newFile = addFile(folderId, name);
    return NextResponse.json(newFile, { status: 201 });
  } else {
    // Menambah folder baru
    const newFolder = addFolder(name);
    return NextResponse.json(newFolder, { status: 201 });
  }
}