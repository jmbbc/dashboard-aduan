const SPREADSHEET_ID = '1Nlp9_dSTgBisv6fkZKu5SlPgyxXMOMpCxoGWPCgOnUA';
const DRIVE_FOLDER_ID = '1KjQCovBn3HKMmNidHr8bzegZsyVDFrBd';

function normalizeIdValue(id) {
  return String(id || '').trim().replace(/^#+/, '');
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    const type = String(e.parameter.type || payload.type || '').trim();
    const action = String(e.parameter.action || payload.action || 'upsert').trim().toLowerCase();
    if (!type || !['Aduan', 'Technical', 'PPM'].includes(type)) {
      return jsonResponse({ success: false, error: 'Invalid type, expected Aduan, Technical, or PPM' }, 400);
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(type);
    if (!sheet) {
      return jsonResponse({ success: false, error: `Sheet ${type} not found` }, 400);
    }

    if (action === 'delete') {
      const id = normalizeIdValue(payload.id || '');
      if (!id) {
        return jsonResponse({ success: false, error: 'Missing id for delete action' }, 400);
      }
      const deleted = deleteRowById(sheet, type, id);
      return jsonResponse({ success: deleted, deleted });
    }

    const row = buildRow(type, payload);
    const result = upsertRowById(sheet, type, row, normalizeIdValue(payload.id || ''));
    return jsonResponse({ success: true, row: row.object, result });
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
    if (!type || !['Aduan', 'Technical', 'PPM'].includes(type)) {
      return jsonResponse({ success: false, error: 'Invalid type, expected Aduan, Technical, or PPM' }, 400);
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(type);
    if (!sheet) {
      return jsonResponse({ success: false, error: `Sheet ${type} not found` }, 400);
    }

    const rows = sheet.getDataRange().getValues();
    if (!rows.length) {
      return jsonResponse({ success: true, rows: [] });
    }

    const rawHeaders = rows[0].map((cell) => String(cell || '').trim());
    const normalizedHeaderKeys = rawHeaders.map(normalizeHeaderName);
    const hasIdHeader = normalizedHeaderKeys.includes('id');
    const isFirstRowData = isHeaderRowActuallyData(type, rawHeaders);

    let headerKeys;
    let dataRows;

    if (hasIdHeader && !isFirstRowData) {
      headerKeys = normalizedHeaderKeys;
      dataRows = rows.slice(1);
    } else {
      headerKeys = getDefaultHeadersForType(type);
      dataRows = rows;
    }

    const items = dataRows.map((row) => buildRowObject(headerKeys, row, type));
    return jsonResponse({ success: true, rows: items });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

function normalizeHeaderName(header) {
  const key = String(header || '').trim().toLowerCase();
  const normalizedKey = key.replace(/[^a-z0-9]+/g, '');
  const map = {
    'id': 'id',
    'idaduan': 'id',
    'tajukaduan': 'title',
    'tajuk': 'title',
    'judul': 'title',
    'kategoriutama': 'categoryMain',
    'subkategori': 'categorySub',
    'subkategori': 'categorySub',
    'kategori': 'categorySub',
    'namapengadu': 'reporter',
    'nama': 'reporter',
    'telefonpengadu': 'phone',
    'telefon': 'phone',
    'unitrumahpengadu': 'unit',
    'unitrumah': 'unit',
    'unit': 'unit',
    'lokasiunitrumahterlibat': 'relatedUnit',
    'lokasiunit': 'relatedUnit',
    'location': 'location',
    'lokasi': 'location',
    'locasi': 'location',
    'tarikhterima': 'date',
    'monthkey': 'monthKey',
    'monthkey': 'monthKey',
    'inspectiondate': 'inspectionDate',
    'templatedescription': 'templateDescription',
    'templatekey': 'templateKey',
    'referenceNo': 'referenceNo',
    'referenceno': 'referenceNo',
    'frequency': 'frequency',
    'technicianname': 'technicianName',
    'verifiedby': 'verifiedBy',
    'techdeclaration': 'techDeclaration',
    'confirmchecklist': 'confirmChecklist',
    'techniciannotes': 'technicianNotes',
    'checklistfieldvalues': 'checklistFieldValues',
    'tarikh': 'date',
    'date': 'date',
    'status': 'status',
    'butiran': 'details',
    'detail': 'details',
    'details': 'details',
    'worklogs': 'workLogs',
    'worklogs': 'workLogs',
    'worklog': 'workLogs',
    'log': 'workLogs',
    'imageurls': 'imageUrls',
    'imageurls': 'imageUrls',
    'imageurl': 'imageUrls',
    'images': 'imageUrls',
    'gambar': 'imageUrls',
    'updatedat': 'updatedAt',
    'resolvedat': 'resolvedAt',
    'asset': 'asset',
    'owner': 'owner',
    'due': 'due',
    'priority': 'priority',
    'notes': 'notes'
  };

  if (map[normalizedKey]) {
    return map[normalizedKey];
  }
  return normalizedKey;
}

function isHeaderRowActuallyData(type, headers) {
  if (!headers || !headers.length) return false;
  const firstCell = String(headers[0] || '').trim();
  return /^(ADU|TECH|PPM)-\d+/i.test(firstCell);
}

function getDefaultHeadersForType(type) {
  if (type === 'Aduan') {
    return ['id', 'title', 'categoryMain', 'categorySub', 'reporter', 'phone', 'unit', 'relatedUnit', 'date', 'status', 'details', 'workLogs', 'imageUrls', 'updatedAt', 'resolvedAt'];
  }
  if (type === 'Technical') {
    return ['id', 'title', 'type', 'asset', 'owner', 'due', 'priority', 'status', 'notes', 'workLogs', 'imageUrls', 'updatedAt'];
  }
  return ['id', 'templateKey', 'category', 'referenceNo', 'frequency', 'location', 'monthKey', 'inspectionDate', 'templateDescription', 'technicianName', 'verifiedBy', 'techDeclaration', 'confirmChecklist', 'technicianNotes', 'checklistFieldValues', 'updatedAt', 'submittedAt'];
}

function buildRowObject(headerKeys, row, type) {
  const headers = headerKeys.map((header, index) => header || getDefaultHeadersForType(type)[index] || `col${index}`);
  const obj = {};
  headers.forEach((key, index) => {
    obj[key] = row[index];
  });
  return obj;
}

function getEffectiveHeaderKeys(rows, type) {
  if (!Array.isArray(rows) || !rows.length) {
    return { headerKeys: getDefaultHeadersForType(type), dataRowStart: 1 };
  }

  const rawHeaders = rows[0].map((cell) => String(cell || '').trim());
  const headerKeys = rawHeaders.map(normalizeHeaderName);
  const hasHeaderRow = !isHeaderRowActuallyData(type, rawHeaders);

  return {
    headerKeys: hasHeaderRow ? headerKeys : getDefaultHeadersForType(type),
    dataRowStart: hasHeaderRow ? 2 : 1
  };
}

function findRowIndexesById(rows, headerKeys, type, id) {
  const idIndex = headerKeys.findIndex((header) => header === 'id');
  if (idIndex === -1) return [];

  const normalizedId = normalizeIdValue(id);
  return rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => normalizeIdValue(String(row[idIndex] || '')) === normalizedId)
    .map(({ index }) => index);
}

function sanitizeSheetRowIds(sheet, headerKeys, dataRowStart) {
  const idIndex = headerKeys.findIndex((header) => header === 'id');
  if (idIndex === -1) return;

  const lastRow = sheet.getLastRow();
  if (lastRow < dataRowStart) return;

  const range = sheet.getRange(dataRowStart, idIndex + 1, lastRow - dataRowStart + 1, 1);
  const values = range.getValues();
  let changed = false;

  const normalized = values.map((row) => {
    const current = String(row[0] || '');
    const cleaned = normalizeIdValue(current);
    if (current !== cleaned) {
      changed = true;
    }
    return [cleaned];
  });

  if (changed) {
    range.setValues(normalized);
  }
}

function upsertRowById(sheet, type, row, id) {
  let rows = sheet.getDataRange().getValues();
  const { headerKeys, dataRowStart } = getEffectiveHeaderKeys(rows, type);
  sanitizeSheetRowIds(sheet, headerKeys, dataRowStart);
  rows = sheet.getDataRange().getValues();
  const rowIndexes = findRowIndexesById(rows.slice(dataRowStart - 1), headerKeys, type, id);

  if (rowIndexes.length > 0) {
    const firstTargetRow = dataRowStart + rowIndexes[0];
    sheet.getRange(firstTargetRow, 1, 1, row.values.length).setValues([row.values]);

    // Remove any duplicate rows with the same ID, starting from the bottom.
    for (let i = rowIndexes.length - 1; i > 0; i -= 1) {
      const duplicateRow = dataRowStart + rowIndexes[i];
      sheet.deleteRow(duplicateRow);
    }

    return { updated: true, rowIndex: firstTargetRow, duplicatesRemoved: rowIndexes.length - 1 };
  }

  sheet.appendRow(row.values);
  return { appended: true };
}

function deleteRowById(sheet, type, id) {
  let rows = sheet.getDataRange().getValues();
  const { headerKeys, dataRowStart } = getEffectiveHeaderKeys(rows, type);
  sanitizeSheetRowIds(sheet, headerKeys, dataRowStart);
  rows = sheet.getDataRange().getValues();
  const rowIndexes = findRowIndexesById(rows.slice(dataRowStart - 1), headerKeys, type, id);
  if (!rowIndexes.length) {
    return false;
  }

  for (let i = rowIndexes.length - 1; i >= 0; i -= 1) {
    const targetRow = dataRowStart + rowIndexes[i];
    sheet.deleteRow(targetRow);
  }

  return true;
}

function buildRow(type, data) {
  const now = new Date().toISOString();
  const id = normalizeIdValue(data.id || generateId(type));
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

  if (type === 'PPM') {
    let checklistFieldValues = {};
    try {
      if (typeof data.checklistFieldValues === 'string') {
        checklistFieldValues = JSON.parse(data.checklistFieldValues || '{}');
      } else if (typeof data.checklistFieldValues === 'object' && data.checklistFieldValues !== null) {
        checklistFieldValues = data.checklistFieldValues;
      }
    } catch (error) {
      checklistFieldValues = {};
    }

    return {
      values: [
        id,
        data.templateKey || '',
        data.category || '',
        data.referenceNo || '',
        data.frequency || '',
        data.location || '',
        data.monthKey || '',
        data.inspectionDate || '',
        data.templateDescription || '',
        data.technicianName || '',
        data.verifiedBy || '',
        data.techDeclaration || '',
        data.confirmChecklist ? 'TRUE' : 'FALSE',
        data.technicianNotes || '',
        JSON.stringify(checklistFieldValues),
        data.updatedAt || now,
        data.submittedAt || now
      ],
      object: {
        id,
        templateKey: data.templateKey || '',
        category: data.category || '',
        referenceNo: data.referenceNo || '',
        frequency: data.frequency || '',
        location: data.location || '',
        monthKey: data.monthKey || '',
        inspectionDate: data.inspectionDate || '',
        templateDescription: data.templateDescription || '',
        technicianName: data.technicianName || '',
        verifiedBy: data.verifiedBy || '',
        techDeclaration: data.techDeclaration || '',
        confirmChecklist: Boolean(data.confirmChecklist),
        technicianNotes: data.technicianNotes || '',
        checklistFieldValues,
        updatedAt: data.updatedAt || now,
        submittedAt: data.submittedAt || now
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
