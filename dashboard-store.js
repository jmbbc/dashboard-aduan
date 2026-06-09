(function (global) {
    const STORAGE_KEYS = {
        complaints: 'aduanDashboardData',
        technical: 'aduanDashboardTechnical',
        activity: 'aduanDashboardActivity',
        complaintCategories: 'aduanDashboardCategories'
    };

    const DEFAULT_COMPLAINTS = [
        {
            id: 'ADU-001',
            title: 'Masalah sistem pembayaran tidak berfungsi',
            categoryMain: 'Elektrikal & M&E',
            categorySub: 'MSB dan Bilik Genset',
            category: 'MSB dan Bilik Genset',
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
            categoryMain: 'Air, Paip & Saliran',
            categorySub: 'Air perlahan',
            category: 'Air perlahan',
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
            categoryMain: 'Elektrikal & M&E',
            categorySub: 'Lif',
            category: 'Lif',
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
            categoryMain: 'Keselamatan & Akses',
            categorySub: 'CCTV',
            category: 'CCTV',
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
            categoryMain: 'Air, Paip & Saliran',
            categorySub: 'Kebocoran',
            category: 'Kebocoran',
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
            categoryMain: 'Keselamatan & Akses',
            categorySub: 'Palang Keselamatan',
            category: 'Palang Keselamatan',
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

    const DEFAULT_COMPLAINT_CATEGORY_TREE = {
        'Elektrikal & M&E': [
            'Kerosakan lampu (lampu jalan / koridor)',
            'Lif',
            'Bilik riser dan M&E',
            'MSB dan Bilik Genset'
        ],
        'Air, Paip & Saliran': [
            'Air perlahan',
            'Kebocoran',
            'Tangki Air',
            'Saluran paip (gutter)',
            'Kebocoran Petak parkir',
            'Pam domestik dan tekanan'
        ],
        'Keselamatan & Akses': [
            'CCTV',
            'Palang Keselamatan'
        ],
        'Sistem Kebakaran': [
            'Sistem Kebakaran'
        ],
        'Struktur & Bangunan': [
            'Bumbung',
            'Homestay & Asrama'
        ],
        'Fasiliti Komuniti': [
            'Taman Permainan & Badminton',
            'Car Wash',
            'Kolam',
            'Gim',
            'Surau'
        ],
        'Landskap & Persekitaran': [
            'Pokok Liar',
            'Kebun',
            'Landskap'
        ]
    };

    const DEFAULT_COMPLAINT_CATEGORIES = Object.values(DEFAULT_COMPLAINT_CATEGORY_TREE)
        .flat()
        .slice();

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
        ...buildSingleLevelRange('B3', 'G', 1, 12),
        'Pihak Pengurusan'
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

    function normalizeCategoryName(value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function buildUniqueCategoryList(...sources) {
        const list = [];
        const seen = new Set();

        sources.forEach((source) => {
            const rows = Array.isArray(source) ? source : [];
            rows.forEach((entry) => {
                const category = normalizeCategoryName(entry);
                if (!category) {
                    return;
                }

                const key = category.toLocaleLowerCase('ms');
                if (seen.has(key)) {
                    return;
                }

                seen.add(key);
                list.push(category);
            });
        });

        return list;
    }

    function normalizeCategoryTree(value) {
        const source = value && typeof value === 'object' && !Array.isArray(value)
            ? value
            : {};
        const normalizedTree = {};

        Object.entries(source).forEach(([rawMainCategory, rawSubCategories]) => {
            const mainCategory = normalizeCategoryName(rawMainCategory);
            if (!mainCategory) {
                return;
            }

            normalizedTree[mainCategory] = buildUniqueCategoryList(rawSubCategories);
        });

        return normalizedTree;
    }

    function mergeCategoryTrees(...trees) {
        const mergedTree = {};

        trees.forEach((tree) => {
            const normalizedTree = normalizeCategoryTree(tree);
            Object.entries(normalizedTree).forEach(([mainCategory, subCategories]) => {
                mergedTree[mainCategory] = buildUniqueCategoryList(mergedTree[mainCategory], subCategories);
            });
        });

        return mergedTree;
    }

    function flattenCategoryTree(tree) {
        const normalizedTree = normalizeCategoryTree(tree);
        const rows = [];

        Object.entries(normalizedTree).forEach(([mainCategory, subCategories]) => {
            subCategories.forEach((subCategory) => {
                rows.push({
                    mainCategory,
                    subCategory
                });
            });
        });

        return rows;
    }

    function findMainCategoryForSubCategory(subCategory, categoryTree) {
        const normalizedSubCategory = normalizeCategoryName(subCategory);
        if (!normalizedSubCategory) {
            return '';
        }

        const normalizedTree = normalizeCategoryTree(categoryTree);
        const matchedEntry = Object.entries(normalizedTree).find(([, subCategories]) => (
            subCategories.some(
                (entry) => entry.toLocaleLowerCase('ms') === normalizedSubCategory.toLocaleLowerCase('ms')
            )
        ));

        return matchedEntry ? matchedEntry[0] : '';
    }

    function getMainCategoryMatch(categoryTree, candidateMainCategory) {
        const normalizedCandidate = normalizeCategoryName(candidateMainCategory);
        if (!normalizedCandidate) {
            return '';
        }

        const normalizedTree = normalizeCategoryTree(categoryTree);
        const matchedMainCategory = Object.keys(normalizedTree).find(
            (entry) => entry.toLocaleLowerCase('ms') === normalizedCandidate.toLocaleLowerCase('ms')
        );

        return matchedMainCategory || '';
    }

    function getSubCategoryMatch(categoryTree, mainCategory, candidateSubCategory) {
        const normalizedCandidate = normalizeCategoryName(candidateSubCategory);
        if (!normalizedCandidate) {
            return '';
        }

        const normalizedTree = normalizeCategoryTree(categoryTree);
        const subCategories = normalizedTree[mainCategory] || [];
        const matchedSubCategory = subCategories.find(
            (entry) => entry.toLocaleLowerCase('ms') === normalizedCandidate.toLocaleLowerCase('ms')
        );

        return matchedSubCategory || '';
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

    function resolveComplaintCategoryPair(item) {
        const categoryTree = loadComplaintCategoryTree();

        const rawMainCategory = normalizeCategoryName(
            item.categoryMain
            || item.mainCategory
            || item.kategoriUtama
        );
        const rawSubCategory = normalizeCategoryName(
            item.categorySub
            || item.subCategory
            || item.category
            || item.kategori
        );

        let mainCategory = getMainCategoryMatch(categoryTree, rawMainCategory);
        if (!mainCategory && rawSubCategory) {
            mainCategory = findMainCategoryForSubCategory(rawSubCategory, categoryTree);
        }

        if (!mainCategory) {
            mainCategory = rawMainCategory || 'Lain-lain';
        }

        let subCategory = getSubCategoryMatch(categoryTree, mainCategory, rawSubCategory);
        if (!subCategory) {
            subCategory = rawSubCategory || 'Lain-lain';
        }

        return {
            mainCategory,
            subCategory
        };
    }

    function normalizeComplaint(item, index) {
        const id = String(item.id || `ADU-${index + 1}`);
        const rawUnit = String(item.unit || '');
        const canonicalUnit = normalizeUnitForMockup(rawUnit, index, id);
        const complaintDate = normalizeDateOnly(item.date, new Date().toISOString().slice(0, 10));
        const rawDetails = String(item.details || '').trim();
        const workLogs = normalizeWorkLogs(item.workLogs, complaintDate, rawDetails);
        const imageAttachments = normalizeImageAttachments(item.imageAttachments || item.images || item.attachments);
        const categoryPair = resolveComplaintCategoryPair(item || {});

        return {
            id,
            title: String(item.title || '-'),
            categoryMain: categoryPair.mainCategory,
            categorySub: categoryPair.subCategory,
            category: categoryPair.subCategory,
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

    function loadComplaintCategoryTree() {
        const stored = parseJson(readStorage(STORAGE_KEYS.complaintCategories), null);
        let storedTree = {};

        if (Array.isArray(stored)) {
            storedTree = {};
            buildUniqueCategoryList(stored).forEach((subCategory) => {
                const mainCategory = findMainCategoryForSubCategory(subCategory, DEFAULT_COMPLAINT_CATEGORY_TREE) || 'Lain-lain';
                storedTree[mainCategory] = buildUniqueCategoryList(storedTree[mainCategory], [subCategory]);
            });
        } else {
            storedTree = normalizeCategoryTree(stored);
        }

        return mergeCategoryTrees(DEFAULT_COMPLAINT_CATEGORY_TREE, storedTree);
    }

    function saveComplaintCategoryTree(tree) {
        const payload = mergeCategoryTrees(DEFAULT_COMPLAINT_CATEGORY_TREE, tree);
        writeStorage(STORAGE_KEYS.complaintCategories, JSON.stringify(payload));
        return payload;
    }

    function addComplaintMainCategory(value) {
        const normalizedValue = normalizeCategoryName(value);
        if (!normalizedValue) {
            return '';
        }

        const categoryTree = loadComplaintCategoryTree();
        const matchedMainCategory = getMainCategoryMatch(categoryTree, normalizedValue);
        if (matchedMainCategory) {
            return matchedMainCategory;
        }

        const nextTree = {
            ...categoryTree,
            [normalizedValue]: []
        };

        saveComplaintCategoryTree(nextTree);
        return normalizedValue;
    }

    function addComplaintSubCategory(mainCategory, subCategory) {
        const normalizedSubCategory = normalizeCategoryName(subCategory);
        if (!normalizedSubCategory) {
            return {
                mainCategory: '',
                subCategory: ''
            };
        }

        const ensuredMainCategory = addComplaintMainCategory(mainCategory || 'Lain-lain') || 'Lain-lain';
        const categoryTree = loadComplaintCategoryTree();
        const matchedMainCategory = getMainCategoryMatch(categoryTree, ensuredMainCategory) || ensuredMainCategory;
        const matchedSubCategory = getSubCategoryMatch(categoryTree, matchedMainCategory, normalizedSubCategory);

        if (matchedSubCategory) {
            return {
                mainCategory: matchedMainCategory,
                subCategory: matchedSubCategory
            };
        }

        const nextTree = {
            ...categoryTree,
            [matchedMainCategory]: buildUniqueCategoryList(categoryTree[matchedMainCategory], [normalizedSubCategory])
        };

        saveComplaintCategoryTree(nextTree);
        return {
            mainCategory: matchedMainCategory,
            subCategory: normalizedSubCategory
        };
    }

    function loadComplaintCategories() {
        return flattenCategoryTree(loadComplaintCategoryTree()).map((entry) => entry.subCategory);
    }

    function saveComplaintCategories(list) {
        const nextTree = {};
        buildUniqueCategoryList(list).forEach((subCategory) => {
            const mainCategory = findMainCategoryForSubCategory(subCategory, DEFAULT_COMPLAINT_CATEGORY_TREE) || 'Lain-lain';
            nextTree[mainCategory] = buildUniqueCategoryList(nextTree[mainCategory], [subCategory]);
        });

        const payload = saveComplaintCategoryTree(nextTree);
        return flattenCategoryTree(payload).map((entry) => entry.subCategory);
    }

    function addComplaintCategory(value) {
        const normalizedValue = normalizeCategoryName(value);
        if (!normalizedValue) {
            return '';
        }

        const mainCategory = findMainCategoryForSubCategory(normalizedValue, DEFAULT_COMPLAINT_CATEGORY_TREE) || 'Lain-lain';
        return addComplaintSubCategory(mainCategory, normalizedValue).subCategory;
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
        DEFAULT_COMPLAINT_CATEGORY_TREE: clone(DEFAULT_COMPLAINT_CATEGORY_TREE),
        DEFAULT_COMPLAINT_CATEGORIES: clone(DEFAULT_COMPLAINT_CATEGORIES),
        DEFAULT_TECHNICAL: clone(DEFAULT_TECHNICAL),
        UNIT_MASTER_LIST: UNIT_MASTER_LIST.slice(),
        loadComplaints,
        saveComplaints,
        loadComplaintCategoryTree,
        saveComplaintCategoryTree,
        addComplaintMainCategory,
        addComplaintSubCategory,
        loadComplaintCategories,
        saveComplaintCategories,
        addComplaintCategory,
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
