import * as React from 'react';
import { storiesOf } from '@storybook/react';
import './styles.css';

import SimpleVertical from './simple/vertical';
import SimpleHorizontal from './simple/horizontal';

import RotationVertical from './rotation/vertical';
import RotationHorizontal from './rotation/horizontal';

import AddAndRemoveWithUncontrollableOrder from './add_remove/uncontrollable-order';
import AddAndRemoveWithControllableOrder from './add_remove/controllable-order';

storiesOf('[0] Simple', module)
  .add('vertical', () => <SimpleVertical />)
  .add('horizontal', () => <SimpleHorizontal />);

storiesOf('Add & Remove', module)
  .add('uncontrollable order', () => <AddAndRemoveWithUncontrollableOrder />)
  .add('controllable order', () => <AddAndRemoveWithControllableOrder />);

storiesOf('Rotation', module)
  .add('horizontal', () => <RotationHorizontal />)
  .add('vertical', () => <RotationVertical />);
