(function (global) {
    const STORAGE_KEYS = {
        complaints: 'aduanDashboardData',
        technical: 'aduanDashboardTechnical',
        activity: 'aduanDashboardActivity'
    };

    const DEFAULT_COMPLAINTS = [
        {
            id: 'ADU-001',
            title: 'Masalah sistem pembayaran tidak berfungsi',
            category: 'Teknikal',
            reporter: 'Ahmad Ali',
            phone: '012-3456789',
            unit: 'B1-12-3',
            date: '2025-12-31',
            status: 'Dalam Proses',
            details: 'Transaksi gagal diproses selepas kemas kini aplikasi.',
            updatedAt: '2025-12-31T09:10:00Z'
        },
        {
            id: 'ADU-002',
            title: 'Perkhidmatan pelanggan lambat bertindak',
            category: 'Perkhidmatan',
            reporter: 'Siti Nurhaliza',
            phone: '013-1112233',
            unit: 'A-3-8',
            date: '2025-12-31',
            status: 'Baru',
            details: 'Pertanyaan tidak dijawab selama lebih 48 jam.',
            updatedAt: '2025-12-31T08:00:00Z'
        },
        {
            id: 'ADU-003',
            title: 'Kualiti produk tidak memuaskan',
            category: 'Produk',
            reporter: 'Mohd Razak',
            phone: '017-2233445',
            unit: 'B2-7-5',
            date: '2025-12-30',
            status: 'Dalam Proses',
            details: 'Produk diterima rosak dengan kemasan tidak lengkap.',
            updatedAt: '2025-12-30T13:50:00Z'
        },
        {
            id: 'ADU-004',
            title: 'Permintaan maklumat tambahan',
            category: 'Pertanyaan',
            reporter: 'Fatimah Zahra',
            phone: '016-9090909',
            unit: 'B3-5-2',
            date: '2025-12-30',
            status: 'Selesai',
            resolvedAt: '2025-12-31',
            details: 'Memerlukan spesifikasi lanjut berkenaan produk terbaru.',
            updatedAt: '2025-12-31T11:00:00Z'
        },
        {
            id: 'ADU-005',
            title: 'Aplikasi mudah alih sering tergendala',
            category: 'Teknikal',
            reporter: 'Lim Wei Jian',
            phone: '012-8882233',
            unit: 'B1-10-1',
            date: '2025-12-29',
            status: 'Dalam Proses',
            details: 'Aplikasi crash ketika membuka halaman pembayaran.',
            updatedAt: '2025-12-29T15:25:00Z'
        },
        {
            id: 'ADU-006',
            title: 'Penghantaran barang lewat',
            category: 'Logistik',
            reporter: 'Kumar Selvam',
            phone: '019-5556789',
            unit: 'B2-2-6',
            date: '2025-12-29',
            status: 'Selesai',
            resolvedAt: '2025-12-30',
            details: 'Parcel sampai 3 hari lewat daripada tarikh dijanjikan.',
            updatedAt: '2025-12-30T10:15:00Z'
        }
    ];

    const DEFAULT_TECHNICAL = [
        {
            id: 'TECH-001',
            title: 'Lesen AV Endpoint (Corp-AV) tamat 20 Jan',
            type: 'Lesen',
            asset: 'Endpoint Suite',
            owner: 'Hafiz',
            due: '2026-01-20',
            priority: 'Tinggi',
            status: 'Terbuka',
            notes: 'Perlu perbaharui 250 seat, semak bajet dengan kewangan.',
            updatedAt: '2026-01-01T08:00:00Z'
        },
        {
            id: 'TECH-002',
            title: 'Pembaikan kipas PSU Server RDS-01',
            type: 'Pembaikan',
            asset: 'Server RDS-01',
            owner: 'Amin',
            due: '2026-01-08',
            priority: 'Tinggi',
            status: 'Dalam Proses',
            notes: 'PSU gantian telah ditempah, ETA vendor 3 hari.',
            updatedAt: '2026-01-02T10:00:00Z'
        },
        {
            id: 'TECH-003',
            title: 'Penyelenggaraan AC bilik server',
            type: 'Penyelenggaraan',
            asset: 'CRAC-02',
            owner: 'Ravi',
            due: '2026-01-15',
            priority: 'Sederhana',
            status: 'Terbuka',
            notes: 'Jadualkan downtime 1 jam, maklumkan pasukan operasi.',
            updatedAt: '2026-01-02T13:00:00Z'
        },
        {
            id: 'TECH-004',
            title: 'Audit patuh ISO27001 Q1',
            type: 'Audit/Compliance',
            asset: 'Keseluruhan',
            owner: 'Nadia',
            due: '2026-02-05',
            priority: 'Sederhana',
            status: 'Selesai',
            notes: 'Pra-audit selesai, laporan dihantar auditor.',
            updatedAt: '2026-01-03T09:00:00Z'
        }
    ];

    function buildUnitRange(block, levelStart, levelEnd, unitStart, unitEnd) {
        const list = [];
        for (let level = levelStart; level <= levelEnd; level += 1) {
            for (let unit = unitStart; unit <= unitEnd; unit += 1) {
                list.push(`${block}-${level}-${unit}`);
            }
        }
        return list;
    }

    function buildSingleLevelRange(block, levelCode, unitStart, unitEnd) {
        const list = [];
        for (let unit = unitStart; unit <= unitEnd; unit += 1) {
            list.push(`${block}-${levelCode}-${unit}`);
        }
        return list;
    }

    const UNIT_MASTER_LIST = [
        ...buildUnitRange('A', 1, 14, 1, 10),
        ...buildUnitRange('B1', 1, 12, 1, 12),
        ...buildSingleLevelRange('B1', 'G', 1, 12),
        ...buildUnitRange('B2', 1, 15, 1, 12),
        ...buildSingleLevelRange('B2', 'G', 1, 12),
        ...buildUnitRange('B3', 1, 17, 1, 12),
        ...buildSingleLevelRange('B3', 'G', 1, 12)
    ];

    function normalizeUnitCode(value) {
        const raw = String(value || '').trim().toUpperCase();
        if (!raw) return '';

        const normalized = raw
            .replace(/[\s_/]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        if (!normalized) return '';

        return normalized
            .split('-')
            .map((part) => (/^\d+$/.test(part) ? String(Number(part)) : part))
            .join('-');
    }

    const UNIT_CANONICAL_MAP = new Map(
        UNIT_MASTER_LIST.map((unit) => [normalizeUnitCode(unit), unit])
    );

    function canonicalizeUnit(value) {
        const key = normalizeUnitCode(value);
        if (!key) return '';
        return UNIT_CANONICAL_MAP.get(key) || '';
    }

    function isValidUnit(value) {
        return Boolean(canonicalizeUnit(value));
    }

    function getUnitList() {
        return UNIT_MASTER_LIST.slice();
    }

    function stableHash(text) {
        let hash = 0;
        const source = String(text || '');
        for (let i = 0; i < source.length; i += 1) {
            hash = ((hash * 31) + source.charCodeAt(i)) >>> 0;
        }
        return hash;
    }

    function pickMockupFallbackUnit(seed, index) {
        if (!UNIT_MASTER_LIST.length) return '';
        const base = stableHash(seed || `MOCK-${index}`);
        const offset = Number.isFinite(index) ? index : 0;
        const position = (base + offset) % UNIT_MASTER_LIST.length;
        return UNIT_MASTER_LIST[position];
    }

    function normalizeUnitForMockup(value, index, seed) {
        const canonical = canonicalizeUnit(value);
        if (canonical) return canonical;
        return pickMockupFallbackUnit(seed || normalizeUnitCode(value) || '', index);
    }

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function parseJson(raw, fallback) {
        if (!raw) return fallback;
        try {
            return JSON.parse(raw);
        } catch (error) {
            console.warn('Gagal parse data JSON', error);
            return fallback;
        }
    }

    function readStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn('Gagal membaca localStorage', key, error);
            return null;
        }
    }

    function writeStorage(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.warn('Gagal menulis localStorage', key, error);
            return false;
        }
    }

    function normalizeDateOnly(value, fallbackDate) {
        const fallback = String(fallbackDate || new Date().toISOString().slice(0, 10));
        const raw = String(value || '').trim();

        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
            return raw;
        }

        const parsed = new Date(raw);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed.toISOString().slice(0, 10);
        }

        return fallback;
    }

    function normalizeWorkLogs(rows, fallbackDate, fallbackDetails) {
        const source = Array.isArray(rows) ? rows : [];
        const logs = source
            .map((row) => {
                if (!row || typeof row !== 'object') {
                    return null;
                }

                const note = String(row.note ?? row.details ?? row.butiran ?? row.message ?? '').trim();
                if (!note) {
                    return null;
                }

                return {
                    date: normalizeDateOnly(row.date ?? row.tarikh, fallbackDate),
                    note
                };
            })
            .filter(Boolean);

        const legacyNote = String(fallbackDetails || '').trim();
        if (!logs.length && legacyNote) {
            logs.push({
                date: normalizeDateOnly(fallbackDate, fallbackDate),
                note: legacyNote
            });
        }

        return logs;
    }

    function normalizeImageAttachments(rows) {
        const source = Array.isArray(rows) ? rows : [];
        return source
            .map((entry) => {
                if (typeof entry === 'string') {
                    const dataUrl = entry.trim();
                    if (!dataUrl.startsWith('data:image/')) return null;
                    return { dataUrl, name: 'Gambar', type: '', size: 0, details: '' };
                }

                if (!entry || typeof entry !== 'object') {
                    return null;
                }

                const dataUrl = String(entry.dataUrl || entry.url || '').trim();
                if (!dataUrl.startsWith('data:image/')) {
                    return null;
                }

                return {
                    dataUrl,
                    name: String(entry.name || 'Gambar').slice(0, 120),
                    type: String(entry.type || ''),
                    size: Number.isFinite(Number(entry.size)) ? Number(entry.size) : 0,
                    details: String(entry.details || entry.detail || entry.description || entry.caption || entry.note || '').trim().slice(0, 160)
                };
            })
            .filter(Boolean)
            .slice(0, 6);
    }

    function normalizeComplaint(item, index) {
        const id = String(item.id || `ADU-${index + 1}`);
        const rawUnit = String(item.unit || '');
        const canonicalUnit = normalizeUnitForMockup(rawUnit, index, id);
        const complaintDate = normalizeDateOnly(item.date, new Date().toISOString().slice(0, 10));
        const rawDetails = String(item.details || '').trim();
        const workLogs = normalizeWorkLogs(item.workLogs, complaintDate, rawDetails);
        const imageAttachments = normalizeImageAttachments(item.imageAttachments || item.images || item.attachments);
        return {
            id,
            title: String(item.title || '-'),
            category: String(item.category || '-'),
            reporter: String(item.reporter || '-'),
            phone: String(item.phone || ''),
            unit: canonicalUnit,
            date: complaintDate,
            status: String(item.status || 'Baru'),
            details: rawDetails || (workLogs[0] ? workLogs[0].note : ''),
            workLogs,
            imageAttachments,
            resolvedAt: item.resolvedAt || undefined,
            updatedAt: item.updatedAt || null
        };
    }

    function normalizeTechnical(item, index) {
        const dueDate = normalizeDateOnly(item.due, new Date().toISOString().slice(0, 10));
        const rawNotes = String(item.notes ?? item.details ?? '').trim();
        const workLogs = normalizeWorkLogs(item.workLogs, dueDate, rawNotes);
        const imageAttachments = normalizeImageAttachments(item.imageAttachments || item.images || item.attachments);
        return {
            id: String(item.id || `TECH-${index + 1}`),
            title: String(item.title || '-'),
            type: String(item.type || '-'),
            asset: String(item.asset || '-'),
            owner: String(item.owner || '-'),
            due: dueDate,
            priority: String(item.priority || 'Sederhana'),
            status: String(item.status || 'Terbuka'),
            notes: workLogs[0] ? workLogs[0].note : rawNotes,
            workLogs,
            imageAttachments,
            updatedAt: item.updatedAt || null
        };
    }

    function loadComplaints() {
        const parsed = parseJson(readStorage(STORAGE_KEYS.complaints), null);
        if (Array.isArray(parsed) && parsed.length) {
            const payload = parsed.map(normalizeComplaint);
            const hasUnitAdjustments = parsed.some((row, index) => {
                const rawUnit = String((row && row.unit) || '').trim();
                return rawUnit !== payload[index].unit;
            });

            // Persist one-time cleanup so invalid unit formats become valid mockup units.
            if (hasUnitAdjustments) {
                writeStorage(STORAGE_KEYS.complaints, JSON.stringify(payload));
            }

            return payload;
        }
        return clone(DEFAULT_COMPLAINTS).map(normalizeComplaint);
    }

    function saveComplaints(list) {
        const payload = (Array.isArray(list) ? list : []).map(normalizeComplaint);
        writeStorage(STORAGE_KEYS.complaints, JSON.stringify(payload));
        return payload;
    }

    function loadTechnical() {
        const parsed = parseJson(readStorage(STORAGE_KEYS.technical), null);
        if (Array.isArray(parsed) && parsed.length) {
            return parsed.map(normalizeTechnical);
        }
        return clone(DEFAULT_TECHNICAL).map(normalizeTechnical);
    }

    function saveTechnical(list) {
        const payload = (Array.isArray(list) ? list : []).map(normalizeTechnical);
        writeStorage(STORAGE_KEYS.technical, JSON.stringify(payload));
        return payload;
    }

    function upsertComplaint(entry) {
        const rows = loadComplaints();
        const next = normalizeComplaint({ ...entry, updatedAt: entry.updatedAt || new Date().toISOString() }, 0);
        const index = rows.findIndex((row) => row.id === next.id);
        if (index === -1) rows.unshift(next);
        else rows[index] = { ...rows[index], ...next };
        saveComplaints(rows);
        return next;
    }

    function upsertTechnical(entry) {
        const rows = loadTechnical();
        const next = normalizeTechnical({ ...entry, updatedAt: entry.updatedAt || new Date().toISOString() }, 0);
        const index = rows.findIndex((row) => row.id === next.id);
        if (index === -1) rows.unshift(next);
        else rows[index] = { ...rows[index], ...next };
        saveTechnical(rows);
        return next;
    }

    function removeComplaint(id) {
        const rows = loadComplaints().filter((row) => row.id !== id);
        saveComplaints(rows);
        return rows;
    }

    function removeTechnical(id) {
        const rows = loadTechnical().filter((row) => row.id !== id);
        saveTechnical(rows);
        return rows;
    }

    function getLatestUpdatedAt(rows) {
        return (Array.isArray(rows) ? rows : [])
            .map((row) => row.updatedAt || row.date || row.due || null)
            .filter(Boolean)
            .map((raw) => new Date(raw))
            .filter((date) => !Number.isNaN(date.getTime()))
            .sort((a, b) => b - a)[0] || null;
    }

    global.DashboardStore = {
        STORAGE_KEYS,
        DEFAULT_COMPLAINTS: clone(DEFAULT_COMPLAINTS),
        DEFAULT_TECHNICAL: clone(DEFAULT_TECHNICAL),
        UNIT_MASTER_LIST: UNIT_MASTER_LIST.slice(),
        loadComplaints,
        saveComplaints,
        upsertComplaint,
        removeComplaint,
        loadTechnical,
        saveTechnical,
        upsertTechnical,
        removeTechnical,
        getLatestUpdatedAt,
        getUnitList,
        isValidUnit,
        normalizeUnitCode,
        normalizeUnit: canonicalizeUnit,
        normalizeUnitForMockup
    };
})(window);
