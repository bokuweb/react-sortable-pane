import React from 'react';
import { SortablePane, Pane } from '../src/index';
import renderer from 'react-test-renderer';

it('should render simple vertical pane', () => {
  // TODO: Add test. `re-resizable` throw error, this is because jest uses jsdom...
  /*
  const panes = [0, 1, 2].map(key => (
    <Pane key={key} defaultSize={{ width: 120, height: '100%' }}>
      <p>00{key}</p>
    </Pane>
  ));
  const tree = renderer
    .create(
      <div style={{ padding: '10px' }}>
        <SortablePane direction="vertical" margin={20}>
          {panes}
        </SortablePane>
      </div>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
  */
});
