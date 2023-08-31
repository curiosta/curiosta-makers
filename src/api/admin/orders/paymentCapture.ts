import medusa from "@api/medusa";

export const adminPaymentCapture = async (orderId: string) => {
  return medusa.admin.orders.capturePayment(orderId);
};
