/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: "attachment",
        contentSecurityPolicy:
            "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "7777",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "engineer-project-api.onrender.com",
                port: "",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "covers.openlibrary.org",
                port: "",
                pathname: "**",
            },
        ],
    },
};

module.exports = nextConfig;
