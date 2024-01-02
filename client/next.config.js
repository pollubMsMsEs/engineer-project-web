/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
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
            {
                protocol: "http",
                hostname: "covers.openlibrary.org",
                port: "",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "image.tmdb.org",
                port: "",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "images.igdb.com",
                port: "",
                pathname: "**",
            },
        ],
    },
};

module.exports = nextConfig;
