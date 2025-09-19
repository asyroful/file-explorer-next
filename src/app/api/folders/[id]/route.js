// src/app/api/folders/[id]/route.js
import { NextResponse } from 'next/server';
import { getFolder, updateFolder, deleteFolder } from '@/lib/data';

// GET a single folder
export async function GET(request, { params }) {
  try {
    const folder = getFolder(params.id);
    if (!folder) {
      return NextResponse.json({ message: 'Folder not found' }, { status: 404 });
    }
    return NextResponse.json(folder);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching folder', error: error.message }, { status: 500 });
  }
}

// PUT (update) a folder's name
export async function PUT(request, { params }) {
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ message: 'Missing new name' }, { status: 400 });
    }
    const updated = updateFolder(params.id, name);
    if (!updated) {
      return NextResponse.json({ message: 'Folder not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating folder', error: error.message }, { status: 500 });
  }
}

// DELETE a folder
export async function DELETE(request, { params }) {
  try {
    const deleted = deleteFolder(params.id);
    if (!deleted) {
      return NextResponse.json({ message: 'Folder not found' }, { status: 404 });
    }
    return NextResponse.json(deleted);
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting folder', error: error.message }, { status: 500 });
  }
}