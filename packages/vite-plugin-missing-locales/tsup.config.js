/** @type {import("tsup").Options} */
export const tsup = {
  entryPoints: ["src/index.ts", "src/cli"],
  format: ["esm", "cjs"],
  sourcemap: true,
  splitting: true,
  clean: true,
  target: "node14",
};
