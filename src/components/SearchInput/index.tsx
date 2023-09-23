import FormControl from "@components/FormControl";
import Input from "@components/Input";
import Button from "@components/Button";
import { ChangeEvent, useRef } from "preact/compat";
import { Signal, useSignal } from "@preact/signals";
import Radio from "../Radio";

export type TSortOptions = {
  option: string;
  value: string[] | string;
};

type TSearchInput = {
  searchTerm: Signal<string>;
  sortOptions?: Signal<TSortOptions[]>;
  handleSortToggle?: (e: ChangeEvent<HTMLInputElement>) => void;
  isSearchSort: boolean;
};

const SearchInput = ({
  searchTerm,
  sortOptions,
  handleSortToggle,
  isSearchSort,
}: TSearchInput) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    searchTerm.value = e.currentTarget.value;
  };

  const handleDialog = () => {
    if (dialogRef.current?.open) {
      dialogRef.current?.close();
    } else {
      dialogRef.current?.show();
    }
  };

  return (
    <div className="flex my-4 w-full bg-white relative">
      <FormControl
        className={
          "flex items-center w-full border shadow-lg rounded-2xl p-2 px-4"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <Input
          placeholder="Search..."
          className="!border-none !ring-0 !shadow-none"
          onChange={handleSearch}
        />
        {isSearchSort ? (
          <>
            <Button
              type="button"
              className={`p-0 w-10 h-10 rounded-l-none flex items-center justify-center !bg-transparent z-10`}
              onClick={handleDialog}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 text-primary-900"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                />
              </svg>
            </Button>

            {/* close on outside click  */}
            <div
              className={`w-1/4 h-full absolute right-0`}
              onClick={() => {
                dialogRef.current?.close();
              }}
            />
            <dialog
              ref={dialogRef}
              className="absolute top-full left-2/3 p-2 shadow-lg rounded-md z-10"
            >
              <div className="flex flex-col gap-1 p-1">
                {sortOptions?.value?.map((sort) => (
                  <Radio
                    name="sort-option"
                    label={sort.option}
                    value={sort.value}
                    onChange={handleSortToggle}
                  />
                ))}
              </div>
            </dialog>
          </>
        ) : null}
      </FormControl>
    </div>
  );
};

export default SearchInput;
