import * as React from 'react';
import { SortablePane, Pane } from '../../src/index';
import { textStyle, paneStyle } from '../styles';

type State = {
  order: string[];
};

export default class ControlledOrder extends React.Component<{}, State> {
  state = {
    order: ['2', '0', '1'],
  };

  render() {
    const panes = [0, 1, 2].map(key => (
      <Pane key={key} defaultSize={{ width: 120 * (key + 0.5), height: 120 }} style={paneStyle}>
        <p style={textStyle}>00{key}</p>
      </Pane>
    ));
    return (
      <div style={{ padding: '10px' }}>
        <SortablePane
          margin={10}
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
