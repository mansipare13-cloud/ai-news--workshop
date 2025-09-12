import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.livemint.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'webassets.mongodb.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'nypost.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.insider.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'biztoc.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imageio.forbes.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ml.globenewswire.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cmg-cmg-rd-20021-prod.cdn.arcpublishing.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pubs.rsc.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains for flexibility
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
