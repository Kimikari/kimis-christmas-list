/* Kimi's Christmas List: the code that is specific to this site.
   This file was written by an AI assistant (Genos), not copied from anyone: the gift list, the rules of the
   filter and the sort, the "I bought this" button with its shared list, the loading and showing of the tracked
   prices, and the lines that switch the libraries on.
   What it hands to code written by people (lib/, unchanged; CREDITS.txt says who wrote each):
   List.js copies the card template in index.html once per gift and fills in the name, the category and the shop,
   and it carries out the filter and the sort by the rules given here (prices, photos and the bought state are
   this file's work); Bootstrap has the styles, the category buttons and the menu; Snowstorm, countdown.js
   and canvas-confetti do the snow, the countdown and the confetti. */
"use strict";
/* ---------- The list ----------
   id: never change one (it ties a gift to its price and to its "bought" mark).
   price/list: the prices seen on 2026-11-26, used until the tracked prices load.
   tracked: the price is read from the shop by tools/prices.mjs. qty: how many to buy.
   tags: short facts a buyer needs (size, color, quantity); no reasons.
   The photo of a gift is img/<id>.jpg. */
const A = "https://www.amazon.com/dp/";
const ITEMS = [
  { id: "side-pillow", cat: "Sleep", name: "Coop Original Adjustable Pillow, queen",
    price: 66.75, list: 89, listLabel: "noprime", prime: true, tracked: true, shop: ["Amazon", A + "B00EINBSEW"], tags: [] },
  { id: "body-pillow", cat: "Sleep", name: "Sleep Number Cool ComfortFit Body Pillow",
    price: 119.99, tracked: true, shop: ["Sleep Number", "https://www.sleepnumber.com/products/cool-comfortfit-body-pillow"], tags: [] },
  { id: "heated-throw", cat: "Sleep", name: "WOOMER reversible faux fur and sherpa heated throw, 50 x 60 in",
    price: 42.49, list: 59.99, listLabel: "noprime", prime: true, tracked: true, shop: ["Amazon", A + "B0CZRJ7CNY"], tags: ["Color: Marble Grey", "Size: throw, 50 x 60 in"] },

  { id: "headset", cat: "Gaming", name: "Razer BlackShark V3 wireless gaming headset",
    price: 99.99, list: 149.99, tracked: true, shop: ["Amazon", A + "B0FH5XX7GP"], tags: ["Color: black"] },
  { id: "mic", cat: "Gaming", name: "Fifine AmpliGame AM8 USB dynamic mic",
    price: 44.99, list: 56.99, tracked: true, shop: ["Amazon", A + "B0BMFQP2ZZ"], tags: ["Color: black"] },

  { id: "boots", cat: "Winter", name: "Kamik Nation Plus snow boots, men's",
    price: 103.99, list: 129.99, tracked: true, shop: ["Amazon", A + "B0G4F2XKCR"], tags: ["Color: black", "Size: 11 (estimate)", "Runs small, no half sizes"] },
  { id: "cleats", cat: "Winter", name: "Yaktrax Diamond Grip ice cleats",
    price: 43.44, list: 59.99, tracked: true, shop: ["Amazon", A + "B01BZHFB7S"], tags: ["Size: X-Large (estimate, to fit over size 11 snow boots)"] },
  { id: "coat", cat: "Winter", name: "Columbia Landroamer II parka, men's",
    price: 179.99, list: 240, tracked: true, shop: ["Amazon", A + "B0CLR9F8TF"], tags: ["Color: black", "Size: Large (estimate)"] },
  { id: "gloves", cat: "Winter", name: "The North Face Montana Ski Gloves, men's",
    price: 70, tracked: true, shop: ["Amazon", A + "B0FXVXMW5Z"], tags: ["Color: TNF Black", "Size: L (estimate)"] },
  { id: "hat", cat: "Winter", name: "Carhartt A18 knit cuffed beanie",
    price: 19.99, tracked: true, shop: ["Amazon", A + "B002G9UDYG"], tags: ["Color: black"] },
  { id: "face-mask", cat: "Winter", name: "Buff ThermoNet neck gaiter",
    price: 24, list: 30, tracked: true, shop: ["Amazon", A + "B0848XF4TC"], tags: ["Color: black"] },
  { id: "lined-pants", cat: "Winter", name: "Wrangler Authentics fleece-lined cargo pants, men's",
    price: 30.35, list: 37.95, tracked: true, shop: ["Amazon", A + "B088856W2V"], tags: ["Color: Black Twill", "Size: 34W x 30L (estimate)"] },
  { id: "socks", cat: "Winter", name: "Darn Tough Light Hiker Micro Crew socks, men's merino",
    price: 25, tracked: true, shop: ["Darn Tough", "https://darntough.com/products/mens-merino-wool-light-hiker-micro-crew-cushioned-lightweight-hiking-socks"], tags: ["Color: black", "Size: L (estimate)", "Price is per pair"] },

  { id: "wallet", cat: "Everyday", name: "Minor History The Snaps Keychain Wallet",
    price: 36, list: 48, approx: true, shop: ["Minor History", "https://www.minorhistory.com/products/snaps-keychain-wallet?variant=31986093981805"], tags: ["Color: black", "Sale items can't be returned"] },
  { id: "toiletry-bag", cat: "Everyday", name: "Osprey Daylite Toiletry Kit",
    price: 19.99, tracked: true, shop: ["Amazon", A + "B0BKQGKNZ9"], tags: ["Color: black"] },

  { id: "towels", cat: "Kitchen", name: "All-Clad Professional Cotton Terry Kitchen Towel, 1 piece",
    price: 11.99, tracked: true, shop: ["Amazon", A + "B00UABQ5J4"], tags: ["Color: black", "Just one"] },
  { id: "sharpener", cat: "Kitchen", name: "The Original Tumbler rolling knife sharpener",
    price: 90.3, list: 129, listLabel: "typical", tracked: true, shop: ["Amazon", A + "B0CGGVHBQG"], tags: ["Color: wood"] },
  { id: "breading-trays", cat: "Kitchen", name: "Nordic Ware Naturals eighth sheet pans, three of them",
    price: 8.99, list: 10, qty: 3, tracked: true, shop: ["Amazon", A + "B079Q1GT7H"], tags: ["Set the quantity to 3"] },
  { id: "knife-chef", cat: "Kitchen", name: "MAC Professional 8-inch chef's knife with dimples, MTH-80",
    price: 159.95, tracked: true, shop: ["Amazon", A + "B000N5H2XU"], tags: ["Handle: black", "Sold by: Whittle Workhorse"] },
  { id: "knife-paring", cat: "Kitchen", name: "Victorinox Swiss Classic 3.25-inch paring knife, straight edge",
    price: 8, tracked: true, shop: ["Amazon", A + "B0061SWLKW"], tags: ["Color: black"] },
  { id: "scale", cat: "Kitchen", name: "Escali Primo digital kitchen scale",
    price: 25, list: 26.95, tracked: true, shop: ["Amazon", A + "B0007GAWSC"], tags: ["Color: black"] },
  { id: "pan-thermometer", cat: "Kitchen", name: "ThermoWorks Industrial IR Gun infrared thermometer (IR-GUN-S)",
    price: 51.35, tracked: true, shop: ["ThermoWorks", "https://www.thermoworks.com/products/ir-gun-s"], tags: ["Color: yellow and charcoal", "Shipping is extra"] },
  { id: "steak-weight", cat: "Kitchen", name: "The Chef's Press, 13 oz",
    price: 27, tracked: true, shop: ["The Chef's Press", "https://www.thechefspress.com/shop/p/13-oz-chefs-press"], tags: ["Just one"] },
  { id: "blender", cat: "Kitchen", name: "Braun MultiQuick 7 immersion blender with chopper and whisk, MQ7035",
    price: 79.95, list: 109.95, tracked: true, shop: ["Amazon", A + "B085FRKBMF"], tags: ["Color: black"] },
  { id: "fryer", cat: "Kitchen", name: "T-fal deep fryer with basket and oil filtration, 3.5 L",
    price: 104.44, list: 149.99, tracked: true, shop: ["Amazon", A + "B00NQ7QFGM"], tags: [] },

  { id: "cat-tree", cat: "Pets", name: "Feandrea 66.1-inch large cat tower",
    price: 59.49, list: 69.99, tracked: true, shop: ["Amazon", A + "B09YLP5F38"], tags: ["Color: light gray"] },
  { id: "cat-harness", cat: "Pets", name: "Voyager Step-In cat harness with leash",
    price: 12.06, list: 13.99, tracked: true, shop: ["Amazon", A + "B0CLVQQ897"], tags: ["Color: black", "Size: S (chest 15 to 18 in)"] },
  { id: "pet-puzzle", cat: "Pets", name: "Nina Ottosson Dog Brick treat puzzle",
    price: 11.02, list: 20.99, tracked: true, shop: ["Amazon", A + "B0711Y9XTF"], tags: [] },
  { id: "dog-egg", cat: "Pets", name: "Jolly Pets Jolly Egg herding dog toy",
    price: 13.99, tracked: true, shop: ["Amazon", A + "B005AFHOZE"], tags: ["Color: yellow", "Size: Medium (8 in)"] },
];
const BASE_DATE = Date.parse("2026-11-26T08:50:00Z");   // when the prices above were read from the shops
const PRICES_URL = "https://raw.githubusercontent.com/Kimikari/kimis-christmas-list/data/prices.json";
// The shared "already bought" list: one small public text record, {"<id>": <time it was marked>}.
const STORE_READ = "https://textdb.online/kimis-xmas-bought-q7w3k9x2";
const STORE_WRITE = "https://textdb.online/update";
const STORE_KEY = "kimis-xmas-bought-q7w3k9x2";

