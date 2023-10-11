import Button from "../Button";
import { Signal, useSignal } from "@preact/signals";
import Typography from "../Typography";
import AddressForm from "./AddressForm";
import { Address, Region } from "@medusajs/medusa";
import AddressCard from "./AddressCard";
import { isUser } from "@/store/userState";
import { ChangeEvent, useEffect } from "preact/compat";
import cart from "@/api/cart";
import user from "@/api/user";
import { listRegion } from "@/api/user/region/listRegion";

type Props = {
  address: Signal<Address[]>;
};

const AddressList = ({ address }: Props) => {
  const isNewAddress = useSignal<boolean>(false);
  const currentUser = user.customer.value;
  const selectedAddressId = useSignal<string | null>(
    currentUser?.billing_address_id
  );
  const isLoading = useSignal<boolean>(false);

  const handleSelectAddress = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.currentTarget;
    if (checked) {
      selectedAddressId.value = value;
    }
    isNewAddress.value = false;
  };

  // update shipping address
  const updateShippingAddress = async () => {
    isLoading.value = true;
    try {
      if (!cart.store.value?.id || !selectedAddressId.value) return;
      const regionRes = await listRegion();
      const regions: Region[] = regionRes?.regions;
      const shipping_addresses = currentUser?.shipping_addresses;
      const shippingCountryCodes = shipping_addresses.map(
        (address) => address.country_code
      );
      const regionId = regions?.find((region) =>
        shippingCountryCodes.includes(region.countries[0]?.iso_2)
      )?.id;
      await cart.updateCart({
        region_id: regionId,
        shipping_address: selectedAddressId.value,
        billing_address: selectedAddressId.value,
      });
      await user.updateUser({ billing_address: selectedAddressId.value });
    } catch (error) {
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() => {
    updateShippingAddress();
  }, [selectedAddressId.value]);

  return (
    <div className={`${isUser.value ? "mb-20" : "mb-4"}`}>
      <Typography size="h6/medium" className="p-2">
        Address
      </Typography>

      <div class="flex flex-col justify-center ">
        <div class="my-2 grid grid-cols-1 gap-4 sm:grid-cols-2 md:flex ">
          {isUser.value ? (
            <div className="w-full flex justify-end my-2">
              <Button
                type="button"
                title="add new address"
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

          {isUser.value ? (
            <div class={`${isNewAddress.value ? "block" : "hidden"} my-4`}>
              <AddressForm
                isNewAddress={isNewAddress}
                address={address}
                selectedAddressId={selectedAddressId}
              />
            </div>
          ) : null}
          {address.value?.length ? (
            address.value?.map((address) => (
              <AddressCard
                address={address}
                selectedAddressId={selectedAddressId}
                handleSelectAddress={handleSelectAddress}
                isLoading={isLoading}
                variant="userProfile"
              />
            ))
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
    </div>
  );
};

export default AddressList;
