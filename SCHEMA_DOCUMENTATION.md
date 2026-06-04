# Dokumentasi Schema JSON - Tugas Besar Cloud Computing 2026

## Pengenalan

Aplikasi ini memungkinkan Anda untuk mengimport konfigurasi API lengkap melalui JSON schema. Schema ini mencakup informasi mahasiswa, resource, fields, dan endpoints API.

## Struktur Schema JSON

### Format Lengkap

```json
{
  "student": {
    "name": "string",
    "nim": "string"
  },
  "resource": {
    "name": "string",
    "label": "string",
    "description": "string"
  },
  "fields": [
    {
      "name": "string",
      "label": "string",
      "type": "text | number | email | date | textarea | select | boolean",
      "required": boolean,
      "showInTable": boolean
    }
  ],
  "endpoints": {
    "list": "string",
    "detail": "string",
    "create": "string",
    "update": "string",
    "delete": "string"
  }
}
```

## Detail Setiap Bagian

### 1. Student (Informasi Mahasiswa)

Menyimpan informasi pribadi mahasiswa yang akan ditampilkan di header aplikasi.

| Property | Type | Deskripsi |
|----------|------|-----------|
| name | string | Nama lengkap mahasiswa |
| nim | string | Nomor Induk Mahasiswa |

**Contoh:**
```json
"student": {
  "name": "Muhammad Nouval Habibie",
  "nim": "2311523001"
}
```

### 2. Resource (Informasi Resource)

Mendeskripsikan resource API yang akan dikelola oleh aplikasi.

| Property | Type | Deskripsi |
|----------|------|-----------|
| name | string | Nama resource (misalnya: books, users, products) |
| label | string | Label yang akan ditampilkan di UI |
| description | string | Deskripsi detail tentang resource |

**Contoh:**
```json
"resource": {
  "name": "books",
  "label": "Data Buku",
  "description": "Aplikasi untuk mengelola data buku"
}
```

### 3. Fields (Daftar Bidang)

Array yang mendefinisikan setiap field/kolom dalam resource.

| Property | Type | Deskripsi |
|----------|------|-----------|
| name | string | Nama field yang unik (digunakan di API) |
| label | string | Label yang ditampilkan di form |
| type | enum | Tipe input: text, number, email, date, textarea, select, boolean |
| required | boolean | Apakah field wajib diisi |
| showInTable | boolean | Apakah field ditampilkan di tabel |

**Tipe Field yang Tersedia:**

- **text**: Input text biasa
- **number**: Input untuk angka
- **email**: Input email dengan validasi
- **date**: Input date picker
- **textarea**: Input text panjang multi-baris
- **select**: Dropdown selection
- **boolean**: Checkbox

**Contoh:**
```json
"fields": [
  {
    "name": "title",
    "label": "Judul Buku",
    "type": "text",
    "required": true,
    "showInTable": true
  },
  {
    "name": "description",
    "label": "Deskripsi",
    "type": "textarea",
    "required": false,
    "showInTable": false
  }
]
```

### 4. Endpoints (Endpoint API)

Mendefinisikan URL endpoint untuk operasi CRUD.

| Property | Type | Deskripsi |
|----------|------|-----------|
| list | string | Endpoint untuk mengambil daftar data |
| detail | string | Endpoint untuk mengambil detail satu data |
| create | string | Endpoint untuk membuat data baru |
| update | string | Endpoint untuk mengupdate data |
| delete | string | Endpoint untuk menghapus data |

**Catatan:** Gunakan `{id}` sebagai placeholder untuk ID dalam endpoint detail, update, dan delete.

**Contoh:**
```json
"endpoints": {
  "list": "/books",
  "detail": "/books/{id}",
  "create": "/books",
  "update": "/books/{id}",
  "delete": "/books/{id}"
}
```

## Contoh Lengkap

File `public/schema-example.json` berisi contoh lengkap yang dapat Anda gunakan:

```json
{
  "student": {
    "name": "Muhammad Nouval Habibie",
    "nim": "2311523001"
  },
  "resource": {
    "name": "books",
    "label": "Data Buku",
    "description": "Aplikasi untuk mengelola data buku"
  },
  "fields": [
    {
      "name": "title",
      "label": "Judul Buku",
      "type": "text",
      "required": true,
      "showInTable": true
    },
    {
      "name": "author",
      "label": "Penulis",
      "type": "text",
      "required": true,
      "showInTable": true
    },
    {
      "name": "year",
      "label": "Tahun Terbit",
      "type": "number",
      "required": false,
      "showInTable": true
    },
    {
      "name": "description",
      "label": "Deskripsi",
      "type": "textarea",
      "required": false,
      "showInTable": false
    }
  ],
  "endpoints": {
    "list": "/books",
    "detail": "/books/{id}",
    "create": "/books",
    "update": "/books/{id}",
    "delete": "/books/{id}"
  }
}
```

## Cara Menggunakan

1. **Buka aplikasi** di http://localhost:3000
2. **Copy JSON schema** dari contoh di atas atau buat sendiri
3. **Paste ke textarea** di bagian "Import Schema" di sidebar
4. **Klik tombol "Import Schema"**
5. Setelah import berhasil, Anda akan melihat:
   - Nama dan NIM mahasiswa di header
   - Informasi resource di sidebar
   - Daftar endpoints API di sidebar
6. **Masukkan URL API** di bagian "Konfigurasi API"
7. **Klik "Hubungkan"** untuk menghubungkan ke API
8. Data akan dimuat dan ditampilkan di tabel utama

## Tips dan Catatan

- **showInTable**: Jika set ke `false`, field tidak akan ditampilkan di tabel tapi tetap dapat diisi di form
- **required**: Field yang diperlukan harus diisi sebelum submit form
- **type**: Pilih tipe yang sesuai untuk validasi yang lebih baik
- **Placeholder {id}**: Di endpoint, `{id}` akan diganti dengan ID record saat operasi detail, update, atau delete
- **localStorage**: Konfigurasi schema Anda akan tersimpan otomatis di browser

## Troubleshooting

### JSON tidak valid
- Pastikan JSON syntax sudah benar (gunakan JSON validator online)
- Periksa koma dan kurung kurawal
- Jangan lupa quote untuk string values

### Fields tidak muncul
- Pastikan array `fields` tidak kosong
- Setiap field harus memiliki `name` dan `type`

### Tabel kosong setelah import
- Pastikan API base URL sudah diisi dan terhubung
- Periksa endpoint `list` apakah sesuai dengan API Anda
- Lihat browser console untuk error message

## Support

Jika ada pertanyaan atau masalah, silakan check dokumentasi atau hubungi pengembang aplikasi.
