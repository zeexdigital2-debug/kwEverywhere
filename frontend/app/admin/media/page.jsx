'use client';

import React, { useEffect, useState, useRef } from 'react';
import { adminService } from '@/lib/adminApi';
import {
  Image as ImageIcon,
  UploadCloud,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  AlertTriangle,
  File,
  RefreshCw
} from 'lucide-react';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [notification, setNotification] = useState(null);

  const fileInputRef = useRef(null);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const res = await adminService.getMedia({ search, limit: 30 });
      if (res && res.success) {
        setMediaList(res.media || []);
      }
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to fetch media assets.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [search]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', file.name.replace(/\.[^/.]+$/, ''));

    setUploading(true);
    setNotification(null);

    try {
      const res = await adminService.uploadMedia(formData);
      if (res && res.success) {
        setNotification({ type: 'success', message: 'File uploaded successfully!' });
        loadMedia();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Upload failed.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyUrl = (url, id) => {
    // If relative, prepend window location origin
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteModalId) return;
    try {
      const res = await adminService.deleteMedia(deleteModalId);
      if (res && res.success) {
        setNotification({ type: 'success', message: 'Media file removed.' });
        setDeleteModalId(null);
        loadMedia();
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to delete media.' });
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-amber-400" />
            <span>Media Library & Assets</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload images, illustrations, and banners for your articles, pages, and OpenGraph cards.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <UploadCloud className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*,application/pdf"
          className="hidden"
        />
      </div>

      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Drag and Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="p-8 border-2 border-dashed border-slate-800 hover:border-blue-500/50 bg-slate-900/40 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
      >
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
          <UploadCloud className="w-6 h-6" />
        </div>
        <p className="text-xs font-bold text-slate-200">
          Click to upload or drag & drop files here
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          Supports PNG, JPEG, WEBP, GIF, SVG (Up to 10MB)
        </p>
      </div>

      {/* Search Filter */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
        <div className="max-w-md w-full relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search media by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={loadMedia}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mediaList.map((item) => {
          const isImage = item.mimeType?.startsWith('image/') || item.url?.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i);
          return (
            <div
              key={item._id}
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden group hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              {/* Media Thumbnail */}
              <div className="h-32 bg-slate-950 flex items-center justify-center relative overflow-hidden">
                {isImage ? (
                  <img
                    src={item.url}
                    alt={item.altText || item.originalName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <File className="w-10 h-10 text-slate-600" />
                )}

                {/* Quick overlay buttons */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCopyUrl(item.url, item._id)}
                    className="p-2 bg-slate-800 hover:bg-blue-600 text-white rounded-xl text-xs shadow-lg transition-colors cursor-pointer"
                    title="Copy URL"
                  >
                    {copiedId === item._id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs shadow-lg transition-colors"
                    title="View Original"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setDeleteModalId(item._id)}
                    className="p-2 bg-slate-800 hover:bg-red-600 text-white rounded-xl text-xs shadow-lg transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Media Meta Info */}
              <div className="p-3">
                <p className="text-xs font-semibold text-slate-200 truncate" title={item.originalName}>
                  {item.originalName}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <span>{formatBytes(item.size)}</span>
                  <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</span>
                </div>
              </div>
            </div>
          );
        })}

        {mediaList.length === 0 && !loading && (
          <div className="col-span-full py-16 text-center text-slate-500 text-xs">
            No media files found. Upload your first image or asset above.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Delete Media File?</h3>
            <p className="text-xs text-slate-400">
              The file will be permanently removed from server disk and database.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
