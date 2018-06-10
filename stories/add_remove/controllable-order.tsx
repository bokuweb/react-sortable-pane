/* eslint-disable */

import * as React from 'react';
import { SortablePane, Pane } from '../../src/index';
import { Button } from '@storybook/react/demo';
import { textStyle, paneStyle } from '../styles';

type State = {
  list: Element[];
  order: string[];
};

export default class ControllableOrder extends React.Component {
  id = 3;
  state = {
    list: [],
    order: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      order: ['hoge0', 'hoge1', 'hoge2'],
      list: [0, 1, 2].map(id => (
        <Pane key={`hoge${id}`} defaultSize={{ width: '100%', height: 120 }} style={paneStyle}>
          <p style={textStyle}>00{id}</p>
        </Pane>
      )),
    };
  }

  add() {
    const order = [String(this.id), ...this.state.order];
    this.state.list.splice(
      ~~(Math.random() * this.state.list.length),
      0,
      <Pane key={this.id} defaultSize={{ width: '100%', height: 120 }} style={paneStyle}>
        <p style={textStyle}>00{this.id++}</p>
      </Pane>,
    );
    this.setState({ list: this.state.list, order });
  }

  remove() {
    const index = ~~(Math.random() * this.state.list.length);
    const pane = this.state.list.splice(index, 1);
    const order = this.state.order.filter(o => o !== pane[0].key);
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
