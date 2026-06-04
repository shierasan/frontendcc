'use client';

import { useState } from 'react';
import { ApiSchema } from '@/lib/api-context';
import { Button } from '@/components/ui/button';

export interface DynamicFormProps {
  schema: ApiSchema;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  title?: string;
}

export function DynamicForm({
  schema,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  title,
}: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(
    initialData || {}
  );
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (fieldName: string, fieldType: string) => {
    const value = formData[fieldName] ?? '';

    switch (fieldType) {
      case 'text':
      case 'email':
        return (
          <input
            key={fieldName}
            type={fieldType === 'email' ? 'email' : 'text'}
            value={value}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            placeholder={`Masukkan ${fieldName}`}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            disabled={isSubmitting}
          />
        );

      case 'number':
        return (
          <input
            key={fieldName}
            type="number"
            value={value}
            onChange={(e) => handleChange(fieldName, parseFloat(e.target.value) || '')}
            placeholder={`Masukkan ${fieldName}`}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            disabled={isSubmitting}
          />
        );

      case 'date':
        return (
          <input
            key={fieldName}
            type="date"
            value={value}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isSubmitting}
          />
        );

      case 'boolean':
        return (
          <label
            key={fieldName}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleChange(fieldName, e.target.checked)}
              className="w-4 h-4 rounded border-input"
              disabled={isSubmitting}
            />
            <span className="text-sm text-foreground">{fieldName}</span>
          </label>
        );

      case 'textarea':
        return (
          <textarea
            key={fieldName}
            value={value}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            placeholder={`Masukkan ${fieldName}`}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all h-24"
            disabled={isSubmitting}
          />
        );

      case 'select':
        return (
          <select
            key={fieldName}
            value={value}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            disabled={isSubmitting}
          >
            <option value="">Pilih {fieldName}</option>
            <option value="option1">Opsi 1</option>
            <option value="option2">Opsi 2</option>
            <option value="option3">Opsi 3</option>
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}

      <div className="space-y-3">
        {Object.entries(schema).map(([fieldName, fieldType]) => (
          <div key={fieldName}>
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
              {fieldName}
            </label>
            {renderField(fieldName, fieldType)}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-3 justify-end pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || Object.keys(schema).length === 0}
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
}
