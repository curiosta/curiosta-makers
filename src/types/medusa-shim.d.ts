/**
 * Type-only stand-in for "@medusajs/medusa".
 *
 * The app only ever imported *types* from the Medusa server package. Installing the
 * real package pulled the entire backend dependency tree (TypeORM, MikroORM, Redis,
 * bullmq, ...) into the frontend, which is where almost every Dependabot alert came
 * from - none of that code is ever bundled. This shim keeps the imports compiling.
 * The shapes are intentionally loose; the authoritative types live in the backend.
 */
declare module "@medusajs/medusa" {
  type Loose = { [key: string]: any };
  export type Address = Loose;
  export type AddressCreatePayload = Loose;
  export type AdminCreateUserRequest = Loose;
  export type AdminGetCustomersParams = Loose;
  export type AdminGetOrdersParams = Loose;
  export type AdminGetProductCategoriesParams = Loose;
  export type AdminGetReturnsParams = Loose;
  export type AdminPostCustomersCustomerReq = Loose;
  export type AdminPostCustomersReq = Loose;
  export type AdminUpdateUserRequest = Loose;
  export type BatchJob = Loose;
  export type Customer = Loose;
  export type Item = Loose;
  export type LineItem = Loose;
  export type Order = Loose;
  export type Product = Loose;
  export type ProductCategory = Loose;
  export type Region = Loose;
  export type Return = Loose;
  export type StoreGetProductCategoriesParams = Loose;
  export type StoreGetProductsParams = Loose;
  export type StorePostCustomersCustomerReq = Loose;
  export type User = Loose;
}
