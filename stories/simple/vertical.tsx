import * as React from 'react';
import { SortablePane, Pane } from '../../src/index';
import { textStyle, paneStyle } from '../styles';

export default function SimpleVertical() {
  const panes = [0, 1, 2].map(key => (
    <Pane key={key} className={`pane${key}`} defaultSize={{ width: '100%', height: 120 }} style={paneStyle}>
      <p style={textStyle}>00{key}</p>
    </Pane>
  ));
  return (
    <div style={{ padding: '10px' }}>
      <SortablePane direction="vertical" margin={20} className="panes">
        {panes}
      </SortablePane>
    </div>
  );
}
