import * as React from 'react';
import { SortablePane, Pane } from '../src/index';

export default class Example extends React.Component<{}, {}> {
  constructor(props) {
    super(props);
    this.state = {
      order: ['2', '1', '0'],
    };
  }

  render() {
    const panes = [0, 1, 2].map(id => (
      <Pane
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
        <SortablePane direction="vertical" margin={20} order={this.state.order} onOrderChange={order => {this.setState({ order })}}>
          {panes}
        </SortablePane>
      </div>
    );
  }
}
