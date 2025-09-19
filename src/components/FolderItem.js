// src/components/FolderItem.js
"use client";
import { useState, useEffect } from 'react';
import { FaFolder, FaFolderOpen, FaFile, FaTrash, FaChevronUp, FaChevronDown } from 'react-icons/fa';

const AddFileInput = ({ folderId, onAddFile, onCancelAddFile }) => {
  const [fileName, setFileName] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (fileName.trim()) {
        onAddFile(folderId, fileName.trim());
      }
    } else if (e.key === 'Escape') {
      onCancelAddFile();
    }
  };

  return (
    <li className="flex items-center p-2">
      <FaFile className="mr-2 text-gray-400" />
      <input
        type="text"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={onCancelAddFile}
        className="bg-gray-700 text-white w-full px-1 rounded"
        autoFocus
      />
    </li>
  );
};


export default function FolderItem({ 
  folder, 
  onContextMenu, 
  onSelectFile, 
  onDeleteFile, 
  selectedFileId,
  onAddFile,
  onCancelAddFile,
  isAddingFile
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Automatically open the folder if we are adding a file to it.
    if (isAddingFile && !isOpen) {
      setIsOpen(true);
    }
  }, [isAddingFile, isOpen]);

  const handleToggle = (e) => {
    // Stop propagation to prevent the context menu from closing
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <li 
      className="mb-1 rounded"
      onContextMenu={(e) => onContextMenu(e, folder)}
    >
      <div 
        onClick={handleToggle} 
        className="flex items-center cursor-pointer p-2 hover:bg-gray-700 rounded"
      >
        <div className="flex justify-between w-full">
          <div className="flex items-center">
            {isOpen ? <FaFolderOpen className="mr-2 text-yellow-500" /> : <FaFolder className="mr-2 text-yellow-500" />}
            <span className="font-semibold">{folder.name}</span>
          </div>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      {isOpen && (
        <ul className="pl-6 border-l border-gray-700">
          {(folder.files && folder.files.length > 0) && 
            folder.files.map((file) => (
              <li 
                key={file.id} 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectFile(file, folder.id);
                }} 
                className={`flex justify-between items-center p-2 rounded cursor-pointer hover:bg-gray-700 ${selectedFileId === file.id ? 'bg-gray-600' : ''}`}
              >
                <div className="flex items-center">
                  <FaFile className="mr-2 text-gray-400" />
                  <span>{file.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(file.id, folder.id);
                  }}
                  className="text-gray-500 hover:text-red-500"
                >
                  <FaTrash />
                </button>
              </li>
            ))
          }
          {isAddingFile && (
            <AddFileInput 
              folderId={folder.id}
              onAddFile={onAddFile}
              onCancelAddFile={onCancelAddFile}
            />
          )}
          {!isAddingFile && (!folder.files || folder.files.length === 0) && (
             <li className="text-gray-500 p-2">No files</li>
          )}
        </ul>
      )}
    </li>
  );
}