import { cx } from "class-variance-authority";
import { ComponentChildren } from "preact";
import { HTMLAttributes } from "preact/compat";

interface Props extends HTMLAttributes<HTMLInputElement> {
  label?: string;
  leftAdornment?: ComponentChildren | ComponentChildren[];
}

const NewInput = ({ label, leftAdornment, className, ...rest }: Props) => {
  const id = label?.replaceAll(" ", "-").toLowerCase();

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-6 text-ink flex gap-1 mb-1"
        >
          {label}
        </label>
      ) : null}
      <div className="flex rounded-md">
        {leftAdornment ? (
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-muted/80 px-3 text-muted sm:text-sm">
            {leftAdornment}
          </span>
        ) : null}
        <input
          id={id}
          class={cx(
            `block w-full rounded-md border-0 p-1.5 px-3 text-ink shadow-sm
      ring-1 ring-inset ring-muted/80 placeholder:text-muted focus:ring-2
      focus:ring-inset focus:ring-sea-500  sm:text-sm sm:leading-6 focus-visible:outline-none`,
            leftAdornment ? "rounded-l-none" : "rounded-l-md",
            className
          )}
          placeholder={label}
          {...rest}
        />
      </div>
    </div>
  );
};

export default NewInput;
