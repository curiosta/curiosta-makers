import Button from "../Button";
import { Signal, useSignal } from "@preact/signals";
import Typography from "../Typography";
import AddressForm from "./AddressForm";
import { Address } from "@medusajs/medusa";
import AddressCard from "./AddressCard";
import { isUser } from "@/store/userState";

type Props = {
  address: Signal<Address[]>;
};

const AddressList = ({ address }: Props) => {
  const isNewAddress = useSignal<boolean>(false);

  return (
    <div className={`${isUser.value ? "mb-20" : "mb-4"}`}>
      <Typography size="h6/medium" className="p-2">
        Address
      </Typography>

      <div class="flex flex-col justify-center ">
        <div class="my-2 grid grid-cols-1 sm:grid-cols-2 md:flex ">
          {isUser.value ? (
            <div className="w-full flex justify-end">
              <Button
                type="button"
                title="add new address"
                className={`${!address.value?.length ? "flex" : "hidden"}`}
                onClick={() => {
                  isNewAddress.value = !isNewAddress.value;
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6 stroke-secondray stroke-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Add
              </Button>
            </div>
          ) : null}

          {address.value?.length ? (
            address.value?.map((address) => <AddressCard address={address} />)
          ) : (
            <Typography
              size="body2/normal"
              variant="error"
              className="my-4 text-center"
            >
              Address not found
            </Typography>
          )}
        </div>
      </div>

      {isUser.value ? (
        <div class={`${isNewAddress.value ? "block" : "hidden"} my-4`}>
          <AddressForm isNewAddress={isNewAddress} address={address} />
        </div>
      ) : null}
    </div>
  );
};

export default AddressList;
