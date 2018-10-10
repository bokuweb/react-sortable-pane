import * as React from 'react';
import { SortablePane, Pane } from '../../src/index';
import { textStyle, paneStyle } from '../styles';

type State = {
  panes: { [key: string]: { height: number } };
};

export default class ControlledHeight extends React.Component<{}, State> {
  state = {
    panes: { '0': { height: 100 }, '1': { height: 200 }, '2': { height: 300 } },
  };

  render() {
    const panes = [0, 1, 2].map((key, i) => (
      <Pane key={key} size={{ width: '100%', height: this.state.panes[key].height }} style={paneStyle}>
        <p style={textStyle}>00{key}</p>
      </Pane>
    ));
    return (
      <div style={{ padding: '10px' }}>
        <SortablePane
          direction="vertical"
          margin={20}
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
