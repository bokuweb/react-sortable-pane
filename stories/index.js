import React from 'react';
import { storiesOf } from '@storybook/react';
import './styles.css';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

// import { Button, Welcome } from '@storybook/react/demo';
import VerticalPane from './vertical-pane-basic';
import HorizontalPane from './horizontal-pane-basic';

storiesOf('SortablePane', module)
  .add('vertical pane basic', () => <VerticalPane />)
  .add('horizontal basic pane basic', () => <HorizontalPane />);

