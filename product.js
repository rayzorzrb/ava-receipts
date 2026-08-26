(function () {
  const money = (n) => "₹" + Number(n).toFixed(2);
  const KEY = "ava-v3";
  const TRAY = "assets/3d/his-tray.webp";
  let lastView = "home";
  let cents = 0;

  const CATS = [
    { id: "groceries", label: "Groceries" },
    { id: "coffee", label: "Coffee" },
    { id: "rides", label: "Rides" },
    { id: "home", label: "Home" },
    { id: "other", label: "August" },
  ];

  const SEED = [
    { id: "ottimo", merchant: "Ottimo Pizza", date: "18 AUG", amount: 54.3, cat: "other",
      items: [["Margherita", 24], ["Garlic bread", 12], ["Pepsi", 18.3]],
      pos: { t: "31%", l: "28%", r: "-12deg", w: "20%" } },
    { id: "tj", merchant: "Trader Joe's", date: "11 AUG", amount: 32.15, cat: "groceries",
      items: [["Bananas", 4.2], ["Oat milk", 6.5], ["Eggs", 21.45]],
      pos: { t: "31%", l: "42%", r: "8deg", w: "20%" } },
    { id: "bluebottle", merchant: "Blue Bottle", date: "12 AUG", amount: 6.5, cat: "coffee",
      items: [["Drip coffee", 6.5]],
      pos: { t: "31%", l: "52%", r: "-6deg", w: "20%" } },
    { id: "wf", merchant: "Whole Foods", date: "03 AUG", amount: 42.16, cat: "groceries",
      items: [["Kale", 8], ["Yogurt", 12.16], ["Bread", 22]],
      pos: { t: "33%", l: "26%", r: "6deg", w: "20%" } },
    { id: "uber", merchant: "Uber", date: "15 AUG", amount: 18.4, cat: "rides",
      items: [["Trip fare", 18.4]],
      pos: { t: "34%", l: "40%", r: "-10deg", w: "20%" } },
    { id: "ikea", merchant: "IKEA", date: "22 AUG", amount: 89, cat: "home",
      items: [["Lamp", 49], ["Hooks", 40]],
      pos: { t: "33%", l: "52%", r: "10deg", w: "20%" } },
    { id: "chipotle", merchant: "Chipotle", date: "20 AUG", amount: 14.85, cat: "other",
      items: [["Burrito", 14.85]],
      pos: { t: "32%", l: "34%", r: "4deg", w: "20%" } },
    { id: "starbucks", merchant: "Starbucks", date: "08 AUG", amount: 5.75, cat: "coffee",
      items: [["Caffe latte", 5.75]],
      pos: { t: "32%", l: "47%", r: "-14deg", w: "20%" } },
    { id: "philz", merchant: "Philz", date: "05 AUG", amount: 7.65, cat: "coffee",
      items: [["Tesora", 7.65]],
      pos: { t: "36%", l: "32%", r: "12deg", w: "20%" } },
    { id: "amc", merchant: "AMC", date: "16 AUG", amount: 24, cat: "other",
      items: [["Ticket", 18], ["Soda", 6]],
      pos: { t: "31%", l: "44%", r: "14deg", w: "20%" } },
    { id: "shell", merchant: "Shell", date: "09 AUG", amount: 45.2, cat: "other",
      items: [["Petrol", 45.2]],
      pos: { t: "37%", l: "45%", r: "-5deg", w: "20%" } },
    { id: "sushiran", merchant: "Sushi Ran", date: "25 AUG", amount: 68, cat: "other",
      items: [["Omakase", 68]],
      pos: { t: "35%", l: "54%", r: "7deg", w: "20%" } },
    { id: "yakuza", merchant: "Yakuza", date: "14 AUG", amount: 38.5, cat: "other",
      items: [["Ramen", 38.5]],
      pos: { t: "32%", l: "56%", r: "-10deg", w: "20%" } },
  ];

  const MINI = [
    { t: "31%", l: "28%", r: "-8deg", w: "26%" },
    { t: "33%", l: "46%", r: "7deg", w: "24%" },
    { t: "34%", l: "34%", r: "-5deg", w: "24%" },
  ];

  function extras() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  }
  function all() { return SEED.concat(extras()); }
  function byCat(id) { return all().filter((r) => r.cat === id); }
  function find(id) { return all().find((r) => r.id === id); }
  function catOf(id) { return CATS.find((c) => c.id === id); }
  function catTotal(id) { return byCat(id).reduce((s, r) => s + r.amount, 0); }

  function barShift(id) {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 33 + id.charCodeAt(i)) | 0;
    return (h % 14) + "px";
  }
  function slipEl(r, big) {
    const b = document.createElement("button");
    b.className = "slip";
    b.type = "button";
    b.dataset.id = r.id;
    if (r.pos && !big) {
      b.style.top = r.pos.t;
      b.style.left = r.pos.l;
      b.style.width = r.pos.w;
      b.style.setProperty("--r", r.pos.r);
    }
    const paper = document.createElement("span");
    paper.className = "coded";
    paper.style.setProperty("--bar", barShift(r.id));
    const items = r.items || [["Total", r.amount]];
    paper.innerHTML =
      '<span class="m">' + r.merchant + "</span>" +
      '<span class="d">' + r.date + "</span>" +
      '<span class="rule"></span>' +
      items.map(function (it) {
        return '<span class="ln"><span>' + it[0] + "</span><span>" + Number(it[1]).toFixed(2) + "</span></span>";
      }).join("") +
      '<span class="rule"></span>' +
      '<span class="tot"><span>TOTAL</span><span>' + money(r.amount) + "</span></span>" +
      '<span class="bars"></span>';
    b.appendChild(paper);
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      openDetail(r.id);
    });
    return b;
  }

  function fillWell(el, receipts) {
    el.innerHTML = "";
    receipts.forEach((r, i) => {
      const copy = Object.assign({}, r);
      if (!copy.pos) {
        copy.pos = {
          t: (31 + (i % 3) * 3) + "%",
          l: (28 + (i % 3) * 12) + "%",
          r: (i % 2 ? 8 : -10) + "deg",
          w: "20%",
        };
      }
      el.appendChild(slipEl(copy));
    });
  }

  function miniTile(c) {
    const items = byCat(c.id);
    const btn = document.createElement("button");
    btn.className = "box-tile";
    btn.type = "button";
    btn.dataset.cat = c.id;
    btn.innerHTML =
      '<div class="drawer mini">' +
        '<img class="oak" src="' + TRAY + '" width="900" height="759" alt="">' +
        '<div class="well"></div>' +
      "</div>" +
      '<div class="cap">' + c.label + "</div>" +
      '<div class="meta">' + money(catTotal(c.id)) + " ×" + items.length + "</div>";
    const well = btn.querySelector(".well");
    items.slice(0, 3).forEach((r, i) => {
      well.appendChild(slipEl(Object.assign({}, r, { pos: MINI[i] })));
    });
    btn.addEventListener("click", (e) => {
      if (e.target.closest(".slip")) return;
      openCat(c.id);
    });
    return btn;
  }

  function renderHome() {
    fillWell(document.getElementById("well"), all());
    const n = all().length;
    document.getElementById("count").textContent = n + " receipt" + (n === 1 ? "" : "s") + " in the drawer";
    const grid = document.getElementById("boxes");
    grid.innerHTML = "";
    CATS.filter((c) => c.id !== "other").forEach((c) => grid.appendChild(miniTile(c)));
  }

  function openCat(id) {
    const c = catOf(id);
    const items = byCat(id);
    lastView = "cat";
    show("cat");
    document.getElementById("cat-title").textContent = c.label.toLowerCase();
    document.getElementById("cat-sub").textContent =
      money(catTotal(id)) + " · " + items.length + " receipt" + (items.length === 1 ? "" : "s");
    document.getElementById("cat-shot").src = TRAY;
    document.querySelector("#view-cat .drawer").style.display = "";
    document.getElementById("cat-slips").style.display = "none";
    fillWell(
      document.getElementById("cat-well"),
      items.map((r, i) =>
        Object.assign({}, r, {
          pos: {
            t: 31 + (i % 3) * 3 + "%",
            l: 30 + (i % 2) * 14 + "%",
            r: (i % 2 ? 8 : -10) + "deg",
            w: "20%",
          },
        })
      )
    );
  }

  function openBoxes() {
    lastView = "home";
    show("cat");
    document.getElementById("cat-title").textContent = "the boxes";
    document.getElementById("cat-sub").textContent = "four piles, same oak";
    document.querySelector("#view-cat .drawer").style.display = "none";
    const row = document.getElementById("cat-slips");
    row.style.display = "grid";
    row.className = "boxes slips-row";
    row.innerHTML = "";
    CATS.filter((c) => c.id !== "other").forEach((c) => row.appendChild(miniTile(c)));
  }

  function openDetail(id) {
    const r = find(id);
    if (!r) return;
    show("detail");
    const wrap = document.getElementById("detail-wrap");
    wrap.innerHTML = "";
    wrap.appendChild(slipEl(r, true));
    const label = catOf(r.cat)?.label || "August";
    document.getElementById("detail-back").textContent = "‹ " + label;
  }

  function show(name) {
    document.querySelectorAll(".view").forEach((v) => v.classList.toggle("on", v.id === "view-" + name));
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("on"));
    if (name === "home") document.getElementById("home-tab").classList.add("on");
    if (name === "cat") document.getElementById("boxes-tab").classList.add("on");
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
  document.getElementById("home-tab").onclick = () => {
    lastView = "home";
    renderHome();
    show("home");
  };
  document.getElementById("back-home").onclick = () => {
    lastView = "home";
    renderHome();
    show("home");
  };
  document.getElementById("detail-back").onclick = () => {
    if (lastView === "cat") show("cat");
    else {
      renderHome();
      show("home");
    }
  };
  document.getElementById("detail-done").onclick = () => {
    renderHome();
    show("home");
  };

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
    if (b.dataset.k === "del") cents = Math.floor(cents / 10);
    else if (b.textContent === ".") return;
    else {
      const d = Number(b.textContent);
      if (cents < 1000000) cents = cents * 10 + d;
    }
    setAmt();
  };

  document.getElementById("save").onclick = () => {
    const merchant = sheet.dataset.merchant || "New merchant";
    const amount = cents / 100 || 0;
    const cat = sheet.dataset.cat || "other";
    const rec = {
      id: "n" + Date.now(),
      merchant,
      date: "26 AUG",
      amount,
      cat,
      items: [["Total", amount]],
      pos: { t: "33%", l: "40%", r: "5deg", w: "20%" },
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
