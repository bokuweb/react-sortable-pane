/* eslint-disable */

import React from 'react';
import { SortablePane, Pane } from '../src/components';
import { Button } from '@storybook/react/demo';

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'solid 1px #ddd',
  background: '#f0f0f0',
};

export default class VerticalPaneWithController extends React.Component {
  constructor() {
    super();
    this.id = 3;
    this.state = {
      order: [0, 1, 2],
      list: [0, 1, 2].map(id => (
        <Pane
          id={id}
          key={id}
          width="100%"
          height={120}
          style={style}
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
      )),
    };
  }

  add() {
    this.state.list.splice(~~(Math.random() * this.state.list.length), 0, (
      <Pane
        id={++this.id}
        key={this.id}
        width="100%"
        height={120}
        style={style}
      >
        <p
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#aaa',
          }}
        >
          00{this.id}
        </p>
      </Pane>
    ));
    this.setState({ list: this.state.list });
  }

  remove() {
    this.state.list.splice(~~(Math.random() * this.state.list.length), 1);
    this.setState({ list: this.state.list });
  }

  render() {
    return (
      <div style={{ padding: '10px' }}>
        <Button onClick={() => this.add()}>Add</Button>
        <Button onClick={() => this.remove()}>Remove</Button>
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
          {this.state.list}
        </SortablePane>
      </div>
    );
  }
}
