import type { Address } from "@medusajs/medusa";
import Typography from "@components/Typography";
import type { Signal } from "@preact/signals";

interface Props {
  address: Address;
}

const AddressCard = ({ address }: Props) => {
  const addressInfo = [
    address.address_2,
    address.city,
    address.province,
    address.postal_code,
  ];

  return (
    <div class="relative flex cursor-pointer rounded-lg border bg-secondray p-4 shadow-sm">
      <div class="flex flex-col w-full">
        <Typography size="body1/medium" variant="primary">
          {address.address_1}
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
          {address.country_code === "in" ? "India" : address.country_code}
        </Typography>
        <Typography variant="secondary" className="mt-1 flex items-center">
          Phone: {address.phone}
        </Typography>
      </div>
    </div>
  );
};

export default AddressCard;
