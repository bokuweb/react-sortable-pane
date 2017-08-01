import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';

export default {
    entry: 'src/components/index.js',
    plugins: [
        babel(),
        replace({ 'process.env.NODE_ENV': JSON.stringify('production') })
    ],
    sourceMap: true,
    exports: 'named',
    moduleName: 'react-sortable-pane',
    external: [ 'react' ],
    globals: {
        'react': 'React',
    }
};