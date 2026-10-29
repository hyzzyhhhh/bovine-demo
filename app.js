const runs = [
  { run: 'SRR37700558', experiment: 'SRX32578307', assay: 'RNA-seq', sample: 'S1', organ: '肝脏', breed: '安格斯', sex: '雌性', layout: 'PAIRED', spots: '11.2M', platform: 'NextSeq 1000', strategy: 'PolyA', source: 'TRANSCRIPTOMIC', status: 'QC passed', release: '2026-08-04' },
  { run: 'SRR37700561', experiment: 'SRX32578310', assay: 'ATAC-seq', sample: 'S4', organ: '肌肉', breed: '荷斯坦', sex: '雌性', layout: 'PAIRED', spots: '38.4M', platform: 'NovaSeq 6000', strategy: 'PCR-free', source: 'GENOMIC', status: 'QC passed', release: '2026-08-06' },
  { run: 'SRR37700572', experiment: 'SRX32578321', assay: 'ChIP-seq', sample: 'S7', organ: '乳腺', breed: '娟姗', sex: '雌性', layout: 'PAIRED', spots: '25.8M', platform: 'NextSeq 2000', strategy: 'H3K27ac', source: 'GENOMIC', status: 'QC passed', release: '2026-08-08' },
  { run: 'SRR37700604', experiment: 'SRX32578353', assay: 'WGBS', sample: 'S12', organ: '血液', breed: '西门塔尔', sex: '雄性', layout: 'PAIRED', spots: '62.1M', platform: 'NovaSeq 6000', strategy: 'Bisulfite', source: 'GENOMIC', status: 'Review', release: '2026-08-12' },
  { run: 'SRR37700618', experiment: 'SRX32578367', assay: 'RNA-seq', sample: 'S15', organ: '下丘脑', breed: '荷斯坦', sex: '雄性', layout: 'PAIRED', spots: '18.6M', platform: 'NextSeq 1000', strategy: 'PolyA', source: 'TRANSCRIPTOMIC', status: 'QC passed', release: '2026-08-13' },
  { run: 'SRR37700633', experiment: 'SRX32578382', assay: 'ATAC-seq', sample: 'S19', organ: '胚胎组织', breed: '安格斯', sex: '雌性', layout: 'PAIRED', spots: '44.7M', platform: 'NovaSeq 6000', strategy: 'Tn5', source: 'GENOMIC', status: 'Review', release: '2026-08-16' }
];

const statusLabels = { 'QC passed': '质控通过', Review: '待审核' };

const body = document.querySelector('#runTableBody');
const count = document.querySelector('#runCount');
const runSearch = document.querySelector('#runSearch');
const assayFilter = document.querySelector('#assayFilter');
const statusFilter = document.querySelector('#statusFilter');
const drawer = document.querySelector('#runDrawer');
const drawerBody = document.querySelector('#drawerBody');
const drawerTitle = document.querySelector('#drawerTitle');
const drawerSubtitle = document.querySelector('#drawerSubtitle');

function renderRuns() {
  const query = runSearch.value.trim().toLowerCase();
  const assay = assayFilter.value;
  const status = statusFilter.value;
  const filtered = runs.filter((item) => {
    const haystack = Object.values(item).join(' ').toLowerCase();
    return (!query || haystack.includes(query)) && (assay === 'all' || item.assay === assay) && (status === 'all' || item.status === status);
  });
  body.innerHTML = filtered.map((item) => `
    <tr data-run="${item.run}">
      <td><strong>${item.run}</strong><span class="subcell">${item.experiment}</span></td>
      <td><strong>${item.assay}</strong><span class="subcell">${item.strategy}</span></td>
      <td>${item.sample}<span class="subcell">${item.sex}</span></td>
      <td>${item.organ}<span class="subcell">${item.breed}</span></td>
      <td>${item.layout}</td><td>${item.spots}</td>
      <td><span class="badge ${item.status === 'Review' ? 'review' : ''}">${statusLabels[item.status]}</span></td>
      <td><span class="view-link">查看 →</span></td>
    </tr>`).join('') || '<tr><td colspan="8" class="empty-cell">当前筛选条件下没有匹配的演示记录。</td></tr>';
  count.textContent = `显示 ${filtered.length} / 2,941 个 Run`;
  body.querySelectorAll('tr[data-run]').forEach((row) => row.addEventListener('click', () => openDrawer(row.dataset.run)));
}

function openDrawer(runId) {
  const item = runs.find((run) => run.run === runId);
  if (!item || !drawer) return;
  drawerTitle.textContent = item.run;
  drawerSubtitle.textContent = `${item.assay} · ${item.sample} · ${item.sex}`;
  const fields = [
    ['实验项目', item.experiment], ['样本', item.sample], ['组织', item.organ], ['品种', item.breed],
    ['文库选择', item.strategy], ['数据来源', item.source], ['测序模式', item.layout], ['Spot 数', item.spots],
    ['测序平台', item.platform], ['发布日期', item.release], ['质控状态', statusLabels[item.status]], ['参考组装', 'ARS-UCD2.0']
  ];
  drawerBody.innerHTML = fields.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
}

function closeDrawer() {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
}

if (runSearch && assayFilter && statusFilter && body && count) {
  [runSearch, assayFilter, statusFilter].forEach((control) => control.addEventListener('input', renderRuns));
  renderRuns();
}
const closeButton = document.querySelector('#closeDrawer');
if (closeButton) closeButton.addEventListener('click', closeDrawer);
if (drawer) {
  drawer.addEventListener('click', (event) => { if (event.target === drawer) closeDrawer(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeDrawer(); });
}

const quickSearch = document.querySelector('#quickSearch');
if (quickSearch) quickSearch.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = document.querySelector('#quickSearchInput').value.trim();
  const feedback = document.querySelector('#searchFeedback');
  if (!value) { feedback.textContent = '请输入检索内容。'; return; }
  const match = runs.find((item) => Object.values(item).some((field) => String(field).toLowerCase() === value.toLowerCase()));
  if (match) { window.location.href = `run.html?run=${match.run}`; }
  else { feedback.textContent = `演示数据中暂未找到“${value}”，你可以尝试 SRR37700558 或 chr1:1-200000。`; }
});

document.querySelectorAll('.main-nav a, .hero-actions a, .search-links a').forEach((link) => link.addEventListener('click', (event) => {
  const href = link.getAttribute('href');
  if (href && href.startsWith('#') && document.querySelector(href)) {
    event.preventDefault();
    document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}));

const catalogDropdown = document.querySelector('.nav-dropdown');
const catalogTrigger = document.querySelector('.nav-trigger');
if (catalogDropdown && catalogTrigger) {
  catalogTrigger.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = catalogDropdown.classList.toggle('open');
    catalogTrigger.setAttribute('aria-expanded', String(isOpen));
  });
  document.addEventListener('click', () => {
    catalogDropdown.classList.remove('open');
    catalogTrigger.setAttribute('aria-expanded', 'false');
  });
}

const runParam = new URLSearchParams(window.location.search).get('run');
if (runParam && drawer) openDrawer(runParam);
