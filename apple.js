/* ava v2 — Apple sheets, categories, extras */
(function (w) {
  const KEY = "ava-studio-v2";
  const CATS = [
    { id: "groceries", label: "GROCERIES", img: "assets/3d/box-groceries.png" },
    { id: "coffee", label: "COFFEE", img: "assets/3d/box-coffee.png" },
    { id: "rides", label: "RIDES", img: "assets/3d/box-rides.png" },
    { id: "home", label: "HOME", img: "assets/3d/box-home.png" },
  ];

  const CHEV = `<svg class="chev" viewBox="0 0 8 14" aria-hidden="true"><path d="M1.5 1.5 L6.5 7 L1.5 12.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  function titleCase(s) {
    const special = { "AMC THEATER": "AMC Theater", "IKEA": "IKEA", "UBER": "Uber" };
    const raw = String(s || "");
    if (special[raw.toUpperCase()]) return special[raw.toUpperCase()];
    return raw
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace("Joe'S", "Joe’s")
      .replace("Joe's", "Joe’s");
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

  function loadExtras() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }

  function saveExtras(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function allReceipts(withExtras) {
    const base = (w.AVA && w.AVA.RECEIPTS) ? w.AVA.RECEIPTS.slice() : [];
    if (!withExtras) return base;
    return base.concat(loadExtras());
  }

  function inCat(list, cat) {
    return list.filter((r) => r.category === cat);
  }

  function sum(list) {
    return list.reduce((a, r) => a + Number(r.amount), 0);
  }

  function dayNum(r) {
    const n = parseInt(String(r.date), 10);
    return isNaN(n) ? 0 : n;
  }

  function sorted(list) {
    return list.slice().sort((a, b) => dayNum(b) - dayNum(a));
  }

  function money(n) {
    return (w.AVA && w.AVA.money) ? w.AVA.money(n) : ("₹" + Number(n).toFixed(2));
  }

  function catStats(list) {
    return CATS.map((c) => {
      const items = inCat(list, c.id);
      return Object.assign({}, c, { items, count: items.length, total: sum(items) });
    });
  }

  function rowHTML(r, opts) {
    opts = opts || {};
    const thumb = opts.thumb
      ? `<img class="row-thumb" src="assets/3d/obj-receipt.png" alt="">`
      : "";
    return `<button class="row ${opts.thumb ? "has-thumb" : ""}" type="button" data-id="${r.id}">
      ${thumb}
      <div class="row-body">
        <div class="row-title">${titleCase(r.merchant)}</div>
        <div class="row-sub">${prettyDate(r.date)}</div>
      </div>
      <div class="row-amt ${opts.greyAmt ? "grey" : ""}">${money(r.amount)}</div>
      ${CHEV}
    </button>`;
  }

  function ensureSheet() {
    let root = document.querySelector(".sheet-root");
    if (root) return root;
    root = document.createElement("div");
    root.className = "sheet-root";
    root.innerHTML = `<div class="sheet-dim" data-close="1"></div>
      <div class="sheet" role="dialog" aria-modal="true">
        <div class="grabber"></div>
        <div class="sheet-head">
          <h2 id="sheet-title"></h2>
          <div class="sub" id="sheet-sub"></div>
        </div>
        <div class="sheet-scroll">
          <div class="group" id="sheet-list"></div>
        </div>
      </div>`;
    document.body.appendChild(root);
    root.addEventListener("click", (e) => {
      if (e.target.dataset.close) closeSheet();
    });
    return root;
  }

  function closeSheet() {
    const root = document.querySelector(".sheet-root");
    if (root) root.classList.remove("open");
  }

  function openSheet(title, list) {
    const root = ensureSheet();
    document.getElementById("sheet-title").textContent = title;
    const n = list.length;
    document.getElementById("sheet-sub").textContent =
      n + " receipt" + (n === 1 ? "" : "s") + " · " + money(sum(list));
    const box = document.getElementById("sheet-list");
    box.innerHTML = sorted(list).map((r) => rowHTML(r, { greyAmt: true })).join("");
    box.querySelectorAll("[data-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const r = list.find((x) => x.id === btn.dataset.id);
        if (r) openDetail(r);
      });
    });
    requestAnimationFrame(() => root.classList.add("open"));
  }

  function openDetail(r) {
    const items = r.items && r.items.length ? r.items : [{ name: r.merchant, price: r.amount }];
    const rows = items
      .map(
        (it) =>
          `<div class="row" style="pointer-events:none">
            <div class="row-body"><div class="row-title">${titleCase(it.name)}</div></div>
            <div class="row-amt grey">${Number(it.price).toFixed(2)}</div>
          </div>`
      )
      .join("");
    const root = ensureSheet();
    document.getElementById("sheet-title").textContent = titleCase(r.merchant);
    document.getElementById("sheet-sub").textContent = prettyDate(r.date) + (r.time ? "  ·  " + r.time : "");
    document.getElementById("sheet-list").innerHTML =
      rows +
      `<div class="row" style="pointer-events:none">
        <div class="row-body"><div class="row-title" style="font-weight:600">Total</div></div>
        <div class="row-amt">${money(r.amount)}</div>
      </div>`;
    requestAnimationFrame(() => root.classList.add("open"));
  }

  function dummyReceipt() {
    const merchants = (w.AVA && w.AVA.MERCHANTS) || ["OTTIMO PIZZA"];
    const cats = ["coffee", "groceries", "rides", "home", "other"];
    const amounts = [4.5, 6.75, 8.2, 11.4, 14.85, 18, 22.5, 9.8, 5.25];
    const extras = loadExtras();
    const i = extras.length;
    const now = new Date();
    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    const rec = {
      id: "v2-" + Date.now(),
      merchant: merchants[i % merchants.length],
      date: now.getDate() + " " + months[now.getMonth()],
      time: now.toTimeString().slice(0, 5),
      amount: amounts[i % amounts.length],
      category: cats[i % cats.length],
      addr: "ADDED BY HAND",
      items: [{ name: merchants[i % merchants.length], price: amounts[i % amounts.length] }],
    };
    extras.push(rec);
    saveExtras(extras);
    return rec;
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

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSheet();
  });

  w.AVA2 = {
    KEY, CATS, CHEV,
    titleCase, prettyDate, money, sum, sorted, inCat,
    allReceipts, loadExtras, saveExtras, catStats,
    rowHTML, openSheet, openDetail, closeSheet,
    dummyReceipt, toast,
  };
})(window);
