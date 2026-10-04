import Medusa from "@medusajs/medusa-js";
import { baseUrl } from "../config";

const medusa = new Medusa({
  baseUrl,
  maxRetries: 3,
});

export default medusa;
