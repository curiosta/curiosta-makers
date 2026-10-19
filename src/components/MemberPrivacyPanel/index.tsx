import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import Button from "@/components/Button";
import { Alert, Card, Field } from "@/components/Field";
import { adminExport, anonymise, attestGuardian, downloadJson, getSettings, guardianLink, memberPrivacy } from "@/api/privacy";

type Props = { customerId: string; onModes?: (m: { id: boolean; photo: boolean }) => void };

/** Admin view of a member's privacy state: consent, guardian consent, export, anonymise. */
const MemberPrivacyPanel = ({ customerId, onModes }: Props) => {
  const data = useSignal<any>(null);
  const error = useSignal("");
  const info = useSignal("");
  const link = useSignal("");
  const showAttest = useSignal(false);

  const load = () =>
    Promise.all([memberPrivacy(customerId), getSettings()])
      .then(([d, s]) => {
        data.value = d;
        const minor = d.status?.is_minor === true;
        onModes?.({ id: !minor && s.id_proof_mode !== "off", photo: s.photo_mode !== "off" });
      })
      .catch((e) => (error.value = e.message));
  useEffect(() => void load(), [customerId]);

  const act = async (fn: () => Promise<unknown>, okMsg: string) => {
    error.value = info.value = "";
    try {
      await fn();
      info.value = okMsg;
      await load();
    } catch (e: any) {
      error.value = e.message;
    }
  };

  const d = data.value;
  if (!d) return error.value ? <Alert>{error.value}</Alert> : null;
  const st = d.status;
  const latestGuardian = d.consents.find((c: any) => c.given_by === "guardian");

  return (
    <Card title="Privacy and consent" className="w-full my-4">
      {d.anonymised_at ? <Alert kind="info">This member was anonymised on {new Date(d.anonymised_at).toLocaleDateString("en-IN")}.</Alert> : null}
      <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="text-muted">Under 18</dt><dd>{st.is_minor === null ? "Not answered yet" : st.is_minor ? "Yes" : "No"}</dd>
        {d.roll_number ? <><dt className="text-muted">Roll no.</dt><dd>{d.roll_number}</dd></> : null}
        <dt className="text-muted">Consent</dt>
        <dd>
          {st.consent_status === "given" ? "Given" : st.consent_status === "pending" ? "Waiting for parent/guardian" : "Withdrawn"}
          {st.acknowledged_at ? ` · member accepted notice ${new Date(st.acknowledged_at).toLocaleDateString("en-IN")}` : " · member has not signed in to accept the notice yet"}
        </dd>
        {latestGuardian ? (
          <>
            <dt className="text-muted">Guardian</dt>
            <dd>{[latestGuardian.guardian_name, latestGuardian.guardian_relation, latestGuardian.guardian_email, latestGuardian.guardian_phone].filter(Boolean).join(" · ")}{latestGuardian.method === "guardian_link" ? " (consent link)" : " (signed form)"}</dd>
          </>
        ) : null}
        {d.requests.some((r: any) => r.status === "open") ? <><dt className="text-muted">Open requests</dt><dd>{d.requests.filter((r: any) => r.status === "open").map((r: any) => r.type).join(", ")}</dd></> : null}
      </dl>

      {error.value ? <Alert>{error.value}</Alert> : null}
      {info.value ? <Alert kind="ok">{info.value}</Alert> : null}
      {link.value ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm">Send this one-time link to the parent/guardian (expires in 7 days):</p>
          <p className="font-mono text-xs break-all bg-sand p-2 rounded-md">{link.value}</p>
          <div><Button type="button" variant="secondary" onClick={() => navigator.clipboard?.writeText(link.value)}>Copy link</Button></div>
        </div>
      ) : null}

      {!d.anonymised_at ? (
        <div className="flex flex-wrap gap-2">
          {st.is_minor && st.consent_status !== "given" ? (
            <>
              <Button type="button" onClick={() => act(async () => {
                const r = await guardianLink(customerId);
                link.value = `${window.location.origin}${r.guardian_link_path}`;
              }, "New consent link created.")}>Create consent link</Button>
              <Button type="button" variant="secondary" onClick={() => (showAttest.value = !showAttest.value)}>Record signed form</Button>
            </>
          ) : null}
          <Button type="button" variant="secondary" onClick={() => act(async () => downloadJson(await adminExport(customerId), `member-${customerId}.json`), "Data export downloaded.")}>
            Export member data
          </Button>
          <Button type="button" variant="danger" onClick={() => {
            const typed = window.prompt("This removes the member's name, sign-in, guardian details and files, keeping anonymous stock records. It cannot be undone. Type ANONYMISE to confirm.");
            if (typed === "ANONYMISE") act(() => anonymise(customerId), "Member anonymised and signed out.");
          }}>Delete / anonymise member</Button>
        </div>
      ) : null}

      {showAttest.value ? (
        <form className="flex flex-col gap-2 border-t border-line pt-3" onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          act(() => attestGuardian(customerId, {
            confirm: f.get("attest_confirm") === "on",
            guardian_name: f.get("attest_name"), guardian_relation: f.get("attest_relation"),
            guardian_email: f.get("attest_email"), guardian_phone: f.get("attest_phone"),
          }), "Guardian consent recorded.").then(() => (showAttest.value = false));
        }}>
          <div className="grid sm:grid-cols-2 gap-2">
            <Field id="attest_name" label="Parent/guardian name" required defaultValue={latestGuardian?.guardian_name || ""} />
            <Field id="attest_relation" label="Relationship" defaultValue={latestGuardian?.guardian_relation || ""} />
            <Field id="attest_email" label="Email" type="email" defaultValue={latestGuardian?.guardian_email || ""} />
            <Field id="attest_phone" label="Phone" type="tel" defaultValue={latestGuardian?.guardian_phone || ""} />
          </div>
          <label className="flex items-start gap-2 text-sm"><input type="checkbox" name="attest_confirm" required className="mt-1 rounded" /> I have the parent/guardian's signed consent form on file.</label>
          <div><Button type="submit">Save consent</Button></div>
        </form>
      ) : null}
    </Card>
  );
};

export default MemberPrivacyPanel;
