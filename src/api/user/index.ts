import { isUser } from "@/store/userState";
import medusa from "@api/medusa";
import type { Customer, StorePostCustomersCustomerReq } from "@medusajs/medusa";
import { signal } from "@preact/signals";

type TCustomerMetadata = {
  cart_id?: string | null;
  profile_image_key?: string;
  dob?: Date;
  gender?: string;
  documentInfo?: {
    idType: string;
    idNumber: string;
    idImageKey: string;
  }[];
  temp_password?: string;
  new_account?: boolean;
};

export type TCustomer = Omit<Customer, "password_hash" | "metadata"> & {
  metadata?: TCustomerMetadata;
};

export type TCustomerUpdatePayload = Omit<
  StorePostCustomersCustomerReq,
  "metadata"
> & {
  metadata?: TCustomerMetadata;
};

class User {
  state = signal<"authenticated" | "loading" | "unauthenticated">("loading");
  customer = signal<TCustomer | null>(null);

  constructor() {
    // initially call user
    if (isUser.value) {
      this.refetch();
    }
  }

  async refetch() {
    try {
      // user is logged in
      const result = await medusa.auth.getSession();
      this.customer.value = result.customer;
      this.state.value = "authenticated";
    } catch (response: any) {
      const errorJson = response.toJSON?.();
      // user is unauthenticated
      if (errorJson.status === 401) {
        this.state.value = "unauthenticated";
      }
    }
  }

  async updateUser(payload: TCustomerUpdatePayload) {
    const response = await medusa.customers.update(payload);
    this.customer.value = response.customer;
  }

  async login({ email, password }: { email: string; password: string }) {
    const result = await medusa.auth.authenticate({ email, password });
    this.customer.value = result.customer;
    this.state.value = "authenticated";
  }
  async register({
    email,
    password,
    first_name,
    last_name,
  }: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) {
    const createCustomerResult = await medusa.customers.create({
      email,
      password,
      first_name,
      last_name,
    });
    if (createCustomerResult.customer.id) {
      await this.login({ email, password });
    }
  }

  async logout() {
    await medusa.auth.deleteSession();
  }

  async requestPasswordReset({ email }: { email: string }) {
    await medusa.customers.generatePasswordToken({ email });
  }

  async passwordReset({
    email,
    password,
    token,
  }: {
    email: string;
    password: string;
    token: string;
  }) {
    await medusa.customers.resetPassword({ email, password, token });
  }
}

const user = new User();

export default user;
