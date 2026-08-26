(function () {
  const money = (n) => "₹" + Number(n).toFixed(2);
  const KEY = "ava-v3";
  let lastView = "home";
  let cents = 0;

  const CATS = [
    { id: "groceries", label: "Groceries", shot: "assets/3d/box-groc.webp" },
    { id: "coffee", label: "Coffee", shot: "assets/3d/box-coffee.webp" },
    { id: "rides", label: "Rides", shot: "assets/3d/box-rides.webp" },
    { id: "home", label: "Home", shot: "assets/3d/box-home.webp" },
    { id: "other", label: "August", shot: "assets/3d/oak.webp" },
  ];

  const SEED = [
    { id: "ottimo", merchant: "Ottimo Pizza", date: "18 AUG", amount: 54.3, cat: "other", img: "assets/3d/slip-ottimo.webp",
      pos: { t: "4%", l: "2%", r: "-16deg", w: "38%" } },
    { id: "tj", merchant: "Trader Joe's", date: "11 AUG", amount: 32.15, cat: "groceries", img: "assets/3d/slip-tj.webp",
      pos: { t: "6%", l: "34%", r: "11deg", w: "36%" } },
    { id: "bluebottle", merchant: "Blue Bottle", date: "12 AUG", amount: 6.5, cat: "coffee", img: "assets/3d/slip-bluebottle.webp",
      pos: { t: "2%", l: "62%", r: "-7deg", w: "34%" } },
    { id: "wf", merchant: "Whole Foods", date: "03 AUG", amount: 42.16, cat: "groceries", img: "assets/3d/slip-wf.webp",
      pos: { t: "38%", l: "4%", r: "7deg", w: "37%" } },
    { id: "uber", merchant: "Uber", date: "15 AUG", amount: 18.4, cat: "rides", img: "assets/3d/slip-uber.webp",
      pos: { t: "42%", l: "38%", r: "-12deg", w: "35%" } },
    { id: "ikea", merchant: "IKEA", date: "22 AUG", amount: 89, cat: "home", img: "assets/3d/slip-ikea.webp",
      pos: { t: "36%", l: "66%", r: "14deg", w: "32%" } },
    { id: "chipotle", merchant: "Chipotle", date: "20 AUG", amount: 14.85, cat: "other", img: "assets/3d/slip-ottimo.webp",
      pos: { t: "18%", l: "18%", r: "4deg", w: "33%" } },
    { id: "starbucks", merchant: "Starbucks", date: "08 AUG", amount: 5.75, cat: "coffee", img: "assets/3d/slip-bluebottle.webp",
      pos: { t: "22%", l: "52%", r: "-20deg", w: "31%" } },
    { id: "philz", merchant: "Philz", date: "05 AUG", amount: 7.65, cat: "coffee", img: "assets/3d/slip-bluebottle.webp",
      pos: { t: "58%", l: "18%", r: "16deg", w: "30%" } },
    { id: "amc", merchant: "AMC", date: "16 AUG", amount: 24, cat: "other", img: "assets/3d/slip-uber.webp",
      pos: { t: "8%", l: "48%", r: "18deg", w: "29%" } },
    { id: "shell", merchant: "Shell", date: "09 AUG", amount: 45.2, cat: "other", img: "assets/3d/slip-ikea.webp",
      pos: { t: "62%", l: "52%", r: "-6deg", w: "31%" } },
    { id: "sushiran", merchant: "Sushi Ran", date: "25 AUG", amount: 68, cat: "other", img: "assets/3d/slip-wf.webp",
      pos: { t: "48%", l: "70%", r: "8deg", w: "28%" } },
    { id: "yakuza", merchant: "Yakuza", date: "14 AUG", amount: 38.5, cat: "other", img: "assets/3d/slip-ottimo.webp",
      pos: { t: "28%", l: "72%", r: "-14deg", w: "26%" } },
  ];

  function extras() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  }
  function all() { return SEED.concat(extras()); }
  function byCat(id) { return all().filter((r) => r.cat === id); }
  function find(id) { return all().find((r) => r.id === id); }
  function catOf(id) { return CATS.find((c) => c.id === id); }
  function catTotal(id) { return byCat(id).reduce((s, r) => s + r.amount, 0); }

  function slipEl(r, loose) {
    const b = document.createElement("button");
    b.className = "slip";
    b.type = "button";
    b.dataset.id = r.id;
    if (r.pos && !loose) {
      b.style.top = r.pos.t;
      b.style.left = r.pos.l;
      b.style.width = r.pos.w;
      b.style.transform = "rotate(" + r.pos.r + ")";
    }
    const img = document.createElement("img");
    img.src = r.img || "assets/3d/slip-ottimo.webp";
    img.alt = r.merchant;
    img.draggable = false;
    b.appendChild(img);
    b.addEventListener("click", () => openDetail(r.id));
    return b;
  }

  function fillWell(el, receipts) {
    el.innerHTML = "";
    receipts.forEach((r, i) => {
      if (!r.pos) {
        r.pos = {
          t: (6 + (i % 4) * 20) + "%",
          l: (4 + (i % 3) * 30) + "%",
          r: (i % 2 ? 11 : -13) + "deg",
          w: "34%",
        };
      }
      el.appendChild(slipEl(r));
    });
  }

  function renderHome() {
    fillWell(document.getElementById("well"), all());
    const n = all().length;
    document.getElementById("count").textContent = n + " receipt" + (n === 1 ? "" : "s") + " in the drawer";
    const grid = document.getElementById("boxes");
    const shown = CATS.filter((c) => c.id !== "other");
    grid.innerHTML = shown.map((c) => {
      const items = byCat(c.id);
      return `<button class="box-tile" type="button" data-cat="${c.id}">
        <div class="shot"><img src="${c.shot}" alt="${c.label}" width="800" height="533"></div>
        <div class="cap">${c.label}</div>
        <div class="meta">${money(catTotal(c.id))} ×${items.length}</div>
      </button>`;
    }).join("");
    grid.querySelectorAll("[data-cat]").forEach((el) => {
      el.onclick = () => openCat(el.dataset.cat);
    });
  }

  function openCat(id) {
    const c = catOf(id);
    const items = byCat(id);
    lastView = "cat";
    show("cat");
    document.getElementById("cat-title").textContent = c.label.toLowerCase();
    document.getElementById("cat-sub").textContent = money(catTotal(id)) + " · " + items.length + " receipt" + (items.length === 1 ? "" : "s");
    document.getElementById("cat-shot").src = "assets/3d/oak.webp";
    fillWell(document.getElementById("cat-well"), items.map((r, i) => ({
      ...r,
      pos: {
        t: (8 + (i % 3) * 22) + "%",
        l: (8 + (i % 2) * 36) + "%",
        r: (i % 2 ? 9 : -11) + "deg",
        w: "42%",
      },
    })));
    document.getElementById("cat-slips").innerHTML = "";
  }

  function openBoxes() {
    lastView = "home";
    show("cat");
    document.getElementById("cat-title").textContent = "the boxes";
    document.getElementById("cat-sub").textContent = "four piles, same oak";
    document.getElementById("cat-shot").src = "assets/3d/oak.webp";
    document.getElementById("cat-well").innerHTML = "";
    const row = document.getElementById("cat-slips");
    row.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "boxes";
    grid.style.width = "100%";
    grid.innerHTML = CATS.filter((c) => c.id !== "other").map((c) => `
      <button class="box-tile" type="button" data-cat="${c.id}">
        <div class="shot"><img src="${c.shot}" alt="${c.label}"></div>
        <div class="cap">${c.label}</div>
        <div class="meta">${money(catTotal(c.id))} ×${byCat(c.id).length}</div>
      </button>`).join("");
    row.appendChild(grid);
    grid.querySelectorAll("[data-cat]").forEach((el) => {
      el.onclick = () => openCat(el.dataset.cat);
    });
  }

  function openDetail(id) {
    const r = find(id);
    if (!r) return;
    show("detail");
    document.getElementById("detail-img").src = r.img;
    document.getElementById("detail-img").alt = r.merchant;
    const label = catOf(r.cat)?.label || "August";
    document.getElementById("detail-back").textContent = "‹ " + label;
  }

  function show(name) {
    document.querySelectorAll(".view").forEach((v) => v.classList.toggle("on", v.id === "view-" + name));
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("on", t.dataset.view === name));
    if (name === "home") document.querySelector('.tab[data-view="home"]')?.classList.add("on");
    if (name === "cat" && document.getElementById("cat-title").textContent === "the boxes") {
      document.querySelector('.tab[data-view="cat"]')?.classList.add("on");
    }
  }

  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("on");
    setTimeout(() => t.classList.remove("on"), 1400);
  }

  function setAmt() {
    document.getElementById("amt").textContent = (cents / 100).toFixed(2);
  }

  document.getElementById("boxes-tab").onclick = openBoxes;
  document.getElementById("home-tab").onclick = () => { lastView = "home"; renderHome(); show("home"); };
  document.getElementById("back-home").onclick = () => { lastView = "home"; renderHome(); show("home"); };
  document.getElementById("detail-back").onclick = () => {
    if (lastView === "cat") show("cat");
    else { renderHome(); show("home"); }
  };
  document.getElementById("detail-done").onclick = () => { renderHome(); show("home"); };

  const sheet = document.getElementById("sheet");
  document.getElementById("new-tab").onclick = () => {
    sheet.classList.add("on");
    cents = 0;
    setAmt();
    sheet.dataset.cat = "groceries";
    sheet.dataset.merchant = "";
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("on"));
    document.querySelectorAll(".pick-grid button").forEach((c, i) => c.classList.toggle("on", i === 0));
  };
  document.getElementById("cancel").onclick = () => sheet.classList.remove("on");

  document.getElementById("chips").onclick = (e) => {
    const c = e.target.closest(".chip");
    if (!c) return;
    document.querySelectorAll(".chip").forEach((x) => x.classList.remove("on"));
    c.classList.add("on");
    sheet.dataset.merchant = c.dataset.m;
  };
  document.getElementById("pick").onclick = (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    document.querySelectorAll(".pick-grid button").forEach((x) => x.classList.remove("on"));
    b.classList.add("on");
    sheet.dataset.cat = b.dataset.cat;
  };
  document.getElementById("keys").onclick = (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.k === "del") {
      cents = Math.floor(cents / 10);
    } else if (b.textContent === ".") {
      return;
    } else {
      const d = Number(b.textContent);
      if (cents < 1000000) cents = cents * 10 + d;
    }
    setAmt();
  };

  const SLIP_FOR = {
    "Ottimo Pizza": "assets/3d/slip-ottimo.webp",
    "Trader Joe's": "assets/3d/slip-tj.webp",
    "Blue Bottle": "assets/3d/slip-bluebottle.webp",
    Uber: "assets/3d/slip-uber.webp",
    IKEA: "assets/3d/slip-ikea.webp",
    "Whole Foods": "assets/3d/slip-wf.webp",
  };

  document.getElementById("save").onclick = () => {
    const merchant = sheet.dataset.merchant || "New merchant";
    const amount = cents / 100 || 0;
    const cat = sheet.dataset.cat || "other";
    const rec = {
      id: "n" + Date.now(),
      merchant, date: "26 AUG", amount, cat,
      img: SLIP_FOR[merchant] || "assets/3d/slip-ottimo.webp",
      pos: { t: "24%", l: "26%", r: "5deg", w: "36%" },
    };
    localStorage.setItem(KEY, JSON.stringify(extras().concat([rec])));
    sheet.classList.remove("on");
    lastView = "home";
    renderHome();
    show("home");
    toast("Printed into the drawer");
  };

  renderHome();
  show("home");
})();
