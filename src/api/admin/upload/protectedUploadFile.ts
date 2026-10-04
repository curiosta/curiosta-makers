import { uploadFile } from "./prepareFile";

/** Private file (ID proofs, member photos, CSV imports): only via presigned URLs. */
export const adminProtectedUploadFile = async (file: File) => uploadFile(file, true);
