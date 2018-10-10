import * as React from 'react';
import { SortablePane, Pane } from '../../src/index';
import { textStyle, paneStyle } from '../styles';
import { Button } from '@storybook/react/demo';

type State = {
  panes: { [key: string]: { width: number } };
};

export default class SizeUpDownHorizontal extends React.Component<{}, State> {
  state = {
    panes: { '0': { width: 100 }, '1': { width: 200 }, '2': { width: 300 } },
  };

  render() {
    const panes = [0, 1, 2].map((key, i) => (
      <Pane key={key} size={{ height: '90%', width: this.state.panes[key].width }} style={paneStyle}>
        <p style={textStyle}>00{key}</p>
      </Pane>
    ));
    return (
      <div style={{ padding: '10px' }}>
        <Button
          onClick={() => {
            this.setState({
              panes: { ...this.state.panes, '0': { width: this.state.panes[0].width + 20 } },
            });
          }}
        >
          Width + 20px
        </Button>
        <Button
          onClick={() => {
            this.setState({
              panes: {
                ...this.state.panes,
                '0': {
                  width:
                    this.state.panes[0].width - 20 > 0 ? this.state.panes[0].width - 20 : this.state.panes[0].width,
                },
              },
            });
          }}
        >
          Width - 20px
        </Button>
        <SortablePane
          direction="horizontal"
          margin={20}
          onResizeStop={(e, key, dir, ref, d) => {
            this.setState({
              panes: { ...this.state.panes, [key]: { width: this.state.panes[key].width + d.width } },
            });
          }}
        >
          {panes}
        </SortablePane>
      </div>
    );
  }
}
