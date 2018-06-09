import * as React from 'react';
import { storiesOf } from '@storybook/react';
import './styles.css';
import VerticalPane from './vertical-pane-basic';
import RotationVertical from './rotation/vertical';
import RotationHorizontal from './rotation/horizontal';
// import HorizontalPane from './horizontal-pane-basic';
// import VerticalPaneWithHandle from './vertical-pane-with-handle';
// import VerticalPercentPanes from './vertical-percent-panes';
// import VerticalPaneWithController from './vertical-pane-with-controller';

storiesOf('SortablePane', module).add('vertical pane basic', () => <VerticalPane />);

storiesOf('SortablePane/Rotation', module)
  .add('horizontal', () => <RotationHorizontal />)
  .add('vertical', () => <RotationVertical />);
// .add('horizontal basic pane basic', () => <HorizontalPane />)
// .add('vertical pane with drag handle', () => <VerticalPaneWithHandle />)
// .add('vertical percent size panes', () => <VerticalPercentPanes />)
// .add('vertical pane with controller', () => <VerticalPaneWithController />);
