'use client';

import { useApi, Student, Resource, Endpoints, SchemaField } from '@/lib/api-context';
import { Button } from './ui/button';
import { useState } from 'react';

export function SchemaConfigEditor() {
  const api = useApi();
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');

  const handleImportSchema = () => {
    if (!jsonInput.trim()) {
      setError('Silakan paste JSON schema');
      return;
    }

    try {
      const config = JSON.parse(jsonInput);
      
      // Extract student info
      if (config.student) {
        api.setStudent(config.student);
      }

      // Extract resource info
      if (config.resource) {
        api.setResource(config.resource);
      }

      // Extract endpoints
      if (config.endpoints) {
        api.setEndpoints(config.endpoints);
      }

      // Extract fields and build schema
      if (config.fields && Array.isArray(config.fields)) {
        api.setFields(config.fields);
        
        // Build simple schema from fields
        const newSchema: { [key: string]: string } = {};
        config.fields.forEach((field: SchemaField) => {
          newSchema[field.name] = field.type;
        });
        api.setSchema(newSchema);
      }

      api.setSchemaConfig(config);
      setJsonInput('');
      setError('');
    } catch (err: any) {
      setError(err.message || 'JSON tidak valid');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
          Import Schema JSON
        </label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Paste JSON schema di sini..."
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all h-32 font-mono text-xs"
        />
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <Button onClick={handleImportSchema} className="w-full">
        Import Schema
      </Button>

      {/* Display imported data */}
      {api.student && (
        <div className="p-4 bg-secondary/30 rounded-lg border border-border space-y-2">
          <h4 className="font-semibold text-sm text-foreground">Informasi Mahasiswa</h4>
          <div className="text-sm text-foreground">
            <p><span className="font-medium">Nama:</span> {api.student.name}</p>
            <p><span className="font-medium">NIM:</span> {api.student.nim}</p>
          </div>
        </div>
      )}

      {api.resource && (
        <div className="p-4 bg-secondary/30 rounded-lg border border-border space-y-2">
          <h4 className="font-semibold text-sm text-foreground">Informasi Resource</h4>
          <div className="text-sm text-foreground space-y-1">
            <p><span className="font-medium">Nama:</span> {api.resource.name}</p>
            <p><span className="font-medium">Label:</span> {api.resource.label}</p>
            <p><span className="font-medium">Deskripsi:</span> {api.resource.description}</p>
          </div>
        </div>
      )}

      {api.endpoints && (
        <div className="p-4 bg-secondary/30 rounded-lg border border-border space-y-2">
          <h4 className="font-semibold text-sm text-foreground">Endpoints API</h4>
          <div className="text-xs text-foreground space-y-1 font-mono">
            <p><span className="font-medium">List:</span> <span className="text-primary">{api.endpoints.list}</span></p>
            <p><span className="font-medium">Detail:</span> <span className="text-primary">{api.endpoints.detail}</span></p>
            <p><span className="font-medium">Create:</span> <span className="text-primary">{api.endpoints.create}</span></p>
            <p><span className="font-medium">Update:</span> <span className="text-primary">{api.endpoints.update}</span></p>
            <p><span className="font-medium">Delete:</span> <span className="text-primary">{api.endpoints.delete}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
