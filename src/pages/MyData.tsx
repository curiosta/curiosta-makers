import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import TopNavbar from "@/components/Navbar/TopNavbar";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import Button from "@/components/Button";
import { Alert, Card, PageShell, TextArea } from "@/components/Field";
import { downloadJson, myExport, myRequest } from "@/api/privacy";
import { GRIEVANCE_EMAIL } from "@/config/brand";

/** Member: see and download own data; ask for correction or deletion (DPDP Act rights). */
const MyData = () => {
  const data = useSignal<any>(null);
  const error = useSignal("");
  const notice = useSignal("");

  useEffect(() => {
    myExport().then((d) => (data.value = d)).catch((e) => (error.value = e.message));
  }, []);

  const request = async (type: "deletion" | "correction", form: HTMLFormElement) => {
    error.value = "";
    notice.value = "";
    try {
      const details = String(new FormData(form).get(`${type}-details`) || "");
      const r = await myRequest(type, details);
      notice.value = r.duplicate
        ? `You already have an open ${type} request. Staff will handle it.`
        : `Your ${type} request has been sent to makerspace staff. Reference: ${r.id}.`;
      form.reset();
    } catch (e: any) {
      error.value = e.message;
    }
  };

  const p = data.value?.profile;
  return (
    <div className="flex flex-col items-center p-4 w-full bg-sand min-h-screen">
      <TopNavbar />
      <PageShell title="Privacy & my data">
        {error.value ? <Alert>{error.value}</Alert> : null}
        {notice.value ? <Alert kind="ok">{notice.value}</Alert> : null}
        <Card title="What we hold about you">
          {!data.value ? (
            <p role="status">Loading…</p>
          ) : (
            <>
              <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-sm">
                <dt className="text-muted">Name</dt><dd>{[p.first_name, p.last_name].filter(Boolean).join(" ")}</dd>
                <dt className="text-muted">Sign-in</dt><dd>{p.email ?? `Roll no. ${data.value.privacy?.roll_number ?? ""}`}</dd>
                <dt className="text-muted">Under 18</dt><dd>{data.value.privacy?.is_minor ? "Yes" : "No"}</dd>
                <dt className="text-muted">Consent</dt><dd>{data.value.privacy?.consent_status} (notice {data.value.privacy?.notice_version})</dd>
                <dt className="text-muted">Requests and issues</dt><dd>{data.value.requests_and_issues.length}</dd>
                <dt className="text-muted">Files</dt><dd>{data.value.files.length ? data.value.files.map((f: any) => f.kind).join(", ") : "None"}</dd>
              </dl>
              <div>
                <Button type="button" onClick={() => downloadJson(data.value, "my-data.json")}>Download my data (JSON)</Button>
              </div>
            </>
          )}
        </Card>
        <Card title="Correct my data">
          <form onSubmit={(e) => { e.preventDefault(); request("correction", e.currentTarget); }} className="flex flex-col gap-3">
            <TextArea id="correction-details" label="What should be corrected?" required maxLength={1000} />
            <div><Button type="submit" variant="secondary">Send correction request</Button></div>
          </form>
        </Card>
        <Card title="Delete my data">
          <p className="text-sm text-ink-2">
            Staff will check that you have returned borrowed items, then remove your name, sign-in details, guardian
            details and files. Stock records stay under an anonymous label. You will be signed out.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); request("deletion", e.currentTarget); }} className="flex flex-col gap-3">
            <TextArea id="deletion-details" label="Anything staff should know? (optional)" maxLength={1000} />
            <div><Button type="submit" variant="danger">Request deletion</Button></div>
          </form>
        </Card>
        <p className="text-sm text-ink-2">
          Read the <a className="underline text-sea-900" href="/privacy">privacy notice</a>. Complaints:{" "}
          <a className="underline text-sea-900" href={`mailto:${GRIEVANCE_EMAIL}`}>{GRIEVANCE_EMAIL}</a>.
        </p>
      </PageShell>
      <BottomNavbar />
    </div>
  );
};

export default MyData;
