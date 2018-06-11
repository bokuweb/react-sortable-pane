import * as React from 'react';
import { SortablePane, Pane } from '../../src/index';
import { textStyle, paneStyle } from '../styles';

export default function PanePropsMax() {
  const panes = [0, 1, 2].map(key => (
    <Pane key={key} defaultSize={{ width: 120, height: '100%' }} maxWidth={300} maxHeight={"80%"} style={paneStyle}>
      <p style={textStyle}>00{key}</p>
    </Pane>
  ));
  return (
    <div style={{ padding: '10px' }}>
      <SortablePane direction="horizontal" margin={20}>
        {panes}
      </SortablePane>
    </div>
  );
}
