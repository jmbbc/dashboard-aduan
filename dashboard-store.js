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
            unit: 'B-12-3',
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
            unit: 'A-03-8',
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
            unit: 'D-07-15',
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
            unit: 'C-05-2',
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
            unit: 'E-10-1',
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
            unit: 'F-02-6',
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

    function normalizeComplaint(item, index) {
        return {
            id: String(item.id || `ADU-${index + 1}`),
            title: String(item.title || '-'),
            category: String(item.category || '-'),
            reporter: String(item.reporter || '-'),
            phone: String(item.phone || ''),
            unit: String(item.unit || ''),
            date: String(item.date || new Date().toISOString().slice(0, 10)),
            status: String(item.status || 'Baru'),
            details: String(item.details || ''),
            resolvedAt: item.resolvedAt || undefined,
            updatedAt: item.updatedAt || null
        };
    }

    function normalizeTechnical(item, index) {
        return {
            id: String(item.id || `TECH-${index + 1}`),
            title: String(item.title || '-'),
            type: String(item.type || '-'),
            asset: String(item.asset || '-'),
            owner: String(item.owner || '-'),
            due: String(item.due || new Date().toISOString().slice(0, 10)),
            priority: String(item.priority || 'Sederhana'),
            status: String(item.status || 'Terbuka'),
            notes: String(item.notes || ''),
            updatedAt: item.updatedAt || null
        };
    }

    function loadComplaints() {
        const parsed = parseJson(readStorage(STORAGE_KEYS.complaints), null);
        if (Array.isArray(parsed) && parsed.length) {
            return parsed.map(normalizeComplaint);
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
        loadComplaints,
        saveComplaints,
        upsertComplaint,
        removeComplaint,
        loadTechnical,
        saveTechnical,
        upsertTechnical,
        removeTechnical,
        getLatestUpdatedAt
    };
})(window);
