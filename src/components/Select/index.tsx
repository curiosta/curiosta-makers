import { useSignal } from "@preact/signals";
import { cx } from "class-variance-authority";
import type { HTMLAttributes } from "preact/compat";
import { useId } from "preact/hooks";

interface Props extends Omit<HTMLAttributes<HTMLSelectElement>, "class"> {
  label?: string;
  options: string[];
}

const Select = ({ label, className, options, ...rest }: Props) => {
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
        class={cx("rounded-md border-gray-300", className)}
        {...rest}
      >
        {options.map((opt) => (
          <option value={opt.replaceAll(" ", "-").toLowerCase()}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;
