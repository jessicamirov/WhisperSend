import { defineConfig } from "vite"
import preact from "@preact/preset-vite"
import inject from "@rollup/plugin-inject"
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill"
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill"

export default defineConfig({
    assetsInclude: ["public/**"],
    plugins: [
        preact(),
        inject({
            Buffer: ["buffer", "Buffer"], // Inject the Buffer global
        }),
        {
            name: "resolve-tweetnacl",
            resolveId(source) {
                if (source === "tweetnacl") {
                    return { id: require.resolve("tweetnacl"), external: false }
                }
                return null
            },
        },
        {
            name: "resolve-elliptic",
            resolveId(source) {
                if (source === "elliptic") {
                    return { id: require.resolve("elliptic"), external: false }
                }
                return null
            },
        },
    ],
    build: {
        rollupOptions: {
            external: [], // Ensure that no external modules are wrongly treated
        },
    },
    resolve: {
        alias: {
            buffer: "buffer", // Alias the buffer module to the browser-compatible version
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            // Enable polyfills for Node.js globals and modules in the browser
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    process: true, // Polyfill for process.env in the browser
                    buffer: true, // Polyfill for Buffer in the browser
                }),
                NodeModulesPolyfillPlugin(),
            ],
        },
    },
    base: "/", // Use relative paths for assets in production
})
