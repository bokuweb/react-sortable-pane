import common from './prod.common';

export default Object.assign({}, common, {
  output: Object.assign(common.output, {
    file: 'lib/react-sortable-pane.js',
    format: 'es',
  }),
});
