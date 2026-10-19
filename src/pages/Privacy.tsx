import { APP_DISPLAY_NAME, APP_FULL_NAME, APP_NAME, GRIEVANCE_EMAIL, LEGAL_ENTITY, APP_DOMAIN, LEGACY_DOMAIN } from "@/config/brand";
import { PRIVACY_NOTICE_IS_DRAFT, PRIVACY_NOTICE_VERSION } from "@/config/privacy";
import SiteFooter from "@/components/SiteFooter";

/**
 * Public privacy notice (no login). Topic order follows the structure of large Indian corporate
 * privacy statements (scope, who is responsible, data and purposes, legal basis, children,
 * sharing and location, retention, security, rights, grievance contact, changes), written
 * for this service and the Digital Personal Data Protection Act, 2023.
 */
const sections = [
  ["scope", "1. Scope of this notice"],
  ["who", "2. Who is responsible for your data"],
  ["what", "3. What personal data we process and why"],
  ["basis", "4. Consent and legal basis"],
  ["children", "5. Children (members under 18)"],
  ["sharing", "6. Who we share data with and where it is processed"],
  ["retention", "7. How long we keep data"],
  ["security", "8. How we protect data"],
  ["rights", "9. Your rights and how to use them"],
  ["grievance", "10. Grievance officer and contact"],
  ["cookies", "11. Cookies and tracking"],
  ["changes", "12. Changes to this notice"],
] as const;

const H2 = ({ id, children }: { id: string; children: any }) => (
  <h2 id={id} className="font-serif text-2xl text-ink mt-10 mb-3 scroll-mt-24">{children}</h2>
);

