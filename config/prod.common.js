import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.tsx',
  ignore: ['stories'],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      exclude: ['*.d.ts', 'stories'],
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  ],
  external: ['react', 'react-motion', 're-resizable', 'lodash.isequal', 'resize-observer-polyfill', 'lodash.debounce'],
  output: {
    sourcemap: true,
    exports: 'named',
    name: 'react-sortable-pane',
    globals: {
      react: 'React',
    },
  },
};
