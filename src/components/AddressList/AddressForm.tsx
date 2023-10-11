import Button from "@components/Button";
import FormControl from "@components/FormControl";
import Input from "@components/Input";
import type {
  Address,
  AddressCreatePayload,
  AddressPayload,
  Region,
} from "@medusajs/medusa";
import user from "@api/user";
import { Signal, useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";
import { addAddress } from "@/api/user/address/addAddress";
import Typography from "../Typography";
import { listRegion } from "@/api/user/region/listRegion";
import cart from "@/api/cart";

type TAddressForm = {
  isNewAddress: Signal<boolean>;
  address: Signal<Address[]>;
  selectedAddressId: Signal<string>;
};

const AddressForm = ({
  isNewAddress,
  address,
  selectedAddressId,
}: TAddressForm) => {
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
      payloadAddress.first_name = user.customer.value?.first_name;
      payloadAddress.last_name = user.customer.value?.last_name;
      payloadAddress.country_code = "IN";

      const addressRes = await addAddress(payloadAddress);
      address.value = addressRes?.customer?.shipping_addresses;
      const latestAddress: Address = [
        ...addressRes.customer.shipping_addresses,
      ].pop();
      selectedAddressId.value = latestAddress?.id;
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
            <Input
              name="phone"
              type="tel"
              label="Phone Number"
              autocomplete="phone"
              required={{ message: "Phone number is required!", value: true }}
              validator={(value) =>
                !/^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/.test(
                  value
                )
                  ? "Invalid phone number!"
                  : true
              }
              placeholder={"+91 9876543210"}
            />
          </div>

          <div class="flex justify-between items-center mt-5 border-t border-gray-200 pt-6">
            <Button
              variant="danger"
              type="button"
              onClick={() => (isNewAddress.value = false)}
            >
              Close
            </Button>
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
