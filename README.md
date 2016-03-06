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
import React, {Component} from 'react';
import SortablePane, {Pane} from 'react-sortable-pane';

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
        margin={10}
        onResize={index => console.log(`resize pane${index}`)}
        onOrderChange={order => console.dir(order)}
      >
        <Pane
           width={200}
           height={500}
           minWidth={100}
           maxWidth={800}
           style={style}>
          A
        </Pane>
        <Pane
           width={300}
           height={400}
           minWidth={100}
           style={style}>
          B
        </Pane>
      </SortablePane>
    );
  }
}
```


## Properties

## SortablePane Component

#### customClass {string}

The css class set on the SortablePane.

#### style {object}

The css style set on the SortablePane.

#### margin {number}

Margin between the panes.

## Pane Component

#### width {number}

The default width of the pane.   

#### height {number}

The default height of the pane.   

#### minWidth {number}

The minimum width of the pane.

#### minHeight {number}

The minimum height of the pane.

#### maxWidth {number}

The maximum width of the pane.

#### maxHeight {number}

The maximum height of the pane.

#### customClass {string}

The css class set on the pane.

#### style {object}

The css style set on the pane.


## TODO

- [x] Horizontal pane
- [x] Resized callback
- [x] Sorted callback
- [ ] Vertical Pane
- [ ] Test

## Changelog

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

