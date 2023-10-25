import { isUser } from "@/store/userState";
import medusa from "@api/medusa";
import type { User, AdminUpdateUserRequest } from "@medusajs/medusa";
import { signal } from "@preact/signals";

type TAdminMetadata = {
  draftOrderId?: string;
};

type TAdminUpdatePayload = Omit<AdminUpdateUserRequest, "metadata"> & {
  metadata?: TAdminMetadata;
};

class Admin {
  state = signal<"authenticated" | "loading" | "unauthenticated">("loading");
  adminData = signal<User | null>(null);

  constructor() {
    // initially call admin
    if (!isUser.value) {
      this.refetch();
    }
  }

  async refetch() {
    try {
      // admin is logged in
      const result = await medusa.admin.auth.getSession();
      this.adminData.value = result.user;
      this.state.value = "authenticated";
    } catch (response: any) {
      const errorJson = response.toJSON?.();
      // admin is unauthenticated
      if (errorJson.status === 401) {
        this.state.value = "unauthenticated";
      }
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    const result = await medusa.admin.auth.createSession({ email, password });
    this.adminData.value = result.user;
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
    const createAdminResult = await medusa.admin.user.create({
      email,
      password,
      first_name,
      last_name,
    });
    if (createAdminResult.user.id) {
      await this.login({ email, password });
    }
  }

  async logout() {
    await medusa.admin.auth.deleteSession();
  }

  async requestPasswordReset({ email }: { email: string }) {
    await medusa.admin.users.sendResetPasswordToken({ email });
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
    await medusa.admin.user.resetPassword({ email, password, token });
  }

  // update user
  async updateAdminUser(payload: TAdminUpdatePayload) {
    const response = await medusa.admin.users.update(this.adminData.value.id, {
      payload,
    });
    this.adminData.value = response.customer;
  }
}

const admin = new Admin();

export default admin;
