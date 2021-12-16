import { Buffer } from "buffer";

export function urlSafeEncode(value: Buffer | string): string {
  return (typeof value === "string" ? Buffer.from(value) : value)
    .toString("base64")
    .replace(/\//g, "_")
    .replace(/\+/g, "-");
}
