import { useSignal } from "@preact/signals";
import { cx } from "class-variance-authority";
import type { HTMLAttributes } from "preact/compat";
import { useId } from "preact/hooks";

interface Props extends Omit<HTMLAttributes<HTMLSelectElement>, "class"> {
  label?: string;
  options: (string | { value: string; label: string })[];
}

const Select = ({
  label,
  className,
  options,
  defaultValue,
  ...rest
}: Props) => {
  const id = useId();

  return (
    <div class="flex flex-col gap-1 ">
      {label ? (
        <label for={id} class="cursor-pointer text-sm font-medium">
          {label}
        </label>
      ) : null}
      <select
        id={id}
        class={cx(
          "rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 focus-visible:outline-none",
          className
        )}
        {...rest}
      >
        {options.map((opt) => (
          <option
            value={
              typeof opt === "string"
                ? opt.replaceAll(" ", "-").toLowerCase()
                : opt.value
            }
            selected={
              typeof opt === "string"
                ? opt === defaultValue
                : opt.value === defaultValue
            }
          >
            {typeof opt === "string" ? opt : opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
