/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "engineer-project-api.onrender.com",
                port: "",
                pathname: "**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "7777",
                pathname: "**",
            },
        ],
    },
};

module.exports = nextConfig;