const $ = id => document.getElementById(id);
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
const usd = n => "$" + (Number.isInteger(n) ? String(n) : n.toFixed(2));
const lsGet = k => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } };
const calm = matchMedia("(prefers-reduced-motion: reduce)");
let sayT = 0;
const say = text => { clearTimeout(sayT); $("live").textContent = ""; sayT = setTimeout(() => { $("live").textContent = text; }, 50); };
const ago = t => {
  const m = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (m < 1) return "just now";
  if (m < 60) return m + " min ago";
  if (m < 60 * 36) return Math.round(m / 60) + " h ago";
  return Math.round(m / 1440) + " days ago";
};

/* ---------- State ---------- */
const byId = new Map(ITEMS.map(it => [it.id, it]));
const view = new Map();        // id -> the card's parts
let bought = {};               // id -> +time it was marked bought, or -time it was un-marked, as last read from the shared list
let storeOk = null;            // null: not read yet, true/false: the last read worked or not
let readNo = 0;                // counts reads and saves, so that an older read cannot undo a newer save on screen
let kimi = lsGet("xmas-kimi") === "1";
let filterCat = "All", sortBy = "off";
let kimiAsk = 0, kimiAt = 0;   // the "tap again" question of the Kimi button
// Where the tracker reads an item's price: the Amazon product number, or the shop's page.
// A tracked price that was read from another page (an earlier pick under the same id) is not used.
const srcOf = it => (it.shop[1].startsWith(A) ? it.shop[1].slice(A.length) : it.shop[1]);
const priceAt = new Map();     // id -> time its price was read
for (const it of ITEMS) priceAt.set(it.id, BASE_DATE);
// What this device marked itself (id -> +time or -time), to put a mark back when the shared list lost it.
let mine = {};
try { mine = JSON.parse(lsGet("xmas-mine")) || {}; } catch { mine = {}; }
if (typeof mine !== "object" || Array.isArray(mine)) mine = {};
const putBack = new Map();     // id -> how often this page put a lost mark back

