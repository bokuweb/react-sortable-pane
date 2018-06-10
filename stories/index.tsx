import * as React from 'react';
import { storiesOf } from '@storybook/react';
import './styles.css';

import SimpleVertical from './simple/vertical';
import SimpleHorizontal from './simple/horizontal';

import ControlledOrder from './controlled/order';
import ControlledSize from './controlled/size';
import ControlledFull from './controlled/full';

import SizeUpDownHorizontal from './size_up_down/horizontal';

import RotationVertical from './rotation/vertical';
import RotationHorizontal from './rotation/horizontal';

import AddAndRemoveWithUncontrollableOrder from './add_remove/uncontrollable-order';
import AddAndRemoveWithControllableOrder from './add_remove/controllable-order';

import PanePropsGrid from './pane_props/grid';

storiesOf('000. Simple (uncontrolled)', module)
  .add('vertical', () => <SimpleVertical />)
  .add('horizontal', () => <SimpleHorizontal />);

storiesOf('001. Controlled', module)
  .add('order only', () => <ControlledOrder />)
  .add('size (height) only', () => <ControlledSize />)
  .add('full', () => <ControlledFull />);

storiesOf('002. SizeUpDown', module).add('horizontal', () => <SizeUpDownHorizontal />);

storiesOf('003. Add & Remove', module)
  .add('uncontrollable order', () => <AddAndRemoveWithUncontrollableOrder />)
  .add('controllable order', () => <AddAndRemoveWithControllableOrder />);

storiesOf('004. Rotation', module)
  .add('horizontal', () => <RotationHorizontal />)
  .add('vertical', () => <RotationVertical />);

storiesOf('005. Pane props', module).add('grid', () => <PanePropsGrid />);
