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
</p>

## Table of Contents

- [Demo](#demo)
- [Install](#install)
- [Usage](#usage)
- [Props](#props)
- [Callback](#callback)
- [Method](#method)
- [Test](#test)
- [Changelog](#changelog)
- [License](#license)

## Demo

![screenshot](https://raw.githubusercontent.com/bokuweb/react-sortable-pane/master/screenshot/screenshot.gif)

See demo: [http://bokuweb.github.io/react-sortable-pane](http://bokuweb.github.io/react-sortable-pane)

## Install

```sh
npm i react-sortable-pane
```

or 

```sh
yarn add react-sortable-pane
```

## Usage

``` javascript
import React from 'react';
import { SortablePane, Pane } from 'react-sortable-pane';

export default () => {
  return (
    <div>
      <SortablePane
        direction="horizontal"
        margin={20}    
      >
        <Pane id={0} key={0} width={120} height="100%">
          <p>0</p>
        </Pane>
        <Pane id={1} key={1} width={120} height="100%">
          <p>1</p>
        </Pane>          
      </SortablePane>
    </div>
  );
};
```

## Props

### `SortablePane` Component

#### `className?: string`

The `className` property is used to set the css `classname` of a component.

#### `style?: {[key: string]: string }`

The `style` property is used to set the style of a component.

#### `direction?: 'horizontal' | 'vertical'`

The `direction` property is used to set the direction of a component.
If omitted the default direction is `'horizontal'`.

#### `margin?: number`

The `margin` property is used to set the margin between `Pane` component.
If omitted the default margin is `0`.

#### `zIndex?: number`

The `zIndex` property is used to set the zIndex of a component.
If omitted the default margin is `100`.

#### `grid?: Array<number>;`

The `grid` property is used to specify the increments that resizing should snap to. Defaults to `[1, 1]`.

#### `isSortable?: boolean`

The `isSortable` property is used to control whether panes can be dragged or not.
If omitted, the default value is `true`.

#### `disableEffect?: boolean`

The `disableEffect` property is used to disable floating effect.
If omitted the default margin is `false`.

#### `dragHandleClassName?: string`

The `dragHandleClassName` property is a class name of an element which should handle drag events for panes.

#### `onOrderChange?: (oldPanes: PaneProperty[], newPanes: PaneProperty[]) => void`

It is called when `Pane` component order changed.

`PaneProperty` definition is below.

``` js
type PaneProperty = $Exact<{
  id: PaneId;
  width: number | string;
  height: number | string;
  order: number;
}>
```

#### `onResizeStart?: (e: SyntheticMouseEvent | SyntheticTouchEvent, id: PaneId, panes: PaneProperty[]) => void`

It is called when `Pane` component resize start.

#### `onResize?: (e: SyntheticMouseEvent | SyntheticTouchEvent, id: PaneId, panes: PaneProperty[], data: PaneResizeData) => void`

It is called when `Pane` component resize.

`PaneResizeData` definition is below.

``` js
type PaneResizeData = $Exact<{
  pane: PaneProperty;
  direction: $Values<typeof directionDict>; // 'x' | 'y' | 'xy'
  delta: PaneSize;                          // { width: number; height: number }
}>
```

#### `onResizeStop?: (e: SyntheticMouseEvent | SyntheticTouchEvent, id: PaneId, panes: PaneProperty[], data: PaneResizeData) => void`

It is called when `Pane` component resize stop.

`PaneResizeData` definition is below.

``` js
type PaneResizeData = $Exact<{
  pane: PaneProperty;
  direction: $Values<typeof directionDict>; // 'x' | 'y' | 'xy'
  delta: PaneSize;                          // { width: number; height: number }
}>
```

#### `onDragStart?: (e: SyntheticMouseEvent | SyntheticTouchEvent, id: PaneId, panes: PaneProperty[]) => void`

It is called when `Pane` component dragging starts.

#### `onDragStop?: (e: SyntheticMouseEvent | SyntheticTouchEvent, id: PaneId, panes: PaneProperty[]) => void`

It is called when `Pane` component dragging stop.

## Pane Component

#### `id: string | number`

The `id` property is used to `Pane` component id.

#### `width:? number | string`

The `width` property is used to set the width of a Pane component.
For example, it can be 300, '300px', or 50%.
If ommited, set `auto`.

#### `height:? number | string`

The `height` property is used to set the width of a Pane component.
For example, it can be 300, '300px', or 50%.
If ommited, set `auto`.

#### `minWidth?: number`

The `minWidth` property is used to set the minimum width of a Pane component.

#### `minHeight?: number`

The `minHeight` property is used to set the minimum height of a Pane component.

#### `maxWidth?: number`

The `maxWidth` property is used to set the maximum width of a Pane component.

#### `maxHeight?: number`

The `maxHeight` property is used to set the maximum height of a Pane component.

#### `className?: string`

The `className` property is used to set the css classname of a Pane component.

#### `style?: {[key: string]: string }`

The `style` property is used to set the style of a Pane component.

#### `isResizable?: { x?: boolean, y?: boolean, xy?: boolean }`

The `isResizable` property is used to set the resizable permission of a component.

The permission of `x`, `y`, `xy` direction resizing.
If omitted the default value is `{ x: true, y: true, xy: true }`.
If you want to permit only x direction resizing, please set `{ x: true, y: false, xy: false }`.

## Changelog

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

- Use babel-preset-es2015-ie  babel-preset-es2015-ie #47 thanks @PabloDiablo

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
- Add husky and prepush hook.

### V0.2.4

- update packages to support react v15

### V0.2.3

- update pane size when props.width/height updated.

### V0.2.2

- Fix className bug.

### V0.2.1

- Update resizable box component.

### V0.2.0

- Support pane appen and remove.
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

Copyright (c) 2017 @Bokuweb

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
