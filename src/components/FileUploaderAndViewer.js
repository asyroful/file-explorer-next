
"use client";
import React, { useRef, useState, useEffect } from "react";

export default function FileUploaderAndViewer({ file, onUpdate }) {
  const fileInputRef = useRef(null);
  const [viewUrl, setViewUrl] = useState(null);

  useEffect(() => {
    let blobUrl = null;
    if (file && file.content) {
      // Debug: tampilkan isi HTML sebelum manipulasi
      let htmlContent = file.content;
      // Jika file ada di uploads, tambahkan base href agar gambar bisa tampil
      if (typeof file.publicUrl === 'string' && file.publicUrl.includes('/uploads/')) {
        // Ambil path folder, misal /uploads/file-1-xxxxxx/
        const match = file.publicUrl.match(/\/uploads\/[^\/]+\//);
        if (match) {
          const baseHref = match[0];
          if (/<head([^>]*)>/i.test(htmlContent)) {
            // Sisipkan <base href> di dalam <head>
            htmlContent = htmlContent.replace(
              /<head([^>]*)>/i,
              `<head$1><base href="${baseHref}">`
            );
          } else if (/<html([^>]*)>/i.test(htmlContent)) {
            // Jika tidak ada <head>, sisipkan setelah <html>
            htmlContent = htmlContent.replace(
              /<html([^>]*)>/i,
              `<html$1><head><base href="${baseHref}"></head>`
            );
          } else {
            // Jika tidak ada <html>, tambahkan di awal dokumen
            htmlContent = `<head><base href="${baseHref}"></head>` + htmlContent;
          }
        }
      }
      const blob = new Blob([htmlContent], { type: "text/html" });
      blobUrl = URL.createObjectURL(blob);
      setViewUrl(blobUrl);
    } else {
      setViewUrl(null);
    }
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [file]);

  if (!file) {
    return (
      <div className="text-gray-400 flex items-center justify-center h-full">
        Select an HTML file to view or upload a new one.
      </div>
    );
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
      {/* Viewer menggunakan iframe dengan Blob URL agar SPA berjalan */}
      <iframe
        src={viewUrl || undefined}
        title="HTML Content Viewer"
        className="flex-1 w-full rounded-b-lg bg-white"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}