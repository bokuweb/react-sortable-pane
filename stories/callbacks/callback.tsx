import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { SortablePane, Pane } from '../../src/index';
import { textStyle, paneStyle } from '../styles';

export default function SimpleVertical() {
  const panes = [0, 1, 2].map(key => (
    <Pane key={key} defaultSize={{ width: '100%', height: 120 }} style={paneStyle}>
      <p style={textStyle}>00{key}</p>
    </Pane>
  ));
  return (
    <div style={{ padding: '10px' }}>
      <SortablePane
        direction="vertical"
        margin={20}
        onResizeStart={action('resize start')}
        onResize={action('resize')}
        onResizeStop={action('resize stop')}
        onDragStart={action('drag start')}
        onDragStop={action('drag stop')}
        onOrderChange={action('order change')}
      >
        {panes}
      </SortablePane>
    </div>
  );
}
