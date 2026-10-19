import { APP_DISPLAY_NAME, GRIEVANCE_EMAIL } from "@/config/brand";
import { PRIVACY_NOTICE_VERSION } from "@/config/privacy";

/** Short notice shown at sign-up and on first login. Full text: /privacy. */
const ShortPrivacyNotice = ({ forGuardian = false, id = "privacy-notice-short" }: { forGuardian?: boolean; id?: string }) => (
  <section id={id} aria-labelledby={`${id}-title`} className="rounded-brand border border-line bg-card p-4 text-sm text-ink-2 flex flex-col gap-2">
    <h2 id={`${id}-title`} className="font-serif text-lg text-ink">Privacy notice (short version)</h2>
    <p>
      {APP_DISPLAY_NAME} is used by your makerspace to lend and issue tools and materials.
      {forGuardian ? " Because the member is under 18, we need your consent as parent or guardian." : ""}
    </p>
    <ul className="list-disc pl-5 flex flex-col gap-1">
      <li><strong>What we keep:</strong> name, and an email or school roll/admission number; the items requested, issued and returned. For a member under 18, the parent/guardian's name and email or phone.</li>
      <li><strong>Not collected by default:</strong> date of birth, gender, phone, ID proof or photo. ID proof is never collected for members under 18.</li>
      <li><strong>Why:</strong> to run the makerspace's inventory and keep track of who has what.</li>
      <li><strong>No tracking:</strong> no advertising, analytics or tracking. Your data is not sold.</li>
      <li><strong>How long:</strong> while the membership is active. When you ask us to delete your data, your identity is removed but the anonymous stock records stay.</li>
      <li><strong>Your rights:</strong> see and download your data, correct it, ask us to delete it, or withdraw consent. Complaints: <a className="underline text-sea-900" href={`mailto:${GRIEVANCE_EMAIL}`}>{GRIEVANCE_EMAIL}</a>.</li>
    </ul>
    <p>
      <a className="underline font-semibold text-sea-900" href="/privacy" target="_blank" rel="noopener">Read the full privacy notice</a>
      <span className="text-muted"> · version {PRIVACY_NOTICE_VERSION}</span>
    </p>
  </section>
);

export default ShortPrivacyNotice;
