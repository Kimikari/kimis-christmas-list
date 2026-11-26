// Reads the current price of every tracked gift and writes prices.json.
// Run: node tools/prices.mjs <path to prices.json>
// It keeps the last good price of an item when a shop does not answer or the price looks wrong,
// and never writes a guess.
import { readFile, writeFile } from "node:fs/promises";

const OUT = process.argv[2] || "prices.json";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

// id (the same ids as in index.html) -> where the price is read
const TRACKED = {
  "side-pillow": { asin: "B00EINBSEW" },
  "body-pillow": { url: "https://www.sleepnumber.com/products/cool-comfortfit-body-pillow" },
  "headset": { asin: "B0BY1FXC9N" },
  "mic": { asin: "B0BMFQP2ZZ" },
  "boots": { asin: "B0G4F2XKCR" },
  "coat": { asin: "B0CLR9F8TF" },
  "gloves": { asin: "B0FXVXMW5Z" },
  "hat": { asin: "B002G9UDYG" },
  "face-mask": { asin: "B0848XF4TC" },
  "lined-pants": { asin: "B088856W2V" },
  "socks": { url: "https://darntough.com/products/mens-merino-wool-light-hiker-micro-crew-cushioned-lightweight-hiking-socks" },
  "towels": { asin: "B00UABQ5J4" },
  "sharpener": { asin: "B0CGGVHBQG" },
  "breading-trays": { asin: "B079Q1GT7H" },
  "fryer": { asin: "B00NQ7QFGM" },
  "cat-tree": { asin: "B09YLP5F38" },
  "cat-harness": { asin: "B0CLVQQ897" },
  "pet-puzzle": { asin: "B0711Y9XTF" },
  "cat-dancer": { asin: "B00Y7ZLE0Y" },
  "dog-kong": { asin: "B000GUDZO2" },
  "dog-ball": { asin: "B000F4AVPA" },
};

const sleep = ms => new Promise(r => setTimeout(r, ms));
const money = s => { const n = Number(String(s).replace(/,/g, "")); return Number.isFinite(n) && n > 0 && n < 5000 ? n : null; };

async function get(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 20000);
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "en-US" }, signal: ctl.signal });
    return { status: r.status, text: await r.text() };
  } finally { clearTimeout(timer); }
}

function parseAmazon(html) {
  if (/captcha/i.test(html) && html.length < 20000) return { error: "captcha" };
  // The page lists its offers as data, each with a price and whether it is new or used (Amazon Resale).
  // Only the new one counts: a used offer is cheaper and would show a discount nobody gets.
  let fresh = null, withPrime = null;
  for (const m of html.matchAll(/"priceAmount":([0-9.]+)[^{}]*?"buyingOptionType":"([A-Z_]+)"/g)) {
    if (m[2] === "NEW" && fresh == null) fresh = money(m[1]);
    if (m[2] === "PRIME_SAVINGS_UPSELL" && withPrime == null) withPrime = money(m[1]);
  }
  const toPay = html.match(/priceToPay[^>]*class="aok-offscreen">\s*\$([0-9.,]+)/);
  const shown = toPay ? money(toPay[1]) : null;
  const price = fresh != null ? fresh : shown;
  if (price == null) return { error: "no price for a new one on the page" };
  const out = { price, via: fresh != null ? (shown === fresh ? "new+shown" : "new") : "shown" };
  const basis = html.match(/apex-basisprice-label">\s*(List Price|Typical price):\s*<\/span>\s*<span[^>]*apex-basisprice-value[^>]*>\s*<span class="a-offscreen">\$([0-9.,]+)/);
  const list = basis && money(basis[2]);
  if (list && list > price) { out.list = list; out.listLabel = basis[1] === "List Price" ? "list" : "typical"; }
  // A lower price for Prime members: show that one, marked as needing Prime, against the price without Prime.
  if (withPrime != null && fresh != null && withPrime < fresh) {
    out.price = withPrime; out.prime = true;
    if (!(out.list > fresh)) { out.list = fresh; out.listLabel = "noprime"; }
  }
  return out;
}

// A shop page that describes its product in JSON-LD: the price of the Product's offer, in US dollars.
function parseJsonLd(html) {
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    let data;
    try { data = JSON.parse(m[1]); } catch { continue; }
    const nodes = [].concat(data && data["@graph"] ? data["@graph"] : data);
    for (const node of nodes) {
      if (!node || node["@type"] !== "Product") continue;
      for (const offer of [].concat(node.offers || [])) {
        if (!offer || (offer.priceCurrency && offer.priceCurrency !== "USD")) continue;
        const price = money(offer.price != null ? offer.price : offer.lowPrice);
        if (price != null) return { price };
      }
    }
  }
  return { error: "no product price on the page" };
}

let old = { items: {} };
try { old = JSON.parse(await readFile(OUT, "utf8")); } catch { /* first run */ }
const items = (old && typeof old.items === "object" && old.items) || {};

let ok = 0, failed = 0;
for (const [id, src] of Object.entries(TRACKED)) {
  let res;
  try {
    const page = await get(src.asin ? "https://www.amazon.com/gp/aw/d/" + src.asin : src.url);
    res = page.status !== 200 ? { error: "HTTP " + page.status } : src.asin ? parseAmazon(page.text) : parseJsonLd(page.text);
  } catch (e) { res = { error: String(e && e.message || e) }; }
  const from = src.asin || src.url;
  // The last price only counts as a comparison when it was read from the same product page.
  const last = items[id] && items[id].src === from && items[id].price;
  // A jump this large is far more often another offer on the page than a real price change.
  if (!res.error && last && (res.price < last * 0.4 || res.price > last * 2.5)) res = { error: `SUSPECT price ${res.price}` };
  if (res.error) { failed++; console.log(`${id}: FAILED (${res.error})` + (items[id] ? `, keeping ${items[id].price} from ${items[id].at}` : "")); }
  else { ok++; items[id] = { ...res, src: from, at: new Date().toISOString() }; console.log(`${id}: ${res.price}` + (res.list ? ` (${res.listLabel} ${res.list})` : "") + (res.prime ? " [Prime]" : "")); }
  await sleep(2000 + Math.random() * 2000);
}

// Drop ids that are no longer tracked.
for (const id of Object.keys(items)) if (!TRACKED[id]) delete items[id];

console.log(`${ok} read, ${failed} failed`);
if (ok === 0) { console.log("Nothing could be read: prices.json is left as it was."); process.exit(1); }
await writeFile(OUT, JSON.stringify({ checkedAt: new Date().toISOString(), ok, failed, items }, null, 1) + "\n");
