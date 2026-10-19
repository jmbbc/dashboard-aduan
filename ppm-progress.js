(function () {
    'use strict';
    const CACHE_KEY = 'ppmServerProgressV1';
    const labels = { Electrical: 'Elektrikal', Mechanical: 'Mekanikal', 'Fire Fighting': 'Kebakaran', Civil: 'Sivil', Plumbing: 'Paip' };
    const months = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];
    let templates = {}, rows = [], updatedAt = '', selectedCategory = '', root;
    const now = new Date();
    let year = now.getFullYear(), month = now.getMonth() + 1;
    let half = now.getMonth() < 6 ? 0 : 1;
    const key = () => `${year}-${String(month).padStart(2, '0')}`;
    function monthKey(row) {
        const raw = String(row.monthKey || row.inspectionDate || '').trim();
        const match = raw.match(/^(\d{4})-(\d{2})/);
        return match ? `${match[1]}-${match[2]}` : '';
    }
    function categories() { return [...new Set(Object.values(templates).map((item) => item.category))]; }
    function stats(category, targetMonth) {
        const accepted = new Set(rows.filter((row) => monthKey(row) === targetMonth).map((row) => JSON.stringify([row.templateKey, String(row.location || '').trim()])));
        const expected = [];
        Object.entries(templates).filter(([, template]) => template.category === category).forEach(([templateKey, template]) => {
            [...new Set(template.locations || [])].forEach((location) => expected.push({ templateKey, location, received: accepted.has(JSON.stringify([templateKey, location])) }));
        });
        const received = expected.filter((item) => item.received).length;
        const total = expected.length;
        const future = targetMonth > `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const state = total > 0 && received === total ? 'complete' : received > 0 ? 'partial' : future ? 'future' : 'empty';
        return { received, total, expected, state };
    }
    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }
    function cell(category, targetMonth, compact) {
        const data = stats(category, targetMonth);
        const button = el('button', `ppm-progress-cell ${data.state}`);
        button.type = 'button';
        if (!updatedAt) { button.className = 'ppm-progress-cell future'; button.disabled = true; }
        const selected = selectedCategory === category && targetMonth === key();
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', String(selected));
        button.setAttribute('aria-controls', 'ppmProgressDetail');
        button.setAttribute('aria-label', `${labels[category] || category}, ${targetMonth}: ${data.received} daripada ${data.total} diterima`);
        if (compact) button.append(el('strong', '', labels[category] || category));
        button.append(el('span', 'ppm-progress-fraction', data.state === 'future' ? '—' : `${data.received}/${data.total}`));
        if (compact) {
            const status = { complete: 'Lengkap', partial: 'Sebahagian diterima', empty: 'Belum diterima', future: 'Belum tiba' };
            button.append(el('small', '', updatedAt ? status[data.state] : 'Belum disahkan'));
            const bar = el('span', 'ppm-progress-bar');
            const fill = el('span'); fill.style.width = `${data.total ? data.received / data.total * 100 : 0}%`;
            bar.append(fill); button.append(bar);
        }
        button.addEventListener('click', () => {
            selectedCategory = selected ? '' : category;
            month = Number(targetMonth.slice(5));
            render();
            const activeButton = document.querySelector('#ppmProgressTable button[aria-pressed="true"]');
            if (activeButton) activeButton.focus({ preventScroll: true });
            else {
                const buttons = document.querySelectorAll('#ppmProgressTable button');
                Array.from(buttons).find((item) => item.getAttribute('aria-label') === button.getAttribute('aria-label'))?.focus({ preventScroll: true });
            }
        });
        return button;
    }
    function render() {
        if (!root) return;
        const visibleMonths = months.slice(half * 6, half * 6 + 6);
        document.getElementById('ppmProgressPeriod').textContent = `${visibleMonths[0]} – ${visibleMonths[5]} ${year}`;
        document.getElementById('ppmProgressPrev').disabled = half === 0;
        document.getElementById('ppmProgressNext').disabled = half === 1;
        const table = document.getElementById('ppmProgressTable'); table.replaceChildren();
        const head = el('thead'), header = el('tr');
        header.append(el('th', '', 'Kategori'));
        visibleMonths.forEach((name, index) => {
            const isCurrent = year === now.getFullYear() && half * 6 + index === now.getMonth();
            const heading = el('th', isCurrent ? 'ppm-progress-current-month' : '', name);
            if (isCurrent) heading.setAttribute('aria-label', `${name}, bulan semasa`);
            header.append(heading);
        });
        head.append(header); table.append(head);
        const body = el('tbody');
        categories().forEach((category) => {
            const tr = el('tr'); const heading = el('th', '', labels[category] || category); heading.scope = 'row'; tr.append(heading);
            visibleMonths.forEach((_, index) => { const td = el('td'); td.append(cell(category, `${year}-${String(half * 6 + index + 1).padStart(2, '0')}`, false)); tr.append(td); });
            body.append(tr);
        });
        table.append(body);
        const detail = document.getElementById('ppmProgressDetail'); detail.replaceChildren(); detail.hidden = !selectedCategory;
        if (selectedCategory) {
            const data = stats(selectedCategory, key());
            detail.append(el('h3', '', `${labels[selectedCategory] || selectedCategory} · ${months[month - 1]} ${year}`));
            detail.append(el('p', '', `${data.received}/${data.total} diterima server · ${data.total - data.received} belum diterima`));
            const pending = data.expected.filter((item) => !item.received);
            if (pending.length) {
                const list = el('ul');
                pending.forEach((item) => list.append(el('li', '', `${templates[item.templateKey].referenceNo} · ${item.location}`)));
                detail.append(el('strong', '', 'Templat / lokasi belum diterima'), list);
            } else detail.append(el('p', '', 'Semua borang kategori ini telah diterima.'));
        }
        document.getElementById('ppmProgressUpdated').textContent = updatedAt
            ? `Salinan rekod server · Dikemas kini ${new Date(updatedAt).toLocaleString('ms-MY')}`
            : 'Belum mendapat rekod server. Kiraan belum dapat disahkan.';
        root.classList.toggle('ppm-progress-unverified', !updatedAt);
    }
    window.PPMProgress = {
        init(config) {
            templates = config.templates;
            root = document.getElementById('ppmProgress');
            if (!root) return;
            try { const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); if (cache && Array.isArray(cache.rows)) { rows = cache.rows; updatedAt = cache.updatedAt || ''; } } catch (_) {}
            const yearSelect = document.getElementById('ppmProgressYear');
            const years = new Set([year - 2, year - 1, year, year + 1, ...rows.map((row) => Number(monthKey(row).slice(0, 4))).filter(Boolean)]);
            [...years].sort((a, b) => b - a).forEach((value) => { const option = el('option', '', String(value)); option.value = value; yearSelect.append(option); });
            yearSelect.value = year;
            yearSelect.addEventListener('change', () => { year = Number(yearSelect.value); render(); });
            document.getElementById('ppmProgressPrev').addEventListener('click', () => { half = 0; selectedCategory = ''; render(); });
            document.getElementById('ppmProgressNext').addEventListener('click', () => { half = 1; selectedCategory = ''; render(); });
            render();
        },
        setRows(serverRows) {
            if (!Array.isArray(serverRows)) return;
            rows = serverRows.map((row) => ({ id: row.id, templateKey: row.templateKey, location: row.location, monthKey: monthKey(row) }));
            updatedAt = new Date().toISOString();
            try { localStorage.setItem(CACHE_KEY, JSON.stringify({ rows, updatedAt })); } catch (_) {}
            render();
        },
        acceptRow(row) {
            if (!row) return;
            const remaining = rows.filter((item) => !(item.templateKey === row.templateKey && item.location === row.location && monthKey(item) === monthKey(row)));
            this.setRows([...remaining, row]);
        }
    };
})();
