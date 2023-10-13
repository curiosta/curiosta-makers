import medusa from "@api/medusa";

export const adminMarkPaidDraftOrder = async (draftOrderId: string) => {
  return medusa.admin.draftOrders.markPaid(draftOrderId);
};
