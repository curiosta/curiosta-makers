import medusa from "@api/medusa";
import user from "@api/user";
import useLocalStorage from "@hooks/useLocalStorage";
import {
  type StoreCompleteCartRes,
  Region,
  DraftOrder,
  AdminPostDraftOrdersReq,
  AdminPostDraftOrdersDraftOrderReq,
} from "@medusajs/medusa";
import type { PricedShippingOption } from "@medusajs/medusa/dist/types/pricing";
import { signal } from "@preact/signals";
import admin from "..";

type TDraftOrderMetadata = {
  cartType: string;
  borrowReturnDate?: string;
};

type TLoadableOptionsList = {
  draftOrder:
    | "get"
    | "create"
    | "update"
    | "reset"
    | "complete"
    | {
        line_items:
          | "get"
          | "add"
          | "remove"
          | "update"
          | "update_metadata"
          | { quantity: "" };
        shipping: "all" | "set";
        payment_session: "create";
      };
};

type TLoadableOptions = FlattenOptionsList<TLoadableOptionsList>;

class DraftOrderStore {
  // actual cart data
  store = signal<DraftOrder | null>(null);
  // order data
  orderStore = signal<StoreCompleteCartRes | null>(null);

  loading = signal<TLoadableOptions | undefined>(undefined);

  // shipping methods related states
  shipping = {
    options: signal<PricedShippingOption[] | undefined>(undefined),
    selectedOption: signal<string | undefined>(undefined),
  };

  constructor() {
    // run initialize when user.state.value changes from loading to authenticated/unauthenticated
    // effect(() => {
    //   this.initialize();
    // });
  }

  async createDraftOrder(payload: AdminPostDraftOrdersReq) {
    this.loading.value = "draftOrder:complete";
    const { region_id, email, customer_id, billing_address } = payload;
    const listShippingOption = await medusa.admin.shippingOptions.list({
      region_id,
    });
    const result = await medusa.admin.draftOrders.create({
      email,
      region_id,
      customer_id,
      billing_address,
      shipping_address: billing_address,
      shipping_methods: [
        {
          option_id: listShippingOption.shipping_options[0]?.id,
        },
      ],
    });
    this.store.value = result.draft_order;
    await admin.updateAdminUser({
      metadata: { draftOrderId: result.draft_order.id },
    });
    this.loading.value = undefined;
  }

  async getDraftOrder(id: string) {
    this.loading.value = "draftOrder:get";
    const result = await medusa.admin.draftOrders.retrieve(id);
    this.loading.value = undefined;
    this.store.value = result.draft_order;
  }

  async updateDraftOrder(payload: AdminPostDraftOrdersDraftOrderReq) {
    if (!this.store.value)
      throw new Error(
        "Draft order was not initialize before using draftOrder.updateDraftOrder function."
      );
    this.loading.value = "draftOrder:update";

    const updateResult = await medusa.admin.draftOrders.update(
      this.store.value.id,
      {
        payload,
      }
    );
    this.store.value = updateResult.cart;

    this.loading.value = undefined;
  }

  // line items

  async addItem({
    variant_id,
    quantity = 1,
    metadata,
  }: {
    variant_id: string;
    quantity?: number;
    metadata: TDraftOrderMetadata;
  }) {
    if (!this.store.value)
      throw new Error(
        "Draft order was not initialize before using draftOrder.addItem function."
      );
    this.loading.value = "draftOrder:line_items:add";
    const response = await medusa.admin.draftOrders.addLineItem(
      this.store.value.id,
      {
        quantity,
        variant_id,
        metadata,
      }
    );
    this.loading.value = undefined;
    this.store.value = response.draft_order;
  }

  async removeItem(line_id: string) {
    if (!this.store.value)
      throw new Error(
        "Draft order was not initialize before using draftOrder.removeItem function."
      );
    this.loading.value = "draftOrder:line_items:remove";
    const response = await medusa.admin.draftOrders.removeLineItem(
      this.store.value.id,
      line_id
    );
    this.store.value = response.draft_order;
    this.loading.value = undefined;
  }

  async updateItemMetaData({
    variant_id,
    quantity,
    metadata,
  }: {
    variant_id: string;
    quantity: number;
    metadata: TDraftOrderMetadata;
  }) {
    if (!this.store.value)
      throw new Error(
        "Cart was not initialize before using cart.setItemQuantity function."
      );
    this.loading.value = "draftOrder:line_items:update_metadata";
    const response = await medusa.admin.draftOrders.addLineItem(
      this.store.value.id,
      {
        quantity,
        variant_id,
        metadata,
      }
    );
    this.store.value = response.draft_order;
    this.loading.value = undefined;
  }

  async setItemQuantity(line_id: string, quantity: number) {
    if (!this.store.value)
      throw new Error(
        "Draft order was not initialize before using draftOrder.setItemQuantity function."
      );
    this.loading.value = "draftOrder:line_items:update";
    const item = this.store.value.cart.items.find(
      (item) => item.id === line_id
    );
    if (quantity < 1) {
      this.loading.value = undefined;
      throw new Error("Cannot set quantity less than 1.");
    }
    if (!item) {
      this.loading.value = undefined;
      throw new Error("Cannot find item with this id!");
    }
    if (quantity > item.variant.inventory_quantity) {
      this.loading.value = undefined;
      throw new Error(
        `Cannot set quantity exceeding ${item.variant.inventory_quantity} !.`
      );
    }
    const response = await medusa.admin.draftOrders.updateLineItem(
      this.store.value.id,
      line_id,
      { quantity }
    );
    this.store.value = response.cart;
    this.loading.value = undefined;
  }

  async resetDraftOrder() {
    await admin.updateAdminUser({
      metadata: { draftOrderId: "" },
    });
  }

  // complete cart
  async completeDraftOrder(id: string) {
    if (!this.store.value?.id) return null;
    this.loading.value = "draftOrder:complete";
    const result = await medusa.admin.draftOrders.markPaid(this.store.value.id);
    this.orderStore.value = result;
    await this.resetDraftOrder();
    this.loading.value = undefined;
  }
}

const cart = new DraftOrderStore();

export default cart;
