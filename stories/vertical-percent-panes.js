import React from 'react';
import { SortablePane, Pane } from '../src/components';

export default () => {
  return (
    <div style={{ padding: '10px' }}>
      <SortablePane
        direction="vertical"
        margin={20}
        onResize={(e, id, panes, data) => {
          console.log('onResize', e, id, panes, data);
        }}
        onResizeStart={(e, id, panes) => {
          console.log('onResizeStart', e, id, panes);
        }}
        onResizeStop={(e, id, panes, data) => {
          console.log('onResizeStop', e, id, panes, data);
        }}
        onOrderChange={(panes, next) => {
          console.log('onOrderChange', panes, next);
        }}
        onDragStart={(e, id, panes) => console.log('onDragStart', e, id, panes)}
        onDragStop={(e, id, panes) => console.log('onDragStop', e, id, panes)}
      >
        {[0, 1, 2].map(id => (
          <Pane
            id={id}
            key={id}
            width="100%"
            height="30%"
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
