// src/components/FileUploaderAndViewer.js
"use client";

import { useRef } from 'react';

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
  console.log('Rendering viewer for file:', file.content, file.publicUrl);

  return (
    <div className="h-full flex flex-col bg-gray-800 rounded-lg">
      <div className="flex justify-between items-center p-4 bg-gray-900 rounded-t-lg">
        <h2 className="text-lg font-bold text-gray-300">{file.name}</h2>
        <div>
          {/* Tombol untuk update/upload */}
          <button onClick={triggerFileUpload} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Upload
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            id="zipUploader"
            accept=".zip,application/zip,application/x-zip-compressed"
          />
        </div>
      </div>
      {/* Viewer menggunakan iframe untuk keamanan */}
      {file.publicUrl ? (
        <iframe
          src={file.publicUrl}
          title="HTML Content Viewer"
          className="flex-1 w-full rounded-b-lg bg-white"
        />
      ) : (
        <iframe
          srcDoc={file.content}
          title="HTML Content Viewer"
          className="flex-1 w-full rounded-b-lg bg-white"
        />
      )}
    </div>
  );
}