const round2 = n => Math.round(n * 100) / 100;
const total = it => round2(it.price * (it.qty || 1));
const totalList = it => (it.list && it.list > it.price ? round2(it.list * (it.qty || 1)) : null);
const pctOff = it => { const l = totalList(it); return l ? Math.round((1 - total(it) / l) * 100) : 0; };
const isBought = id => !kimi && bought[id] > 0;

/* ---------- Cards ----------
   List.js (lib/list.min.js, by Jonny Strömberg) makes one card per gift: a copy of the card template in
   index.html (id "card-tpl"), with the name, the category, the shop's name and the shop's link filled in. It also puts the
   cards in order and takes the filtered ones out of the page. The names it fills in are this page's own
   texts from ITEMS, never text from the network (List.js writes them as HTML).
   The class names that are not Bootstrap's ("name", "buy", "got", "msg", ...) are plain hooks without a style. */
const list = new List("gifts", {
  item: "card-tpl",
  valueNames: ["name", "cat", "shopname", { name: "buy", attr: "href" }, { data: ["id"] }],
}, ITEMS.map((it, i) => ({ id: it.id, i, name: it.name, cat: it.cat, shopname: it.shop[0], buy: it.shop[1] })));
const itemOf = li => byId.get(li.values().id);
// The rest of a card is specific to this list: its photo, its size and color notes, and the parts that change.
function wire(li) {
  const it = itemOf(li), col = li.elm, q = c => col.querySelector("." + c);
  const img = q("photo").querySelector("img"), box = img.parentNode;
  img.addEventListener("error", () => { box.textContent = "🎁"; box.classList.add("fs-1"); });
  img.src = "img/" + it.id + ".jpg";
  const tags = q("tags");
  for (const t of it.tags) tags.append(el("li", "list-group-item px-0 py-1", t));
  if (!it.tags.length) tags.remove();
  // shop: the parts that are only shown while the gift can still be bought
  const v = { col, card: q("card"), off: q("off"), cat: q("cat"), wrapped: q("wrapped"), now: q("now"), was: q("was"), wasnum: q("wasnum"),
    waslabel: q("waslabel"), save: q("save"), prime: q("prime"), fresh: q("fresh"), got: q("got"), msg: q("msg"),
    shop: [q("photo"), q("prices"), q("fresh"), tags, q("buy")], armed: 0, want: false, busy: false };
  v.got.addEventListener("click", () => onGot(it, v));
  view.set(it.id, v);
  paintPrice(it); paintBought(it);
}
list.on("updated", l => { $("empty").hidden = l.visibleItems.length > 0; });

