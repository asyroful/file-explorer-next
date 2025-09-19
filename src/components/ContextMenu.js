// src/components/ContextMenu.js
"use client";
import { FaFile, FaTrash } from 'react-icons/fa';

export default function ContextMenu({ x, y, folderId, onClose, onInitiateAddFile, onDelete }) {
  const handleAddFileClick = () => {
    onInitiateAddFile(folderId);
    onClose();
  };

  const handleRename = () => {
    const newName = prompt('Enter new folder name:');
    if (newName) {
      onRename(folderId, newName);
    }
    onClose();
  };

  const handleDelete = () => {
    onDelete(folderId);
    onClose();
  };

  return (
    <div
      className="absolute bg-gray-800 border border-gray-700 rounded-md shadow-lg py-2 z-10"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      <ul>
        <li onClick={handleAddFileClick} className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
          <FaFile className="mr-3" /> Add File
        </li>
        <li onClick={handleDelete} className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-700 cursor-pointer">
          <FaTrash className="mr-3" /> Delete
        </li>
      </ul>
    </div>
  );
}