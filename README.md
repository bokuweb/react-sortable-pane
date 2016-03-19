# react-sortable-pane

Sortable and resizable pane component for react.

[![Code Climate](https://codeclimate.com/github/bokuweb/react-sortable-pane/badges/gpa.svg)](https://codeclimate.com/github/bokuweb/react-sortable-pane)

## Demo

![screenshot](https://raw.githubusercontent.com/bokuweb/react-sortable-pane/master/screenshot/screenshot.gif)
   
   
See demo: [http://bokuweb.github.io/react-sortable-pane](http://bokuweb.github.io/react-sortable-pane)

## Important Note

This is an alpha release. Use with caution and hope.

## Installation

```sh
npm i react-sortable-pane
```

## Overview

### Example

``` javascript
import React, { Component } from 'react';
import { SortablePane, Pane } from 'react-sortable-pane';

const style = {
  fontSize: "40px",
  textAlign:"center",
  paddingTop:"60px",
  height:"400px",
  border: "solid 1px #ccc",
  borderRadius: "5px",
  backgroundColor: "#fff"
};

export default class Example extends Component{
  render() {
    return (
      <SortablePane
          direction="vertical"
          margin={10}
          onResize={(id, dir, size, rect) => null}
          onOrderChange={(panes) => null}
      >
        <Pane
           width={200}
           height={500}
           style={style}
        >
          A
        </Pane>
        <Pane
           width={300}
           height={400}
           style={style}
         >
          B
        </Pane>
      </SortablePane>
    );
  }
}
```


## Props

### SortablePane Component

#### `className`: PropTypes.string

The `className` property is used to set the css class name of a component.

#### `style`: PropTypes.object

The `style` property is used to set the style of a component.

#### `direction`: PropTypes.oneOf(['horizontal', 'vertical']).

The `direction` property is used to set the direction of a component.
If ommited the default direction is `'horizontal'`.

#### `margin`: PropTypes.number

The `margin` property is used to set the margin between Pane component.
If ommited the default margin is `0`

#### `isResizable`: Proptypes.shape({ x: PropTypes.bool, y: PropTypes.bool, xy: PropTypes.bool })

The `isResizable` property is used to set the resizable permission of a component.

The permission of `x`, `y`, `xy` direction resizing.
If ommited the default value is `{ x: true, y: true, xy: true }`.
If you want to permit only x direction resizing, please set `{ x:true, y:false, xy:false }`. 

#### `disableEffect`: PropTypes.bool,

The `disableEffect` property is used to disable floating effect.
If ommited the default margin is `false`.

#### `onOrderChange`: PropTypes.func,

Calls when pane component order changed.
Calls back with (`oldPanes: array`, `newPanes: array`)

- oldPanes: old pane list.
- newPanes: new pane list.

See the example bellow.

- pane list example

``` js
[
  {
    id: 'foo',
    width: 200,
    height: 300,
    order: 1,
  },
  {
    id: 1,
    width: 100,
    height: 380,
    order: 0,  
  },
  { ... },
  { ... },
  ...
]
```

    
#### `onResizeStart`: PropTypes.func

Calls when pane component resize starts.
Calls back with (`id: number or string`, ``direction: string`)

- id: pane id
- direction: `x` or `y` or `xy`

#### `onResize`: PropTypes.func

Calls when Pane component resize.
Calls back with (`id: number or string`, `direction: string`, `coputedSize: object`, `clientSize: object`)

- id: pane id
- direction: `x` or `y` or `xy`
- size: `{ width, height }`
  - this argument is {width, height} of getComputedStyle.
- rect: `{ width, height }`
  - this argument is `clientWidth` and `clientHeight`.
  
For example, when `<Resizable width={100} height={200} style={{ padding: '20px'}} onResize={...} />` mounted and resize 'x', this callback is called with `('x', { width: 100, height: 200 }, { width: 140, height: 240 })`

#### `onResizeStop`: PropTypes.func

Calls when Pane component resizeStop.
Calls back with (`id: number or string`, `direction: string`, `coputedSize: object`, `clientSize: object`)

- id: pane id
- direction: `x` or `y` or `xy`
- size: `{ width, height }`
  - this argument is {width, height} of getComputedStyle.
- rect: `{ width, height }`
  - this argument is `clientWidth` and `clientHeight`.
  
For example, when `<Resizable width={100} height={200} style={{ padding: '20px'}} onResize={...} />` mounted and resize 'x', this callback is called with `('x', { width: 100, height: 200 }, { width: 140, height: 240 })`

## Pane Component

#### `id`: PropTypes.oneOfType([PropTypes.string, PropTypes.number ]).isRequired

The `id` property is used to Pane component id.

#### `width`: PropTypes.number

The `width` property is used to set the width of a Pane component.

#### `height`: PropTypes.number

The `height` property is used to set the width of a Pane component.

#### `minWidth`: PropTypes.number

The `minWidth` property is used to set the minimum width of a Pane component.

#### `minHeight`: PropTypes.number

The `minHeight` property is used to set the minimum height of a Pane component.

#### `maxWidth`: PropTypes.number

The `maxWidth` property is used to set the maximum width of a Pane component.

#### `maxHeight`: PropTypes.number

The `maxheight` property is used to set the maximum height of a Pane component.

#### `className`: PropTypes.string

The `className` property is used to set the css class name of a Pane component.

#### `style`: PropTypes.object

The `style` property is used to set the style of a Pane component.


## TODO

- [x] Horizontal pane
- [x] Resized callback
- [x] Sorted callback
- [x] Support pane append and remove
- [x] Vertical Pane
- [x] Support size updater by parent component
- [ ] Test

## Changelog

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

Copyright (c) 2016 @Bokuweb

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