function paintPrice(it) {
  const v = view.get(it.id), l = totalList(it), p = pctOff(it), ap = it.approx ? "≈" : "";
  v.now.textContent = ap + usd(total(it));
  v.off.hidden = !(p >= 5) || isBought(it.id);
  v.off.textContent = "-" + p + "%";
  v.was.hidden = v.save.hidden = !l;
  if (l) {
    v.wasnum.textContent = usd(l);
    v.waslabel.textContent = it.listLabel === "typical" ? "typical price" : it.listLabel === "noprime" ? "without Prime" : "list price";
    v.save.textContent = "save " + ap + usd(round2(l - total(it)));
  }
  v.prime.hidden = !it.prime;
  if (it.tracked) {
    const t = priceAt.get(it.id), old = Date.now() - t > 26 * 3600e3;
    v.fresh.textContent = "Price read from the shop " + ago(t) + (old ? ": look before you buy" : "");
  } else v.fresh.textContent = "Not tracked: see the shop for today's price";
}

// A bought gift is a red card that shows only its name: no photo, no price, no shop button.
function paintBought(it) {
  const v = view.get(it.id), b = isBought(it.id), ask = v.armed > 0 && !v.busy;
  for (const k of ["bought", "bg-danger", "text-white"]) v.card.classList.toggle(k, b);
  for (const n of v.shop) n.hidden = b;
  v.off.hidden = b || !(pctOff(it) >= 5);
  v.wrapped.hidden = !b;
  v.cat.classList.toggle("text-white", b); v.cat.classList.toggle("text-muted", !b);
  v.msg.className = "msg small mb-0 " + (b ? "text-white" : "text-danger");
  v.got.hidden = kimi;
  v.got.className = "got btn " + (b ? (ask ? "btn-warning" : "btn-light") : (ask ? "btn-danger" : "btn-outline-danger"));
  v.got.disabled = v.busy;
  if (v.busy) v.got.textContent = "Saving…";
  else if (v.armed) v.got.textContent = v.want ? "Tap again: yes, I bought it" : "Tap again: it is NOT bought";
  else v.got.textContent = b ? "Marked by mistake? Undo" : "🎁 I bought this";
}

