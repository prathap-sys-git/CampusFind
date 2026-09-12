import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Sparkles,
  Image as ImageIcon,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { Button } from '../ui/Button';

export interface ImageUploaderProps {
  /** The raw File object (null = no image selected) */
  file: File | null;
  /** Temporary object URL for preview — also accepts a plain HTTPS URL for demo presets */
  previewUrl: string | null;
  /** Called whenever the image changes */
  onChange: (file: File | null, previewUrl: string | null) => void;
  error?: string;
  required?: boolean;
}

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const SAMPLE_PRESETS = [
  {
    name: 'Hydro Flask (Navy)',
    url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'AirPods Pro Case',
    url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Backpack (Grey)',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
  },
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  file,
  previewUrl,
  onChange,
  error,
  required = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
  // Track object URLs we create so we can revoke them on cleanup
  const objectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke old object URL when component unmounts or URL changes
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const processFile = (selectedFile: File) => {
    setLocalError(null);

    // Format validation
    if (!ALLOWED_TYPES.includes(selectedFile.type.toLowerCase())) {
      setLocalError('Invalid format. Please upload a JPG, JPEG, PNG, or WEBP image.');
      return;
    }

    // Size validation
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setLocalError(
        `File too large (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB). Maximum is ${MAX_FILE_SIZE_MB} MB.`
      );
      return;
    }

    // Revoke the previous object URL to free memory
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    // Create an instant preview URL — no FileReader delay, no base64 conversion
    const url = URL.createObjectURL(selectedFile);
    objectUrlRef.current = url;

    setFileDetails({
      name: selectedFile.name,
      size: `${(selectedFile.size / 1024).toFixed(0)} KB`,
    });

    onChange(selectedFile, url);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
      // Reset the input so the same file can be re-selected
      e.target.value = '';
    }
  };

  const handleRemove = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setFileDetails(null);
    setLocalError(null);
    onChange(null, null);
  };

  const handlePresetSelect = (preset: (typeof SAMPLE_PRESETS)[0]) => {
    // Demo presets use a regular HTTPS URL — no File object
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setFileDetails({ name: `${preset.name}.jpg`, size: '~820 KB (demo)' });
    setLocalError(null);
    onChange(null, preset.url); // no File for demo presets
  };

  const activeError = localError || error;

  return (
    <div className="space-y-3 text-left">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Item Photo {required && <span className="text-rose-500">*</span>}
        </label>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200/80 dark:border-blue-800">
          <Sparkles className="w-3 h-3" />
          AI Matching Key Factor
        </span>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        id="item-image-file-input"
      />

      {/* State A: Image Preview */}
      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md group animate-in fade-in zoom-in-95 duration-200">
          <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Uploaded item preview"
              className="h-full w-full object-contain sm:object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top bar */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-white backdrop-blur-md border border-white/15">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Image Ready for AI Matching
              </span>

              <button
                type="button"
                onClick={handleRemove}
                title="Remove photo"
                className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-rose-600 text-white backdrop-blur-md border border-white/15 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom bar */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white text-xs">
              <div className="truncate max-w-[65%]">
                <span className="font-semibold block truncate">
                  {fileDetails?.name || 'Item Photo'}
                </span>
                <span className="text-[11px] text-slate-300">
                  {fileDetails?.size || 'Image'} • Ready for upload
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-xs text-xs"
                  leftIcon={<RefreshCw className="w-3 h-3" />}
                >
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={handleRemove}
                  className="text-xs"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* State B: Empty Drop-Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 group relative ${
            isDragging
              ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-4 ring-blue-500/20 scale-[1.01]'
              : activeError
              ? 'border-rose-500 bg-rose-50/30 dark:bg-rose-950/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900/80'
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mx-auto mb-3.5 group-hover:scale-110 transition-transform shadow-xs">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Drag &amp; drop your item photo here, or{' '}
            <span className="text-blue-600 dark:text-blue-400 underline">browse</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            Supports JPG, JPEG, PNG, or WEBP (Max {MAX_FILE_SIZE_MB} MB). Clear, well-lit photos give the best AI match scores.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-500" /> Instant preview
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-500" /> Drag &amp; drop
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-500" /> Secure upload
            </span>
          </div>
        </div>
      )}

      {/* Error display */}
      {activeError && (
        <div className="flex items-center gap-2 text-xs font-medium text-rose-600 dark:text-rose-400 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{activeError}</span>
        </div>
      )}

      {/* Demo presets */}
      {!previewUrl && (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ImageIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Demo presets:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {SAMPLE_PRESETS.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                + {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
