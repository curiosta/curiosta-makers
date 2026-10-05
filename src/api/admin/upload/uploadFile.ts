import { uploadFile } from "./prepareFile";

/** Public file (product images): served via CloudFront. Images are compressed first. */
export const adminUploadFile = async (file: File) => uploadFile(file, false);
