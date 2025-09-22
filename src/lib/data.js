// src/lib/data.js

// In-memory store

let folders = [
  { id: 1, name: 'Laporan Bulanan' },
  { id: 2, name: 'Dokumen Proyek' },
];

let files = [];

let nextFolderId = 3;
let nextFileId = 1;

// CRUD FOLDER
export const getFolders = () => folders.map(folder => ({
  ...folder,
  files: files.filter(file => file.folderId === folder.id).map(f => ({
    id: f.id,
    name: f.name,
  })),
}));

export const getFolder = (id) => {
  const folder = folders.find(f => f.id === parseInt(id));
  if (!folder) return null;
  return {
    ...folder,
    files: files.filter(file => file.folderId === folder.id),
  };
};

export const addFolder = (name) => {
  const newFolder = { id: nextFolderId++, name };
  folders.push(newFolder);
  return { ...newFolder, files: [] };
};

export const updateFolder = (id, name) => {
  const folder = folders.find(f => f.id === parseInt(id));
  if (folder) {
    folder.name = name;
    return { ...folder, files: files.filter(file => file.folderId === folder.id) };
  }
  return null;
};

export const deleteFolder = (id) => {
  const folderIndex = folders.findIndex(f => f.id === parseInt(id));
  if (folderIndex === -1) return null;
  const folderId = folders[folderIndex].id;
  folders.splice(folderIndex, 1);
  files = files.filter(file => file.folderId !== folderId);
  return { message: 'Folder deleted' };
};

// CRUD FILE
export const getFiles = () => files;

export const getFile = (id) => files.find(f => f.id === parseInt(id)) || null;

// Ubah addFile untuk menerima konten
export const addFile = (folderId, name, content) => {
  const newFile = { id: nextFileId++, folderId: parseInt(folderId), name, content, publicUrl: null };
  files.push(newFile);
  return newFile;
};

// Ubah updateFile untuk menerima konten dan nama baru
export const updateFile = (id, newContent) => {
  const file = files.find(f => f.id === parseInt(id));
  if (file) {
    file.content = newContent;
    if (arguments.length > 2) file.publicUrl = arguments[2];
    return file;
  }
  return null;
};

export const deleteFile = (id) => {
  const fileIndex = files.findIndex(f => f.id === parseInt(id));
  if (fileIndex !== -1) {
    files.splice(fileIndex, 1);
    return { message: 'File deleted' };
  }
  return null;
};