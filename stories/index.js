import React from 'react';
import { storiesOf } from '@storybook/react';
import './styles.css';
import VerticalPane from './vertical-pane-basic';
import HorizontalPane from './horizontal-pane-basic';
import VerticalPaneWithHandle from './vertical-pane-with-handle';
import VerticalPaneWithController from './vertical-pane-with-controller';

storiesOf('SortablePane', module)
  .add('vertical pane basic', () => <VerticalPane />)
  .add('horizontal basic pane basic', () => <HorizontalPane />)
  .add('vertical pane with drag handle', () => <VerticalPaneWithHandle />)
  .add('vertical pane with controller', () => <VerticalPaneWithController />);

