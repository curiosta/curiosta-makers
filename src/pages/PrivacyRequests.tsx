import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { Link } from "preact-router";
import TopNavbar from "@/components/Navbar/TopNavbar";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import Button from "@/components/Button";
import { Alert, Card, PageShell, SelectField } from "@/components/Field";
import { listPrivacyRequests, resolvePrivacyRequest } from "@/api/privacy";
import { isRollEmail } from "@/utils/loginId";

/** Admin: data-principal requests (deletion / correction). Deletion is done from the member's profile (Anonymise). */
const PrivacyRequests = () => {
  const status = useSignal("open");
  const rows = useSignal<any[] | null>(null);
  const error = useSignal("");

  const load = () => {
    rows.value = null;
    listPrivacyRequests(status.value).then((r) => (rows.value = r)).catch((e) => (error.value = e.message));
  };
  useEffect(load, [status.value]);

  const resolve = async (id: string, s: "completed" | "rejected") => {
    const note = window.prompt(s === "rejected" ? "Reason for rejecting (shown to the member on request):" : "Note (optional):") ?? undefined;
    try {
      await resolvePrivacyRequest(id, s, note);
      load();
    } catch (e: any) {
      error.value = e.message;
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full bg-sand min-h-screen">
      <TopNavbar />
      <PageShell title="Privacy requests">
        <p className="text-sm text-ink-2">Members' requests to correct or delete their data. Aim to finish within 30 days.</p>
        <SelectField id="req-status" label="Show" value={status.value} onChange={(e: any) => (status.value = e.currentTarget.value)}
          options={[["open", "Open"], ["completed", "Completed"], ["rejected", "Rejected"], ["all", "All"]]} className="max-w-xs" />
        {error.value ? <Alert>{error.value}</Alert> : null}
        {rows.value === null ? <p role="status">Loading…</p> : rows.value.length === 0 ? <Alert kind="info">No requests.</Alert> : null}
        {(rows.value || []).map((r) => (
          <Card key={r.id}>
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-semibold text-ink">{r.type === "deletion" ? "Delete data" : r.type === "correction" ? "Correct data" : "Access"} · {r.status}</p>
              <p className="text-sm text-muted">{new Date(r.created_at).toLocaleString("en-IN")}</p>
            </div>
            <p className="text-sm">
              <Link className="underline text-sea-900" href={`/user/${r.customer_id}`}>
                {[r.first_name, r.last_name].filter(Boolean).join(" ") || r.customer_id}
              </Link>{" "}
              {r.roll_number ? `· Roll no. ${r.roll_number}` : r.email && !isRollEmail(r.email) ? `· ${r.email}` : ""}
              {r.is_minor ? " · under 18" : ""}
            </p>
            {r.details ? <p className="text-sm text-ink-2 whitespace-pre-wrap">{r.details}</p> : null}
            {r.status === "open" ? (
              <div className="flex flex-wrap gap-2">
                {r.type === "deletion" ? <Button link={`/user/${r.customer_id}`}>Open profile to anonymise</Button> : null}
                <Button type="button" variant="secondary" onClick={() => resolve(r.id, "completed")}>Mark done</Button>
                <Button type="button" variant="secondary" onClick={() => resolve(r.id, "rejected")}>Reject</Button>
              </div>
            ) : r.resolution_note ? <p className="text-sm text-muted">{r.resolution_note}</p> : null}
          </Card>
        ))}
      </PageShell>
      <BottomNavbar />
    </div>
  );
};

export default PrivacyRequests;
