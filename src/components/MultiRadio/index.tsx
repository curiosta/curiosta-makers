import { Signal, useSignal } from "@preact/signals";
import { cx } from "class-variance-authority";
import { type ChangeEvent, type HTMLAttributes } from "preact/compat";
import Button from "../Button";
import { Customer } from "@medusajs/medusa";
import Typography from "../Typography";
import Radio from "../Radio";

interface Props extends Omit<HTMLAttributes<HTMLInputElement>, "class"> {
  options: Customer[];
  selectedValue: Signal<string>;
}

const MultiRadio = ({ className, options, selectedValue, ...rest }: Props) => {
  const searchTerm = useSignal<string | null>(null);
  const dropDownOpen = useSignal<boolean>(true);

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.currentTarget;
    if (checked) {
      selectedValue.value = value;
    } else {
      selectedValue.value = undefined;
    }
  };

  const searchResult = options.filter((opt) =>
    opt.email.toLowerCase().includes(searchTerm.value?.toLowerCase())
  );

  return (
    <div class="flex flex-col gap-2 my-4">
      {selectedValue.value ? (
        <div className="w-full flex gap-2 items-center flex-wrap ">
          <Button
            type="button"
            className="gap-2 !items-center py-1 bg-gray-200"
            variant="icon"
          >
            {selectedValue.value}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
              onClick={() => (selectedValue.value = undefined)}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
      ) : null}
      <div className="w-full flex items-center bg-secondray border rounded-lg shadow-lg p-1.5 border-gray-300">
        <input
          type="search"
          class={cx(
            "rounded-md border-gray-300 w-full border-none focus:border-transparent focus:ring-0 z-10 ",
            className
          )}
          value={searchTerm.value}
          {...rest}
          onChange={(e) => (searchTerm.value = e.currentTarget.value)}
        />

        <Button
          type="button"
          variant="icon"
          className={`${!searchTerm.value?.length ? "hidden" : ""}`}
          onClick={() => (searchTerm.value = "")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>

        <Button
          type="button"
          variant="icon"
          className="!text-app-primary-600"
          onClick={() => {
            dropDownOpen.value = !dropDownOpen.value;
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class={`w-6 h-6 ${
              dropDownOpen.value || searchTerm.value?.length
                ? "rotate-180"
                : "rotate-0"
            }`}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </Button>
      </div>
      <ul
        className={`w-full  flex-col gap-3 ${
          dropDownOpen.value || searchTerm.value?.length ? "flex" : "hidden"
        } bg-secondray my-1 p-3 overflow-y-auto max-h-48 shadow-lg rounded-lg`}
      >
        {searchTerm.value?.length ? (
          searchResult?.length ? (
            searchResult.map((opt) => (
              <li>
                <Radio
                  value={opt.email}
                  label={opt.email}
                  className="!w-5 !h-5"
                  onChange={handleCheck}
                  checked={selectedValue.value === opt.email}
                />
              </li>
            ))
          ) : (
            <Typography>No Result Found</Typography>
          )
        ) : (
          options.map((opt) => (
            <li>
              <Radio
                value={opt.email}
                label={opt.email}
                className="!w-5 !h-5"
                onChange={handleCheck}
                checked={selectedValue.value === opt.email}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default MultiRadio;