/* ---------- Bought: the shared list ---------- */
const pause = ms => new Promise(r => setTimeout(r, ms));
// Fetches a text with one time limit for the whole answer, its body included.
const timed = async (url, opt = {}) => {
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 12000);
  try {
    const r = await fetch(url, { ...opt, signal: ctl.signal });
    return { ok: r.ok, status: r.status, text: await r.text() };
  } finally { clearTimeout(t); }
};
// Keeps everything that can be a mark: a short name with a number. Gifts this page does not know are kept too
// (a newer version of the page may know them), so that saving from an old open tab does not delete them.
function tidy(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("not a list");
  const out = {};
  if (Object.keys(raw).length > 200) throw new Error("too long");
  for (const [k, t] of Object.entries(raw))
    if (k.length <= 40 && typeof t === "number" && Number.isFinite(t) && t !== 0) out[k] = t;
    else throw new Error("not a mark");   // an error text from the service, for one: not our list
  return out;
}
// Throws when the list cannot be read or is not what it should be: a bad read never counts as "nothing is bought".
// An empty answer is a bad read too: the list always holds text (an undone mark stays in it as a negative time).
async function readStore() {
  const r = await timed(STORE_READ + "?t=" + Date.now(), { cache: "no-store" });
  if (!r.ok) throw new Error("read " + r.status);
  const text = r.text.trim();
  if (!text) throw new Error("empty");
  return tidy(JSON.parse(text));
}
async function writeStore(data) {
  tidy(data);                             // never write what this page would refuse to read
  const body = new URLSearchParams({ key: STORE_KEY, value: JSON.stringify(data) });
  const r = await timed(STORE_WRITE, { method: "POST", body });
  if (!r.ok) throw new Error("write " + r.status);
  const j = JSON.parse(r.text);
  if (!j || j.status !== 1) throw new Error("write refused");
}
// Change one gift: read the newest list, change that gift only, write, then read back twice to see that it stuck
// (someone saving another gift at the same moment can overwrite it a second later).
// still(list), when given, is asked on each fresh list whether the change is still wanted (putting a lost mark back).
// Gives back the list as last read and the time that was written.
async function saveMark(id, value, still) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const data = await readStore();
    if (still && !still(data)) return { back: data, value };
    // A tap, and the fresh list says someone already did just that: write nothing, and say so.
    if (!still && attempt === 0 && (data[id] > 0) === (value > 0) && data[id]) return { back: data, value, same: true };
    const there = Math.abs(data[id] || 0);
    if (there > Math.abs(value)) {
      if (attempt > 0) return { back: data, value };   // someone changed this gift after our write: theirs counts
      value = Math.sign(value) * (there + 1);          // a tap now is the newest choice, whatever the other clock says
    }
    data[id] = value;
    await writeStore(data);
    if (!still) { mine[id] = value; lsSet("xmas-mine", JSON.stringify(mine)); }   // ours from now on, even if the check below fails
    await pause(600 + attempt * 600);
    let back = await readStore();
    if (back[id] === value) { await pause(2500); back = await readStore(); }
    if (back[id] === value || Math.abs(back[id] || 0) > Math.abs(value)) return { back, value };
  }
  throw new Error("did not stick");
}
// One save at a time on this device.
let chain = Promise.resolve();
const queued = job => { const p = chain.then(job); chain = p.catch(() => {}); return p; };
// A newer time in the list is someone's later choice: this device's older mark is over and is never put back.
function retire(list) {
  let any = false;
  for (const id of Object.keys(mine)) if (Math.abs(list[id] || 0) > Math.abs(mine[id])) { delete mine[id]; any = true; }
  if (any) lsSet("xmas-mine", JSON.stringify(mine));
}
const took = back => { readNo++; bought = back; storeOk = true; retire(back); };
function setMark(id, on) {
  return queued(async () => {
    const r = await saveMark(id, on ? Date.now() : -Date.now());
    took(r.back);
    return r;
  });
}

async function onGot(it, v) {
  if (v.busy || kimi) return;
  v.msg.textContent = "";
  if (v.armed && Date.now() - v.armedAt > 8500) { clearTimeout(v.armed); v.armed = 0; }   // the question is too old (the phone slept)
  if (!v.armed) {                       // first tap: ask, and remember what was asked
    v.want = !isBought(it.id);
    v.armedAt = Date.now();
    v.armed = setTimeout(() => { v.armed = 0; paintBought(it); }, 8000);
    paintBought(it);
    return;
  }
  if (Date.now() - v.armedAt < 500) return;   // a double tap by accident is not a yes
  clearTimeout(v.armed); v.armed = 0;
  if (isBought(it.id) === v.want) {     // someone else did it meanwhile
    paintBought(it);
    v.msg.textContent = v.want ? "Someone else just marked this as bought. If you ordered it too, tell the family." : "Someone else just un-marked this.";
    return;
  }
  const on = v.want;
  v.busy = true; paintBought(it);
  try {
    const r = await setMark(it.id, on);
    v.busy = false;
    paintAll();
    if (kimi) { /* Kimi mode was turned on meanwhile: show nothing */ }
    else if (r.same) v.msg.textContent = on ? "Someone else already marked this as bought. If you ordered it too, tell the family." : "Someone else already un-marked this.";
    else if (isBought(it.id) !== on) v.msg.textContent = "Someone else changed this gift at the same moment. Look at the card and try again if it is wrong.";
    else if (on) { celebrate(v.card); say(it.name + " is marked as bought for everyone."); }
    else say(it.name + " is no longer marked as bought.");
    setTimeout(refreshBought, 4000);
  } catch {
    v.busy = false; paintBought(it);
    const m = v.msg.textContent = kimi ? "" : "Couldn't confirm it saved. Wait a moment: if the card doesn't change, try again, or tell the family yourself.";
    setTimeout(async () => { await refreshBought(); if (isBought(it.id) === on && v.msg.textContent === m) v.msg.textContent = ""; }, 2500);
  }
}

