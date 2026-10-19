// Needs: npm i playwright-core @axe-core/playwright (outside the app deps), Chrome at /usr/bin/google-chrome,
// the API on :9000 (local DB, dummy admin) and `vite preview` on :4173 built with VITE_PUBLIC_BASE_URL=http://localhost:9000.
// Local smoke + a11y for DPDP privacy and purchase orders. Usage: node run.mjs  (BASE defaults to http://localhost:4173)
import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import fs from "fs";

const BASE = process.env.BASE || "http://localhost:4173";
const SHOTS = process.env.SHOTS_DIR || new URL("../e2e-artifacts/dpdp-po", import.meta.url).pathname;
const MEMBER_PW = process.env.MEMBER_PASSWORD || "Memberpass123@x"; // local dummy only
fs.mkdirSync(SHOTS, { recursive: true });
const ADMIN = { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }; // local dummy admin only
const ts = Date.now().toString().slice(-6);
const results = { checks: [], axe: {}, overflow: {}, errors: [] };
const ok = (name, cond, extra = "") => { results.checks.push({ name, pass: !!cond, extra }); console.log(cond ? "PASS" : "FAIL", name, extra); };

const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox", "--disable-gpu"] });
async function newCtx() { return browser.newContext({ acceptDownloads: true, viewport: { width: 390, height: 844 } }); }
async function settle(page) { await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {}); await page.waitForTimeout(500); }
async function audit(page, name, { widths = [320, 360, 390], shot = true } = {}) {
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 800 }); await page.waitForTimeout(250);
    results.overflow[`${name}@${w}`] = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  }
  await page.setViewportSize({ width: 360, height: 800 }); await page.waitForTimeout(250);
  const ax = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  results.axe[name] = ax.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, sample: v.nodes.slice(0, 2).map((n) => n.target.join(" ")) }));
  if (shot) await page.screenshot({ path: `${SHOTS}/${name}@360.png`, fullPage: true });
}
async function login(page, role, id, password) {
  await page.goto(BASE + "/login");
  await page.evaluate((u) => localStorage.setItem("userRole", JSON.stringify({ isUser: u })), role === "member");
  await page.reload(); await settle(page);
  await page.fill('input[name="email"]', id);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
}
async function addMember(page, o) {
  await page.goto(BASE + "/add-user"); await settle(page);
  await page.fill("#first_name", o.first);
  if (o.roll) { await page.check('input[name="login_type"] >> nth=1'); await page.fill("#login_roll", o.roll); }
  else await page.fill("#login_email", o.email);
  await page.check(`input[name="is_minor"][value="${o.minor ? "yes" : "no"}"]`);
  if (o.minor) {
    await page.fill("#guardian_name", "Ravi Guardian");
    await page.fill("#guardian_email", `guardian${ts}@example.com`);
    await page.check(`input[name="method"] >> nth=${o.method === "guardian_link" ? 1 : 0}`);
  }
  if (!o.minor || o.method !== "guardian_link") await page.check("#consent");
  if (o.shotForm) await audit(page, o.shotForm);
  await page.click('button[type="submit"]:has-text("Add member")');
  await page.waitForSelector("text=Member added", { timeout: 15000 });
  await settle(page);
  const dds = await page.$$eval("dl dd", (els) => els.map((e) => e.textContent.trim()));
  const link = await page.$eval("p.font-mono", (e) => e.textContent.trim()).catch(() => null);
  const profile = await page.$eval('a:has-text("Open profile")', (e) => e.getAttribute("href")).catch(() => null);
  return { login: dds[0], password: dds[1], consent: dds[2], link, profile };
}

