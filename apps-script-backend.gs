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

function doGet(e) {
  try {
    const action = String(e.parameter.action || 'read').trim();
    const type = String(e.parameter.type || '').trim();
    if (action !== 'read') {
      return jsonResponse({ success: false, error: 'Unsupported action. Use action=read' }, 400);
    }
    if (!type || !['Aduan', 'Technical'].includes(type)) {
      return jsonResponse({ success: false, error: 'Invalid type, expected Aduan or Technical' }, 400);
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(type);
    if (!sheet) {
      return jsonResponse({ success: false, error: `Sheet ${type} not found` }, 400);
    }

    const rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return jsonResponse({ success: true, rows: [] });
    }

    const headers = rows.shift();
    const items = rows.map((row) => {
      const obj = {};
      row.forEach((value, index) => {
        obj[headers[index]] = value;
      });
      return obj;
    });

    return jsonResponse({ success: true, rows: items });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

function buildRow(type, data) {
  const now = new Date().toISOString();
  const id = String(data.id || generateId(type));
  const imageUrls = uploadImages(data.images || []);
  const workLogs = Array.isArray(data.workLogs)
    ? data.workLogs.map((log) => `${log.date || ''} | ${log.note || ''}`).join('\n')
    : '';

  if (type === 'Aduan') {
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
  if (!Array.isArray(images)) {
    return [];
  }

  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  return images.map((image) => {
    const dataUrl = String(image.dataUrl || '');
    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) {
      return '';
    }

    const mimeType = match[1];
    const base64Data = match[2];
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, String(image.name || 'image'));
    const file = folder.createFile(blob);
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (ex) {
      // If sharing fails, still return the file URL for browser access when possible.
    }
    return file.getUrl();
  }).filter(Boolean);
}

function generateId(type) {
  return `${type.substring(0, 3).toUpperCase()}-${new Date().getTime()}`;
}

function jsonResponse(payload, statusCode) {
  const response = ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
  if (response.setHeader) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (typeof statusCode === 'number' && response.setResponseCode) {
    response.setResponseCode(statusCode);
  }
  return response;
}

function doOptions() {
  return jsonResponse({ success: true }, 200);
}