async function refreshBought() {
  if (document.hidden) return;
  const no = ++readNo;
  let data;
  try { data = await readStore(); }
  catch { if (no === readNo) { storeOk = false; paintAll(); } return; }
  if (no !== readNo) return;            // a save or a newer read finished meanwhile
  bought = data; storeOk = true; retire(data);
  paintAll();
  // Put back a mark of this device that the shared list lost (two people saving at the same moment).
  for (const [id, mark] of Object.entries(mine)) {
    if (!byId.has(id) || typeof mark !== "number") continue;
    // Lost: the list holds an older time for this gift, or none. A newer time is someone's later choice and stays.
    const lost = list => mine[id] === mark && Math.abs(list[id] || 0) < Math.abs(mark);
    if (!lost(data)) continue;
    const n = putBack.get(id) || 0;
    if (n >= 3) continue;
    putBack.set(id, n + 1);
    queued(() => saveMark(id, mark, lost)).then(r => { took(r.back); paintAll(); }, () => {});
  }
}

/* ---------- Prices ---------- */
let checkedAt = null, readCount = "";
const okPrice = n => typeof n === "number" && Number.isFinite(n) && n > 0 && n < 5000;
async function refreshPrices() {
  if (document.hidden) return;
  try {
    const r = await timed(PRICES_URL + "?t=" + Math.floor(Date.now() / 240000), { cache: "no-cache" });
    if (!r.ok) throw new Error(r.status);
    const data = JSON.parse(r.text);
    const soon = Date.now() + 600000;   // a time in the future is not believed
    for (const [id, p] of Object.entries((data && data.items) || {})) {
      const it = byId.get(id);
      if (!it || !it.tracked || !p || typeof p !== "object") continue;
      const at = Date.parse(p.at);
      if (p.src !== srcOf(it) || !okPrice(p.price) || !(at <= soon) || at < priceAt.get(id)) continue;
      it.price = p.price;
      it.list = okPrice(p.list) && p.list > p.price ? p.list : null;
      it.listLabel = ["typical", "noprime"].includes(p.listLabel) ? p.listLabel : "list";
      it.prime = p.prime === true;
      priceAt.set(id, at);
    }
    const c = Date.parse(data && data.checkedAt);
    if (c <= soon && c >= BASE_DATE) {
      checkedAt = c;
      readCount = Number.isInteger(data.ok) && Number.isInteger(data.failed) ? ` It read ${data.ok} of ${data.ok + data.failed} prices.` : "";
    }
  } catch { /* keep the prices we have */ }
  paintAll();
}

