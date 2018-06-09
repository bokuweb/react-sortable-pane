import * as React from 'react';
import { SortablePane, Pane } from '../../src/index';
import { Button } from '@storybook/react/demo';
import { textStyle, paneStyle } from '../styles';

type State = {
  order: string[];
};

export default class Example extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      order: ['2', '1', '0'],
    };
  }

  render() {
    const panes = [0, 1, 2].map(id => (
      <Pane key={id} width="100%" height={120} style={paneStyle}>
        <p style={textStyle}>00{id}</p>
      </Pane>
    ));
    return (
      <div style={{ padding: '10px' }}>
        <Button
          onClick={() => {
            this.setState({ order: this.state.order.map(o => String((Number(o) + 1) % this.state.order.length)) });
          }}
        >
          Rotate
        </Button>
        <SortablePane
          direction="vertical"
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
