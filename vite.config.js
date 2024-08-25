import { defineConfig } from "vite"
import preact from "@preact/preset-vite"

export default defineConfig({
    plugins: [preact()],
    build: {
        rollupOptions: {
            external: ["buffer", "tweetnacl", "elliptic"],
        },
    },
    resolve: {
        alias: {
            buffer: "buffer",
        },
    },
    base: "./", // הגדרה של base כדי לוודא שהקבצים ייטענו נכון גם בתיקיות יחסיות
})
