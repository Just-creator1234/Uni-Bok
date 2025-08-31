// middleware.js
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/Allcourse/:path*", "/profile/:path*", "/dashboard/:path*"],
};