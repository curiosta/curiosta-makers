import { useSignal } from "@preact/signals";
import { acknowledge, TPrivacyStatus } from "@/api/privacy";
import user from "@/api/user";
import ShortPrivacyNotice from "@/components/PrivacyNotice/Short";
import { Alert, Card } from "@/components/Field";
import Button from "@/components/Button";
import { APP_DISPLAY_NAME, GRIEVANCE_EMAIL } from "@/config/brand";
import { PRIVACY_NOTICE_VERSION } from "@/config/privacy";

/** Shown to a signed-in member before anything else when the notice must be (re)accepted or guardian consent is missing. */
const PrivacyGate = ({ status, onDone }: { status: TPrivacyStatus; onDone: (s: TPrivacyStatus) => void }) => {
  const error = useSignal("");
  const minorAnswer = useSignal<"" | "yes" | "no">("");

  const logout = async () => {
    await user.logout().catch(() => null);
    window.location.href = "/login";
  };

  if (status.blocked) {
    return (
      <main id="main" className="min-h-screen bg-sand p-5 flex justify-center">
        <div className="max-w-xl w-full flex flex-col gap-4 mt-10">
          <h1 className="font-serif text-3xl text-ink">Waiting for parent or guardian consent</h1>
          <p className="text-ink-2">
            Because you are under 18, a parent or guardian needs to give consent before you can use {APP_DISPLAY_NAME}.
            Ask makerspace staff to send them the consent link or record their signed form.
          </p>
          <p className="text-sm text-muted">Questions: <a className="underline text-sea-900" href={`mailto:${GRIEVANCE_EMAIL}`}>{GRIEVANCE_EMAIL}</a></p>
          <Button variant="secondary" type="button" onClick={logout}>Sign out</Button>
        </div>
      </main>
    );
  }

  const submit = async (e: Event) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget as HTMLFormElement);
    error.value = "";
    try {
      const body: any = { notice_version: PRIVACY_NOTICE_VERSION, accept: f.get("accept") === "on" };
      if (!status.known) {
        if (!minorAnswer.value) throw new Error("Tell us whether you are under 18.");
        body.is_minor = minorAnswer.value === "yes";
      }
      onDone(await acknowledge(body));
    } catch (err: any) {
      error.value = err.message;
    }
  };

  return (
    <main id="main" className="min-h-screen bg-sand p-5 flex justify-center">
      <div className="max-w-2xl w-full flex flex-col gap-4 mt-6">
        <h1 className="font-serif text-3xl text-ink">Before you continue</h1>
        <p className="text-ink-2">Please read how {APP_DISPLAY_NAME} uses your data.</p>
        <ShortPrivacyNotice />
        <Card>
          <form onSubmit={submit} className="flex flex-col gap-3">
            {!status.known ? (
              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-medium text-ink">Are you under 18?</legend>
                <div className="flex gap-4 flex-wrap">
                  {(["no", "yes"] as const).map((v) => (
                    <label key={v} className="flex items-center gap-2 text-sm">
                      <input type="radio" name="is_minor" value={v} checked={minorAnswer.value === v} onChange={() => (minorAnswer.value = v)} />
                      {v === "yes" ? "Yes, I am under 18" : "No, I am 18 or older"}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
            <div className="flex items-start gap-2">
              <input id="gate-accept" name="accept" type="checkbox" className="mt-1 rounded text-sea-700" required />
              <label htmlFor="gate-accept" className="text-sm text-ink">I have read the privacy notice and I agree to my data being used as described.</label>
            </div>
            {error.value ? <Alert>{error.value}</Alert> : null}
            <div className="flex flex-wrap gap-3">
              <Button type="submit">Accept and continue</Button>
              <Button type="button" variant="secondary" onClick={logout}>Sign out</Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
};

export default PrivacyGate;
