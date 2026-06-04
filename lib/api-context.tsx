'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Student {
  name: string;
  nim: string;
}

export interface Resource {
  name: string;
  label: string;
  description: string;
}

export interface Endpoints {
  list: string;
  detail: string;
  create: string;
  update: string;
  delete: string;
}

export interface SchemaField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'date' | 'textarea' | 'select' | 'boolean';
  required?: boolean;
  showInTable?: boolean;
}

export interface ApiSchemaConfig {
  student?: Student;
  resource?: Resource;
  fields?: SchemaField[];
  endpoints?: Endpoints;
}

export interface ApiSchema {
  [key: string]: 'text' | 'number' | 'email' | 'date' | 'select' | 'boolean' | 'textarea';
}

export interface ApiContextType {
  baseUrl: string;
  setBaseUrl: (url: string) => void;
  schema: ApiSchema;
  setSchema: (schema: ApiSchema) => void;
  schemaConfig: ApiSchemaConfig;
  setSchemaConfig: (config: ApiSchemaConfig) => void;
  student: Student | null;
  setStudent: (student: Student | null) => void;
  resource: Resource | null;
  setResource: (resource: Resource | null) => void;
  endpoints: Endpoints | null;
  setEndpoints: (endpoints: Endpoints | null) => void;
  fields: SchemaField[];
  setFields: (fields: SchemaField[]) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  activeResource: string;
  setActiveResource: (resource: string) => void;
  recordCount: number;
  setRecordCount: (count: number) => void;
  lastResponseTime: number;
  setLastResponseTime: (time: number) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [baseUrl, setBaseUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('apiBaseUrl') || '';
    }
    return '';
  });

  const [schema, setSchema] = useState<ApiSchema>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('apiSchema');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [schemaConfig, setSchemaConfig] = useState<ApiSchemaConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('apiSchemaConfig');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [student, setStudent] = useState<Student | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('student');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [resource, setResource] = useState<Resource | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('resource');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [endpoints, setEndpoints] = useState<Endpoints | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('endpoints');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [fields, setFields] = useState<SchemaField[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fields');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [isConnected, setIsConnected] = useState(false);
  const [activeResource, setActiveResource] = useState('');
  const [recordCount, setRecordCount] = useState(0);
  const [lastResponseTime, setLastResponseTime] = useState(0);

  const value: ApiContextType = {
    baseUrl,
    setBaseUrl: (url) => {
      setBaseUrl(url);
      if (typeof window !== 'undefined') {
        localStorage.setItem('apiBaseUrl', url);
      }
    },
    schema,
    setSchema: (newSchema) => {
      setSchema(newSchema);
      if (typeof window !== 'undefined') {
        localStorage.setItem('apiSchema', JSON.stringify(newSchema));
      }
    },
    schemaConfig,
    setSchemaConfig: (config) => {
      setSchemaConfig(config);
      if (typeof window !== 'undefined') {
        localStorage.setItem('apiSchemaConfig', JSON.stringify(config));
      }
    },
    student,
    setStudent: (s) => {
      setStudent(s);
      if (typeof window !== 'undefined') {
        if (s) localStorage.setItem('student', JSON.stringify(s));
        else localStorage.removeItem('student');
      }
    },
    resource,
    setResource: (r) => {
      setResource(r);
      if (typeof window !== 'undefined') {
        if (r) localStorage.setItem('resource', JSON.stringify(r));
        else localStorage.removeItem('resource');
      }
    },
    endpoints,
    setEndpoints: (e) => {
      setEndpoints(e);
      if (typeof window !== 'undefined') {
        if (e) localStorage.setItem('endpoints', JSON.stringify(e));
        else localStorage.removeItem('endpoints');
      }
    },
    fields,
    setFields: (f) => {
      setFields(f);
      if (typeof window !== 'undefined') {
        localStorage.setItem('fields', JSON.stringify(f));
      }
    },
    isConnected,
    setIsConnected,
    activeResource,
    setActiveResource,
    recordCount,
    setRecordCount,
    lastResponseTime,
    setLastResponseTime,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within ApiProvider');
  }
  return context;
}