const Privacy = () => (
  <div className="min-h-screen bg-sand flex flex-col">
    <header className="bg-sea-900 text-white">
      <div className="mx-auto max-w-[1120px] px-5 py-4 flex items-center justify-between gap-4">
        <a href="/" className="font-serif text-lg font-semibold">Curiosta <span className="text-teal">{APP_NAME}</span></a>
        <a href="/login" className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-sea-900">Sign in</a>
      </div>
      <div className="mx-auto max-w-[780px] px-5 pb-10 pt-6">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-teal">Privacy</p>
        <h1 className="font-serif text-4xl sm:text-5xl mt-2">Privacy notice</h1>
        <p className="mt-3 text-white/90">{APP_DISPLAY_NAME} ({APP_FULL_NAME}) · version {PRIVACY_NOTICE_VERSION}</p>
      </div>
    </header>

    <div className="mx-auto w-full max-w-[780px] px-5 py-8 text-ink-2 leading-relaxed">
      {PRIVACY_NOTICE_IS_DRAFT ? (
        <p role="note" className="rounded-brand border border-line bg-coral-soft p-4 text-sm text-ink mb-6">
          <strong>Draft for review.</strong> This notice is being reviewed before final publication. Items marked
          "to be confirmed" will be filled in.
        </p>
      ) : null}

      <nav aria-labelledby="toc" className="rounded-brand border border-line bg-card p-4">
        <h2 id="toc" className="font-mono text-xs uppercase tracking-[0.14em] text-sea-500">Contents</h2>
        <ol className="mt-2 grid gap-1 sm:grid-cols-2 text-sm">
          {sections.map(([id, t]) => (
            <li key={id}><a className="underline text-sea-900" href={`#${id}`}>{t}</a></li>
          ))}
        </ol>
      </nav>

      <H2 id="scope">1. Scope of this notice</H2>
      <p>
        This notice covers {APP_DISPLAY_NAME} at <span className="font-mono">{APP_DOMAIN}</span> (formerly{" "}
        <span className="font-mono">{LEGACY_DOMAIN}</span>, which now redirects there), the web app a makerspace uses
        to lend, issue and track tools and materials, and the related consent pages. It explains what personal data the app handles, why, for how long,
        and how you can control it. It does not cover other Curiosta websites, which have their own notices.
      </p>

      <H2 id="who">2. Who is responsible for your data</H2>
      <p>
        The service is operated by <strong>{LEGAL_ENTITY}</strong> ("we"), which decides why and how the data is
        processed and acts as the <em>Data Fiduciary</em> under the Digital Personal Data Protection Act, 2023
        ("DPDP Act"). Where a school or institution runs its makerspace on {APP_DISPLAY_NAME}, that institution's staff
        create member accounts and manage requests.
      </p>

      <H2 id="what">3. What personal data we process and why</H2>
      <p>We collect only what is needed to run the makerspace's inventory.</p>
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-sm border border-line bg-card">
          <caption className="sr-only">Personal data categories, sources and purposes</caption>
          <thead className="bg-sea-700 text-white">
            <tr><th scope="col" className="p-2 text-left">Data</th><th scope="col" className="p-2 text-left">Source</th><th scope="col" className="p-2 text-left">Purpose</th></tr>
          </thead>
          <tbody>
            <tr className="border-t border-line"><td className="p-2">Name; email <em>or</em> school roll/admission number; password (stored only as a secure hash)</td><td className="p-2">You or makerspace staff at sign-up</td><td className="p-2">Create and secure your account; identify who borrowed what</td></tr>
            <tr className="border-t border-line"><td className="p-2">Under 18 or not (yes/no)</td><td className="p-2">Sign-up</td><td className="p-2">Decide whether parental consent is needed</td></tr>
            <tr className="border-t border-line"><td className="p-2">Parent/guardian name, relationship, and email or phone</td><td className="p-2">Staff or the parent/guardian</td><td className="p-2">Record verifiable parental consent for members under 18</td></tr>
            <tr className="border-t border-line"><td className="p-2">Requests, issues, borrowings, returns and their dates</td><td className="p-2">Your use of the app</td><td className="p-2">Run the inventory; account for stock</td></tr>
            <tr className="border-t border-line"><td className="p-2">Consent records (notice version, date and time, method)</td><td className="p-2">Generated by the app</td><td className="p-2">Show that valid consent was given</td></tr>
            <tr className="border-t border-line"><td className="p-2">Optional: photo; ID proof type, last 4 characters and image (adults only, only if the makerspace turns it on)</td><td className="p-2">Staff at sign-up</td><td className="p-2">Confirm identity at the counter</td></tr>
            <tr className="border-t border-line"><td className="p-2">Technical logs: request path, status and time (no IP address, browser details or search terms)</td><td className="p-2">Generated by the servers</td><td className="p-2">Keep the service running and secure</td></tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3">
        We do not collect date of birth, gender, home address or phone number by default, and we never ask for
        Aadhaar or PAN numbers. We do not make automated decisions about you, and we do not sell personal data.
      </p>

      <H2 id="basis">4. Consent and legal basis</H2>
      <p>
        We process your data on the basis of your consent, given when your account is created after you have seen this
        notice. The app records which version of the notice you accepted, and when. You are asked to accept it again
        whenever it changes. You can withdraw consent at any time (see section 9). If you do, we stop processing your
        data, apart from anonymous stock records and anything the law requires us to keep.
      </p>

      <H2 id="children">5. Children (members under 18)</H2>
      <p>
        If a member is under 18, we need <strong>verifiable consent from a parent or lawful guardian</strong> before the
        account can be used. A parent or guardian gives this either through a one-time consent link (valid for 7 days)
        or on a signed form that makerspace staff record in the app. We record the guardian's name, how to reach them,
        the notice version and the time of consent. For members under 18 we never collect ID proof, we never require a
        photo, and there is no tracking, analytics, behavioural monitoring or targeted advertising.
      </p>

      <H2 id="sharing">6. Who we share data with and where it is processed</H2>
      <p>We share data only with service providers that host and run the app for us, under contract:</p>
      <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
        <li><strong>Amazon Web Services:</strong> application servers and content delivery (Singapore region), file storage (Mumbai region).</li>
        <li><strong>Neon:</strong> the database (Singapore region).</li>
        <li><strong>Email delivery provider</strong> (only if password-reset emails are turned on): your email address, to send the message.</li>
      </ul>
      <p className="mt-2">
        Some processing therefore happens outside India, which the DPDP Act allows except to countries the Government
        restricts. Makerspace staff can see members' account and request details. We may disclose data to authorities
        when the law requires it. We do not share data for advertising.
      </p>

      <H2 id="retention">7. How long we keep data</H2>
      <ul className="list-disc pl-5 flex flex-col gap-1">
        <li>Account data: while the membership is active, and until you ask us to delete it.</li>
        <li>ID proof images (if used): deleted automatically 30 days after upload (to be confirmed). Only the ID type and last 4 characters remain.</li>
        <li>Photos and ID images of deactivated members: deleted automatically 90 days after deactivation (to be confirmed).</li>
        <li>After deletion, your name, email or roll number, guardian details, addresses and files are removed. Stock movements stay under an anonymous label so the makerspace's records still add up.</li>
        <li>Server logs: 14 days. Unused guardian consent links: they expire after 7 days.</li>
      </ul>

      <H2 id="security">8. How we protect data</H2>
      <p>
        Data is encrypted in transit (HTTPS) and at rest. Photos and ID images sit in private storage and are shown only
        to signed-in staff through links that expire within minutes. Passwords are stored as one-way hashes. Staff
        access needs an admin login. Server logs leave out IP addresses and search terms. If a personal data breach
        happens, we will inform the Data Protection Board of India and the people affected, as the DPDP Act requires.
      </p>

      <H2 id="rights">9. Your rights and how to use them</H2>
      <p>Under the DPDP Act you can:</p>
      <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
        <li><strong>Access:</strong> see a summary of your data and download a copy. Use <em>Account → Privacy &amp; my data</em>.</li>
        <li><strong>Correction:</strong> ask us to correct or complete your data (same page, or ask makerspace staff).</li>
        <li><strong>Erasure:</strong> ask us to delete your data (same page). Staff confirm and then anonymise your account.</li>
        <li><strong>Withdraw consent:</strong> as easily as you gave it, by asking for deletion or writing to us.</li>
        <li><strong>Grievance redressal:</strong> complain to us (section 10). If you are not satisfied, you can go to the Data Protection Board of India.</li>
        <li><strong>Nominate</strong> someone to use these rights for you if you die or become incapacitated.</li>
      </ul>
      <p className="mt-2">For members under 18, a parent or guardian can use these rights.</p>

      <H2 id="grievance">10. Grievance officer and contact</H2>
      <p>
        Email <a className="underline text-sea-900 font-semibold" href={`mailto:${GRIEVANCE_EMAIL}`}>{GRIEVANCE_EMAIL}</a> with
        "Privacy" in the subject. Grievance officer: name to be confirmed, {LEGAL_ENTITY}. We aim to reply within 7 days
        and to resolve your request within 30 days.
      </p>

      <H2 id="cookies">11. Cookies and tracking</H2>
      <p>
        We use one essential cookie to keep you signed in. We use no analytics, advertising or third-party tracking
        cookies, and the app loads no third-party scripts or fonts.
      </p>

      <H2 id="changes">12. Changes to this notice</H2>
      <p>
        When we change this notice, we update its version and date, and members are asked to read and accept the new
        version the next time they sign in. Current version: {PRIVACY_NOTICE_VERSION}.
      </p>
    </div>
    <SiteFooter className="mt-auto" />
  </div>
);

export default Privacy;
