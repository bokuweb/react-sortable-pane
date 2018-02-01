import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';

export default {
  input: 'src/components/index.js',
  plugins: [
    babel({
      plugins: ['external-helpers'],
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  ],
  external: ['react', 'react-motion', 're-resizable', 'lodash.isequal'],
  output: {
    sourcemap: true,
    exports: 'named',
    name: 'react-sortable-pane',
    globals: {
      'react': 'React',
    },
  },
};
