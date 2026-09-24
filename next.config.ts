import type { NextConfig } from "next"
import path from "node:path"

const nextConfig: NextConfig = {
    devIndicators: false,
    turbopack: {
        // Pin the Turbopack root to this project so it stops scanning
        // C:\Users\ASHU (which contains a foreign package-lock.json /
        // package.json) during root detection.
        root: __dirname,
    },
}

export default nextConfig