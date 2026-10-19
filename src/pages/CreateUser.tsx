import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import TopNavbar from "@/components/Navbar/TopNavbar";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import Button from "@/components/Button";
import ShortPrivacyNotice from "@/components/PrivacyNotice/Short";
import { Alert, Card, Field, PageShell, SelectField } from "@/components/Field";
import { createMember, getSettings, TSettings } from "@/api/privacy";
import { adminProtectedUploadFile } from "@/api/admin/upload/protectedUploadFile";
import { PRIVACY_NOTICE_VERSION } from "@/config/privacy";

/** Random temporary password from the Web Crypto API. Shown once, never stored. */
function genPassword(length = 12) {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%*";
  const buf = new Uint32Array(length);
  crypto.getRandomValues(buf);
  return Array.from(buf, (n) => chars[n % chars.length]).join("");
}

type Result = { login_id: string; password: string; consent_status: string; guardian_link: string | null; id: string };

/**
 * Add member, DPDP Act data minimisation: name + (email or roll number) + under-18 answer.
 * Members under 18 need a parent/guardian's consent (signed form recorded by staff, or a consent link).
 * Photo / ID proof only if the admin setting turns them on; never ID proof for minors.
 */
const CreateUser = () => {
  const settings = useSignal<TSettings | null>(null);
  const loginType = useSignal<"email" | "roll">("email");
  const minor = useSignal<"" | "yes" | "no">("");
  const method = useSignal<"admin_attested" | "guardian_link">("admin_attested");
  const photoKey = useSignal<string | null>(null);
  const idDoc = useSignal<{ idType: string; idNumber: string; idImageKey: string } | null>(null);
  const error = useSignal("");
  const busy = useSignal(false);
  const result = useSignal<Result | null>(null);
  const copied = useSignal("");

  useEffect(() => {
    getSettings().then((s) => (settings.value = s)).catch((e) => (error.value = e.message));
  }, []);

  const isMinor = minor.value === "yes";
  const photoMode = settings.value?.photo_mode ?? "off";
  const idMode = isMinor ? "off" : settings.value?.id_proof_mode ?? "off";

  const upload = async (file: File | undefined, kind: "photo" | "id", form?: HTMLFormElement) => {
    if (!file) return;
    error.value = "";
    try {
      const res = await adminProtectedUploadFile(file);
      const k = res?.uploads[0]?.key;
      if (kind === "photo") photoKey.value = k;
      else {
        const f = new FormData(form);
        idDoc.value = { idType: String(f.get("id_type") || "School/college ID card"), idNumber: String(f.get("id_number") || ""), idImageKey: k };
      }
    } catch (e: any) {
      error.value = e.message;
    }
  };

  const submit = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const f = new FormData(form);
    const g = (k: string) => String(f.get(k) ?? "").trim();
    error.value = "";
    if (!minor.value) return void (error.value = "Say whether the member is under 18.");
    const password = genPassword();
    busy.value = true;
    try {
      const r = await createMember({
        first_name: g("first_name"),
        last_name: g("last_name"),
        email: loginType.value === "email" ? g("login_email") : undefined,
        roll_number: loginType.value === "roll" ? g("login_roll") : undefined,
        password,
        is_minor: isMinor,
        notice_version: PRIVACY_NOTICE_VERSION,
        consent: f.get("consent") === "on",
        guardian: isMinor ? { name: g("guardian_name"), relation: g("guardian_relation"), email: g("guardian_email"), phone: g("guardian_phone") } : undefined,
        guardian_consent_method: isMinor ? method.value : undefined,
        profile_image_key: photoMode !== "off" ? photoKey.value : null,
        documents: idMode !== "off" && idDoc.value ? [idDoc.value] : [],
      });
      result.value = {
        id: r.customer.id,
        login_id: r.login_id,
        password,
        consent_status: r.consent_status,
        guardian_link: r.guardian_link_path ? `${window.location.origin}${r.guardian_link_path}` : null,
      };
    } catch (err: any) {
      error.value = err.message;
    } finally {
      busy.value = false;
    }
  };

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      copied.value = `${what} copied.`;
    } catch {
      copied.value = "Copy failed: select the text and copy it manually.";
    }
  };

  if (result.value) {
    const r = result.value;
    return (
      <div className="flex flex-col items-center p-4 w-full bg-sand min-h-screen">
        <TopNavbar />
        <PageShell title="Member added">
          <Alert kind="ok">The account is ready. Give these sign-in details to the member now: the password is not stored and won't be shown again.</Alert>
          <Card>
            <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted">Sign-in</dt><dd className="font-mono break-all">{r.login_id}</dd>
              <dt className="text-muted">Temporary password</dt><dd className="font-mono break-all">{r.password}</dd>
              <dt className="text-muted">Consent</dt><dd>{r.consent_status === "given" ? "Recorded" : "Waiting for parent/guardian"}</dd>
            </dl>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={() => copy(`Sign-in: ${r.login_id}\nPassword: ${r.password}`, "Sign-in details")}>Copy sign-in details</Button>
            </div>
          </Card>
          {r.guardian_link ? (
            <Card title="Send this consent link to the parent/guardian">
              <p className="text-sm text-ink-2">Share it by email, SMS or WhatsApp. It works once and expires in 7 days. The member can't use the app until consent is given.</p>
              <p className="font-mono text-xs break-all bg-sand p-2 rounded-md">{r.guardian_link}</p>
              <div><Button type="button" onClick={() => copy(r.guardian_link!, "Consent link")}>Copy consent link</Button></div>
            </Card>
          ) : null}
          {copied.value ? <p role="status" className="text-sm font-semibold text-sea-900">{copied.value}</p> : null}
          <div className="flex flex-wrap gap-3">
            <Button link={`/user/${r.id}`} variant="secondary">Open profile</Button>
            <Button type="button" onClick={() => { result.value = null; minor.value = ""; photoKey.value = null; idDoc.value = null; copied.value = ""; }}>Add another member</Button>
          </div>
        </PageShell>
        <BottomNavbar />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 w-full bg-sand min-h-screen">
      <TopNavbar />
      <PageShell title="Add member">
        <p className="text-sm text-ink-2">Only a name and an email or roll number are needed. Date of birth, gender and phone are not collected.</p>
        <form onSubmit={submit} className="flex flex-col gap-4" noValidate={false}>
          <Card title="Member">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field id="first_name" label="First name" required maxLength={50} autocomplete="off" />
              <Field id="last_name" label="Last name (optional)" maxLength={50} autocomplete="off" />
            </div>
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium text-ink">Signs in with</legend>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2"><input type="radio" name="login_type" checked={loginType.value === "email"} onChange={() => (loginType.value = "email")} /> Email</label>
                <label className="flex items-center gap-2"><input type="radio" name="login_type" checked={loginType.value === "roll"} onChange={() => (loginType.value = "roll")} /> School roll / admission number</label>
              </div>
              {loginType.value === "email"
                ? <Field id="login_email" label="Email" type="email" required autocomplete="off" />
                : <Field id="login_roll" label="Roll / admission number" required maxLength={40} pattern="[A-Za-z0-9][A-Za-z0-9/_.\-]*" hint="Letters, digits and / _ . -" />}
            </fieldset>
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium text-ink">Is the member under 18? *</legend>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2"><input type="radio" name="is_minor" value="no" required checked={minor.value === "no"} onChange={() => (minor.value = "no")} /> No, 18 or older</label>
                <label className="flex items-center gap-2"><input type="radio" name="is_minor" value="yes" checked={minor.value === "yes"} onChange={() => (minor.value = "yes")} /> Yes, under 18</label>
              </div>
            </fieldset>
          </Card>

          {isMinor ? (
            <Card title="Parent or guardian">
              <p className="text-sm text-ink-2">The DPDP Act needs verifiable consent from a parent or lawful guardian for members under 18. ID proof is never collected for them.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field id="guardian_name" label="Parent/guardian name" required maxLength={80} autocomplete="off" />
                <Field id="guardian_relation" label="Relationship (optional)" maxLength={40} />
                <Field id="guardian_email" label="Parent/guardian email" type="email" hint="Email or phone is required" autocomplete="off" />
                <Field id="guardian_phone" label="Parent/guardian phone" type="tel" placeholder="+91 98765 43210" autocomplete="off" />
              </div>
              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-medium text-ink">How is consent given?</legend>
                <label className="flex items-start gap-2 text-sm"><input type="radio" name="method" checked={method.value === "admin_attested"} onChange={() => (method.value = "admin_attested")} className="mt-1" /> The parent/guardian signed the consent form (keep the form on file)</label>
                <label className="flex items-start gap-2 text-sm"><input type="radio" name="method" checked={method.value === "guardian_link"} onChange={() => (method.value = "guardian_link")} className="mt-1" /> Send the parent/guardian a consent link (the member can sign in only after they agree)</label>
              </fieldset>
            </Card>
          ) : null}

          {(photoMode !== "off" || idMode !== "off") && minor.value ? (
            <Card title="Photo and ID proof">
              {photoMode !== "off" ? (
                <div className="flex flex-col gap-1">
                  <label htmlFor="photo" className="text-sm font-medium text-ink">Member photo ({photoMode === "required" && !isMinor ? "required" : "optional"})</label>
                  <input id="photo" type="file" accept="image/png,image/jpeg" className="text-sm" onChange={(e: any) => upload(e.currentTarget.files?.[0], "photo")} />
                  {photoKey.value ? <p className="text-xs font-semibold text-sea-900" role="status">Photo uploaded (private storage).</p> : null}
                </div>
              ) : null}
              {idMode !== "off" ? (
                <div className="flex flex-col gap-2" id="id-proof">
                  <SelectField id="id_type" label={`ID proof type (${idMode})`} options={[["School/college ID card", "School/college ID card"], ["Other photo ID", "Other photo ID"]]} />
                  <Field id="id_number" label="ID number" hint="Only the last 4 characters are kept. Don't use Aadhaar or PAN." maxLength={30} autocomplete="off" />
                  <label htmlFor="id_file" className="text-sm font-medium text-ink">ID image</label>
                  <input id="id_file" type="file" accept="image/png,image/jpeg" className="text-sm" onChange={(e: any) => upload(e.currentTarget.files?.[0], "id", e.currentTarget.form)} />
                  {idDoc.value ? <p className="text-xs font-semibold text-sea-900" role="status">ID image uploaded (private; deleted automatically after {settings.value?.id_doc_retention_days} days).</p> : null}
                </div>
              ) : null}
            </Card>
          ) : null}

          <ShortPrivacyNotice forGuardian={isMinor} />
          {!isMinor || method.value === "admin_attested" ? (
            <div className="flex items-start gap-2 rounded-brand border border-line bg-card p-4">
              <input id="consent" name="consent" type="checkbox" className="mt-1 rounded text-sea-700" required />
              <label htmlFor="consent" className="text-sm text-ink">
                {isMinor
                  ? "I confirm the parent/guardian named above has read this notice and signed the consent form."
                  : "The member has read this privacy notice and agrees to their data being used as described."}
              </label>
            </div>
          ) : null}
          {error.value ? <Alert>{error.value}</Alert> : null}
          <div><Button type="submit" disabled={busy.value}>{busy.value ? "Adding…" : "Add member"}</Button></div>
        </form>
      </PageShell>
      <BottomNavbar />
    </div>
  );
};

export default CreateUser;
