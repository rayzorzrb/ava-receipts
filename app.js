/* ava — shared receipts, barcodes, kraft bits */
(function (w) {
  const INR = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });

  function money(n) {
    const s = INR.format(Number(n));
    return s.replace("₹", "₹");
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

  const RECEIPTS = [
    {
      id: "ottimo",
      merchant: "OTTIMO PIZZA",
      date: "18 AUG",
      time: "19:42",
      amount: 54.3,
      category: "other",
      addr: "2148 CHESTNUT ST\nSAN FRANCISCO, CA",
      items: [
        { name: "MARGHERITA", price: 18.0 },
        { name: "DIAVOLA", price: 22.5 },
        { name: "GARLIC KNOTS", price: 8.0 },
        { name: "TAX", price: 5.8 },
      ],
    },
    {
      id: "bluebottle",
      merchant: "BLUE BOTTLE",
      date: "12 AUG",
      time: "08:11",
      amount: 6.5,
      category: "coffee",
      addr: "315 LINDEN ST\nSAN FRANCISCO, CA",
      items: [{ name: "NEW ORLEANS ICED", price: 6.5 }],
    },
    {
      id: "uber",
      merchant: "UBER",
      date: "15 AUG",
      time: "22:04",
      amount: 18.4,
      category: "rides",
      addr: "TRIP · SF",
      items: [
        { name: "MISSION → NORTH BEACH", price: 16.0 },
        { name: "BOOKING FEE", price: 2.4 },
      ],
    },
    {
      id: "chipotle",
      merchant: "CHIPOTLE",
      date: "20 AUG",
      time: "12:36",
      amount: 14.85,
      category: "other",
      addr: "211 SUTTER ST\nSAN FRANCISCO, CA",
      items: [
        { name: "CHICKEN BOWL", price: 12.5 },
        { name: "TAX", price: 2.35 },
      ],
    },
    {
      id: "yakuza",
      merchant: "YAKUZA",
      date: "14 AUG",
      time: "20:18",
      amount: 38.5,
      category: "other",
      addr: "FILLMORE ST\nSAN FRANCISCO, CA",
      items: [
        { name: "RAMEN", price: 18.0 },
        { name: "GYOZA", price: 9.5 },
        { name: "HIGHBALL", price: 8.0 },
        { name: "TAX", price: 3.0 },
      ],
    },
    {
      id: "starbucks",
      merchant: "STARBUCKS",
      date: "08 AUG",
      time: "07:52",
      amount: 5.75,
      category: "coffee",
      addr: "201 POWELL ST\nSAN FRANCISCO, CA",
      items: [{ name: "ICED AMERICANO", price: 5.75 }],
    },
    {
      id: "wholefoods",
      merchant: "WHOLE FOODS",
      date: "03 AUG",
      time: "11:07",
      amount: 42.16,
      category: "groceries",
      addr: "1765 CALIFORNIA ST\nSAN FRANCISCO, CA",
      items: [
        { name: "HEIRLOOM TOMATOES", price: 6.49 },
        { name: "SOURDOUGH", price: 5.99 },
        { name: "OAT MILK", price: 4.79 },
        { name: "MIXED GREENS", price: 3.99 },
        { name: "PASTA", price: 4.49 },
        { name: "OLIVE OIL", price: 12.99 },
        { name: "TAX", price: 3.42 },
      ],
    },
    {
      id: "amc",
      merchant: "AMC THEATER",
      date: "16 AUG",
      time: "16:40",
      amount: 24.0,
      category: "other",
      addr: "METREON\nSAN FRANCISCO, CA",
      items: [
        { name: "TICKET", price: 16.0 },
        { name: "POPCORN", price: 8.0 },
      ],
    },
    {
      id: "shell",
      merchant: "SHELL",
      date: "09 AUG",
      time: "17:21",
      amount: 45.2,
      category: "other",
      addr: "VAN NESS AVE\nSAN FRANCISCO, CA",
      items: [{ name: "REGULAR  12.4 GAL", price: 45.2 }],
    },
    {
      id: "ikea",
      merchant: "IKEA",
      date: "22 AUG",
      time: "14:03",
      amount: 89.0,
      category: "home",
      addr: "EMERYVILLE, CA",
      items: [
        { name: "LACK TABLE", price: 49.0 },
        { name: "BILLY EXTRAS", price: 32.0 },
        { name: "HOT DOG", price: 8.0 },
      ],
    },
    {
      id: "philz",
      merchant: "PHILZ COFFEE",
      date: "05 AUG",
      time: "09:14",
      amount: 7.65,
      category: "coffee",
      addr: "HAIGHT ST\nSAN FRANCISCO, CA",
      items: [{ name: "TESORA  LARGE", price: 7.65 }],
    },
    {
      id: "sushiran",
      merchant: "SUSHI RAN",
      date: "25 AUG",
      time: "19:05",
      amount: 68.0,
      category: "other",
      addr: "SAUSALITO, CA",
      items: [
        { name: "OMAKASE LUNCH", price: 58.0 },
        { name: "GREEN TEA", price: 4.0 },
        { name: "TAX", price: 6.0 },
      ],
    },
    {
      id: "traderjoes",
      merchant: "TRADER JOE'S",
      date: "11 AUG",
      time: "18:28",
      amount: 32.15,
      category: "groceries",
      addr: "MASONIC AVE\nSAN FRANCISCO, CA",
      items: [
        { name: "MANDARINS", price: 3.99 },
        { name: "FROZEN GYOZA", price: 4.49 },
        { name: "EVERYTHING BAGEL", price: 2.29 },
        { name: "DARK CHOCOLATE", price: 2.99 },
        { name: "FLOWERS", price: 7.99 },
        { name: "SPARKLING WATER", price: 3.49 },
        { name: "TAX", price: 6.91 },
      ],
    },
  ];

  const MERCHANTS = [
    "OTTIMO PIZZA",
    "BLUE BOTTLE",
    "STARBUCKS",
    "PHILZ COFFEE",
    "CHIPOTLE",
    "TRADER JOE'S",
    "WHOLE FOODS",
    "UBER",
    "IKEA",
    "AMC THEATER",
    "SUSHI RAN",
  ];

  const CATEGORIES = [
    { id: "groceries", label: "GROCERIES" },
    { id: "coffee", label: "COFFEE" },
    { id: "rides", label: "RIDES" },
    { id: "home", label: "HOME" },
    { id: "other", label: "OTHER" },
  ];

  const DRAWER_LAYOUT = [
    { top: "6%", left: "5%", rot: -11 },
    { top: "8%", left: "34%", rot: 7 },
    { top: "4%", left: "62%", rot: -5 },
    { top: "28%", left: "2%", rot: 9 },
    { top: "32%", left: "28%", rot: -14 },
    { top: "26%", left: "55%", rot: 5 },
    { top: "30%", left: "76%", rot: -8 },
    { top: "54%", left: "8%", rot: 4 },
    { top: "58%", left: "38%", rot: -7 },
    { top: "52%", left: "66%", rot: 12 },
    { top: "74%", left: "18%", rot: -3 },
    { top: "72%", left: "48%", rot: 8 },
    { top: "76%", left: "72%", rot: -10 },
  ];

  function shortName(name) {
    if (name.length <= 11) return name;
    return name.slice(0, 10) + "…";
  }

  function miniHTML(r, extraClass) {
    return `<article class="receipt receipt-mini ${extraClass || ""}" data-id="${r.id}" tabindex="0" role="button" aria-label="${r.merchant}, ${money(r.amount)}">
      <div class="m">${r.merchant}</div>
      <div class="d">${r.date}</div>
      <div class="t">TOTAL: ${money(r.amount)}</div>
      <div class="barcode">${barcodeSVG(r.merchant + r.amount)}</div>
    </article>`;
  }

  function peekHTML(r, style) {
    return `<article class="receipt receipt-peek" style="${style}">
      <div class="m">${shortName(r.merchant)}</div>
      <div class="barcode">${barcodeSVG(r.merchant)}</div>
    </article>`;
  }

  function sheetHTML(r) {
    const items = (r.items || [{ name: "TOTAL", price: r.amount }])
      .map(
        (it) =>
          `<div class="row"><span>${it.name}</span><span>${Number(it.price).toFixed(2)}</span></div>`
      )
      .join("");
    const addr = (r.addr || "").split("\n").join("<br>");
    return `<div class="sheet" role="dialog" aria-label="${r.merchant} receipt">
      <div class="store">${r.merchant}</div>
      <div class="addr">${addr}</div>
      <div class="when">${r.date} 2026${r.time ? "  ·  " + r.time : ""}</div>
      <hr class="rule" />
      ${items}
      <hr class="rule" />
      <div class="total-row"><span>TOTAL</span><span>${money(r.amount)}</span></div>
      <div class="barcode">${barcodeSVG(r.merchant + r.date + r.amount, 40)}</div>
      <div class="thanks">THANK YOU</div>
      <div class="close-hint">tap anywhere to put it back</div>
    </div>`;
  }

  const TOMATO = `<svg class="obj-tomato" viewBox="0 0 80 80" aria-hidden="true">
    <defs>
      <radialGradient id="tg" cx="38%" cy="34%" r="70%">
        <stop offset="0%" stop-color="#ff6b4a"/>
        <stop offset="45%" stop-color="#e23c2b"/>
        <stop offset="100%" stop-color="#b41c1c"/>
      </radialGradient>
    </defs>
    <ellipse cx="40" cy="44" rx="28" ry="26" fill="url(#tg)"/>
    <ellipse cx="30" cy="34" rx="10" ry="7" fill="#ffd0c0" opacity="0.45"/>
    <path d="M40 22 C36 28 28 30 22 28 C30 24 34 18 40 16 C46 18 50 24 58 28 C52 30 44 28 40 22Z" fill="#2f8a3a"/>
    <path d="M40 16 C41 22 43 30 40 36 C37 30 39 22 40 16Z" fill="#246b2e"/>
    <rect x="38.2" y="12" width="3.6" height="8" rx="1.4" fill="#5a3a1a"/>
  </svg>`;

  const CUP = `<svg class="obj-cup" viewBox="0 0 90 90" aria-hidden="true">
    <ellipse cx="45" cy="48" rx="40" ry="18" fill="#efe8dc"/>
    <ellipse cx="45" cy="48" rx="40" ry="18" fill="none" stroke="#ddd4c6" stroke-width="1.2"/>
    <ellipse cx="45" cy="46" rx="28" ry="13" fill="#fff"/>
    <ellipse cx="45" cy="46" rx="28" ry="13" fill="none" stroke="#e8e0d4" stroke-width="1"/>
    <ellipse cx="45" cy="46" rx="22" ry="10" fill="#3a2416"/>
    <ellipse cx="45" cy="46" rx="20" ry="9" fill="#5c3a22"/>
    <ellipse cx="45" cy="45.2" rx="16" ry="6.5" fill="#7a5230" opacity="0.7"/>
    <ellipse cx="38" cy="43.5" rx="6" ry="2.4" fill="#f0d7b0" opacity="0.35"/>
  </svg>`;

  const HEART = `<svg class="prop prop-heart" viewBox="0 0 32 36" aria-hidden="true">
    <path d="M16 31 L14.5 12" stroke="#8a8f94" stroke-width="1.4"/>
    <circle cx="14.5" cy="11" r="1.6" fill="#cfd3d6"/>
    <path d="M16 14 C16 10 12 8 9.5 10.5 C7 13 8 16 16 22 C24 16 25 13 22.5 10.5 C20 8 16 10 16 14Z" fill="#2f8f52"/>
    <path d="M12 12 C11 11 10.2 11.4 10 12.4" stroke="#8fd9a4" stroke-width="1" fill="none"/>
  </svg>`;

  const CLIP = `<svg class="prop prop-clip" viewBox="0 0 28 36" aria-hidden="true">
    <path d="M10 28 V8 C10 4 18 4 18 8 V24 C18 27 13 27 13 24 V10"
      fill="none" stroke="#b9c0c6" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M10 28 V8 C10 4 18 4 18 8 V24"
      fill="none" stroke="#e8ecef" stroke-width="0.7"/>
  </svg>`;

  const SEAL = `<svg class="prop prop-seal" viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="15" fill="#b32032"/>
    <circle cx="20" cy="20" r="15" fill="none" stroke="#8e1826" stroke-width="1.5"/>
    <circle cx="20" cy="20" r="11" fill="none" stroke="#8e1826" stroke-width="0"/>
    <circle cx="20" cy="20" r="10.5" fill="none" stroke="#d44858" stroke-width="1"/>
    <text x="20" y="24" text-anchor="middle" font-size="12" font-family="serif" fill="#6e101c">A</text>
    <path d="M8 28 Q6 34 11 36 Q14 30 12 26" fill="#b32032"/>
    <ellipse cx="14" cy="15" rx="4" ry="2" fill="#ffb0b8" opacity="0.25"/>
  </svg>`;

  function byId(id) {
    return RECEIPTS.find((r) => r.id === id);
  }

  function inCategory(cat) {
    return RECEIPTS.filter((r) => r.category === cat);
  }

  function sum(list) {
    return list.reduce((a, r) => a + Number(r.amount), 0);
  }

  function overlay() {
    let el = document.querySelector(".overlay");
    if (!el) {
      el = document.createElement("div");
      el.className = "overlay";
      document.body.appendChild(el);
      el.addEventListener("click", () => el.classList.remove("open"));
    }
    return el;
  }

  function showSheet(r) {
    const el = overlay();
    el.innerHTML = sheetHTML(r);
    el.classList.add("open");
  }

  function showBox(cat) {
    const list = inCategory(cat);
    const meta = CATEGORIES.find((c) => c.id === cat);
    const el = overlay();
    el.innerHTML = `<div class="box-panel">
      <h2>${(meta && meta.label.toLowerCase()) || cat}</h2>
      <div class="sub">${list.length} receipt${list.length === 1 ? "" : "s"} · ${money(sum(list))}</div>
      <div class="list">
        ${list
          .map(
            (r) =>
              `<article class="receipt list-receipt" data-id="${r.id}">
                <div class="m">${r.merchant}</div>
                <div class="d">${r.date}  ·  ${money(r.amount)}</div>
                <div class="barcode">${barcodeSVG(r.merchant)}</div>
              </article>`
          )
          .join("") || `<p class="sub">nothing in this box yet</p>`}
      </div>
    </div>`;
    el.classList.add("open");
    el.querySelectorAll("[data-id]").forEach((node) => {
      node.addEventListener("click", (e) => {
        e.stopPropagation();
        showSheet(byId(node.dataset.id) || list.find((x) => x.id === node.dataset.id));
      });
    });
  }

  function wireInfo(text) {
    const btn = document.querySelector(".js-info");
    const pop = document.querySelector(".info-pop");
    if (!btn || !pop) return;
    pop.textContent = text;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      pop.classList.toggle("open");
    });
    document.addEventListener("click", () => pop.classList.remove("open"));
  }

  function toast(msg) {
    let t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 1400);
  }

  w.AVA = {
    RECEIPTS,
    MERCHANTS,
    CATEGORIES,
    DRAWER_LAYOUT,
    money,
    barcodeSVG,
    miniHTML,
    peekHTML,
    sheetHTML,
    TOMATO,
    CUP,
    HEART,
    CLIP,
    SEAL,
    byId,
    inCategory,
    sum,
    showSheet,
    showBox,
    overlay,
    wireInfo,
    toast,
    shortName,
  };
})(window);
