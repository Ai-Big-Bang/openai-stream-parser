const typescript = require('@rollup/plugin-typescript');

const sources = [
  { input: 'src/index.ts', format: 'umd', file: 'dist/umd.js', name: 'OpenAIStreamParser' },
  { input: 'src/index.ts', format: 'esm', file: 'dist/esm.js' },
  { input: 'src/index.ts', format: 'cjs', file: 'dist/cjs.js' },
];

module.exports = sources.map(({ input, format, file, name }) => ({
  input: input,
  output: {
    file: file,
    format: format,
    name: name || undefined,
  },
  plugins: [typescript()],
}));
