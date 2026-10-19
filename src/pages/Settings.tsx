import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import TopNavbar from "@/components/Navbar/TopNavbar";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import Button from "@/components/Button";
import { Alert, Card, Field, PageShell, SelectField, TextArea } from "@/components/Field";
import { getSettings, saveSettings, TSettings } from "@/api/privacy";

const modeOptions: [string, string][] = [["off", "Off (not collected)"], ["optional", "Optional"], ["required", "Required (adults only)"]];

/** Admin settings: organisation details (PO buyer), ID-proof / photo collection, retention. */
const Settings = () => {
  const s = useSignal<TSettings | null>(null);
  const error = useSignal("");
  const ok = useSignal("");

  useEffect(() => {
    getSettings().then((v) => (s.value = v)).catch((e) => (error.value = e.message));
  }, []);

  const submit = async (e: Event) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget as HTMLFormElement);
    const g = (k: string) => String(f.get(k) ?? "");
    error.value = ok.value = "";
    try {
      s.value = await saveSettings({
        org: { name: g("org_name"), address: g("org_address"), gstin: g("org_gstin"), email: g("org_email"), phone: g("org_phone") },
        id_proof_mode: g("id_proof_mode") as any,
        photo_mode: g("photo_mode") as any,
        id_doc_retention_days: Number(g("id_doc_retention_days")),
        inactive_file_retention_days: Number(g("inactive_file_retention_days")),
        po_prefix: g("po_prefix"),
      });
      ok.value = "Settings saved.";
    } catch (err: any) {
      error.value = err.message;
    }
  };

  const v = s.value;
  return (
    <div className="flex flex-col items-center p-4 w-full bg-sand min-h-screen">
      <TopNavbar />
      <PageShell title="Settings">
        {!v ? (error.value ? <Alert>{error.value}</Alert> : <p role="status">Loading…</p>) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Card title="Organisation (buyer on purchase orders)">
              <Field id="org_name" label="Organisation name" required defaultValue={v.org.name} maxLength={120} autocomplete="organization" />
              <TextArea id="org_address" label="Address" defaultValue={v.org.address} maxLength={400} />
              <Field id="org_gstin" label="GSTIN (optional)" defaultValue={v.org.gstin} maxLength={15} hint="15 characters, e.g. 21ABCDE1234F1Z5" />
              <div className="grid sm:grid-cols-2 gap-3">
                <Field id="org_email" label="Email (optional)" type="email" defaultValue={v.org.email} />
                <Field id="org_phone" label="Phone (optional)" type="tel" defaultValue={v.org.phone} />
              </div>
              <Field id="po_prefix" label="PO number prefix" defaultValue={v.po_prefix} maxLength={10} hint="PO numbers look like PREFIX-2026-0001" />
            </Card>
            <Card title="Member data collection">
              <p className="text-sm text-ink-2">Collect as little as possible. ID proof is never collected for members under 18, and a photo is never required for them.</p>
              <SelectField id="id_proof_mode" label="ID proof" defaultValue={v.id_proof_mode} options={modeOptions} />
              <SelectField id="photo_mode" label="Member photo" defaultValue={v.photo_mode} options={modeOptions} />
              <div className="grid sm:grid-cols-2 gap-3">
                <Field id="id_doc_retention_days" label="Delete ID-proof images after (days)" type="number" min={1} max={3650} defaultValue={v.id_doc_retention_days} required />
                <Field id="inactive_file_retention_days" label="Delete files of deactivated members after (days)" type="number" min={1} max={3650} defaultValue={v.inactive_file_retention_days} required />
              </div>
            </Card>
            {error.value ? <Alert>{error.value}</Alert> : null}
            {ok.value ? <Alert kind="ok">{ok.value}</Alert> : null}
            <div><Button type="submit">Save settings</Button></div>
          </form>
        )}
      </PageShell>
      <BottomNavbar />
    </div>
  );
};

export default Settings;
