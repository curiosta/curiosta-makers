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
import Select from "../Select";
import countryList from "@/utils/countryList";
import { ChangeEvent } from "preact/compat";
import NewInput from "../Input/NewInput";
import MultiRadio from "../MultiRadio";

type TAddressForm = {
  isNewAddress: Signal<boolean>;
  address: Signal<Address[]>;
  selectedAddressId: Signal<string>;
};

type TCountryList = {
  name: string;
  dial_code: string;
  code: string;
};

const AddressForm = ({
  isNewAddress,
  address,
  selectedAddressId,
}: TAddressForm) => {
  const isLoading = useSignal<boolean>(false);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const errorMessage = useSignal<string | null>(null);
  const selectedCountryCode = useSignal<string | undefined>(undefined);

  const handleAddAddress = async (data: AddressCreatePayload) => {
    isLoading.value = true;
    if (errorMessage.value) {
      errorMessage.value = null;
    }
    try {
      if (!selectedCountryCode.value) {
        throw Error("Please select country");
      }
      const phoneCode = countryList.find(
        (country) => country.code === selectedCountryCode.value
      )?.dial_code;
      const payloadAddress = { ...data };
      payloadAddress.first_name = user.customer.value?.first_name;
      payloadAddress.last_name = user.customer.value?.last_name;
      payloadAddress.country_code = selectedCountryCode?.value;
      payloadAddress.phone = phoneCode + data.phone;
      console.log(data);
      // const addressRes = await addAddress(payloadAddress);
      // address.value = addressRes?.customer?.shipping_addresses;
      // const latestAddress: Address = [
      //   ...addressRes.customer.shipping_addresses,
      // ].pop();
      // selectedAddressId.value = latestAddress?.id;
      // isNewAddress.value = false;
      selectedCountryCode.value = undefined;
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
            <div className="">
              <Typography
                size="body2/medium"
                className="leading-6 text-gray-900 flex gap-1 mb-1"
              >
                Select Country
              </Typography>
              <MultiRadio
                name="country_code"
                options={countryList}
                placeholder="Search country..."
                selectedValue={selectedCountryCode}
                required
              />
            </div>
            <Input
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
              required={{ message: "Phone number is required!", value: true }}
              placeholder={"9876543210"}
              validator={(value) =>
                !/\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
                  value
                )
                  ? "Invalid phone number!"
                  : true
              }
              minLength={5}
              maxLength={15}
            />
          </div>

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
