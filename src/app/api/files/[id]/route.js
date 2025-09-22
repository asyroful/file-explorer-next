// src/app/api/files/[id]/route.js
import { NextResponse } from 'next/server';
import { updateFile, deleteFile, getFile } from '@/lib/data'; // Tambahkan getFile
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';

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
    if (!file || !file.name.endsWith('.zip')) {
      return NextResponse.json({ message: 'Harap unggah file .zip.' }, { status: 400 });
    }

    // Buat folder unik untuk ekstraksi
    const uniqueFolder = `file-${params.id}-${Date.now()}`;
    const extractPath = path.join(process.cwd(), 'public', 'uploads', uniqueFolder);
    fs.mkdirSync(extractPath, { recursive: true });

    // Ekstrak ZIP
    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = new AdmZip(buffer);
    zip.extractAllTo(extractPath, true);

    // Debug: tampilkan isi folder hasil ekstraksi
    const extractedFiles = fs.readdirSync(extractPath);
    console.log('Isi folder hasil ekstraksi:', extractedFiles);

    // Pastikan index.html ada
    const indexPath = path.join(extractPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
      // Selalu kirim daftar file hasil ekstraksi di response
      const filesInFolder = fs.readdirSync(extractPath);
      fs.rmSync(extractPath, { recursive: true, force: true });
      return NextResponse.json({ message: 'File ZIP harus berisi index.html di dalamnya.', extractedFiles: filesInFolder }, { status: 400 });
    }

    // Baca isi index.html
    const htmlContent = fs.readFileSync(indexPath, 'utf-8');
    // Public URL ke index.html
    const publicUrl = `/uploads/${uniqueFolder}/index.html`;

    // Update file di database
    const updated = updateFile(params.id, htmlContent, publicUrl);

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