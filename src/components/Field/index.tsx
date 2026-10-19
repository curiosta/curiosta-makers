import { ComponentChildren } from "preact";

const base =
  "block w-full rounded-md border-0 p-2 px-3 text-ink shadow-sm ring-1 ring-inset ring-muted/80 placeholder:text-muted focus:ring-2 focus:ring-inset focus:ring-sea-500 text-sm";

type Common = { id: string; label: string; hint?: string; required?: boolean; className?: string };

export const Field = ({ id, label, hint, required, className = "", ...rest }: Common & Record<string, any>) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label htmlFor={id} className="text-sm font-medium text-ink">
      {label}
      {required ? <span aria-hidden="true"> *</span> : null}
    </label>
    <input id={id} name={id} required={required} aria-describedby={hint ? `${id}-hint` : undefined} className={base} {...rest} />
    {hint ? <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p> : null}
  </div>
);

export const TextArea = ({ id, label, hint, required, className = "", ...rest }: Common & Record<string, any>) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label htmlFor={id} className="text-sm font-medium text-ink">{label}{required ? <span aria-hidden="true"> *</span> : null}</label>
    <textarea id={id} name={id} required={required} aria-describedby={hint ? `${id}-hint` : undefined} className={base} rows={3} {...rest} />
    {hint ? <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p> : null}
  </div>
);

export const SelectField = ({ id, label, hint, options, className = "", ...rest }: Common & { options: [string, string][] } & Record<string, any>) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label htmlFor={id} className="text-sm font-medium text-ink">{label}</label>
    <select id={id} name={id} aria-describedby={hint ? `${id}-hint` : undefined} className={base} {...rest}>
      {options.map(([v, t]) => <option value={v} key={v}>{t}</option>)}
    </select>
    {hint ? <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p> : null}
  </div>
);

export const Card = ({ title, children, className = "" }: { title?: string; children: ComponentChildren; className?: string }) => (
  <section className={`rounded-brand border border-line bg-card p-4 flex flex-col gap-3 min-w-0 ${className}`}>
    {title ? <h2 className="font-serif text-xl text-ink">{title}</h2> : null}
    {children}
  </section>
);

export const Alert = ({ kind = "error", children }: { kind?: "error" | "ok" | "info"; children: ComponentChildren }) => (
  <p
    role={kind === "error" ? "alert" : "status"}
    className={`rounded-md p-3 text-sm ${kind === "error" ? "bg-coral-soft text-sea-900 border-l-4 border-bad" : kind === "ok" ? "bg-teal-soft text-sea-900 border-l-4 border-ok" : "bg-sand text-ink-2 border-l-4 border-line"}`}
  >
    {children}
  </p>
);

export const PageShell = ({ title, children, wide = false }: { title: string; children: ComponentChildren; wide?: boolean }) => (
  <div className={`w-full mb-24 ${wide ? "max-w-4xl" : "max-w-2xl"} flex flex-col gap-4`}>
    <h1 className="font-serif text-3xl text-ink mt-2">{title}</h1>
    {children}
  </div>
);
