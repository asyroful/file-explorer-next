// src/components/FolderList.js
"use client";
import { useState } from 'react';
import { FaFolder, FaPlus } from 'react-icons/fa';
import FolderItem from './FolderItem';

const Skeleton = () => (
  <div className="p-2 flex items-center">
    <div className="w-5 h-5 bg-gray-700 rounded mr-2 animate-pulse"></div>
    <div className="w-3/4 h-4 bg-gray-700 rounded animate-pulse"></div>
  </div>
);

export default function FolderList({ 
  folders, 
  loading, 
  onAddFolder, 
  onContextMenu, 
  onSelectFile, 
  onDeleteFile, 
  selectedFileId,
  onAddFile,
  onCancelAddFile,
  addingFileToFolderId
}) {
  const [newFolderName, setNewFolderName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleInputChange = (e) => {
    setNewFolderName(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (newFolderName.trim()) {
        onAddFolder(newFolderName.trim());
        setNewFolderName('');
        setIsAdding(false);
      }
    } else if (e.key === 'Escape') {
      setNewFolderName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-300">Explorer</h2>
        <button onClick={handleAddClick} className="text-gray-400 hover:text-white">
          <FaPlus />
        </button>
      </div>
      <ul>
        {loading ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          folders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              onContextMenu={onContextMenu}
              onSelectFile={onSelectFile}
              onDeleteFile={onDeleteFile}
              selectedFileId={selectedFileId}
              onAddFile={onAddFile}
              onCancelAddFile={onCancelAddFile}
              isAddingFile={addingFileToFolderId === folder.id}
            />
          ))
        )}
        {isAdding && (
          <div className="p-2 flex items-center">
            <FaFolder className="mr-2 text-yellow-500" />
            <input
              type="text"
              value={newFolderName}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onBlur={() => setIsAdding(false)}
              className="bg-gray-700 text-white w-full px-1 rounded"
              autoFocus
            />
          </div>
        )}
      </ul>
    </div>
  );
}