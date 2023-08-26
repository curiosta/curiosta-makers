import medusa from "@api/medusa";

export const adminPaymentCapture = async (paymentId: string) => {
  return medusa.admin.payments.capturePayment(paymentId);
};
