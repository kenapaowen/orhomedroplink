(() => {
  const categories = ['Semua', 'Fashion', 'Elektronik', 'Kecantikan', 'Rumah', 'Makanan', 'Lainnya'];
  const config = window.DROPLINK_CONFIG || {};
  const hasBackend = Boolean(config.SUPABASE_URL && config.SUPABASE_ANON_KEY);
  const localKey = 'droplink-submissions-v1';
  const els = Object.fromEntries(['category-filters','link-grid','empty-state','no-results','notice','count-label','search-input','year'].map(id => [id, document.getElementById(id)]));
  let activeCategory = 'Semua';
  let allLinks = [];
  els.year.textContent = new Date().getFullYear();

  function escapeHTML(value='') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function safeURL(value) { try { const u = new URL(value); return ['http:', 'https:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } }
  function domainOf(value) { try { return new URL(value).hostname.replace(/^www\./, ''); } catch { return value; } }
  function showNotice(message, type='info') { els.notice.textContent = message; els.notice.className = `notice ${type}`; els.notice.hidden = false; }
  function hideNotice() { els.notice.hidden = true; }
  function localRead() { try { return JSON.parse(localStorage.getItem(localKey) || '[]'); } catch { return []; } }
  function sorted(rows) { return [...rows].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)); }

  function renderFilters() {
    els['category-filters'].innerHTML = categories.map(name => `<button class="filter-chip ${name === activeCategory ? 'active' : ''}" data-category="${escapeHTML(name)}" type="button">${escapeHTML(name)}</button>`).join('');
  }
  function renderLinks() {
    const q = document.getElementById('search-input').value.trim().toLowerCase();
    const filtered = sorted(allLinks).filter(row => (activeCategory === 'Semua' || row.category === activeCategory) && (!q || `${row.title} ${row.note || ''} ${row.category} ${domainOf(row.url)}`.toLowerCase().includes(q)));
    els['count-label'].textContent = `${allLinks.length} ${allLinks.length === 1 ? 'rekomendasi' : 'rekomendasi'}`;
    els['link-grid'].innerHTML = filtered.map((row, index) => {
      const href = safeURL(row.url);
      const date = new Intl.DateTimeFormat('id-ID', { day:'numeric', month:'short', year:'numeric' }).format(new Date(row.created_at));
      return `<article class="link-card" style="--card-index:${Math.min(index, 8)}"><div class="card-meta"><span class="category-tag">${escapeHTML(row.category || 'Lainnya')}</span><span class="card-date">${date}</span></div><h3>${escapeHTML(row.title)}</h3><p class="card-note">${escapeHTML(row.note || 'Rekomendasi dari komunitas.')}</p><div class="card-footer"><span class="domain"><span class="domain-icon">↗</span>${escapeHTML(domainOf(row.url))}</span>${href ? `<a class="visit-link" href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer sponsored" aria-label="Buka ${escapeHTML(row.title)}">Lihat link <span>↗</span></a>` : '<span class="invalid-link">Link tidak valid</span>'}</div></article>`;
    }).join('');
    const hasAny = allLinks.length > 0;
    els['empty-state'].hidden = hasAny;
    els['no-results'].hidden = !hasAny || filtered.length > 0;
    els['link-grid'].hidden = !filtered.length;
  }
  async function refresh() {
    if (!hasBackend) { allLinks = sorted(localRead()); renderLinks(); showNotice('Mode pratinjau: hubungkan Supabase di config.js agar semua pengunjung melihat katalog yang sama.', 'warning'); return; }
    try {
      const response = await fetch(`${config.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/affiliate_links?select=id,title,url,category,note,created_at&order=created_at.desc`, { headers: { apikey: config.SUPABASE_ANON_KEY, Authorization: `Bearer ${config.SUPABASE_ANON_KEY}` } });
      if (!response.ok) throw new Error('Gagal mengambil rekomendasi. Pastikan tabel dan kebijakan Supabase sudah dibuat.');
      allLinks = await response.json(); hideNotice(); renderLinks();
    } catch (error) { allLinks = []; renderLinks(); showNotice(error.message || 'Tidak dapat terhubung ke penyimpanan saat ini.', 'error'); }
  }
  els['category-filters'].addEventListener('click', event => { const button = event.target.closest('[data-category]'); if (!button) return; activeCategory = button.dataset.category; renderFilters(); renderLinks(); });
  els['search-input'].addEventListener('input', renderLinks);
  document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); els['search-input'].focus(); } });
  renderFilters(); refresh();
})();
