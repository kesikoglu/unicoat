
function initMobileMenu() {
  const btn = document.querySelector('[data-mobile-toggle]');
  const menu = document.querySelector('[data-mobile-nav]');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.toggle('open'));
}
function initYear() {
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
}
function buildDocsTable() {
  const mount = document.getElementById('docs-body');
  if (!mount || !window.ELEMENT_DOCS) return;
  const typeFilter = document.getElementById('docType');
  const search = document.getElementById('docSearch');
  const draw = () => {
    const type = (typeFilter?.value || '').toLowerCase();
    const q = (search?.value || '').toLowerCase().trim();
    const docs = window.ELEMENT_DOCS.filter(d => {
      const okType = !type || d.type.toLowerCase() === type;
      const text = `${d.title} ${d.product} ${d.type} ${d.lang}`.toLowerCase();
      const okText = !q || text.includes(q);
      return okType && okText;
    });
    mount.innerHTML = docs.map(d => `
      <tr>
        <td><strong>${d.title}</strong></td>
        <td><span class="docs-pill ${d.type.toLowerCase()}">${d.type}</span></td>
        <td>${d.product}</td>
        <td>${d.lang}</td>
        <td><a class="btn btn-secondary" href="assets/docs/${d.file}" target="_blank">İndir</a></td>
      </tr>
    `).join('') || `<tr><td colspan="5">Sonuç bulunamadı.</td></tr>`;
  };
  typeFilter?.addEventListener('change', draw);
  search?.addEventListener('input', draw);
  draw();
}
function buildProducts() {
  const mount = document.getElementById('product-grid');
  if (!mount || !window.ELEMENT_PRODUCTS) return;
  mount.innerHTML = window.ELEMENT_PRODUCTS.map(p => `
    <article class="card product-card">
      <div class="media"><img src="assets/images/${p.image}" alt="${p.title}"></div>
      <div class="content">
        <span class="tag">Ürün Grubu</span>
        <h3>${p.title}</h3>
        <p>${p.short}</p>
        <ul class="list">${p.benefits.map(b => `<li>${b}</li>`).join('')}</ul>
        <div class="cta-row" style="margin-top:18px">
          <a class="btn btn-primary" href="urun-${p.slug}.html">Detayı Gör</a>
          <a class="btn btn-secondary" href="assets/docs/${p.tds}" target="_blank">TDS</a>
        </div>
      </div>
    </article>
  `).join('');
}
function buildRALGrid() {
  const mount = document.getElementById('ral-grid');
  if (!mount || !window.RAL_COLORS) return;
  const family = document.getElementById('ralFamily');
  const search = document.getElementById('ralSearch');
  const count = document.getElementById('ralCount');
  const previewCode = document.getElementById('previewCode');
  const previewName = document.getElementById('previewName');
  const previewHex = document.getElementById('previewHex');
  const previewDoor = document.querySelector('.mock-door');
  const previewPanel = document.querySelector('.mock-panel');
  const previewMachine = document.querySelector('.mock-machine');
  function applyPreview(color) {
    if (!color) return;
    [previewDoor, previewPanel, previewMachine].forEach(el => {
      if (el) el.style.background = color.hex;
    });
    if (previewCode) previewCode.textContent = color.label;
    if (previewName) previewName.textContent = color.nameEn;
    if (previewHex) previewHex.textContent = color.hex;
  }
  function draw() {
    const fam = family?.value || '';
    const q = (search?.value || '').toLowerCase().trim();
    const list = window.RAL_COLORS.filter(c => {
      const okFamily = !fam || c.family === fam;
      const text = `${c.code} ${c.label} ${c.nameEn} ${c.hex}`.toLowerCase();
      const okText = !q || text.includes(q);
      return okFamily && okText;
    });
    if (count) count.textContent = `${list.length} renk gösteriliyor`;
    mount.innerHTML = list.slice(0, 216).map(c => `
      <article class="ral-card" data-code="${c.label}">
        <button style="all:unset; display:block; cursor:pointer; width:100%" data-ral='${JSON.stringify(c).replace(/'/g,"&#39;")}'>
          <div class="ral-swatch" style="background:${c.hex}"></div>
          <div class="ral-body">
            <div class="ral-code">${c.label}</div>
            <div class="ral-name">${c.nameEn}</div>
            <div class="ral-meta"><span>${c.family}</span><span>${c.hex}</span></div>
          </div>
        </button>
      </article>
    `).join('');
    mount.querySelectorAll('[data-ral]').forEach(btn => {
      btn.addEventListener('click', () => {
        const data = JSON.parse(btn.getAttribute('data-ral').replace(/&#39;/g, "'"));
        applyPreview(data);
      });
    });
    if (list[0]) applyPreview(list[0]);
  }
  family?.addEventListener('change', draw);
  search?.addEventListener('input', draw);
  draw();
}
window.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initYear();
  buildDocsTable();
  buildProducts();
  buildRALGrid();
});
