const { build, context } = require("esbuild")
const { copy } = require("esbuild-plugin-copy")

const entryPoints = [
    "src/*.html",
    "src/index.ts"
]

function config(isProduction) {
    return {
        entryPoints,
        outdir: "dist",
        bundle: true,
        sourcemap: true,
        loader: {
            ".woff": "file",
            ".eot": "file",
            ".ttf": "file",
            ".html": "copy"
        },
        plugins: [
            copy({
                assets: {
                    from: [ "./src/assets/**/*" ],
                    to: [ "./assets" ]
                }
            })
        ],
        define: {
            "process.env.NODE_ENV": isProduction ? "\"production\"" : "\"dev\"",
            "process.env.IS_PREACT": "\"false\""
        },
        logLevel: "info"
    }
}

switch (process.argv[2]) {
    case "serve":
        (async () => {
            const ctx = await context({
                ...config(false),
                inject: [ "live-reload.js" ]
            })
            await ctx.watch()
            await ctx.serve({
                servedir: "dist"
            })
        })()
        break;
    case "build":
        build({
            ...config(true),
            minify: true
        })
        break;
    default:
        console.warn("Specify either serve or build as an argument.")
        break;
}
