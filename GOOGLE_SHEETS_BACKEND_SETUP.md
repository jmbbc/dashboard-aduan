# Google Sheets + Google Apps Script Backend Setup

## Objective

Use GitHub Pages for the static frontend, and Google Apps Script as a free backend that:
- writes `Aduan` and `Technical` data to a single Google Spreadsheet
- uploads images to a Google Drive folder
- stores image URLs in the spreadsheet

## Required items from your side

1. Google Spreadsheet (one workbook)
   - Sheet/tab names:
     - `Aduan`
     - `Technical`
     - `PPM`
   - Spreadsheet ID:
     - `1Nlp9_dSTgBisv6fkZKu5SlPgyxXMOMpCxoGWPCgOnUA`

2. Google Drive folder for images
   - Folder ID:
     - `1KjQCovBn3HKMmNidHr8bzegZsyVDFrBd`

3. Confirm image access mode
   - preferred: allow public URLs for uploaded images
   - if not, Apps Script can store images privately and share only selected URLs

4. GitHub repository ready for GitHub Pages
   - frontend can remain in this repo

## Spreadsheet schema

These columns are aligned with the current frontend data model in `index.html` and `technical.html`.

### Sheet: `Aduan`
Columns (first row header):
- `ID` (mapped from `id`)
- `Tajuk Aduan` (mapped from `title`)
- `Kategori Utama` (mapped from `categoryMain`)
- `Subkategori` (mapped from `categorySub`)
- `Nama Pengadu` (mapped from `reporter`)
- `Telefon Pengadu` (mapped from `phone`)
- `Unit Rumah Pengadu` (mapped from `unit`)
- `Lokasi / Unit Rumah Terlibat` (mapped from `relatedUnit`)
- `Tarikh Terima` (mapped from `date`)
- `Status` (mapped from `status`)
- `Butiran` (mapped from `details`)
- `WorkLogs` (mapped from `workLogs` array as joined lines)
- `ImageURLs` (mapped from `imageAttachments` / `images`)
- `UpdatedAt` (mapped from `updatedAt`)
- `ResolvedAt` (mapped from `resolvedAt`)

### Sheet: `Technical`
Columns:
- `ID` (mapped from `id`)
- `Tajuk` (mapped from `title`)
- `Type` (mapped from `type`)
- `Asset` (mapped from `asset`)
- `Owner` (mapped from `owner`)
- `Due` (mapped from `due`)
- `Priority` (mapped from `priority`)
- `Status` (mapped from `status`)
- `Notes` (mapped from `notes`)
- `WorkLogs` (mapped from `workLogs` array as joined lines)
- `ImageURLs` (mapped from `imageAttachments` / `images`)
- `UpdatedAt` (mapped from `updatedAt`)

### Sheet: `PPM`
Columns:
- `id`
- `templateKey`
- `category`
- `referenceNo`
- `frequency`
- `location`
- `monthKey`
- `inspectionDate`
- `templateDescription`
- `technicianName`
- `verifiedBy`
- `techDeclaration`
- `confirmChecklist`
- `technicianNotes`
- `checklistFieldValues`
- `updatedAt`
- `submittedAt`

## Apps Script backend

### Setup
1. Open `https://script.google.com`
2. Create a new project
3. Rename project to something like `DashboardAduanBackend`
4. Add the script code below
5. Deploy as Web App
   - Execute as: `Me`
   - Who has access: `Anyone`

> Note: after changing the Apps Script code to support `PPM`, redeploy the web app so the live endpoint uses the latest version. If the live endpoint still returns `Invalid type, expected Aduan or Technical`, it means the deployment is still using the old script.

### Apps Script code

