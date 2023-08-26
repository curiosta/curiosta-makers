import medusa from "@api/medusa";

type TReturnItem = {
  item_id: string;
  quantity: number;
};

export const adminApproveReturn = async (
  returnId: string,
  items: TReturnItem[]
) => {
  return medusa.admin.returns.receive(returnId, { items });
};
