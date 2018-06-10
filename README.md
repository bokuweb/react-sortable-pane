<p align="center"><img src ="https://github.com/bokuweb/react-sortable-pane/blob/master/logo.png?raw=true" /></p>

<p align="center">Sortable and resizable pane component for react.</p>

<p align="center">
<a href="https://circleci.com/gh/bokuweb/react-sortable-pane">
<img src="https://circleci.com/gh/bokuweb/react-sortable-pane.svg?style=svg" alt="CircleCI" /></a>
<a href="https://www.npmjs.com/package/react-sortable-pane">
<img src="https://img.shields.io/npm/v/react-sortable-pane.svg" alt="Build Status" /></a> 
<a href="https://www.npmjs.com/package/react-sortable-pane">
<img src="https://img.shields.io/npm/dm/react-sortable-pane.svg" /></a>
<a href="https://greenkeeper.io/">
<img src="https://badges.greenkeeper.io/bokuweb/react-sortable-pane.svg" /></a>
<a href="https://github.com/prettier/prettier">
<img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" /></a>
</p>

## Table of Contents

- [Screenshot](#Screenshot)
- [Live Demo](#live-demo)
  - [Storybook](#storybook)
  - [CodeSandbox](#codesandbox)
- [Install](#install)
- [Usage](#usage)
  - [uncontrolled](#uncontrolled)
  - [controlled](#controlled)
- [Props](#props)
  - [SortablePaneComponent](#sortablepanecomponent)
  - [PaneComponent](#panecomponent)
- [Test](#test)
- [Changelog](#changelog)
- [License](#license)

## Screenshot

![screenshot](https://raw.githubusercontent.com/bokuweb/react-sortable-pane/master/screenshot/screenshot.gif)

## Live Demo

### Storybook

[Storybook](http://bokuweb.github.io/react-sortable-pane/)

### CodeSandbox

[CodeSandbox](https://codesandbox.io/s/7345yp2yn6)

## Install

```sh
npm i react-sortable-pane
```

or

```sh
yarn add react-sortable-pane
```

## Usage

### Uncontrolled

If you need not to control `SortablePane` state, please use `defaultSize` and `defaultOrder`.

```typescript
import * as React from 'react';
import { SortablePane, Pane } from 'react-sortable-pane';

export default function SimpleUncontrolledExample() {
  const panes = [0, 1, 2].map(key => (
    <Pane key={key} defaultSize={{ width: '100%', height: 120 }}>
      00{key}
    </Pane>
  ));
  return (
    <div>
      <SortablePane direction="vertical" margin={20} defaultOrder={['0', '1', '2']}>
        {panes}
      </SortablePane>
    </div>
  );
}
```

### Controlled

If you need to control `SortablePane`state by yourself, please use `size` and `order`.

```typescript
import * as React from 'react';
import { SortablePane, Pane } from 'react-sortable-pane';

type State = {
  order: string[];
  panes: { [key: string]: { height: number } };
};

export default class SimpleControlledFullExample extends React.Component<{}, State> {
  state = {
    order: ['2', '1', '0'],
    panes: { '0': { height: 100 }, '1': { height: 200 }, '2': { height: 300 } },
  };

  render() {
    const panes = [0, 1, 2].map(key => (
      <Pane key={key} size={{ width: '100%', height: this.state.panes[key].height }}>
        00{key}
      </Pane>
    ));
    return (
      <div>
        <SortablePane
          direction="vertical"
          margin={20}
          order={this.state.order}
          onOrderChange={order => {
            this.setState({ order });
          }}
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
```

## Props

### SortablePaneComponent

#### `className?: string`

The `className` property is used to set the css `className` of a component.

#### `style?: React.CssProperties`

The `style` property is used to set the style of a component.

#### `direction?: 'horizontal' | 'vertical'`

The `direction` property is used to set the direction of a component.
If omitted the default direction is `'horizontal'`.

#### `margin?: number`

The `margin` property is used to set the margin between `Pane` component.
If omitted the default margin is `0`.

#### `isSortable?: boolean`

The `isSortable` property is used to control whether panes can be dragged or not.
If omitted, the default value is `true`.

#### `disableEffect?: boolean`

The `disableEffect` property is used to disable floating effect.
If omitted the default value is `false`.

#### `dragHandleClassName?: string`

The `dragHandleClassName` property is a class name of an element which should handle drag events for panes.

#### `onOrderChange?: (order: string[]) => void`

It is called when `Pane` component order changed. The argument `order` is array of react element's `key`.

#### `onResizeStart?: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>, key: string, dir: PaneResizeDirection) => void`

It is called when `Pane` component resize start.

#### `onResize?: (e: MouseEvent | TouchEvent, key: string, dir: PaneResizeDirection, elementRef: HTMLElement, delta: PaneSize) => void`

It is called when `Pane` component resize.

#### `onResizeStop?: (e: MouseEvent | TouchEvent, key: string, dir: PaneResizeDirection, elementRef: HTMLElement, delta: PaneSize) => void`

It is called when `Pane` component resize stop.

#### `onDragStart?: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,  key: string, elementRef: HTMLElement) => void`

It is called when `Pane` component dragging starts.

#### `onDragStop?: (e: MouseEvent | TouchEvent, key: PaneKey, elementRef: HTMLElement) => void`

It is called when `Pane` component dragging stop.

## PaneComponent

#### `defaultSize?: { width?: (number | string), height?: (number | string) }`;

Specifies the width and height that the dragged item should start at. For example, you can set 300, '300px', 50%. If both defaultSize and size omitted, set 'auto'.
defaultSize will be ignored when size set.

#### `size?: { width?: (number | string), height?: (number | string) }`;

The size property is used to set the size of the component. For example, you can set 300, '300px', 50%.
Use size if you need to control size state by yourself.

#### `minWidth?: number | string;`

The `minWidth` property is used to set the minimum width of a Pane component. Defaults to 10px.

#### `minHeight?: number | string;`

The `minHeight` property is used to set the minimum height of a Pane component. Defaults to 10px.

#### `maxWidth?: number | string;`

The `maxWidth` property is used to set the maximum width of a Pane component.

#### `maxHeight?: number | string`;

The `maxHeight` property is used to set the maximum height of a Pane component.

#### `grid?: [number, number];`

The `grid` property is used to specify the increments that resizing should snap to. Defaults to `[1, 1]`.

#### `className?: string`

The `className` property is used to set the css classname of a Pane component.

#### `style?: React.CssProperties`

The `style` property is used to set the style of a Pane component.

#### `isResizable?: { x?: boolean, y?: boolean, xy?: boolean }`

The `isResizable` property is used to set the resizable permission of a component.

The permission of `x`, `y`, `xy` direction resizing.
If omitted the default value is `{ x: true, y: true, xy: true }`.
If you want to permit only x direction resizing, please set `{ x: true, y: false, xy: false }`.

## Changelog

### V1.0.0-beta.0

- feat: Use `TypeScript` instead of `flowtype`.
- feat: Add `defaultSize`, `defaultOrder`, `order`, `size` props to control(or uncontrol) `SortablePane` state. 
- fix: Some tiny bugs.
- chore: Add some stories.

### V0.8.2

- chore: update deps.

### V0.8.1

- fix: add hysteresis and fix sort position
- fix: add mouseleave to panes node

### V0.8.0

- fix: remove unused `order` property.
- fix: fix position when parent element resized.
- chore: update deps.

### V0.7.1

- fix: sort, Drag, Resize does not work in Safari #128

### V0.7.0

- chore: update deps (use `re-resizable` instead of `react-resizable-box`)

### V0.6.8

- Feature: Add `grid` props.

### V0.6.7

- Chore: Upgrade dependencies.

### V0.6.6

- Add `grid` props. (#93)

### V0.6.5

- Update README.

### V0.6.4

- Fix Bug, `onResizeStart` and `onResizeStop` not fired.

### V0.6.2

- Use flowtype
- Use rollup
- Change callback I/F

### V0.5.5

- Use `prop-types` package.
- Fix #56 thanks @avaskys.

### V0.5.4

- Support server side rendering. #50 thanks @lazreg87

### V0.5.3

- Fix componentDidUpdate argument, use this.props instaead of prev.

### V0.5.2

- Use babel-preset-es2015-ie babel-preset-es2015-ie #47 thanks @PabloDiablo

### V0.5.1

- update readme

### V0.5.0

- Fixes a nasty bug
- Add isResizable props to Pane component
- Set `user-select: none` when resizeing or moving.
- Add zIndex props.
- update example

### V0.4.1

- Fixes a nasty bug where all Panes could end up sharing the same static style #44 (thanks @ara4n)

### V0.4.0

- Add Object.assign transform plugin
- Add add-module-exports plugin

### V0.3.2

- Allow strings for width and height. (thanks @lanVS)
- Add onDragStart and onDragEnd props. (thanks @lanVS)

### V0.3.1

- Add `isSortable` props. (#34 thanks @lanVS)

### V0.3.0

- Change sort trigger position (#40 thanks @lanVS)

### V0.2.12

- Update react-motion(use "^0.4.3")

### V0.2.10, V0.2.11

- Fix order update bug

### V0.2.8

- Fix size updater bug

### V0.2.7

- Fix size updater bug

### V0.2.6

- Fix order bug
- Update react-resizable-box(^1.2.0)

### V0.2.5

- Add order props to change order by parent component.
- Add husky and pre push hook.

### V0.2.4

- update packages to support react v15

### V0.2.3

- update pane size when props.width/height updated.

### V0.2.2

- Fix className bug.

### V0.2.1

- Update resizable box component.

### V0.2.0

- Support pane append and remove.
- Support vertical mode.
- Fix pane size calculator.

### V0.1.2

- Add onOrderChange callback.
- Add disableEffect props.
- Fix eslint error.

### V0.1.1

- Add onResize callback.

### V0.1.0

publised.

## License

The MIT License (MIT)

Copyright (c) 2018 @bokuweb

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
