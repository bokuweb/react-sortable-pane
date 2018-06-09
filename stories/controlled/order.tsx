import * as React from 'react';
import { SortablePane, Pane } from '../../src/index';
import { textStyle, paneStyle } from '../styles';

type State = {
  order: string[];
};

export default class Example extends React.Component<{}, State> {
  state = {
    order: ['2', '1', '0'],
  };

  render() {
    const panes = [0, 1, 2].map(key => (
      <Pane key={key} width="100%" height={120} style={paneStyle}>
        <p style={textStyle}>00{key}</p>
      </Pane>
    ));
    return (
      <div style={{ padding: '10px' }}>
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
