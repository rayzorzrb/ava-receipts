/* ava — product engine. Same app, three homes. Items are thermal slips. */
(function () {
  const HOME = document.body.getAttribute("data-home");
  if (!HOME) return;

  const KEY = "ava-product-v1";
  const INR = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });

  const TRAY = { src: "assets/3d/wood-tray.webp", w: 746, h: 800 };
  const CATS = [
    { id: "groceries", label: "Groceries" },
    { id: "coffee", label: "Coffee" },
    { id: "rides", label: "Rides" },
    { id: "home", label: "Home" },
  ];
  const CAT_OTHER = { id: "other", label: "Other" };

  const MERCHANTS = [
    "Ottimo Pizza",
    "Blue Bottle",
    "Uber",
    "Chipotle",
    "Starbucks",
    "IKEA",
    "Whole Foods",
    "Philz",
    "Trader Joe's",
    "AMC",
    "Shell",
    "Sushi Ran",
    "Yakuza",
  ];

  const SEED = [
    { id: "ottimo", merchant: "Ottimo Pizza", date: "18 AUG", time: "19:42", amount: 54.3, category: "other",
      addr: "2148 CHESTNUT ST\nSAN FRANCISCO, CA",
      items: [{ name: "Margherita", price: 18 }, { name: "Diavola", price: 22.5 }, { name: "Garlic knots", price: 8 }, { name: "Tax", price: 5.8 }] },
    { id: "bluebottle", merchant: "Blue Bottle", date: "12 AUG", time: "08:11", amount: 6.5, category: "coffee",
      addr: "315 LINDEN ST\nSAN FRANCISCO, CA",
      items: [{ name: "New Orleans iced", price: 6.5 }] },
    { id: "uber", merchant: "Uber", date: "15 AUG", time: "22:04", amount: 18.4, category: "rides",
      addr: "TRIP · SF",
      items: [{ name: "Mission → North Beach", price: 16 }, { name: "Booking fee", price: 2.4 }] },
    { id: "chipotle", merchant: "Chipotle", date: "20 AUG", time: "12:36", amount: 14.85, category: "other",
      addr: "211 SUTTER ST\nSAN FRANCISCO, CA",
      items: [{ name: "Chicken bowl", price: 12.5 }, { name: "Tax", price: 2.35 }] },
    { id: "yakuza", merchant: "Yakuza", date: "14 AUG", time: "20:18", amount: 38.5, category: "other",
      addr: "FILLMORE ST\nSAN FRANCISCO, CA",
      items: [{ name: "Ramen", price: 18 }, { name: "Gyoza", price: 9.5 }, { name: "Highball", price: 8 }, { name: "Tax", price: 3 }] },
    { id: "starbucks", merchant: "Starbucks", date: "08 AUG", time: "07:52", amount: 5.75, category: "coffee",
      addr: "201 POWELL ST\nSAN FRANCISCO, CA",
      items: [{ name: "Iced Americano", price: 5.75 }] },
    { id: "wholefoods", merchant: "Whole Foods", date: "03 AUG", time: "11:07", amount: 42.16, category: "groceries",
      addr: "1765 CALIFORNIA ST\nSAN FRANCISCO, CA",
      items: [{ name: "Heirloom tomatoes", price: 6.49 }, { name: "Sourdough", price: 5.99 }, { name: "Oat milk", price: 4.79 }, { name: "Mixed greens", price: 3.99 }, { name: "Pasta", price: 4.49 }, { name: "Olive oil", price: 12.99 }, { name: "Tax", price: 3.42 }] },
    { id: "amc", merchant: "AMC", date: "16 AUG", time: "16:40", amount: 24.0, category: "other",
      addr: "METREON\nSAN FRANCISCO, CA",
      items: [{ name: "Ticket", price: 16 }, { name: "Popcorn", price: 8 }] },
    { id: "shell", merchant: "Shell", date: "09 AUG", time: "17:21", amount: 45.2, category: "other",
      addr: "VAN NESS AVE\nSAN FRANCISCO, CA",
      items: [{ name: "Regular  12.4 gal", price: 45.2 }] },
    { id: "ikea", merchant: "IKEA", date: "22 AUG", time: "14:03", amount: 89.0, category: "home",
      addr: "EMERYVILLE, CA",
      items: [{ name: "Lack table", price: 49 }, { name: "Billy extras", price: 32 }, { name: "Hot dog", price: 8 }] },
    { id: "philz", merchant: "Philz", date: "05 AUG", time: "09:14", amount: 7.65, category: "coffee",
      addr: "HAIGHT ST\nSAN FRANCISCO, CA",
      items: [{ name: "Tesora  large", price: 7.65 }] },
    { id: "sushiran", merchant: "Sushi Ran", date: "25 AUG", time: "19:05", amount: 68.0, category: "other",
      addr: "SAUSALITO, CA",
      items: [{ name: "Omakase lunch", price: 58 }, { name: "Green tea", price: 4 }, { name: "Tax", price: 6 }] },
    { id: "traderjoes", merchant: "Trader Joe's", date: "11 AUG", time: "18:28", amount: 32.15, category: "groceries",
      addr: "MASONIC AVE\nSAN FRANCISCO, CA",
      items: [{ name: "Mandarins", price: 3.99 }, { name: "Frozen gyoza", price: 4.49 }, { name: "Everything bagel", price: 2.29 }, { name: "Dark chocolate", price: 2.99 }, { name: "Flowers", price: 7.99 }, { name: "Sparkling water", price: 3.49 }, { name: "Tax", price: 6.91 }] },
  ];

  const TRAY_LAYOUT = [
    { top: "4%", left: "4%", rot: -11 },
    { top: "8%", left: "34%", rot: 8 },
    { top: "2%", left: "62%", rot: -5 },
    { top: "40%", left: "8%", rot: 7 },
    { top: "46%", left: "38%", rot: -12 },
    { top: "38%", left: "64%", rot: 5 },
  ];

  const COMPACT_LAYOUT = [
    { top: "6%", left: "8%", rot: -9 },
    { top: "18%", left: "42%", rot: 7 },
  ];

  const DRAWER_LAYOUT = [
    { top: "2%", left: "2%", rot: -11 },
    { top: "4%", left: "30%", rot: 7 },
    { top: "1%", left: "56%", rot: -5 },
    { top: "22%", left: "0%", rot: 9 },
    { top: "26%", left: "26%", rot: -14 },
    { top: "20%", left: "50%", rot: 5 },
    { top: "24%", left: "72%", rot: -8 },
    { top: "46%", left: "4%", rot: 4 },
    { top: "50%", left: "32%", rot: -7 },
    { top: "44%", left: "58%", rot: 12 },
    { top: "68%", left: "12%", rot: -3 },
    { top: "66%", left: "40%", rot: 8 },
    { top: "70%", left: "64%", rot: -10 },
  ];

  const CAT_LAYOUT = [
    { top: "8%", left: "8%", rot: -8 },
    { top: "6%", left: "40%", rot: 6 },
    { top: "12%", left: "66%", rot: -4 },
    { top: "46%", left: "10%", rot: 9 },
    { top: "42%", left: "42%", rot: -11 },
    { top: "50%", left: "68%", rot: 5 },
    { top: "72%", left: "22%", rot: -6 },
    { top: "70%", left: "52%", rot: 8 },
  ];

  const CELL_LAYOUT = [
    { top: "10%", left: "10%", rot: -10 },
    { top: "14%", left: "48%", rot: 7 },
    { top: "48%", left: "18%", rot: 5 },
    { top: "52%", left: "52%", rot: -8 },
  ];

  const MINI_LAYOUT = [
    { top: "12%", left: "14%", rot: -9 },
    { top: "18%", left: "50%", rot: 6 },
    { top: "52%", left: "28%", rot: -5 },
  ];

  const BACK_CHEV = `<svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true"><path d="M10 2L2 10l8 8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const ICON_HOME = `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" aria-hidden="true"><path d="M4.2 11.6 L12.5 4.4 L20.8 11.6 V20.2 a1.8 1.8 0 0 1-1.8 1.8 h-4.1 v-6.2 h-4.8 v6.2 H6 a1.8 1.8 0 0 1-1.8-1.8z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`;
  const ICON_BOXES = `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" aria-hidden="true"><rect x="3.4" y="3.4" width="8.2" height="8.2" rx="1.6" stroke="currentColor" stroke-width="1.7"/><rect x="13.4" y="3.4" width="8.2" height="8.2" rx="1.6" stroke="currentColor" stroke-width="1.7"/><rect x="3.4" y="13.4" width="8.2" height="8.2" rx="1.6" stroke="currentColor" stroke-width="1.7"/><rect x="13.4" y="13.4" width="8.2" height="8.2" rx="1.6" stroke="currentColor" stroke-width="1.7"/></svg>`;
  const ICON_PLUS = `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 1.2 v11.6 M1.2 7 h11.6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>`;
  const ICON_CHECK = `<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6.2 L4.6 8.8 L10 3.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  function money(n) {
    return INR.format(Number(n) || 0);
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }
  function prettyDate(d) {
    if (!d) return "";
    const parts = String(d).split(" ");
    if (parts.length === 2) {
      const mon = parts[1].charAt(0) + parts[1].slice(1).toLowerCase();
      return parts[0] + " " + mon;
    }
    return d;
  }
  function dayNum(r) {
    const n = parseInt(String(r.date), 10);
    return isNaN(n) ? 0 : n;
  }
  function sorted(list) {
    return list.slice().sort((a, b) => dayNum(b) - dayNum(a));
  }
  function sum(list) {
    return list.reduce((a, r) => a + Number(r.amount), 0);
  }
  function catById(id) {
    return CATS.find((c) => c.id === id) || (id === "other" ? CAT_OTHER : null);
  }
  function inCat(list, id) {
    return list.filter((r) => r.category === id);
  }
  function catStats(list) {
    return CATS.map((c) => {
      const items = inCat(list, c.id);
      return Object.assign({}, c, { items, count: items.length, total: sum(items) });
    });
  }
  function countWord(n) {
    return n + " receipt" + (n === 1 ? "" : "s");
  }
  function up(s) {
    return String(s || "").toUpperCase();
  }

  function imgHTML(src, w, h, alt, eager) {
    const wh = w && h ? ` width="${w}" height="${h}" style="aspect-ratio:${w}/${h}"` : "";
    const load = eager
      ? ` fetchpriority="high" decoding="async"`
      : ` loading="lazy" decoding="async"`;
    return `<img src="${src}" alt="${esc(alt || "")}"${wh}${load}>`;
  }
  function trayImg(alt, eager) {
    return imgHTML(TRAY.src, TRAY.w, TRAY.h, alt || "Oak tray", eager);
  }

  /* Reusable oak box: empty wood tray + coded slips in the well. */
  function oakHTML(list, opts) {
    opts = opts || {};
    const size = opts.size || "hero";
    const layout = opts.layout
      || (size === "cell" || size === "pick" ? CELL_LAYOUT
        : size === "mini" || size === "compact" ? MINI_LAYOUT
        : size === "full" ? DRAWER_LAYOUT
        : TRAY_LAYOUT);
    const cls = ["oak", "size-" + size];
    if (opts.cls) cls.push(opts.cls);
    let hit = "";
    if (opts.hit !== false) {
      if (opts.cat) {
        hit = `<button class="tray-hit press" type="button" data-cat="${esc(opts.cat)}" aria-label="${esc(opts.label || "Open box")}"></button>`;
      } else if (opts.filter) {
        hit = `<button class="tray-hit press" type="button" data-filter="${esc(opts.filter)}" aria-label="${esc(opts.label || "All receipts")}"></button>`;
      } else if (opts.pick) {
        hit = `<button class="tray-hit press" type="button" data-pick="${esc(opts.pick)}" aria-label="${esc(opts.label || "Choose box")}"></button>`;
      } else {
        hit = `<button class="tray-hit press" type="button" data-act="${esc(opts.act || "all")}" aria-label="${esc(opts.label || "All August receipts")}"></button>`;
      }
    }
    const slips = list && list.length ? scatterHTML(list, layout) : "";
    return `<div class="${cls.join(" ")}">
      ${trayImg(opts.alt || "Oak tray", opts.eager !== false)}
      <div class="tray-well">${slips}</div>
      ${hit}
    </div>`;
  }

  function barcodeSVG(seed, h) {
    h = h || 24;
    let x = 0;
    let bars = "";
    const s = String(seed) + "AVA" + String(seed).length;
    for (let i = 0; i < 42; i++) {
      const code = s.charCodeAt(i % s.length) + i * 7;
      const w = 1 + (code % 3);
      if (i % 2 === 0) {
        bars += `<rect x="${x}" y="0" width="${w}" height="${h}" fill="#1a1814"/>`;
      }
      x += w;
    }
    bars += `<rect x="0" y="0" width="2" height="${h}" fill="#1a1814"/>`;
    bars += `<rect x="${x - 2}" y="0" width="2" height="${h}" fill="#1a1814"/>`;
    return `<svg viewBox="0 0 ${x} ${h}" preserveAspectRatio="none" aria-hidden="true">${bars}</svg>`;
  }

  function slipBody(r, compact) {
    return `<div class="m">${esc(up(r.merchant))}</div>
      <div class="d">${esc(r.date)}</div>
      <div class="t">TOTAL ${money(r.amount)}</div>
      <div class="barcode">${barcodeSVG(r.merchant + r.amount, compact ? 16 : 22)}</div>`;
  }

  function slipMini(r, pos, extraClass) {
    const style = pos
      ? `top:${pos.top};left:${pos.left};transform:rotate(${pos.rot}deg);z-index:${pos.z || 1}`
      : "";
    return `<article class="slip slip-mini ${extraClass || ""}" data-id="${esc(r.id)}" tabindex="0" role="button" style="${style}" aria-label="${esc(r.merchant)}, ${money(r.amount)}">
      ${slipBody(r, true)}
    </article>`;
  }

  function slipCard(r, i) {
    const rots = [-2.6, 1.8, -1.4, 2.4, -3.1, 1.2, 2.1, -1.8, 0.8, -2.2];
    const rot = rots[i % rots.length];
    return `<button class="slip slip-card" type="button" data-id="${esc(r.id)}" style="transform:rotate(${rot}deg)" aria-label="${esc(r.merchant)}, ${money(r.amount)}">
      ${slipBody(r, false)}
    </button>`;
  }

  function slipFull(r) {
    const lines = (r.items && r.items.length ? r.items : [{ name: r.merchant, price: r.amount }])
      .map((it) => `<div class="slip-line"><span>${esc(up(it.name))}</span><span>${Number(it.price).toFixed(2)}</span></div>`)
      .join("");
    const addr = (r.addr || "").split("\n").filter(Boolean).map(esc).join("<br>");
    return `<article class="slip slip-full" aria-label="${esc(r.merchant)} receipt">
      <div class="store">${esc(up(r.merchant))}</div>
      ${addr ? `<div class="addr">${addr}</div>` : ""}
      <div class="when">${esc(prettyDate(r.date))} 2026${r.time ? "  ·  " + esc(r.time) : ""}</div>
      <hr class="rule" />
      ${lines}
      <hr class="rule" />
      <div class="total-row"><span>TOTAL</span><span>${money(r.amount)}</span></div>
      <div class="barcode tall">${barcodeSVG(r.merchant + r.date + r.amount, 40)}</div>
      <div class="thanks">THANK YOU</div>
    </article>`;
  }

  function scatterHTML(list, layout, extraClass) {
    const loc = layout || DRAWER_LAYOUT;
    return sorted(list).map((r, i) => {
      const pos = Object.assign({ z: 3 + i }, loc[i] || loc[i % loc.length]);
      return slipMini(r, pos, extraClass);
    }).join("");
  }

  function loadExtras() {
    try {
      const raw = localStorage.getItem(KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }
  function saveExtras(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
  }
  function allReceipts() {
    return SEED.concat(loadExtras());
  }
  function byId(id) {
    return allReceipts().find((r) => r.id === id);
  }

  const state = {
    tab: "home",
    stack: [],
    form: { merchant: "", amount: "", cat: null },
    sheet: false,
    prefCat: null,
    filterCat: null,
    lastSaved: null,
  };

  function backLabel() {
    if (state.stack.length <= 1) return state.tab === "boxes" ? "Boxes" : "August";
    const prev = state.stack[state.stack.length - 2];
    if (prev.type === "category") {
      const c = catById(prev.cat);
      return c ? c.label : "Back";
    }
    if (prev.type === "all") return "August";
    if (prev.type === "home") return "August";
    if (prev.type === "boxes") return "Boxes";
    return "Back";
  }

  function statusHTML() {
    return `<div class="statusbar" aria-hidden="true">
      <div class="sb-time">9:41</div>
      <div class="sb-end">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="7.2" width="3" height="4.8" rx="0.5"/><rect x="4.5" y="5" width="3" height="7" rx="0.5"/><rect x="9" y="2.6" width="3" height="9.4" rx="0.5"/><rect x="13.5" y="0" width="3" height="12" rx="0.5"/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M1.4 7.4 A8.4 8.4 0 0 1 14.6 7.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4.1 9.2 A4.8 4.8 0 0 1 11.9 9.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="11" r="1.15" fill="currentColor"/></svg>
        <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.6" y="0.6" width="21" height="10.8" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="22.2" y="3.6" width="1.6" height="4.8" rx="0.6" fill="currentColor"/><rect x="2" y="2" width="16.2" height="8" rx="1.4" fill="currentColor"/></svg>
      </div>
    </div>`;
  }

  function tabbarHTML() {
    const homeOn = state.tab === "home" && !state.sheet ? "on" : "";
    const boxesOn = state.tab === "boxes" && !state.sheet ? "on" : "";
    return `<nav class="tabbar" role="tablist">
      <button class="tab ${homeOn}" type="button" data-tab="home" role="tab" aria-selected="${!!homeOn}">
        ${ICON_HOME}<span>Home</span>
      </button>
      <button class="tab tab-plus" type="button" data-tab="new" aria-label="New receipt">
        <span class="plus-fab">${ICON_PLUS}</span><span>New</span>
      </button>
      <button class="tab ${boxesOn}" type="button" data-tab="boxes" role="tab" aria-selected="${!!boxesOn}">
        ${ICON_BOXES}<span>Boxes</span>
      </button>
    </nav>
    <div class="home-ind" aria-hidden="true"></div>`;
  }

  function navHTML(opts) {
    opts = opts || {};
    const back = opts.back
      ? `<button class="back" type="button" data-act="back" aria-label="Back">${BACK_CHEV}<span>${esc(opts.back)}</span></button>`
      : "";
    const left = opts.left || back;
    const right = opts.right || "";
    return `<div class="nav">
      <div class="nav-left">${left}</div>
      <div class="nav-title">${esc(opts.title || "")}</div>
      <div class="nav-right">${right}</div>
    </div>`;
  }

  function homeStudio() {
    const list = allReceipts();
    const total = sum(list);
    const stats = catStats(list);
    return `${navHTML({ title: "ava" })}
      <div class="large-title">
        <h1>August</h1>
        <p class="sub"><span class="total">${money(total)}</span> · ${countWord(list.length)}</p>
      </div>
      ${oakHTML(list, { size: "hero", layout: DRAWER_LAYOUT, eager: true, label: "All August receipts", alt: "August inbox" })}
      <div class="section-head">Sorted</div>
      <div class="cat-grid">
        ${stats.map((c, i) => `
          <div class="cat-tile" data-cat="${c.id}">
            ${oakHTML(c.items, { size: "mini", cat: c.id, label: c.label + ", " + money(c.total), alt: c.label, eager: i < 2 })}
            <div class="cap">${esc(c.label)}</div>
            <div class="meta">${money(c.total)}</div>
          </div>`).join("")}
      </div>`;
  }

  function homeCells() {
    const list = allReceipts();
    const stats = catStats(list);
    return `<div class="cells-home">
      ${navHTML({ title: "ava" })}
      <div class="large-title">
        <h1>August</h1>
        <p class="sub"><span class="total">${money(sum(list))}</span></p>
      </div>
      <div class="cells-grid">
        ${stats.map((c) => `
          <div class="cells-tile" data-cat="${c.id}">
            ${oakHTML(c.items, { size: "cell", cat: c.id, label: c.label + ", " + money(c.total), alt: c.label, eager: true })}
            <div class="cap">${esc(c.label)}</div>
            <div class="meta">${money(c.total)}</div>
          </div>`).join("")}
      </div>
    </div>`;
  }

  function homeTable() {
    const list = allReceipts();
    const stats = catStats(list);
    const shown = state.filterCat ? inCat(list, state.filterCat) : list;
    const filterLabel = state.filterCat ? (catById(state.filterCat) || {}).label : null;
    const trayList = state.filterCat ? shown : sorted(list).slice(0, 3);
    return `${navHTML({ title: "ava" })}
      <div class="large-title">
        <h1>August</h1>
        <p class="sub"><span class="total">${money(sum(shown))}</span> · ${countWord(shown.length)}${filterLabel ? " · " + esc(filterLabel) : ""}</p>
      </div>
      ${oakHTML(trayList, { size: "compact", filter: "all", eager: true, alt: "August tray", label: "All receipts", layout: COMPACT_LAYOUT })}
      <div class="snap-row">
        ${stats.map((c, i) => `
          <div class="snap-card ${state.filterCat === c.id ? "on" : ""}" data-filter="${c.id}">
            ${oakHTML(c.items.slice(0, 2), { size: "pick", filter: c.id, label: "Filter " + c.label, alt: c.label, eager: i < 2, layout: MINI_LAYOUT })}
            <div class="cap">${esc(c.label)}</div>
            <div class="meta">${money(c.total)}</div>
          </div>`).join("")}
      </div>
      <div class="wallet-stack">
        ${shown.length
          ? sorted(shown).map((r, i) => slipCard(r, i)).join("")
          : `<div class="empty"><p>Nothing in this box yet.</p></div>`}
      </div>`;
  }

  function homeHTML() {
    if (HOME === "cells") return homeCells();
    if (HOME === "table") return homeTable();
    return homeStudio();
  }

  function boxesHTML() {
    const stats = catStats(allReceipts());
    return `${navHTML({ title: "ava" })}
      <div class="large-title">
        <h1>Boxes</h1>
        <p class="sub">Where August goes</p>
      </div>
      <div class="boxes-grid">
        ${stats.map((c, i) => `
          <div class="boxes-tile" data-cat="${c.id}">
            ${oakHTML(c.items, { size: "cell", cat: c.id, label: c.label + ", " + money(c.total), alt: c.label, eager: i < 2 })}
            <div class="cap">${esc(c.label)}</div>
            <div class="meta">${c.count ? money(c.total) : "Empty"}</div>
          </div>`).join("")}
      </div>`;
  }

  function categoryHTML(catId, isAll) {
    const list = allReceipts();
    const items = isAll ? list : inCat(list, catId);
    const cat = isAll
      ? { id: "all", label: "August" }
      : catById(catId);
    const back = backLabel();
    const empty = !items.length;
    if (isAll) {
      return `${navHTML({ back: back, title: "August" })}
        <div class="large-title">
          <h1>August</h1>
          <p class="sub"><span class="total">${money(sum(items))}</span> · ${countWord(items.length)}</p>
        </div>
        ${oakHTML(items, { size: "full", layout: DRAWER_LAYOUT, eager: true, hit: false, alt: "August tray" })}
        <p class="oak-hint">Tap a slip for the full sheet.</p>`;
    }
    return `${navHTML({ back: back, title: cat.label })}
      <div class="large-title">
        <h1>${esc(cat.label)}</h1>
        <p class="sub"><span class="total">${money(sum(items))}</span> · ${empty ? "No receipts yet" : countWord(items.length)}</p>
      </div>
      ${oakHTML(items, { size: "full", layout: CAT_LAYOUT, eager: true, hit: false, alt: cat.label + " box" })}
      ${empty
        ? `<div class="empty">
            <p>This box is empty. Add a receipt and it lands here.</p>
            <button class="btn" type="button" data-act="add" data-pref="${esc(catId || "")}">Add Receipt</button>
          </div>`
        : `<p class="oak-hint">Tap a slip for the full sheet.</p>`}`;
  }

  function detailHTML(id) {
    const r = byId(id);
    if (!r) return `<div class="empty"><p>Receipt gone.</p></div>`;
    const cat = catById(r.category);
    const done = `<button class="nav-action strong" type="button" data-act="back">Done</button>`;
    const pile = cat ? inCat(allReceipts(), cat.id) : [];
    return `${navHTML({ back: backLabel(), title: "", right: done })}
      <div class="detail-paper">
        ${slipFull(r)}
      </div>
      ${cat
        ? `<div class="section-head">In the box</div>
           <div class="detail-box">
             ${oakHTML(pile, { size: "mini", cat: cat.id, label: cat.label, alt: cat.label })}
             <div class="cap">${esc(cat.label)}</div>
           </div>`
        : ""}`;
  }

  function sheetHTML() {
    const f = state.form;
    const can = f.merchant.trim() && Number(f.amount) > 0 && f.cat;
    return `<div class="sheet-root">
      <div class="sheet-dim" data-act="close-sheet"></div>
      <div class="sheet" role="dialog" aria-modal="true" aria-label="New receipt">
        <div class="grabber"></div>
        ${navHTML({
          title: "New Receipt",
          left: `<button class="nav-action" type="button" data-act="close-sheet">Cancel</button>`,
          right: `<button class="nav-action strong ${can ? "" : "dim"}" type="button" data-act="save" ${can ? "" : "disabled"}>Save</button>`,
        })}
        <div class="sheet-scroll">
          <div class="form-label">Merchant</div>
          <div class="chips">
            ${MERCHANTS.map((m) => `<button class="chip ${f.merchant === m ? "on" : ""}" type="button" data-chip="${esc(m)}">${esc(m)}</button>`).join("")}
          </div>
          <div class="field-wrap">
            <div class="field">
              <label for="merchant-in">Name</label>
              <input id="merchant-in" type="text" placeholder="Or type a name" value="${esc(f.merchant)}" autocomplete="off">
            </div>
          </div>
          <div class="form-label">Amount</div>
          <div class="amount-big">
            <span class="curr">₹</span>
            <input id="amount-in" type="text" inputmode="decimal" placeholder="0.00" value="${esc(f.amount)}" autocomplete="off">
          </div>
          <div class="form-label">Category</div>
          <div class="pick-grid">
            ${CATS.map((c) => `
              <button class="pick-tile press ${f.cat === c.id ? "on" : ""}" type="button" data-pick="${c.id}" aria-label="${esc(c.label)}" aria-pressed="${f.cat === c.id}">
                <span class="pick-check">${ICON_CHECK}</span>
                ${oakHTML([], { size: "pick", hit: false, alt: c.label, eager: false })}
                <div class="cap">${esc(c.label)}</div>
              </button>`).join("")}
          </div>
        </div>
      </div>
    </div>`;
  }

  function rootKind() {
    return state.tab === "boxes" ? "boxes" : "home";
  }

  function htmlFor(screen) {
    if (screen.type === "home") return homeHTML();
    if (screen.type === "boxes") return boxesHTML();
    if (screen.type === "all") return categoryHTML(null, true);
    if (screen.type === "category") return categoryHTML(screen.cat, false);
    if (screen.type === "detail") return detailHTML(screen.id);
    return homeHTML();
  }

  let rootEl;
  let stageEl;
  let sheetWrap;

  function mountChrome() {
    rootEl = document.getElementById("root");
    rootEl.innerHTML = `<main class="phone app">
      ${statusHTML()}
      <div class="stage" id="stage"></div>
      ${tabbarHTML()}
      <div id="sheet-slot"></div>
      <div class="toast" id="toast"></div>
    </main>`;
    stageEl = document.getElementById("stage");
    sheetWrap = document.getElementById("sheet-slot");
    bindChrome(rootEl);
  }

  function paintRoot() {
    const kind = rootKind();
    state.stack = [{ type: kind }];
    stageEl.innerHTML = `<div class="screen root" data-kind="${kind}">${htmlFor({ type: kind })}</div>`;
    bindScreen(stageEl.querySelector(".screen"));
    refreshTabs();
    markSpawn();
  }

  function refreshTabs() {
    const bar = rootEl.querySelector(".tabbar");
    if (!bar) return;
    bar.querySelectorAll(".tab").forEach((t) => {
      const id = t.getAttribute("data-tab");
      if (id === "new") return;
      t.classList.toggle("on", id === state.tab);
      t.setAttribute("aria-selected", id === state.tab ? "true" : "false");
    });
  }

  function paintSheet() {
    sheetWrap.innerHTML = state.sheet ? sheetHTML() : "";
    if (state.sheet) {
      bindSheet(sheetWrap);
      const amt = sheetWrap.querySelector("#amount-in");
      const mer = sheetWrap.querySelector("#merchant-in");
      if (mer) {
        mer.addEventListener("input", () => {
          state.form.merchant = mer.value;
          refreshSave();
        });
      }
      if (amt) {
        amt.addEventListener("input", () => {
          state.form.amount = amt.value.replace(/[^\d.]/g, "");
          if (amt.value !== state.form.amount) amt.value = state.form.amount;
          refreshSave();
        });
      }
      requestAnimationFrame(() => {
        const root = sheetWrap.querySelector(".sheet-root");
        if (root) root.classList.add("open");
      });
    }
  }

  function refreshSave() {
    const btn = sheetWrap.querySelector('[data-act="save"]');
    if (!btn) return;
    const f = state.form;
    const can = f.merchant.trim() && Number(f.amount) > 0 && f.cat;
    btn.disabled = !can;
    btn.classList.toggle("dim", !can);
  }

  function push(screen) {
    state.stack.push(screen);
    const next = document.createElement("div");
    next.className = "screen enter";
    next.innerHTML = htmlFor(screen);
    stageEl.appendChild(next);
    bindScreen(next);
    const root = stageEl.querySelector(".screen.root");
    requestAnimationFrame(() => {
      next.classList.add("in");
      if (root) root.classList.add("shift");
    });
  }

  function pop() {
    if (state.stack.length <= 1) return;
    state.stack.pop();
    const screens = stageEl.querySelectorAll(".screen");
    const top = screens[screens.length - 1];
    const root = stageEl.querySelector(".screen.root");
    if (screens.length <= 2 && root) root.classList.remove("shift");
    top.classList.remove("in");
    top.classList.add("leave");
    const done = () => { if (top.parentNode) top.remove(); };
    top.addEventListener("transitionend", done, { once: true });
    setTimeout(done, 400);
  }

  function openCategory(catId) {
    const top = state.stack[state.stack.length - 1];
    if (top && top.type === "category" && top.cat === catId) return;
    if (top && top.type === "detail") {
      const prev = state.stack[state.stack.length - 2];
      if (prev && prev.type === "category" && prev.cat === catId) {
        pop();
        return;
      }
      pop();
      setTimeout(() => push({ type: "category", cat: catId }), 40);
      return;
    }
    push({ type: "category", cat: catId });
  }

  function openAll() {
    push({ type: "all" });
  }

  function openDetail(id) {
    if (!id) return;
    push({ type: "detail", id: id });
  }

  function openAdd(pref) {
    state.prefCat = pref || null;
    state.form = { merchant: "", amount: "", cat: pref || state.filterCat || null };
    state.sheet = true;
    paintSheet();
  }

  function closeSheet() {
    const root = sheetWrap.querySelector(".sheet-root");
    if (root) root.classList.remove("open");
    state.sheet = false;
    setTimeout(() => { sheetWrap.innerHTML = ""; }, 320);
  }

  function saveReceipt() {
    const f = state.form;
    const merchant = f.merchant.trim();
    const amount = Number(f.amount);
    if (!merchant || !(amount > 0) || !f.cat) return;
    const now = new Date();
    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    const rec = {
      id: "p-" + Date.now(),
      merchant: merchant,
      date: now.getDate() + " " + months[now.getMonth()],
      time: now.toTimeString().slice(0, 5),
      amount: Math.round(amount * 100) / 100,
      category: f.cat,
      items: [{ name: merchant, price: Math.round(amount * 100) / 100 }],
    };
    const extras = loadExtras();
    extras.push(rec);
    saveExtras(extras);
    state.lastSaved = rec.id;
    closeSheet();
    toast("Printed into " + (catById(f.cat) || {}).label);
    rebuild();
    requestAnimationFrame(() => {
      const tile = stageEl.querySelector('[data-cat="' + f.cat + '"]');
      if (tile) {
        tile.classList.add("settle");
        tile.addEventListener("animationend", () => tile.classList.remove("settle"), { once: true });
      }
      markSpawn();
    });
  }

  function markSpawn() {
    if (!state.lastSaved) return;
    const slip = stageEl.querySelector('[data-id="' + state.lastSaved + '"]');
    if (slip) {
      slip.classList.add("spawn");
      slip.addEventListener("animationend", () => slip.classList.remove("spawn"), { once: true });
    }
    state.lastSaved = null;
  }

  function rebuild() {
    const frozen = state.stack.slice();
    const tab = state.tab;
    paintRoot();
    state.tab = tab;
    refreshTabs();
    frozen.slice(1).forEach((s) => {
      state.stack.push(s);
      const next = document.createElement("div");
      next.className = "screen enter in";
      next.innerHTML = htmlFor(s);
      stageEl.appendChild(next);
      bindScreen(next);
    });
    const root = stageEl.querySelector(".screen.root");
    if (frozen.length > 1 && root) root.classList.add("shift");
  }

  function toast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 1400);
  }

  function applyFilter(id) {
    if (id === "all" || id === state.filterCat) state.filterCat = null;
    else state.filterCat = id;
    const root = stageEl.querySelector(".screen.root");
    if (root && state.stack.length === 1 && state.tab === "home") {
      root.innerHTML = homeHTML();
      bindScreen(root);
    }
  }

  function bindChrome(el) {
    el.addEventListener("click", (e) => {
      const tab = e.target.closest("[data-tab]");
      if (tab) {
        const id = tab.getAttribute("data-tab");
        if (id === "new") {
          openAdd(null);
          return;
        }
        if (id === state.tab && state.stack.length > 1) {
          paintRoot();
          return;
        }
        if (id !== state.tab) {
          state.tab = id;
          if (id !== "home") state.filterCat = null;
          paintRoot();
        }
      }
    });
  }

  function bindScreen(screen) {
    screen.addEventListener("click", (e) => {
      const act = e.target.closest("[data-act]");
      if (act) {
        const a = act.getAttribute("data-act");
        if (a === "back") { pop(); return; }
        if (a === "all") { openAll(); return; }
        if (a === "add") { openAdd(act.getAttribute("data-pref") || null); return; }
      }
      const row = e.target.closest("[data-id]");
      if (row && row.getAttribute("data-id")) {
        openDetail(row.getAttribute("data-id"));
        return;
      }
      const filter = e.target.closest("[data-filter]");
      if (filter) {
        applyFilter(filter.getAttribute("data-filter"));
        return;
      }
      const cat = e.target.closest("[data-cat]");
      if (cat && cat.getAttribute("data-cat")) {
        openCategory(cat.getAttribute("data-cat"));
        return;
      }
    });
  }

  function bindSheet(el) {
    el.addEventListener("click", (e) => {
      const act = e.target.closest("[data-act]");
      if (act) {
        const a = act.getAttribute("data-act");
        if (a === "close-sheet") { closeSheet(); return; }
        if (a === "save") { saveReceipt(); return; }
        if (a === "back") { closeSheet(); return; }
      }
      const chip = e.target.closest("[data-chip]");
      if (chip) {
        state.form.merchant = chip.getAttribute("data-chip");
        const input = el.querySelector("#merchant-in");
        if (input) input.value = state.form.merchant;
        el.querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", c === chip));
        refreshSave();
        return;
      }
      const pick = e.target.closest("[data-pick]");
      if (pick) {
        state.form.cat = pick.getAttribute("data-pick");
        el.querySelectorAll(".pick-tile").forEach((t) => t.classList.toggle("on", t === pick));
        refreshSave();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (state.sheet) closeSheet();
      else pop();
    }
  });

  mountChrome();
  paintRoot();

  const q = new URLSearchParams(location.search);
  const v = q.get("v");
  if (v === "category") openCategory(q.get("cat") || "groceries");
  else if (v === "all") openAll();
  else if (v === "detail") openDetail(q.get("id") || "ottimo");
  else if (v === "add") setTimeout(() => openAdd(q.get("cat") || null), 200);
  else if (v === "boxes") {
    state.tab = "boxes";
    paintRoot();
  }
})();
