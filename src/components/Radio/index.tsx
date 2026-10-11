import { cx } from "class-variance-authority";
import type { HTMLAttributes } from "preact/compat";
import { useId } from "preact/hooks";

interface Props extends Omit<HTMLAttributes<HTMLInputElement>, "class"> {
  label?: string;
}

const Radio = ({ label, className, ...rest }: Props) => {
  const id = useId();

  return (
    <div class="flex items-center">
      <input
        type="radio"
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
          class="ml-3 block text-sm leading-6 text-ink cursor-pointer"
        >
          {label}
        </label>
      ) : null}
    </div>
  );
};

export default Radio;
