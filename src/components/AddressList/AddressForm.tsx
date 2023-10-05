import Button from "@components/Button";
import FormControl from "@components/FormControl";
import Input from "@components/Input";
import type {
  Address,
  AddressCreatePayload,
  AddressPayload,
} from "@medusajs/medusa";
import user from "@api/user";
import { Signal, useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";
import { addAddress } from "@/api/user/address/addAddress";
import Typography from "../Typography";

type TAddressForm = {
  isNewAddress: Signal<boolean>;
  address: Signal<Address[]>;
};

const AddressForm = ({ isNewAddress, address }: TAddressForm) => {
  const isLoading = useSignal<boolean>(false);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const errorMessage = useSignal<string | null>(null);

  const handleAddAddress = async (data: AddressCreatePayload) => {
    try {
      isLoading.value = true;
      if (errorMessage.value) {
        errorMessage.value = null;
      }
      const payloadAddress = { ...data };
      if (user.customer.value?.phone) {
        payloadAddress.first_name = user.customer.value?.first_name;
        payloadAddress.last_name = user.customer.value?.last_name;
        payloadAddress.phone = user.customer.value?.phone;
        payloadAddress.country_code = "IN";
      } else {
        throw new Error("Please add phone No. in profile first!");
      }
      const addressRes = await addAddress(payloadAddress);
      address.value = addressRes?.customer?.shipping_addresses;
      isNewAddress.value = false;
      resetButtonRef.current?.click();
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = false;
    }
  };

  return (
    <div class="w-full bg-secondray shadow-sm rounded-lg border p-4">
      <Typography
        size="body1/semi-bold"
        className="my-2 text-center capitalize"
      >
        Add new address
      </Typography>
      <div class="relative mx-auto max-w-2xl">
        <FormControl
          class="sm:px-6 mt-4 flex flex-col gap-5 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-4"
          noValidate
          mode="onSubmit"
          onSubmit={handleAddAddress}
        >
          <Input
            type="text"
            label="Address"
            name="address_1"
            autocomplete="street-address"
            required={{ message: "Address is required!", value: true }}
          />
          <div class=" grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
            <Input
              type="text"
              name="city"
              label="City"
              autocomplete="address-level2"
              required={{ message: "City is required!", value: true }}
            />
            <Input
              type="text"
              name="province"
              label="State"
              autocomplete="address-level1"
              required={{ message: "State is required!", value: true }}
            />

            <Input
              type="text"
              name="postal_code"
              label="Postal code"
              required={{
                message: "Postal code is required!",
                value: true,
              }}
              minLength={5}
              autocomplete="postal-code"
            />
          </div>

          <div class="mt-5 border-t border-gray-200 pt-6">
            <div className="flex justify-end items-center gap-4">
              <Button
                variant="danger"
                type="reset"
                className="!w-max"
                ref={resetButtonRef}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="primary"
                title="Save address"
                className="!w-auto max-xs:!px-4"
                disabled={isLoading.value}
              >
                {isLoading.value ? "Loading..." : "Save Address"}
              </Button>
            </div>
          </div>
          {errorMessage.value ? (
            <Typography variant="error" className="text-center mt-2">
              {errorMessage.value}
            </Typography>
          ) : null}
        </FormControl>
      </div>
    </div>
  );
};

export default AddressForm;
