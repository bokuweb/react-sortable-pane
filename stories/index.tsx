import * as React from 'react';
import { storiesOf } from '@storybook/react';
import './styles.css';

import SimpleVertical from './simple/vertical';
import SimpleHorizontal from './simple/horizontal';

import ControlledOrder from './controlled/order';
import ControlledSize from './controlled/size';

import SizeUpDownHorizontal from './size_up_down/horizontal';

import RotationVertical from './rotation/vertical';
import RotationHorizontal from './rotation/horizontal';

import AddAndRemoveWithUncontrollableOrder from './add_remove/uncontrollable-order';
import AddAndRemoveWithControllableOrder from './add_remove/controllable-order';

storiesOf('000. Simple (uncontrolled)', module)
  .add('vertical', () => <SimpleVertical />)
  .add('horizontal', () => <SimpleHorizontal />);

storiesOf('001. Controlled', module)
  .add('order only', () => <ControlledOrder />)
  .add('size (height) only', () => <ControlledSize />);

storiesOf('002. SizeUpDown', module)
  .add('horizontal', () => <SizeUpDownHorizontal />);

storiesOf('Add & Remove', module)
  .add('uncontrollable order', () => <AddAndRemoveWithUncontrollableOrder />)
  .add('controllable order', () => <AddAndRemoveWithControllableOrder />);

storiesOf('Rotation', module)
  .add('horizontal', () => <RotationHorizontal />)
  .add('vertical', () => <RotationVertical />);
