import * as React from 'react';
import { SortablePane, Pane } from '../../src/index';
import { Button } from '@storybook/react/demo';
import { textStyle, paneStyle } from '../styles';

type State = {
  order: string[];
};

export default class RotationHorizontal extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      order: ['2', '1', '0'],
    };
  }

  render() {
    const panes = [0, 1, 2].map(key => (
      <Pane key={key} defaultSize={{ width: 240, height: '90%' }} style={paneStyle}>
        <p style={textStyle}>00{key}</p>
      </Pane>
    ));
    return (
      <div style={{ padding: '10px' }}>
        <Button
          onClick={() => {
            const order = [...this.state.order];
            order.unshift(order.pop());
            this.setState({ order });
          }}
        >
          Rotate
        </Button>
        <SortablePane
          direction="horizontal"
          margin={20}
          order={this.state.order}
          onOrderChange={order => {
            this.setState({ order });
          }}
        >
          {panes}
        </SortablePane>
      </div>
    );
  }
}
