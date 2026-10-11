import { cx } from "class-variance-authority";
import type { HTMLAttributes } from "preact/compat";
import { useId } from "preact/hooks";

interface Props extends Omit<HTMLAttributes<HTMLInputElement>, "class"> {
  label?: string;
  labelClassName?: string;
}

const Checkbox = ({ label, labelClassName, className, ...rest }: Props) => {
  const id = useId();

  return (
    <div class="flex items-center">
      <input
        type="checkbox"
        id={id}
        class={cx(
          "h-4 w-4 rounded border-muted text-sea-500 focus:ring-sea-500",
          className
        )}
        {...rest}
      />
      {label ? (
        <label
          for={id}
          class={cx(
            "ml-3 block text-sm leading-6 text-ink cursor-pointer",
            labelClassName
          )}
        >
          {label}
        </label>
      ) : null}
    </div>
  );
};

export default Checkbox;
