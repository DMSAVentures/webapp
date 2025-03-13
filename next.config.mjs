/** @type {import('next').NextConfig} */
const nextConfig = {
    sassOptions: {
        sourceMap: true,
    },
    images: {
        domains: ['*'],
    },
    eslint: {
        ignoreDuringBuilds: false,
    },
};

export default nextConfig;
