import * as React from 'react';
import { SortablePane, Pane } from '../../src/index';
import { Button } from '@storybook/react/demo';

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
    const panes = [0, 1, 2].map(key => (
      <Pane
        key={key}
        width={120}
        height="100%"
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
          00{key}
        </p>
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