```javascript
const SPREADSHEET_ID = '1Nlp9_dSTgBisv6fkZKu5SlPgyxXMOMpCxoGWPCgOnUA';
const DRIVE_FOLDER_ID = '1KjQCovBn3HKMmNidHr8bzegZsyVDFrBd';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    const type = String(payload.type || '').trim();
    if (!type || !['Aduan', 'Technical'].includes(type)) {
      return jsonResponse({ success: false, error: 'Invalid type, expected Aduan or Technical' }, 400);
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(type);
    if (!sheet) {
      return jsonResponse({ success: false, error: `Sheet ${type} not found` }, 400);
    }

    const row = buildRow(type, payload);
    sheet.appendRow(row.values);
    return jsonResponse({ success: true, row: row.object });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

function buildRow(type, data) {
  const now = new Date().toISOString();
  const id = String(data.id || generateId(type));
  const imageUrls = uploadImages(data.images || []);

  if (type === 'Aduan') {
    const workLogs = Array.isArray(data.workLogs) ? data.workLogs.map((log) => `${log.date || ''} | ${log.note || ''}`).join('\n') : '';
    return {
      values: [
        id,
        data.title || '',
        data.categoryMain || '',
        data.categorySub || '',
        data.reporter || '',
        data.phone || '',
        data.unit || '',
        data.relatedUnit || '',
        data.date || '',
        data.status || '',
        data.details || '',
        workLogs,
        imageUrls.join(', '),
        now,
        data.resolvedAt || ''
      ],
      object: {
        id,
        title: data.title || '',
        categoryMain: data.categoryMain || '',
        categorySub: data.categorySub || '',
        reporter: data.reporter || '',
        phone: data.phone || '',
        unit: data.unit || '',
        relatedUnit: data.relatedUnit || '',
        date: data.date || '',
        status: data.status || '',
        details: data.details || '',
        workLogs,
        imageUrls,
        updatedAt: now,
        resolvedAt: data.resolvedAt || ''
      }
    };
  }

  if (type === 'Technical') {
    const workLogs = Array.isArray(data.workLogs) ? data.workLogs.map((log) => `${log.date || ''} | ${log.note || ''}`).join('\n') : '';
    return {
      values: [
        id,
        data.title || '',
        data.type || '',
        data.asset || '',
        data.owner || '',
        data.due || '',
        data.priority || '',
        data.status || '',
        data.notes || '',
        workLogs,
        imageUrls.join(', '),
        now
      ],
      object: {
        id,
        title: data.title || '',
        type: data.type || '',
        asset: data.asset || '',
        owner: data.owner || '',
        due: data.due || '',
        priority: data.priority || '',
        status: data.status || '',
        notes: data.notes || '',
        workLogs,
        imageUrls,
        updatedAt: now
      }
    };
  }

  throw new Error('Unsupported type');
}

function uploadImages(images) {
  if (!Array.isArray(images)) return [];

  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  return images.map((image) => {
    const dataUrl = String(image.dataUrl || '');
    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) return '';

    const mimeType = match[1];
    const base64Data = match[2];
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, String(image.name || 'image'));
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  }).filter(Boolean);
}

function generateId(prefix) {
  return `${prefix.substring(0, 3).toUpperCase()}-${new Date().getTime()}`;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions() {
  return jsonResponse({ success: true });
}

function doGet(e) {
  try {
    const type = String(e.parameter.type || '').trim();
    if (!type || !['Aduan', 'Technical'].includes(type)) {
      return jsonResponse({ success: false, error: 'Invalid type, expected Aduan or Technical' });
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(type);
    if (!sheet) {
      return jsonResponse({ success: false, error: `Sheet ${type} not found` });
    }

    const rows = sheet.getDataRange().getValues();
    const headers = rows.shift() || [];
    const items = rows.map((row) => {
      return row.reduce((obj, value, index) => {
        obj[headers[index]] = value;
        return obj;
      }, {});
    });

    return jsonResponse({ success: true, rows: items });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}
```

## Frontend API contract

### Request
POST `https://script.google.com/macros/s/YOUR_DEPLOY_ID/exec`

Headers:
```http
Content-Type: application/json
```

Body:
```json
{
  "type": "Aduan",
  "id": "ADU-123",
  "title": "...",
  "categoryMain": "...",
  "categorySub": "...",
  "reporter": "...",
  "phone": "...",
  "unit": "...",
  "relatedUnit": "...",
  "date": "2026-06-08",
  "status": "Baru",
  "details": "...",
  "workLogs": [
    { "date": "2026-06-08", "note": "Log 1" }
  ],
  "images": [
    { "name": "img1.jpg", "type": "image/jpeg", "dataUrl": "data:image/jpeg;base64,..." }
  ]
}
```

### Response
```json
{
  "success": true,
  "row": { ... }
}
```

## Sample frontend fetch

```js
const response = await fetch('https://script.google.com/macros/s/YOUR_DEPLOY_ID/exec', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
});
const result = await response.json();
```

## Notes

- `ANYONE` access for the web app is needed for public submission from GitHub Pages.
- If you want a more secure version later, we can add a simple secret token and check it in `doPost`.
- Use the same sheet names exactly as `Aduan` and `Technical`.
