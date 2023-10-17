import type { Address } from "@medusajs/medusa";
import Typography from "@components/Typography";
import type { Signal } from "@preact/signals";
import Radio from "../Radio";
import { ChangeEvent } from "preact/compat";
import cart from "@/api/cart";
import { cx } from "class-variance-authority";

interface Props {
  address: Address;
  selectedAddressId?: Signal<string>;
  handleSelectAddress?: (e: ChangeEvent<HTMLInputElement>) => void;
  isLoading?: Signal<boolean>;
  variant: "order" | "userProfile";
}

const AddressCard = ({
  address,
  selectedAddressId,
  handleSelectAddress,
  isLoading,
  variant,
}: Props) => {
  const addressInfo = [
    address?.address_2,
    address?.city,
    address?.province,
    address?.postal_code,
  ];

  const disabled =
    (variant === "userProfile" && isLoading.value) ||
    cart.loading.value === "cart:get";
  return (
    <label
      class={cx(
        "relative flex flex-col cursor-pointer rounded-lg border bg-secondray p-4 shadow-sm ",
        variant === "userProfile" && selectedAddressId.value === address.id
          ? "ring-1 ring-primary-600"
          : "",
        variant === "userProfile" && disabled ? "!bg-gray-100" : ""
      )}
    >
      {variant === "userProfile" && selectedAddressId.value === address.id ? (
        <div className="absolute right-4 flex justify-end items-center gap-1 ">
          {disabled ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class={"animate-spin w-6 stroke-primary-600 duration-500"}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          ) : (
            <>
              <Typography variant="secondary">default</Typography>
              <svg
                class={`h-5 w-5 text-app-primary-600`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clip-rule="evenodd"
                />
              </svg>
            </>
          )}
        </div>
      ) : null}
      {variant === "userProfile" ? (
        <Radio
          name="address"
          className="sr-only"
          value={address.id}
          onClick={handleSelectAddress}
          disabled={disabled}
        />
      ) : null}
      <div class="flex flex-col w-10/12">
        <Typography size="body1/medium" variant="primary">
          {address?.address_1}
        </Typography>
        <Typography
          size="body1/normal"
          variant="secondary"
          className="mt-1 flex items-center"
        >
          {addressInfo.filter((i) => i).join(", ")}
        </Typography>
        <Typography variant="secondary" className="mt-1 flex items-center">
          Country:{" "}
          {address?.country_code === "in" ? "India" : address?.country_code}
        </Typography>
        <Typography variant="secondary" className="mt-1 flex items-center">
          Phone: {address?.phone}
        </Typography>
      </div>
    </label>
  );
};

export default AddressCard;
