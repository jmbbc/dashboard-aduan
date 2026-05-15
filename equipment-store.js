(function (global) {
    const STORAGE_KEYS = {
        records: 'techEquipmentRecordsV1',
        detailPrefix: 'equip-detail-',
        issuesPrefix: 'equip-issues-',
        mediaPrefix: 'equip-media-'
    };

    const STATUS_ORDER = {
        Kritikal: 0,
        'Memerlukan Tindakan': 1,
        Normal: 2
    };

    const DEFAULT_RECORDS = [
        { slug: 'panel-kebakaran', name: 'Panel kebakaran', quantity: 4, status: 'Kritikal', issues: 'Panel 2 tidak reset selepas ujian', owner: 'Faris', details: 'Perlu pemeriksaan vendor minggu ini.', locations: ['Pejabat pengurusan', 'Pondok pengawal'] },
        { slug: 'tangki-air-kebakaran', name: 'Tangki air (kebakaran)', quantity: 2, status: 'Memerlukan Tindakan', issues: 'Float valve bocor', owner: 'Hafiz', details: 'Pesan alat ganti, jadualkan shutdown 1 jam.', locations: [] },
        { slug: 'bilik-riser-kebakaran', name: 'Bilik riser (kebakaran)', quantity: 6, status: 'Normal', issues: '-', owner: 'Azlan', details: 'Pemeriksaan mingguan selesai.', locations: [] },
        { slug: 'pam-utama', name: 'Pam utama', quantity: 3, status: 'Memerlukan Tindakan', issues: 'Getaran tinggi pam #2', owner: 'Ravi', details: 'Suspek alignment coupler; vendor dipanggil.', locations: [] },
        { slug: 'pam-tekanan-tinggi', name: 'Pam tekanan tinggi', quantity: 2, status: 'Normal', issues: '-', owner: 'Ravi', details: 'Tiada isu aktif.', locations: [] },
        { slug: 'pam-kolam-renang', name: 'Pam kolam renang', quantity: 2, status: 'Normal', issues: '-', owner: 'Shima', details: 'Backwash terakhir 3 hari lepas.', locations: [] },
        { slug: 'genset', name: 'Genset', quantity: 1, status: 'Normal', issues: '-', owner: 'Hafiz', details: 'Ujian beban mingguan lulus.', locations: [] },
        { slug: 'bilik-msb', name: 'Bilik MSB', quantity: 1, status: 'Kritikal', issues: 'Suhu tinggi (32°C)', owner: 'Nadia', details: 'AC split out; sementara guna kipas industri.', locations: [] },
        { slug: 'kapasitor-bank', name: 'Kapasitor bank', quantity: 1, status: 'Normal', issues: '-', owner: 'Nadia', details: 'Harmonik dalam had.', locations: [] },
        { slug: 'cctv', name: 'Kamera litar tertutup (CCTV)', quantity: 48, status: 'Memerlukan Tindakan', issues: '3 kamera offline (Lobi, Parkir B2, Lif 3)', owner: 'Amin', details: 'Switch POE perlu disemak; fiber patch panel longgar.', locations: [] },
        { slug: 'lif', name: 'Lif', quantity: 6, status: 'Normal', issues: '-', owner: 'Vendor KONE', details: 'Penyelenggaraan bulanan terjadual.', locations: [] },
        { slug: 'padang-permainan', name: 'Padang permainan', quantity: 1, status: 'Normal', issues: '-', owner: 'Ops', details: 'Pemeriksaan fizikal normal.', locations: [] },
        { slug: 'padang-badminton', name: 'Padang Badminton', quantity: 2, status: 'Normal', issues: '-', owner: 'Ops', details: 'Lampu LED baru dipasang.', locations: [] },
        { slug: 'tangki-air-domestik', name: 'Tangki air domestik', quantity: 2, status: 'Memerlukan Tindakan', issues: 'Sedikit sedimen', owner: 'Hafiz', details: 'Jadual cuci tank minggu depan.', locations: [] }
    ];

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function readStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn('Gagal membaca localStorage untuk key:', key, error);
            return null;
        }
    }

    function writeStorage(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.warn('Gagal menulis localStorage untuk key:', key, error);
            return false;
        }
    }

    function safeParse(rawValue, fallback) {
        if (!rawValue) return fallback;
        try {
            return JSON.parse(rawValue);
        } catch (error) {
            console.warn('Gagal parse JSON:', error);
            return fallback;
        }
    }

    function normalizeRecord(record, index) {
        return {
            slug: String(record.slug || `asset-${index + 1}`),
            name: String(record.name || 'Tanpa Nama'),
            quantity: Number.isFinite(Number(record.quantity)) ? Number(record.quantity) : 0,
            status: String(record.status || 'Normal'),
            issues: String(record.issues || '-'),
            owner: String(record.owner || '-'),
            details: String(record.details || '-'),
            locations: Array.isArray(record.locations) ? record.locations.filter(Boolean) : [],
            updatedAt: record.updatedAt || null
        };
    }

    function loadRecordsFromStorage() {
        const saved = safeParse(readStorage(STORAGE_KEYS.records), null);
        if (Array.isArray(saved) && saved.length) {
            return saved.map(normalizeRecord);
        }
        return clone(DEFAULT_RECORDS).map(normalizeRecord);
    }

    function saveRecords(records) {
        const normalized = (Array.isArray(records) ? records : []).map(normalizeRecord);
        writeStorage(STORAGE_KEYS.records, JSON.stringify(normalized));
        return normalized;
    }

    function loadDetail(slug) {
        return safeParse(readStorage(`${STORAGE_KEYS.detailPrefix}${slug}`), null);
    }

    function saveDetail(slug, data) {
        return writeStorage(`${STORAGE_KEYS.detailPrefix}${slug}`, JSON.stringify(data || {}));
    }

    function loadIssues(slug) {
        const issues = safeParse(readStorage(`${STORAGE_KEYS.issuesPrefix}${slug}`), []);
        return Array.isArray(issues) ? issues : [];
    }

    function saveIssues(slug, issues) {
        return writeStorage(`${STORAGE_KEYS.issuesPrefix}${slug}`, JSON.stringify(Array.isArray(issues) ? issues : []));
    }

    function loadMedia(slug, fallback) {
        const media = safeParse(readStorage(`${STORAGE_KEYS.mediaPrefix}${slug}`), null);
        if (Array.isArray(media)) return media;
        return Array.isArray(fallback) ? fallback : [];
    }

    function saveMedia(slug, media) {
        return writeStorage(`${STORAGE_KEYS.mediaPrefix}${slug}`, JSON.stringify(Array.isArray(media) ? media : []));
    }

    function getActiveIssueCount(slug, listOverride) {
        const source = Array.isArray(listOverride) ? listOverride : loadIssues(slug);
        return source.filter((issue) => issue && issue.status !== 'Selesai').length;
    }

    function getIssueTextFromCount(count, fallbackText) {
        if (count <= 0) {
            return fallbackText && fallbackText !== '-' ? fallbackText : '-';
        }
        return `${count} isu aktif`;
    }

    function mergeRecordWithDetail(baseRecord) {
        const detail = loadDetail(baseRecord.slug);
        if (!detail || typeof detail !== 'object') return baseRecord;

        return normalizeRecord({
            ...baseRecord,
            status: detail.status || baseRecord.status,
            quantity: Number.isFinite(Number(detail.quantity)) ? Number(detail.quantity) : baseRecord.quantity,
            owner: detail.owner || baseRecord.owner,
            details: detail.details || baseRecord.details,
            locations: Array.isArray(detail.locations) ? detail.locations : baseRecord.locations,
            updatedAt: detail.updatedAt || baseRecord.updatedAt
        }, 0);
    }

    function hydrateRecords() {
        const records = loadRecordsFromStorage().map((record) => {
            const merged = mergeRecordWithDetail(record);
            const activeIssues = getActiveIssueCount(merged.slug);
            return {
                ...merged,
                issues: getIssueTextFromCount(activeIssues, merged.issues),
                updatedAt: merged.updatedAt || new Date().toISOString()
            };
        });

        saveRecords(records);
        return records;
    }

    function loadRecords() {
        return hydrateRecords();
    }

    function getRecordBySlug(slug) {
        return loadRecords().find((item) => item.slug === slug) || null;
    }

    function upsertRecord(record) {
        const records = loadRecords();
        const next = normalizeRecord({ ...record, updatedAt: record.updatedAt || new Date().toISOString() }, 0);
        const index = records.findIndex((item) => item.slug === next.slug);

        if (index === -1) {
            records.push(next);
        } else {
            records[index] = { ...records[index], ...next };
        }

        saveRecords(records);
        return next;
    }

    function statusRank(status) {
        return Number.isFinite(STATUS_ORDER[status]) ? STATUS_ORDER[status] : 99;
    }

    global.EquipmentStore = {
        loadRecords,
        saveRecords,
        hydrateRecords,
        getRecordBySlug,
        upsertRecord,
        loadDetail,
        saveDetail,
        loadIssues,
        saveIssues,
        loadMedia,
        saveMedia,
        getActiveIssueCount,
        getIssueTextFromCount,
        statusRank
    };
})(window);
