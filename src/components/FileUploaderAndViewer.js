// src/components/FileUploaderAndViewer.js
"use client";

import { useRef } from 'react';
import Link from 'next/link';

export default function FileUploaderAndViewer({ file, onUpdate }) {
  const fileInputRef = useRef(null);

  if (!file) {
    return <div className="text-gray-400 flex items-center justify-center h-full">Select an HTML file to view or upload a new one.</div>;
  }
  
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      onUpdate(file.id, uploadedFile);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 rounded-lg">
      <div className="flex justify-between items-center p-4 bg-gray-900 rounded-t-lg">
        <h2 className="text-lg font-bold text-gray-300">{file.name}</h2>
        <div>
          {/* Tombol untuk membuka di tab baru */}
          <Link href={`/view/${file.id}`} target="_blank" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
            Open in New Tab
          </Link>
          {/* Tombol untuk update/upload */}
          <button onClick={triggerFileUpload} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Upload & Replace HTML
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".html"
          />
        </div>
      </div>
      {/* Viewer menggunakan iframe untuk keamanan */}
      <iframe
        srcDoc={file.content}
        title="HTML Content Viewer"
        className="flex-1 w-full rounded-b-lg bg-white"
        sandbox="allow-scripts" // Sedikit lebih aman
      />
    </div>
  );
}