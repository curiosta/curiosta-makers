import { signal } from "@preact/signals";

const localIsUser: boolean = JSON.parse(
  localStorage.getItem("userRole")
)?.isUser;

export const isUser = signal<boolean>(localIsUser ?? true);
