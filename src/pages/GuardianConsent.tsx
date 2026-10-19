import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { guardianConfirm, guardianInfo } from "@/api/privacy";
import ShortPrivacyNotice from "@/components/PrivacyNotice/Short";
import SiteFooter from "@/components/SiteFooter";
import { Alert, Card, Field } from "@/components/Field";
import Button from "@/components/Button";
import { APP_DISPLAY_NAME, APP_NAME } from "@/config/brand";
import { PRIVACY_NOTICE_VERSION } from "@/config/privacy";

/** Public page: a parent/guardian gives consent. The token is in the URL #fragment (never sent in logs). */
const GuardianConsent = () => {
  // Take the token from the #fragment once, keep it only for this tab, and drop it from the address bar/history.
  const token = (() => {
    if (typeof window === "undefined") return "";
    const fromHash = window.location.hash.replace(/^#/, "");
    if (fromHash) {
      sessionStorage.setItem("guardian_consent_token", fromHash);
      history.replaceState(null, "", "/guardian-consent");
      return fromHash;
    }
    return sessionStorage.getItem("guardian_consent_token") || "";
  })();
  const info = useSignal<{ member_first_name: string; guardian_name: string } | null>(null);
  const error = useSignal("");
  const done = useSignal(false);
  const busy = useSignal(false);

  useEffect(() => {
    if (!token) {
      error.value = "This consent link is incomplete. Open the full link you were sent.";
      return;
    }
    guardianInfo(token).then((r) => (info.value = r)).catch((e) => { sessionStorage.removeItem("guardian_consent_token"); error.value = e.message; });
  }, []);

  const submit = async (e: Event) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget as HTMLFormElement);
    error.value = "";
    busy.value = true;
    try {
      await guardianConfirm({
        token,
        notice_version: PRIVACY_NOTICE_VERSION,
        accept: f.get("accept") === "on",
        guardian_name: String(f.get("guardian_name") || ""),
        guardian_relation: String(f.get("guardian_relation") || ""),
      });
      done.value = true;
      sessionStorage.removeItem("guardian_consent_token");
    } catch (err: any) {
      error.value = err.message;
    } finally {
      busy.value = false;
    }
  };

  return (
    <div className="min-h-screen bg-sand flex flex-col">
      <header className="bg-sea-900 text-white">
        <div className="mx-auto max-w-[780px] px-5 py-6">
          <p className="font-serif text-lg font-semibold">Curiosta <span className="text-teal">{APP_NAME}</span></p>
          <h1 className="font-serif text-3xl mt-4">Parent or guardian consent</h1>
        </div>
      </header>
      <div className="mx-auto w-full max-w-[780px] px-5 py-8 flex flex-col gap-4">
        {done.value ? (
          <Alert kind="ok">Thank you. Your consent has been recorded. {info.value?.member_first_name} can now use {APP_DISPLAY_NAME}.</Alert>
        ) : info.value ? (
          <>
            <p className="text-ink-2">
              Your makerspace has asked for your consent so that <strong>{info.value.member_first_name}</strong>, who is
              under 18, can use {APP_DISPLAY_NAME} to borrow and use tools and materials.
            </p>
            <ShortPrivacyNotice forGuardian />
            <Card title="Give consent">
              <form onSubmit={submit} className="flex flex-col gap-3">
                <Field id="guardian_name" label="Your full name" required autocomplete="name" defaultValue={info.value.guardian_name || ""} />
                <Field id="guardian_relation" label="Relationship to the member" hint="For example: mother, father, legal guardian" />
                <div className="flex items-start gap-2">
                  <input id="accept" name="accept" type="checkbox" className="mt-1 rounded text-sea-700" required />
                  <label htmlFor="accept" className="text-sm text-ink">
                    I am the parent or lawful guardian of {info.value.member_first_name}. I have read the privacy notice and I
                    consent to the processing of their data as described.
                  </label>
                </div>
                {error.value ? <Alert>{error.value}</Alert> : null}
                <Button type="submit" disabled={busy.value}>I give consent</Button>
                <p className="text-xs text-muted">You can withdraw consent at any time by writing to the makerspace or to info@curiosta.com.</p>
              </form>
            </Card>
          </>
        ) : error.value ? (
          <Alert>{error.value}</Alert>
        ) : (
          <p role="status">Loading…</p>
        )}
      </div>
      <SiteFooter className="mt-auto" />
    </div>
  );
};

export default GuardianConsent;
