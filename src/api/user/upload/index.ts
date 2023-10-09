const baseUrl = import.meta.env.VITE_PUBLIC_BASE_URL;

export const customerUploadFile = async () => {
  const response = await fetch(`${baseUrl}/uploads/getPreSignedUrl?ext=png`, {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  return data;
};