/* ---------- Painting the page ---------- */
function shown(it) {
  if (filterCat !== "All" && it.cat !== filterCat) return false;
  const max = Number($("budget").value);
  return max >= Number($("budget").max) || total(it) <= max;
}
// Filters the cards and puts them in order, bought ones last: List.js does both, by the rules given here.
// List.js takes every card out of the page and puts it back, so this is only called on load and when the
// visitor changes the category, the budget or the order, never by a background refresh: a card must not move
// under a finger. So a gift whose tracked price rises above the chosen budget stays until the next such change.
function reorder() {
  list.filter(li => shown(itemOf(li)));
  list.sort("i", { sortFunction: (a, b) => {
    const x = itemOf(a), y = itemOf(b);
    return isBought(x.id) - isBought(y.id)
      || (sortBy === "off" ? pctOff(y) - pctOff(x) : sortBy === "low" ? total(x) - total(y) : sortBy === "high" ? total(y) - total(x) : 0)
      || a.values().i - b.values().i;
  } });
}
let sortedOnce = false;
let touched = false;           // the visitor has started to use the page (a finger scrolling counts)
for (const e of ["touchstart", "pointerdown", "wheel", "keydown"]) addEventListener(e, () => { touched = true; }, { once: true, passive: true });
function paintAll() {
  for (const it of ITEMS) { paintPrice(it); paintBought(it); }
  // Sorted once, at the first answer. If that one failed, or the visitor is already using the page, the cards
  // stay where they are: no jump under a finger.
  if (!sortedOnce && storeOk !== null) {
    sortedOnce = true;
    const inUse = touched || $("grid").contains(document.activeElement) || [...view.values()].some(v => v.armed || v.busy);
    if (storeOk && !inUse) reorder();
  }

  const n = ITEMS.filter(it => isBought(it.id)).length;
  $("track").hidden = kimi || storeOk !== true;
  const pct = (n / ITEMS.length) * 100;
  $("fill").style.width = pct + "%";
  $("fill").setAttribute("aria-valuenow", String(n));
  $("fill").setAttribute("aria-valuemax", String(ITEMS.length));
  $("trackText").textContent = n === ITEMS.length ? "Every gift is wrapped. Merry Christmas! 🎉"
    : n ? `${n} of ${ITEMS.length} gifts wrapped` : `0 of ${ITEMS.length} gifts wrapped. Be the first!`;

  const banner = $("banner");
  banner.hidden = false;
  if (kimi) $("bannerText").textContent = "Kimi mode: what's already bought is hidden on this device. No peeking! 🙈";
  else if (storeOk === null) $("bannerText").textContent = "Checking what's already bought…";
  else if (storeOk === false) $("bannerText").textContent = "Can't reach the shared list right now, so this page can't show what is already bought. Ask before you buy.";
  else banner.hidden = true;
  $("kimiBtn").setAttribute("aria-pressed", String(kimi));
  $("kimiBtn").classList.toggle("active", kimi);
  $("kimiBtn").textContent = kimi ? "🙈 Kimi mode is ON: tap to show what's bought"
    : kimiAsk ? "Only Kimi! Tap again to hide what's bought on this device" : "🙈 I'm Kimi: hide what's bought";
  $("sub").hidden = kimi;

  const when = t => new Date(t).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  $("priceNote").textContent = checkedAt
    ? `The price tracker last ran ${ago(checkedAt)} (${when(checkedAt)}).${readCount}`
    : `Prices were read from the shops on ${when(BASE_DATE)}.`;
}

/* ---------- Controls ---------- */
// The category buttons are Bootstrap's radio button group, written out in index.html.
const catNow = () => { const r = $("chips").querySelector("input:checked"); return r ? r.value : "All"; };
$("chips").addEventListener("change", () => {
  filterCat = catNow(); reorder(); paintAll();
  const r = $("chips").querySelector("input:checked");   // chosen with the arrow keys: bring its button into view
  if (r) r.nextElementSibling.scrollIntoView({ block: "nearest", inline: "nearest" });
});
function paintBudget() {
  const b = $("budget");
  $("budgetOut").textContent = Number(b.value) >= Number(b.max) ? "any" : "≤ $" + b.value;
}
$("budget").addEventListener("input", () => { paintBudget(); reorder(); paintAll(); });
$("sort").addEventListener("change", e => { sortBy = e.target.value; reorder(); paintAll(); });
$("santa").addEventListener("click", () => {
  const pool = list.visibleItems.map(itemOf).filter(it => !isBought(it.id));
  if (!pool.length) { say("Nothing left to pick with these filters."); return; }
  const it = pool[Math.floor(Math.random() * pool.length)], c = view.get(it.id).card;
  c.scrollIntoView({ block: "center", behavior: calm.matches ? "auto" : "smooth" });
  const ring = ["border", "border-warning", "border-3"];   // Bootstrap's yellow border marks the pick for a moment
  c.classList.add(...ring);
  clearTimeout(c.ringT); c.ringT = setTimeout(() => c.classList.remove(...ring), 3000);
  say("Santa picked: " + it.name + ", " + usd(total(it)));
});
$("kimiBtn").addEventListener("click", () => {
  if (!kimi && !kimiAsk) {              // turning it on takes two taps: with it on, a gift can be bought twice
    kimiAt = Date.now();
    kimiAsk = setTimeout(() => { kimiAsk = 0; paintAll(); }, 6000);
    paintAll();
    return;
  }
  if (!kimi && Date.now() - kimiAt < 500) return;
  clearTimeout(kimiAsk); kimiAsk = 0;
  kimi = !kimi;
  if (kimi) {                           // leave nothing on screen that tells what was bought
    clearTimeout(sayT); $("live").textContent = "";
    for (const v of view.values()) { v.msg.textContent = ""; clearTimeout(v.armed); v.armed = 0; }
  }
  lsSet("xmas-kimi", kimi ? "1" : "0"); reorder(); paintAll(); });

