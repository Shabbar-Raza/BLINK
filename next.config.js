/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      "mongodb-client-encryption": false,
      "aws4": false,
      "kerberos": false,
      "mongodb-client-encryption": false,
      "snappy": false,
      "@mongodb-js/zstd": false,
      "@aws-sdk/credential-providers": false,
      "gcp-metadata": false,
      "socks": false,
      "aws-crt": false,
    };
    return config;
  },
  output: 'export',
  images: {
    unoptimized: true,
  },
  // basePath: '/<your-repo-name>',
}

module.exports = nextConfig
