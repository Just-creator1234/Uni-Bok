/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dnu560qk3/**", // your Cloudinary cloud name
      },
    ],
  },
};

module.exports = nextConfig;
