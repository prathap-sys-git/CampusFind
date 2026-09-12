import React, { useState } from 'react';
import { UploadCloud, Sparkles } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { useToast } from './ui/Toast';
import type { ItemType } from '../types';

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: ItemType;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  initialType = 'lost',
}) => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState<ItemType>(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('electronics');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [date, setDate] = useState('2026-09-11');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSimulateUpload = () => {
    // Pick sample image based on category
    if (category === 'bottles-mugs') {
      setPreviewImage('https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80');
    } else if (category === 'bags-backpacks') {
      setPreviewImage('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80');
    } else {
      setPreviewImage('https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80');
    }
    toast({
      title: 'Photo Uploaded',
      description: 'Photo analyzed. Extracting multi-modal visual embeddings for CLIP matching...',
      type: 'info',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      toast({
        title: reportType === 'lost' ? 'Lost Report Filed' : 'Found Report Logged',
        description: `"${title}" has been registered. AI is actively matching against campus inventory.`,
        type: 'success',
      });
      // Reset
      setTitle('');
      setLocation('');
      setDescription('');
      setPreviewImage(null);
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={reportType === 'lost' ? 'Report Lost Belonging' : 'Report Found Belonging'}
      description="Help our AI vision engine index and match items accurately across campus."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Type Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setReportType('lost')}
            className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              reportType === 'lost'
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            I Lost Something
          </button>
          <button
            type="button"
            onClick={() => setReportType('found')}
            className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              reportType === 'found'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            I Found Something
          </button>
        </div>

        {/* Image Dropzone / Preview */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Item Photo (Crucial for AI Vision Matching)
          </label>
          {previewImage ? (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <img src={previewImage} alt="Uploaded preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute top-2 right-2 bg-slate-900/80 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-xs hover:bg-black cursor-pointer"
              >
                Change Photo
              </button>
              <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI Feature Vectors Ready
              </div>
            </div>
          ) : (
            <div
              onClick={handleSimulateUpload}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mx-auto mb-2">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Click to upload photo or tap camera
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPG, or HEIC up to 10MB
              </p>
            </div>
          )}
        </div>

        {/* Title */}
        <Input
          label="Item Name / Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Hydro Flask 32oz Navy Blue"
          required
        />

        {/* Category & Color */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'electronics', label: 'Electronics & Gadgets' },
              { value: 'bottles-mugs', label: 'Water Bottles & Mugs' },
              { value: 'bags-backpacks', label: 'Bags & Backpacks' },
              { value: 'ids-wallets', label: 'ID Cards & Wallets' },
              { value: 'keys', label: 'Keys & Fobs' },
              { value: 'books-stationery', label: 'Books & Calculators' },
              { value: 'clothing', label: 'Jackets & Clothing' },
              { value: 'glasses', label: 'Glasses & Cases' },
              { value: 'other', label: 'Other Miscellaneous' },
            ]}
          />
          <Input
            label="Primary Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g. Navy Blue / Silver"
          />
        </div>

        {/* Location & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Campus Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Library 3rd Floor or Room 204"
            required
          />
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Description & Distinguishing Features
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mention stickers, scratches, case color, or unique identifying markers..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm p-3 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Submit & Scan AI Matches
          </Button>
        </div>
      </form>
    </Modal>
  );
};
