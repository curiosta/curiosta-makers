import { cx } from "class-variance-authority";
import { HTMLAttributes } from "preact/compat";

interface Props extends HTMLAttributes<HTMLInputElement> {
  label?: string;
}

const NewInput = ({ label, className, ...rest }: Props) => {
  const id = label?.replaceAll(" ", "-").toLowerCase();

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-6 text-gray-900 flex gap-1 mb-1"
        >
          {label}
        </label>
      ) : null}
      <input
        id={id}
        class={cx(
          `block w-full rounded-md border-0 p-1.5 px-3 text-gray-900 shadow-sm
      ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
      focus:ring-inset focus:ring-primary-600  sm:text-sm sm:leading-6 focus-visible:outline-none`,
          className
        )}
        placeholder={label}
        {...rest}
      />
    </div>
  );
};

export default NewInput;
