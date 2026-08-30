import React, { useState } from 'react';
import { Upload, File, X } from 'lucide-react';

function FileUpload({ userID }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    formData.append('user_id', userID);

    try {
      const response = await fetch('http://localhost:8000/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(prev => [...prev, ...data.files]);
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 2000);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (filename) => {
    setFiles(prev => prev.filter(f => f.filename !== filename));
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Upload size={18} />
        File Embedding
      </h3>
      
      <label className="block">
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition">
          <Upload className="mx-auto mb-2 text-gray-400" size={24} />
          <p className="text-sm text-gray-400">Upload files to embed in AI memory</p>
          <p className="text-xs text-gray-500 mt-1">PDF, DOCX, TXT, MD</p>
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.txt,.md"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </div>
      </label>

      {uploading && (
        <div className="mt-3">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Uploading files...</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <File size={16} className="text-blue-400" />
                <span className="text-sm truncate">{file.filename}</span>
              </div>
              <button
                onClick={() => removeFile(file.filename)}
                className="text-gray-400 hover:text-red-400 transition"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUpload;