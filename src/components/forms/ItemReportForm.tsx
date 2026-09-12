import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Camera,
  MapPin,
  Calendar,
  Clock,
  Shield,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import { FormSection } from './FormSection';
import { ImageUploader } from './ImageUploader';
import { CategorySelect } from './CategorySelect';
import { LocationSelect } from './LocationSelect';
import { PrivacyNotice } from './PrivacyNotice';
import { SuccessState } from './SuccessState';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { createItem } from '../../services/itemService';
import type { ItemType } from '../../types';

export interface ItemReportFormProps {
  type: ItemType;
}

interface FormValues {
  imageFile: File | null;
  imagePreviewUrl: string | null;
  name: string;
  category: string;
  description: string;
  color: string;
  brand: string;
  location: string;
  locationNotes: string;
  date: string;
  time: string;
  uniqueDetails: string;
}

const today = new Date().toISOString().split('T')[0];
const currentTime = new Date().toTimeString().slice(0, 5);

export const ItemReportForm: React.FC<ItemReportFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { supabaseUser } = useAuth();

  const isLost = type === 'lost';

  const [values, setValues] = useState<FormValues>({
    imageFile: null,
    imagePreviewUrl: null,
    name: '',
    category: '',
    description: '',
    color: '',
    brand: '',
    location: '',
    locationNotes: '',
    date: today,
    time: currentTime,
    uniqueDetails: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Validation ─────────────────────────────────────────────────────────────
  const errors: Record<string, string> = {};
  if (!values.imagePreviewUrl) {
    errors.photo = 'Please provide an item photo for AI visual matching.';
  }
  if (!values.name.trim()) errors.name = 'Item name is required.';
  if (!values.category) errors.category = 'Please select a category.';
  if (!values.description.trim() || values.description.trim().length < 10) {
    errors.description = 'Please enter a description (at least 10 characters).';
  }
  if (!values.location) {
    errors.location = isLost
      ? 'Please select where it was lost.'
      : 'Please select where it was found.';
  }
  if (!values.date) errors.date = 'Date is required.';

  const isValid = Object.keys(errors).length === 0;

  const handleBlur = (field: keyof FormValues) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleChange = (field: keyof FormValues, value: string | null) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  const handleImageChange = (file: File | null, previewUrl: string | null) => {
    setValues((prev) => ({ ...prev, imageFile: file, imagePreviewUrl: previewUrl }));
    setTouched((prev) => ({ ...prev, photo: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Mark all required fields as touched to show validation errors
    setTouched({ photo: true, name: true, category: true, description: true, location: true, date: true });

    if (!isValid) {
      toast({ title: 'Missing Required Fields', description: 'Please complete all required fields and upload an item photo.', type: 'error' });
      return;
    }

    if (!supabaseUser) {
      toast({ title: 'Not Authenticated', description: 'Please log in to submit a report.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      await createItem(
        {
          type,
          name: values.name,
          description: values.description,
          category: values.category,
          color: values.color || undefined,
          brand: values.brand || undefined,
          location: values.location,
          locationDetails: values.locationNotes || undefined,
          date: values.date,
          time: values.time || undefined,
          additionalDetails: values.uniqueDetails || undefined,
        },
        values.imageFile,
        supabaseUser.id,
        (progress) => setUploadProgress(progress)
      );

      setIsSuccess(true);
      toast({
        title: isLost ? 'Lost Item Reported' : 'Found Item Logged',
        description: `"${values.name}" has been saved to the campus database.`,
        type: 'success',
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      setSubmitError(msg);
      toast({ title: 'Submission Failed', description: msg, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setValues({
      imageFile: null,
      imagePreviewUrl: null,
      name: '',
      category: '',
      description: '',
      color: '',
      brand: '',
      location: '',
      locationNotes: '',
      date: today,
      time: currentTime,
      uniqueDetails: '',
    });
    setTouched({});
    setIsSuccess(false);
    setSubmitError(null);
    setUploadProgress(0);
  };

  if (isSuccess) {
    return <SuccessState type={type} itemName={values.name} onReset={handleReset} />;
  }

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isLost ? 'Lost Item Registry' : 'Found Item Intake'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isLost ? 'Report a Lost Item' : 'Report a Found Item'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          {isLost
            ? "Tell us about the item you lost. We'll use these details to help find a match."
            : 'Help reunite a lost item with its owner.'}
        </p>
      </div>

      {/* Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* Upload progress bar (shown during submission) */}
          {isSubmitting && (
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-700 dark:text-blue-300">
                <span>
                  {uploadProgress < 80 ? 'Uploading image to secure storage…' : 'Saving report to database…'}
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Global submit error */}
          {submitError && !isSubmitting && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* SECTION 1 — ITEM PHOTO */}
          <FormSection
            number={1}
            title="Item Photo"
            subtitle="Clear photos help our AI extract visual embeddings (color, geometry, logos)."
          >
            <ImageUploader
              file={values.imageFile}
              previewUrl={values.imagePreviewUrl}
              onChange={handleImageChange}
              error={touched.photo ? errors.photo : undefined}
              required
            />
          </FormSection>

          {/* SECTION 2 — ITEM INFORMATION */}
          <FormSection
            number={2}
            title="Item Information"
            subtitle="Core identifying labels and general product description."
          >
            <div className="space-y-4">
              <Input
                label="Item Name *"
                value={values.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="e.g. Hydro Flask 32oz Navy Blue"
                error={touched.name ? errors.name : undefined}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CategorySelect
                  value={values.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  error={touched.category ? errors.category : undefined}
                  required
                />

                <Input
                  label="Color / Finish"
                  value={values.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  placeholder="e.g. Deep Navy Blue, Matte"
                />
              </div>

              <Input
                label="Brand / Manufacturer (Optional)"
                value={values.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                placeholder="e.g. Hydro Flask, Apple, Sony, North Face"
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={3}
                  value={values.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  onBlur={() => handleBlur('description')}
                  placeholder="Describe the item's general appearance, condition, size, or material..."
                  className={`w-full rounded-2xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm p-4 transition-colors focus:ring-2 placeholder:text-slate-400 ${
                    touched.description && errors.description
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-blue-500/20'
                  }`}
                  required
                />
                {touched.description && errors.description ? (
                  <p className="text-xs font-medium text-rose-600 dark:text-rose-400 mt-1">
                    {errors.description}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Mention general characteristics. Keep unique security secrets for Section 4.
                  </p>
                )}
              </div>
            </div>
          </FormSection>

          {/* SECTION 3 — LOCATION & TIME */}
          <FormSection
            number={3}
            title="Location & Time"
            subtitle={
              isLost
                ? 'Where and approximately when did you misplace it on campus?'
                : 'Where and approximately when did you find it?'
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LocationSelect
                  label={isLost ? 'Location Lost' : 'Found Location'}
                  value={values.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  error={touched.location ? errors.location : undefined}
                  required
                />

                <Input
                  label="Location Notes (Optional)"
                  value={values.locationNotes}
                  onChange={(e) => handleChange('locationNotes', e.target.value)}
                  placeholder="e.g. 3rd Floor Quiet Study Desk #14"
                  leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={isLost ? 'Date Lost *' : 'Date Found *'}
                  type="date"
                  value={values.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  onBlur={() => handleBlur('date')}
                  leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
                  error={touched.date ? errors.date : undefined}
                  required
                />

                <Input
                  label="Approximate Time"
                  type="time"
                  value={values.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  leftIcon={<Clock className="w-4 h-4 text-slate-400" />}
                />
              </div>
            </div>
          </FormSection>

          {/* SECTION 4 — UNIQUE DETAILS */}
          <FormSection
            number={4}
            title="Help us identify your item"
            subtitle="Provide distinguishing marks used exclusively to verify student ownership."
          >
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Unique Details &amp; Proof Features
                </label>
                <textarea
                  rows={3}
                  value={values.uniqueDetails}
                  onChange={(e) => handleChange('uniqueDetails', e.target.value)}
                  placeholder="List unique stickers, scratch marks, serial numbers, case attachments, lock-screen wallpaper, or engraving initials..."
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm p-4 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                />
              </div>
              <PrivacyNotice />
            </div>
          </FormSection>

          {/* SECTION 5 — SUBMIT */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => navigate('/dashboard')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!isValid && (
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  Complete required fields &amp; photo
                </span>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                disabled={!isValid || isSubmitting}
                isLoading={isSubmitting}
                leftIcon={isLost ? <Camera className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              >
                {isSubmitting
                  ? uploadProgress < 80
                    ? 'Uploading Image…'
                    : 'Saving Report…'
                  : isLost
                  ? 'Report Lost Item'
                  : 'Report Found Item'}
              </Button>
            </div>
          </div>
        </form>

        {/* Right Column: Live Preview */}
        <aside className="hidden lg:block lg:col-span-4 space-y-6 sticky top-24">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Live Report Card Preview
              </span>
              <Badge variant={isLost ? 'lost' : 'found'} size="sm" dot>
                {isLost ? 'Lost Item' : 'Found Item'}
              </Badge>
            </div>

            {/* Thumbnail Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center">
              {values.imagePreviewUrl ? (
                <img
                  src={values.imagePreviewUrl}
                  alt="Live preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 text-slate-400">
                  <Camera className="w-8 h-8 mx-auto mb-1 opacity-40" />
                  <span className="text-xs">No photo uploaded yet</span>
                </div>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {values.name || 'Untitled Item'}
              </h4>
              <p className="text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {values.description || 'Description will appear here as you type...'}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-semibold">{values.category || 'Not chosen'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-semibold truncate max-w-[60%]">
                    {values.location || 'Not chosen'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="font-semibold">{values.date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Tips */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 border border-blue-200/80 dark:border-blue-900/40 space-y-3">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI Matching Tips</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Natural lighting</strong> gives the highest CLIP multi-modal score.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Include brand logos, distinct scratches, or stickers in the photo frame.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Keep private serial digits inside Section 4 so only verified claims can see them.</span>
              </li>
            </ul>
          </div>

          {/* Trust */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-500">
            <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Campus Safety Verified Network. Zero commercial spam.</span>
          </div>
        </aside>
      </div>
    </div>
  );
};
