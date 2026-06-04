'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/lib/api-context';
import { getApiService } from '@/lib/api-service';
import { DynamicTable } from './dynamic-table';
import { DynamicForm } from './dynamic-form';
import { SchemaEditor } from './schema-editor';
import { SchemaConfigEditor } from './schema-config-editor';
import { ApiConfiguration } from './api-configuration';
import { StatusIndicator } from './status-indicator';
import { Modal } from './modal';
import { useToast, ToastContainer } from './toast';

type FormMode = 'create' | 'edit';

export function Dashboard() {
  const api = useApi();
  const { toasts, addToast, removeToast } = useToast();

  const [records, setRecords] = useState<Record<string, any>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRecord, setEditingRecord] = useState<Record<string, any> | null>(
    null
  );
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const recordsPerPage = 10;

  // Fetch records when resource or page changes
  useEffect(() => {
    if (api.isConnected && api.activeResource) {
      fetchRecords();
    }
  }, [api.isConnected, api.activeResource, currentPage]);

  const fetchRecords = async () => {
    if (!api.baseUrl || !api.activeResource) return;

    setIsLoading(true);
    try {
      const apiService = getApiService(api.baseUrl);
      let result;

      if (searchQuery) {
        result = await apiService.searchRecords(api.activeResource, searchQuery);
      } else {
        result = await apiService.getRecords(
          api.activeResource,
          currentPage,
          recordsPerPage
        );
      }

      setRecords(result.data);
      api.setRecordCount(result.total);
      api.setLastResponseTime(result.responseTime);
      addToast('Catatan berhasil dimuat', 'success');
    } catch (error: any) {
      addToast(error.message || 'Gagal memuat catatan', 'error');
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleNewRecord = () => {
    setEditingRecord(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEditRecord = (record: Record<string, any>) => {
    setEditingRecord(record);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: Record<string, any>) => {
    if (!api.baseUrl || !api.activeResource) return;

    try {
      const apiService = getApiService(api.baseUrl);

      if (formMode === 'create') {
        await apiService.createRecord(api.activeResource, data);
        addToast('Catatan berhasil dibuat', 'success');
      } else if (editingRecord?.id) {
        await apiService.updateRecord(api.activeResource, editingRecord.id, data);
        addToast('Catatan berhasil diperbarui', 'success');
      }

      setIsFormOpen(false);
      await fetchRecords();
    } catch (error: any) {
      addToast(error.message || 'Gagal menyimpan catatan', 'error');
    }
  };

  const handleDeleteRecord = async (id: string | number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan ini?')) return;

    if (!api.baseUrl || !api.activeResource) return;

    try {
      const apiService = getApiService(api.baseUrl);
      await apiService.deleteRecord(api.activeResource, id);
      addToast('Catatan berhasil dihapus', 'success');
      await fetchRecords();
    } catch (error: any) {
      addToast(error.message || 'Gagal menghapus catatan', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Logo_Unand_PTNBH.png/1920px-Logo_Unand_PTNBH.png"
                alt="Logo Unand"
                className="h-12 w-auto"
              />
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-foreground">Tugas Besar Cloud Computing 2026</h1>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                  <span>Tester dan kelola endpoint REST API Anda</span>
                  {api.student && (
                    <div className="flex items-center gap-2 pl-4 border-l border-border">
                      <span className="font-medium">{api.student.name}</span>
                      <span>•</span>
                      <span>{api.student.nim}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <StatusIndicator />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow">
                <h2 className="text-sm font-semibold text-foreground mb-4">
                  Import Schema
                </h2>
                <SchemaConfigEditor />
              </div>

              <div className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow">
                <h2 className="text-sm font-semibold text-foreground mb-4">
                  Konfigurasi API
                </h2>
                <ApiConfiguration />
              </div>

              {api.isConnected && (
                <div className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow">
                  <h2 className="text-sm font-semibold text-foreground mb-4">
                    Skema Manual
                  </h2>
                  <SchemaEditor />
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {!api.isConnected ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <p className="text-foreground font-medium mb-2">Mulai dengan menghubungkan API</p>
                <p className="text-sm text-muted-foreground">
                  Masukkan URL dasar API di panel konfigurasi di sebelah kiri
                </p>
              </div>
            ) : !api.activeResource ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <p className="text-foreground font-medium mb-2">Tentukan skema API Anda</p>
                <p className="text-sm text-muted-foreground">
                  Atur nama sumber daya dan tambahkan bidang skema di panel Skema
                </p>
              </div>
            ) : (
              <div className="bg-card border border-input rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  {api.activeResource}
                </h2>
                <DynamicTable
                  schema={api.schema}
                  fields={api.fields}
                  data={records}
                  onEdit={handleEditRecord}
                  onDelete={handleDeleteRecord}
                  onNew={handleNewRecord}
                  isLoading={isLoading}
                  currentPage={currentPage}
                  totalRecords={api.recordCount}
                  recordsPerPage={recordsPerPage}
                  onPageChange={setCurrentPage}
                  onSearch={handleSearch}
                  searchQuery={searchQuery}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={formMode === 'create' ? 'Buat Catatan' : 'Edit Catatan'}
      >
        <DynamicForm
          schema={api.schema}
          initialData={editingRecord || {}}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          title={
            formMode === 'create'
              ? `Buat ${api.activeResource} baru`
              : `Edit ${api.activeResource}`
          }
        />
      </Modal>

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
