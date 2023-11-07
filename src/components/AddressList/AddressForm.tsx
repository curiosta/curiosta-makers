import Button from "@components/Button";
import type { Address } from "@medusajs/medusa";
import user from "@api/user";
import { Signal, useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";
import { addAddress } from "@/api/user/address/addAddress";
import Typography from "../Typography";
import countryList from "@/utils/countryList";
import { ChangeEvent } from "preact/compat";
import NewInput from "../Input/NewInput";
import MultiRadio from "../MultiRadio";

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
  const formRef = useRef<HTMLFormElement>(null);
  const selectedCountryCode = useSignal<string | undefined>(undefined);

  const handleAddAddress = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    isLoading.value = true;
    if (errorMessage.value) {
      errorMessage.value = null;
    }
    try {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        const formDataObj = Object.fromEntries(formData.entries());
        const { address_1, city, province, postal_code, phone } = formDataObj;
        if (!selectedCountryCode.value) {
          throw Error("Please select country");
        }
        const phoneCode = countryList.find(
          (country) => country.code === selectedCountryCode.value
        )?.dial_code;
        const phonePattern = /^\d+\S*$/;
        if (!phonePattern.test(phone.toString())) {
          throw Error("Invalid phone number!");
        }
        const payloadAddress = {
          first_name: user.customer.value?.first_name,
          last_name: user.customer.value?.last_name,
          address_1: address_1.toString(),
          city: city.toString(),
          province: province.toString(),
          postal_code: postal_code.toString(),
          country_code: selectedCountryCode.value,
          phone: phoneCode + phone.toString(),
        };
        const addressRes = await addAddress(payloadAddress);
        address.value = addressRes?.customer?.shipping_addresses;
        const latestAddress: Address = [
          ...addressRes.customer.shipping_addresses,
        ].pop();
        selectedAddressId.value = latestAddress?.id;
        isNewAddress.value = false;
        resetButtonRef.current?.click();
        selectedCountryCode.value = undefined;
      }
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
        <form
          class="sm:px-6 mt-4 flex flex-col gap-5 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-4"
          onSubmit={handleAddAddress}
          ref={formRef}
        >
          <NewInput
            type="text"
            label="Address"
            name="address_1"
            autocomplete="street-address"
            className="capitalize"
            required
          />
          <div class=" grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
            <NewInput
              type="text"
              name="city"
              label="City"
              autocomplete="address-level2"
              className="capitalize"
              required
            />
            <NewInput
              type="text"
              name="province"
              label="State"
              autocomplete="address-level1"
              className="capitalize"
              required
            />

            <NewInput
              type="text"
              name="postal_code"
              label="Postal code"
              required
              minLength={5}
              autocomplete="postal-code"
            />
          </div>
          <div class=" grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <Typography
                size="body2/medium"
                className="leading-6 text-gray-900 flex gap-1 mb-1"
              >
                Select Country
              </Typography>
              <MultiRadio
                options={countryList}
                placeholder="Search country..."
                selectedValue={selectedCountryCode}
                variant="countries"
              />
            </div>
            <NewInput
              name="phone"
              type="tel"
              label="Phone Number"
              autocomplete="phone"
              leftAdornment={
                selectedCountryCode.value
                  ? countryList.find(
                      (country) => country.code === selectedCountryCode.value
                    )?.dial_code
                  : "N/A"
              }
              required
              placeholder={"9876543210"}
              minLength={5}
              maxLength={15}
            />
          </div>

          {errorMessage.value ? (
            <Typography variant="error" className="text-center mt-2">
              {errorMessage.value}
            </Typography>
          ) : null}
          <div class="flex justify-between items-center gap-3 mt-5 border-t border-gray-200 pt-6">
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
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
