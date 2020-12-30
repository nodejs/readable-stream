require("esbuild").buildSync({
  bundle: true,
  entryPoints: ['./readable.js'],
  format: "esm",
  inject: ['./build/node-shim.js'],
  outfile: './_readable-deno.js',
  platform: "node",
});