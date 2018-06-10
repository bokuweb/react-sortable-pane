/* eslint-disable */

import * as React from 'react';
import { SortablePane, Pane } from '../../src/index';
import { Button } from '@storybook/react/demo';
import { textStyle, paneStyle } from '../styles';

type State = {
  list: Element[];
};
export default class UncontrollableOrder extends React.Component<{}, State> {
  id = 3;
  state = {
    list: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      list: [0, 1, 2].map(id => (
        <Pane key={id} defaultSize={{ width: '100%', height: 120 }} style={paneStyle}>
          <p style={textStyle}>00{id}</p>
        </Pane>
      )),
    };
  }

  add() {
    this.state.list.splice(
      ~~(Math.random() * this.state.list.length),
      0,
      <Pane key={this.id} defaultSize={{ width: '100%', height: 120 }} style={paneStyle}>
        <p style={textStyle}>00{this.id++}</p>
      </Pane>,
    );
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
        <SortablePane direction="vertical" margin={20}>
          {this.state.list}
        </SortablePane>
      </div>
    );
  }
}
