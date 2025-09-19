// src/app/api/files/[id]/route.js
import { NextResponse } from 'next/server';
import { updateFile, deleteFile, getFile } from '@/lib/data'; // Tambahkan getFile

// Tambahkan GET handler untuk mengambil konten file
export async function GET(request, { params }) {
  try {
    const file = getFile(params.id);
    if (!file) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }
    return NextResponse.json(file);
  } catch (error) {
     return NextResponse.json({ message: 'Error fetching file', error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No file provided for update' }, { status: 400 });
    }
    
    if (!file.name.endsWith('.html')) {
      return NextResponse.json({ message: 'Only .html files are allowed' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const content = Buffer.from(buffer).toString('utf-8');
    const updated = updateFile(params.id, content);

    if (!updated) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating file', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const deleted = deleteFile(params.id);
    if (!deleted) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }
    return NextResponse.json(deleted);
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting file', error: error.message }, { status: 500 });
  }
}