/* ---------- Fun: three libraries written by people (see CREDITS.txt), only switched on here ---------- */
// Confetti: canvas-confetti by Kiril Vatev
function burst(node, n) {
  if (!window.confetti) return;
  const r = node.getBoundingClientRect();
  const y = Math.max(60, Math.min(innerHeight - 60, r.top + r.height / 3));
  confetti({ particleCount: n, spread: 80, origin: { x: (r.left + r.width / 2) / innerWidth, y: y / innerHeight },
    colors: ["#dc3545", "#198754", "#ffc107", "#ffffff"], disableForReducedMotion: true });
}
const celebrate = card => burst(card, 90);
$("tree").addEventListener("click", e => burst(e.currentTarget, 40));

// Countdown: countdown.js by Stephen M. McKamey
function paintCount() {
  const now = new Date(), box = $("count");
  if (now.getMonth() === 11 && now.getDate() === 25) { box.textContent = "🎅 Merry Christmas!"; return; }
  let xmas = new Date(now.getFullYear(), 11, 25);
  if (now > xmas) xmas = new Date(now.getFullYear() + 1, 11, 25);
  if (!window.countdown) { box.textContent = Math.ceil((xmas - now) / 864e5) + " days until Christmas"; return; }
  const left = countdown(now, xmas, countdown.DAYS | countdown.HOURS | countdown.MINUTES).toString();
  box.textContent = (left || "A few seconds") + " until Christmas";
}

// Snow: Snowstorm by Scott Schiller. It starts by itself when the page has loaded, unless it is told not to here.
let snowOn = lsGet("xmas-snow") !== "0";
const storm = window.snowStorm;
if (storm) {
  const small = innerWidth < 700;
  storm.excludeMobile = false;          // phones too, but with fewer flakes
  storm.flakesMax = small ? 40 : 96;
  storm.flakesMaxActive = small ? 28 : 64;
  storm.followMouse = false;
  storm.snowStick = false;
  storm.usePositionFixed = true;        // the snow stays on screen while the page scrolls
  storm.scrollHandler = function () {}; // so the scroll position must not be added to how far a flake falls
  storm.className = "pe-none";          // Bootstrap's "no pointer events": a flake never takes a tap meant for a button
}
function runSnow() {
  const want = snowOn && !calm.matches;
  $("snowBtn").classList.toggle("active", want);
  $("snowBtn").setAttribute("aria-pressed", String(want));
  $("snowBtn").disabled = calm.matches;
  $("snowBtn").textContent = calm.matches ? "❄️ Snow (off: your device asks for less motion)" : "❄️ Snow";
  if (!storm) return;
  if (!storm.flakes.length) {           // not snowing yet: allow or forbid the start
    storm.disabled = !want;
    if (want && document.readyState === "complete") { storm.start(); hush(); }
  } else if (Boolean(storm.active) !== want) storm.toggleSnow();
}
// A screen reader should not read the flakes out.
function hush() { if (storm) for (const f of storm.flakes) f.o.setAttribute("aria-hidden", "true"); }
addEventListener("load", () => setTimeout(hush, 500));
$("snowBtn").addEventListener("click", () => { snowOn = !snowOn; lsSet("xmas-snow", snowOn ? "1" : "0"); runSnow(); });
calm.addEventListener("change", runSnow);

/* ---------- Start ---------- */
for (const li of list.items) wire(li);
sortBy = $("sort").value || "off";   // a browser may bring back the choices of the last visit
filterCat = catNow();
reorder();
paintBudget(); paintCount(); runSnow(); paintAll();
refreshBought(); refreshPrices();
setInterval(refreshBought, 45000);
setInterval(refreshPrices, 5 * 60000);
setInterval(() => { if (!document.hidden) { paintCount(); for (const it of ITEMS) paintPrice(it); } }, 60000);
addEventListener("pageshow", e => { if (e.persisted) { refreshBought(); refreshPrices(); } });   // back from the shop
document.addEventListener("visibilitychange", () => { if (!document.hidden && storm && storm.active) storm.resume();   // back from the shop: snow again
  if (!document.hidden) { refreshBought(); refreshPrices(); paintCount(); } });
