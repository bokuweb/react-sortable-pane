import * as React from 'react';
import { SortablePane, Pane } from '../../src/index';
import { textStyle, paneStyle } from '../styles';

type State = {
  order: string[];
  panes: { [key: string]: { height: number } };
};

export default class ControlledFull extends React.Component<{}, State> {
  state = {
    order: ['2', '1', '0'],
    panes: { '0': { height: 100 }, '1': { height: 200 }, '2': { height: 300 } },
  };

  render() {
    const panes = [0, 1, 2].map(key => (
      <Pane key={key} size={{ width: '100%', height: this.state.panes[key].height }} style={paneStyle}>
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
          onResizeStop={(e, key, dir, ref, d) => {
            this.setState({
              panes: { ...this.state.panes, [key]: { height: this.state.panes[key].height + d.height } },
            });
          }}
        >
          {panes}
        </SortablePane>
      </div>
    );
  }
}
