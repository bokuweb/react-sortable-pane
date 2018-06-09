/* eslint-disable */

import * as React from 'react';
import { SortablePane, Pane } from '../../src/index';
import { Button } from '@storybook/react/demo';

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'solid 1px #ddd',
  background: '#f0f0f0',
};

export default class VerticalPaneWithController extends React.Component {

  constructor(props) {
    super(props);
    this.id = 3;
    this.state = {
      order: ['0', '1', '2'],
      list: [0, 1, 2].map(id => (
        <Pane
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
    const order = [String(this.id), ...this.state.order];
    this.state.list.splice(~~(Math.random() * this.state.list.length), 0, (
      <Pane
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
          00{this.id++}
        </p>
      </Pane>
    ));
    this.setState({ list: this.state.list, order });
  }

  remove() {
    const index = ~~(Math.random() * this.state.list.length);
    const a = this.state.list.splice(index, 1);
    console.log('aaa', a[0].key)
    const order = this.state.order.filter(o => o !== a[0].key);
    this.setState({ list: this.state.list, order });
  }

  render() {
    return (
      <div style={{ padding: '10px' }}>
        <Button onClick={() => this.add()}>Add</Button>
        <Button onClick={() => this.remove()}>Remove</Button>
        <SortablePane
          direction="vertical"
          margin={20}
          order={this.state.order}
          onOrderChange={order => this.setState({ order })}
        >
          {this.state.list}
        </SortablePane>
      </div>
    );
  }
}
