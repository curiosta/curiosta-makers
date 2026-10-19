import { APP_DISPLAY_NAME, APP_FULL_NAME, GRIEVANCE_EMAIL } from "@/config/brand";

/** Dark-sea footer (brand skill) with the public privacy link. Used on public pages and Account. */
const SiteFooter = ({ className = "" }: { className?: string }) => (
  <footer className={`w-full bg-sea-900 text-white px-5 py-6 mt-10 rounded-t-brand ${className}`}>
    <div className="mx-auto max-w-[1120px] flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm">
      <p>
        <span className="font-serif font-semibold">{APP_DISPLAY_NAME}</span>
        <span className="text-white/80"> · {APP_FULL_NAME}</span>
      </p>
      <nav aria-label="Legal" className="flex flex-wrap gap-4">
        <a href="/privacy" className="underline underline-offset-2 hover:text-teal">Privacy notice</a>
        <a href={`mailto:${GRIEVANCE_EMAIL}`} className="underline underline-offset-2 hover:text-teal">Contact: {GRIEVANCE_EMAIL}</a>
      </nav>
    </div>
  </footer>
);

export default SiteFooter;