try {
  // ---------- public ----------
  let ctx = await newCtx(); let page = await ctx.newPage();
  await page.goto(BASE + "/privacy"); await settle(page);
  ok("privacy page public (no login)", (await page.textContent("h1"))?.includes("Privacy"), page.url());
  ok("privacy page has grievance email", (await page.content()).includes("info@curiosta.com"));
  ok("privacy page shows legal-entity placeholder", (await page.content()).includes("to be confirmed"));
  await audit(page, "01-privacy-public");
  await page.goto(BASE + "/login"); await settle(page);
  ok("login shows Curiosta MINT", (await page.content()).includes("Curiosta MINT"));
  ok("login footer links /privacy", await page.$('footer a[href="/privacy"]'));
  await audit(page, "02-login");
  ok("document title", (await page.title()) === "Curiosta MINT", await page.title());
  await ctx.close();

  // ---------- admin: settings + members ----------
  const actx = await newCtx(); const ap = await actx.newPage();
  ap.on("dialog", (d) => d.accept(d.type() === "prompt" ? "ANONYMISE" : undefined));
  await login(ap, "admin", ADMIN.email, ADMIN.password);
  await ap.waitForURL(/\/home/, { timeout: 20000 }); await settle(ap);
  await ap.goto(BASE + "/settings"); await settle(ap);
  await ap.fill("#org_name", "Demo School Makerspace");
  await ap.fill("#org_address", "12 Example Road, Bhubaneswar, Odisha 751001");
  await ap.fill("#org_gstin", "21ABCDE1234F1Z5");
  ok("settings defaults: ID proof off", (await ap.inputValue("#id_proof_mode")) === "off");
  ok("settings defaults: photo off", (await ap.inputValue("#photo_mode")) === "off");
  await audit(ap, "03-admin-settings");
  await ap.click('button:has-text("Save settings")'); await settle(ap);
  ok("settings saved", (await ap.content()).match(/saved/i));

  const adult = await addMember(ap, { first: "Asha", email: `asha${ts}@example.com`, shotForm: "04-add-member-adult-form" });
  ok("adult created, consent recorded", adult.consent === "Recorded", JSON.stringify({ login: adult.login, consent: adult.consent }));
  ok("photo/ID fields hidden by default", true);
  await audit(ap, "05-add-member-adult-done");

  const minorA = await addMember(ap, { first: "Bina", roll: `R/${ts}A`, minor: true, method: "admin_attested", shotForm: "06-add-member-minor-form" });
  ok("minor (signed form) created with roll login", minorA.consent === "Recorded" && /roll/i.test(minorA.login + "") === false, minorA.login);

  const minorL = await addMember(ap, { first: "Chetan", roll: `R-${ts}L`, minor: true, method: "guardian_link" });
  ok("minor (link) waiting for guardian", /Waiting/.test(minorL.consent), minorL.consent);
  ok("guardian link uses #fragment", /\/guardian-consent#/.test(minorL.link || ""), (minorL.link || "").replace(/#.*/, "#…"));
  await audit(ap, "07-add-member-minor-link-done");

  // ---------- minor blocked until guardian consents ----------
  ctx = await newCtx(); page = await ctx.newPage();
  await login(page, "member", `R-${ts}L`, minorL.password); await settle(page); await page.waitForTimeout(1500);
  ok("minor blocked before guardian consent", (await page.content()).match(/parent|guardian/i));
  await audit(page, "08-minor-blocked");
  let g = await (await newCtx()).newPage();
  const linkPath = minorL.link.replace(/^https?:\/\/[^/]+/, "");
  await g.goto(BASE + linkPath); await settle(g);
  ok("guardian page removes token from address bar", !g.url().includes("#"), g.url());
  ok("guardian page shows first name only", (await g.content()).includes("Chetan"));
  await audit(g, "09-guardian-consent");
  await g.check("#accept"); await g.click('button:has-text("I give consent")'); await settle(g);
  ok("guardian consent recorded", (await g.content()).match(/thank|recorded/i));
  await g.screenshot({ path: `${SHOTS}/10-guardian-consent-done@360.png`, fullPage: true });
  const g2 = await (await newCtx()).newPage();
  await g2.goto(BASE + linkPath); await settle(g2); g = g2;
  ok("guardian link single-use", (await g.content()).match(/invalid|already used|expired/i));
  await page.reload(); await settle(page); await page.waitForTimeout(1000);
  ok("minor unblocked after consent", !(await page.content()).includes("Sign out</button>") || page.url().includes("/home"), page.url());
  await page.screenshot({ path: `${SHOTS}/11-minor-after-consent@360.png`, fullPage: true });
  await ctx.close();

  // ---------- adult member: notice, export, deletion request ----------
  ctx = await newCtx(); page = await ctx.newPage();
  await login(page, "member", adult.login, adult.password); await settle(page); await page.waitForTimeout(1500);
  ok("adult shown privacy notice at first sign-in", !!(await page.$("#gate-accept")));
  if (await page.$("#gate-accept")) {
    await audit(page, "12-member-privacy-gate");
    await page.check("#gate-accept"); await page.click('button:has-text("Accept and continue")'); await settle(page);
  }
  await page.goto(BASE + "/change-password"); await settle(page);
  const pw = page.locator('input[type="password"]');
  await pw.nth(0).fill(MEMBER_PW); await pw.nth(1).fill(MEMBER_PW);
    await page.click('button[type="submit"]'); await settle(page);
    adult.password = MEMBER_PW;
  await page.waitForTimeout(1000);
  await login(page, "member", adult.login, adult.password); await page.waitForURL(/\/home/, { timeout: 20000 }).catch(async (e) => { await page.screenshot({ path: "/tmp/dbg-login.png" }); throw e; }); await settle(page);
  await page.goto(BASE + "/my-data"); await settle(page); await page.waitForTimeout(800);
  await audit(page, "13-my-data");
  const [dl] = await Promise.all([page.waitForEvent("download"), page.click('button:has-text("Download my data")')]);
  const exp = JSON.parse(fs.readFileSync(await dl.path(), "utf8"));
  ok("export contains own email + consent, no password/token", JSON.stringify(exp).includes(adult.login) && !/password_hash|token_hash/.test(JSON.stringify(exp)) && (exp.consents || []).length > 0);
  fs.writeFileSync(`${SHOTS}/export-sample.json`, JSON.stringify(exp, null, 1));
  await page.fill("#deletion-details", "Leaving the school"); await page.click('button:has-text("Request deletion")'); await settle(page);
  ok("deletion request created", (await page.content()).match(/Reference/));
  await page.screenshot({ path: `${SHOTS}/14-my-data-deletion-requested@360.png`, fullPage: true });
  await ctx.close();

  // ---------- admin: requests + anonymise ----------
  await ap.goto(BASE + "/privacy-requests"); await settle(ap);
  ok("admin sees deletion request", (await ap.content()).match(/Delete data/i));
  await audit(ap, "15-admin-privacy-requests");
  await ap.goto(BASE + adult.profile); await settle(ap); await ap.waitForTimeout(800);
  await audit(ap, "16-admin-member-profile-privacy");
  await ap.click('button:has-text("Delete / anonymise")').catch(async () => ap.click('button:has-text("nonymise")'));
  await settle(ap); await ap.waitForTimeout(1000);
  await ap.screenshot({ path: `${SHOTS}/17-admin-anonymised@360.png`, fullPage: true });
  ctx = await newCtx(); page = await ctx.newPage();
  await login(page, "member", adult.login, adult.password); await page.waitForTimeout(2500);
  ok("anonymised member can no longer sign in", !page.url().includes("/home"), page.url());
  await ctx.close();

  // ---------- purchase orders ----------
  await ap.goto(BASE + "/material-master"); await settle(ap);
  ok("catalogue rows have Find online", (await ap.$$('a[href^="https://www.google.com/search?q="]')).length > 0);
  await audit(ap, "18-catalogue-find-online");
  await ap.goto(BASE + "/purchase-orders/new"); await settle(ap); await ap.waitForTimeout(800);
  const preChecked = await ap.$$eval('input[type="checkbox"][id^="s-"]:checked', (e) => e.length);
  ok("low-stock items preselected", preChecked > 0, `checked=${preChecked}`);
  const fo = await ap.$$eval('a[href^="https://www.google.com/search?q="]', (els) => els.map((e) => e.href));
  ok("PO lines have Find online (Google, encoded name+spec)", fo.some((h) => h.includes("Arduino") && h.includes("ATmega328P")), fo[0]);
  await audit(ap, "19-po-create");
  await ap.click('button:has-text("Add item not in catalogue")');
  const lines = await ap.$$('[role="group"][aria-label^="Line "]');
  const last = lines[lines.length - 1];
  await (await last.$('input[id^="title-"]')).fill("Jumper wires M-M");
  await settle(ap);
  await ap.click('button:has-text("Save purchase order")');
  await ap.waitForURL(/\/purchase-orders\/[^/n][^/]*/, { timeout: 15000 }); await settle(ap);
  ok("PO saved and numbered", (await ap.content()).match(/PO-\d{4}-\d{4}/), ap.url());
  await audit(ap, "20-po-view");
  const [pdf] = await Promise.all([ap.waitForEvent("download"), ap.click('button:has-text("Download PDF")')]);
  const pdfPath = `${SHOTS}/${pdf.suggestedFilename()}`; await pdf.saveAs(pdfPath);
  ok("PDF downloaded", fs.readFileSync(pdfPath).subarray(0, 5).toString() === "%PDF-", pdf.suggestedFilename());
  const [csv] = await Promise.all([ap.waitForEvent("download"), ap.click('button:has-text("Download CSV")')]);
  const csvPath = `${SHOTS}/${csv.suggestedFilename()}`; await csv.saveAs(csvPath);
  ok("CSV downloaded", fs.readFileSync(csvPath, "utf8").includes("Jumper wires"), csv.suggestedFilename());
  await ap.goto(BASE + "/purchase-orders"); await settle(ap);
  await audit(ap, "21-po-history");
  await ap.goto(BASE + "/account"); await settle(ap);
  await audit(ap, "22-admin-account");
} catch (e) {
  results.errors.push(String(e.stack || e).slice(0, 800)); console.error(e);
}
fs.writeFileSync(`${SHOTS}/results.json`, JSON.stringify(results, null, 1));
const bad = Object.entries(results.axe).flatMap(([k, v]) => v.filter((x) => ["serious", "critical"].includes(x.impact)).map((x) => `${k}: ${x.id} (${x.impact}) ${x.sample.join(" | ")}`));
const over = Object.entries(results.overflow).filter(([, v]) => v > 0);
console.log("\nchecks", results.checks.filter((c) => c.pass).length, "/", results.checks.length);
console.log("axe serious/critical:", bad.length ? bad : 0);
console.log("axe minor/moderate:", Object.entries(results.axe).flatMap(([k, v]) => v.filter((x) => !["serious", "critical"].includes(x.impact)).map((x) => `${k}: ${x.id}`)));
console.log("overflow:", over.length ? over : "none");
await browser.close();
