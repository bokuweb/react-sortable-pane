import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import { SortablePane, Pane } from '../src/components';

const renderVerticalPane = () => {
  return (
    <SortablePane
      direction="vertical"
      margin={20}
    >
      <Pane
        id={1}
        key={1}
        width="100%"
        height={120}
        minWidth={100}
        maxWidth={800}
        minHeight={100}
        className="item"
      >
        <span>no1</span>
      </Pane>
      <Pane
        id={2}
        key={2}
        width={450}
        height={100}
        minWidth={100}
        minHeight={100}
        className="item"
      >
        <span>no2<br />resize or sort me!!</span>
      </Pane>
    </SortablePane>
  );
}

storiesOf('SortablePane', module)
  .add('vertical basic pane', () => renderVerticalPane())

