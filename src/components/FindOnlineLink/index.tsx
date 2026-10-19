import { findOnlineUrl } from "@/utils/findOnline";

type Props = { title: string; spec?: string | null; className?: string; compact?: boolean };

/** Opens a Google search for the item in a new tab (replaces the old store link). `compact`: icon only on small screens. */
const FindOnlineLink = ({ title, spec, className = "", compact }: Props) => (
  <a
    href={findOnlineUrl(title, spec)}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Find ${title} online (Google search, opens in a new tab)`}
    className={`inline-flex shrink-0 items-center gap-1 rounded-full border border-sea-500 bg-card px-3 py-1 min-h-[32px] text-sm font-semibold text-sea-900 hover:bg-teal-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-sea-500 ${className}`}
  >
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
      <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.45 4.39l3.08 3.08a.75.75 0 11-1.06 1.06l-3.08-3.08A7 7 0 012 9z" clip-rule="evenodd" />
    </svg>
    <span className={compact ? "hidden sm:inline" : ""}>Find online</span>
  </a>
);

export default FindOnlineLink;
