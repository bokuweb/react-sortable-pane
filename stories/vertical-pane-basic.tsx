import * as React from 'react';
import { SortablePane, Pane } from '../src/index';

export default () => {
  const panes = [0, 1, 2].map(id => (
    <Pane
      id={id}
      key={id}
      width="100%"
      height={120}
      style={{
        display: 'flex' as 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'solid 1px #ddd',
        backgroundColor: '#f0f0f0',
      }}
    >
      <p
        style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#aaa',
        }}
      >
        00{id}
      </p>
    </Pane>
  ));
  return (
    <div style={{ padding: '10px' }}>
      <SortablePane direction="vertical" margin={20}>
        {panes}
      </SortablePane>
    </div>
  );
};
