// lib/utils.js
import slugify from "slugify";

export function slugify(text) {
  return slugify(text, {
    lower: true, // convert to lowercase
    strict: true, // remove special characters
    trim: true, // trim leading/trailing spaces
    replacement: "-", // replace spaces with hyphens
    remove: /[*+~.()'"!:@]/g, // remove these characters
  });
}

// Optional: You can add other utility functions here
export function generateRandomString(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
