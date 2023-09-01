import Medusa from "@medusajs/medusa-js";

export const getOrders = async (orderId: string) => {
  const medusa = new Medusa({
    baseUrl: import.meta.env.VITE_PUBLIC_BASE_URL,
    maxRetries: 3,
    apiKey: import.meta.env.VITE_PRIVATE_API_TOKEN,
  });
  return medusa.admin.orders.retrieve(orderId);
};
