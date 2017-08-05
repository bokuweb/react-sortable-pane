import React from 'react';

import { SortablePane, Pane } from '../src/components';

export default () => {
  return (
    <div style={{ padding: '10px' }}>
      <SortablePane
        direction="vertical"
        margin={20}
      >
        {[0, 1, 2].map(id => (
          <Pane
            id={id}
            key={id}
            width="100%"
            height={120}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'solid 1px #ddd',
              background: '#f0f0f0',
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
        ))}
      </SortablePane>
    </div>
  );
};
