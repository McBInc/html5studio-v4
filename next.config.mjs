/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    /* 
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-filename" },
        ],
      },
    ];
    */
    return [
      {
        source: "/temp-builds/:path*(.js.br)",
        headers: [
          { key: "Content-Encoding", value: "br" },
          { key: "Content-Type", value: "application/javascript" },
        ],
      },
      {
        source: "/temp-builds/:path*(.wasm.br)",
        headers: [
          { key: "Content-Encoding", value: "br" },
          { key: "Content-Type", value: "application/wasm" },
        ],
      },
      {
        source: "/temp-builds/:path*(.data.br)",
        headers: [
          { key: "Content-Encoding", value: "br" },
          { key: "Content-Type", value: "application/octet-stream" },
        ],
      }
    ];
  },
};
export default nextConfig;
