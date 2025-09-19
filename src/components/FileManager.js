"use client";

import { useState, useEffect, useContext, useRef } from 'react';
import FolderList from './FolderList';
import FileUploaderAndViewer from './FileUploaderAndViewer'; 
import ContextMenu from './ContextMenu';
import { ToastContext } from './ToastContainer';
import React from 'react';

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 50 }}>
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" style={{ zIndex: 50 }}></div>
      <div className="bg-gray-800 p-6 rounded shadow-lg w-80 relative" style={{ zIndex: 60 }}>
        <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
        <p className="mb-4 text-gray-200">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
            onClick={onCancel}
          >No</button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >Yes</button>
        </div>
      </div>
    </div>
  );
}

export default function FileManager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [addingFileToFolderId, setAddingFileToFolderId] = useState(null);
  const { addToast } = useContext(ToastContext);
  const [confirmModal, setConfirmModal] = useState({ open: false, fileId: null, folderId: null });
  const [confirmFolderModal, setConfirmFolderModal] = useState({ open: false, folderId: null });
  
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/folders');
        if (!res.ok) throw new Error('Failed to fetch folders');
        const initialData = await res.json();
        setData(initialData);
      } catch (error) {
        addToast(error.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addToast]);

  const handleAddFolder = async (name) => {
    setApiLoading(true);
    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Failed to create folder');
      const newFolder = await res.json();
      setData([...data, newFolder]);
      addToast(`Folder "${name}" created successfully.`, 'success');
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setApiLoading(false);
    }
  };

  const handleAddFile = async (folderId, file) => {
    setApiLoading(true);
    try {
      const payload = {
        folderId: folderId,
        name: file,
      };
      const res = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal upload file');
      }
      await res.json(); // tidak perlu ambil newFile, langsung refresh data
      // Fetch ulang data folder agar file baru langsung muncul
      const folderRes = await fetch('/api/folders');
      if (!folderRes.ok) throw new Error('Gagal mengambil data folder setelah upload file');
      const updatedData = await folderRes.json();
      setData(updatedData);
      addToast(`File "${file}" berhasil di-upload.`, 'success');
      setAddingFileToFolderId(null); // reset agar input add file hilang
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setApiLoading(false);
    }
  };

  const handleInitiateAddFile = (folderId) => {
    setAddingFileToFolderId(folderId);
    setContextMenu(null);
  };

  const handleCancelAddFile = () => {
    setAddingFileToFolderId(null);
  };

  const handleFileSelect = async (file, folderId) => {
    setApiLoading(true);
    setSelectedFolderId(folderId);
    // Fetch konten file saat dipilih
    try {
        const res = await fetch(`/api/files/${file.id}`);
        if (!res.ok) throw new Error('Could not fetch file content');
        const fileData = await res.json();
        setSelectedFile(fileData);
    } catch (error) {
        addToast(error.message, 'error');
        setSelectedFile(file); // fallback
    } finally {
        setApiLoading(false);
    }
  };
  
  const handleUpdateFile = async (fileId, file) => {
    setApiLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`/api/files/${fileId}`, {
        method: 'PUT',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to update file');
      const updatedFile = await res.json();
      // Update state data, hanya update content, name tetap
      const newData = data.map(folder => ({
        ...folder,
        files: folder.files.map(f => f.id === fileId ? { ...f, content: updatedFile.content } : f)
      }));
      setData(newData);
      // Update state selectedFile
      setSelectedFile({ ...selectedFile, content: updatedFile.content });
      addToast('File updated successfully!', 'success');
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setApiLoading(false);
    }
  };

  const handleDeleteFile = (fileId, folderId) => {
    setConfirmModal({ open: true, fileId, folderId });
  };

  const confirmDeleteFile = async () => {
    setApiLoading(true);
    const { fileId, folderId } = confirmModal;
    try {
      const res = await fetch(`/api/files/${fileId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete file');
      const newData = data.map(folder =>
        folder.id === folderId
          ? { ...folder, files: folder.files.filter(f => f.id !== fileId) }
          : folder
      );
      setData(newData);
      if (selectedFile && selectedFile.id === fileId) {
        setSelectedFile(null);
      }
      addToast('File deleted successfully.', 'success');
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setConfirmModal({ open: false, fileId: null, folderId: null });
      setApiLoading(false);
    }
  };

  const handleDeleteFolder = (folderId) => {
    setConfirmFolderModal({ open: true, folderId });
  };

  const confirmDeleteFolder = async () => {
    setApiLoading(true);
    const { folderId } = confirmFolderModal;
    try {
      const res = await fetch(`/api/folders/${folderId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete folder');
      setData(data.filter(folder => folder.id !== folderId));
      if (selectedFolderId === folderId) {
        setSelectedFolderId(null);
        setSelectedFile(null);
      }
      addToast('Folder deleted successfully.', 'success');
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setConfirmFolderModal({ open: false, folderId: null });
      setApiLoading(false);
    }
  };

  const handleContextMenu = (e, folder) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      folderId: folder.id,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <div className="flex h-screen bg-gray-800 text-white" onClick={closeContextMenu}>
      {apiLoading && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 100 }}>
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" style={{ zIndex: 100 }}></div>
          <div className="relative z-[101]">
            <div className="w-16 h-16 border-4 border-t-4 border-white border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <div className="w-80 bg-gray-900 p-4 flex flex-col">
        <FolderList
          folders={data}
          loading={loading}
          onAddFolder={handleAddFolder}
          onContextMenu={handleContextMenu}
          onSelectFile={handleFileSelect}
          onDeleteFile={handleDeleteFile}
          selectedFileId={selectedFile?.id}
          onAddFile={handleAddFile}
          onCancelAddFile={handleCancelAddFile}
          addingFileToFolderId={addingFileToFolderId}
        />
      </div>

      <div className="flex-1 p-4">
        <FileUploaderAndViewer
          file={selectedFile}
          onUpdate={handleUpdateFile}
        />
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          folderId={contextMenu.folderId}
          onClose={closeContextMenu}
          onInitiateAddFile={handleInitiateAddFile}
          onDelete={handleDeleteFolder}
        />
      )}

      <ConfirmModal
        open={confirmModal.open}
        title="Delete File"
        message="Are you sure you want to delete this file?"
        onConfirm={confirmDeleteFile}
        onCancel={() => setConfirmModal({ open: false, fileId: null, folderId: null })}
      />
      <ConfirmModal
        open={confirmFolderModal.open}
        title="Delete Folder"
        message="Are you sure you want to delete this folder and all its contents?"
        onConfirm={confirmDeleteFolder}
        onCancel={() => setConfirmFolderModal({ open: false, folderId: null })}
      />
    </div>
  );
}