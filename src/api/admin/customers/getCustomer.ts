import medusa from "@api/medusa";

export const adminGetCustomer = async ({
  customerId,
}: {
  customerId: string;
}) => {
  return medusa.admin.customers.retrieve(customerId);
};
