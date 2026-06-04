'use client';

import { ApiSchema, SchemaField } from '@/lib/api-context';
import { Button } from '@/components/ui/button';

export interface DynamicTableProps {
  schema: ApiSchema;
  fields?: SchemaField[];
  data: Record<string, any>[];
  onEdit: (record: Record<string, any>) => void;
  onDelete: (id: string | number) => void;
  onNew: () => void;
  isLoading?: boolean;
  currentPage: number;
  totalRecords: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function DynamicTable({
  schema,
  fields,
  data,
  onEdit,
  onDelete,
  onNew,
  isLoading = false,
  currentPage,
  totalRecords,
  recordsPerPage,
  onPageChange,
  onSearch,
  searchQuery,
}: DynamicTableProps) {
  // Gunakan fields dengan showInTable=true, fallback ke schema jika tidak ada
  let columns: string[] = [];
  
  if (fields && fields.length > 0) {
    columns = fields
      .filter(f => f.showInTable !== false)
      .map(f => f.name);
  } else {
    columns = Object.keys(schema);
  }
  
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const hasId = data.length > 0 && 'id' in data[0];

  if (columns.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Silakan konfigurasi skema API untuk melihat data
        </p>
      </div>
    );
  }

  if (data.length === 0 && !isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Tidak ada catatan ditemukan</p>
        <Button onClick={onNew}>Buat Catatan Baru</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari catatan..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            disabled={isLoading}
            className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          />
        </div>
        <Button onClick={onNew} disabled={isLoading} className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Catatan Baru
        </Button>
      </div>

      <div className="overflow-x-auto border border-border rounded-lg bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left font-semibold text-foreground"
                >
                  {col}
                </th>
              ))}
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Tindakan
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center">
                  <span className="text-muted-foreground">Memuat...</span>
                </td>
              </tr>
            ) : (
              data.map((record, index) => (
                <tr key={index} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  {columns.map((col) => (
                    <td
                      key={`${index}-${col}`}
                      className="px-4 py-3 text-foreground"
                    >
                      {typeof record[col] === 'boolean'
                        ? record[col]
                          ? 'Ya'
                          : 'Tidak'
                        : String(record[col] ?? '-')}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(record)}
                        disabled={isLoading}
                        className="text-primary hover:bg-primary/10"
                      >
                        Edit
                      </Button>
                      {hasId && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(record.id)}
                          disabled={isLoading}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          Hapus
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Halaman <span className="font-medium text-foreground">{currentPage}</span> dari <span className="font-medium text-foreground">{totalPages}</span> • <span className="font-medium text-foreground">{totalRecords}</span> total catatan
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="flex items-center gap-1"
            >
              Selanjutnya
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
