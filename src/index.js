import { Component, PropTypes } from 'react';

import Pane from './SortablePane/Pane'

import render from './SortablePane/render'
import events from './SortablePane/events'
import lifecycle from './SortablePane/lifecycle'
import utils from './SortablePane/utils'
import addRemove from './SortablePane/addRemove'

class SortablePane extends Component {
  static propTypes = {
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    margin: PropTypes.number,
    style: PropTypes.object,
    children: PropTypes.array,
    onResizeStart: PropTypes.func,
    onResize: PropTypes.func,
    onResizeStop: PropTypes.func,
    disableEffect: PropTypes.bool,
    onOrderChange: PropTypes.func,
    className: PropTypes.string,
    isResizable: PropTypes.shape({
      x: PropTypes.bool,
      y: PropTypes.bool,
      xy: PropTypes.bool,
    }),
    dragHandleClass: PropTypes.string
  };

  static defaultProps = {
    direction: 'horizontal',
    margin: 0,
    onClick: () => null,
    onTouchStart: () => null,
    onResizeStart: () => null,
    onResize: () => null,
    onResizeStop: () => null,
    onOrderChange: () => null,
    customStyle: {},
    className: '',
    disableEffect: false,
    isResizable: {
      x: true,
      y: true,
      xy: true,
    },
    dragHandleClass: undefined
  };

  constructor(props) {
    super(props);
    this.state = {
      delta: 0,
      mouse: 0,
      isPressed: false,
      lastPressed: 0,
      isResizing: false,
      panes: this.props.children.map((child, order) => ({
        id: child.props.id,
        width: child.props.width,
        height: child.props.height,
        order,
      })),
    };
    this.hasAdded = false;
    this.handleTouchMove = ::this.handleTouchMove;
    this.handleMouseUp = ::this.handleMouseUp;
    this.handleMouseMove = ::this.handleMouseMove;

    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

}

Object.assign(SortablePane.prototype, render, events, lifecycle, utils, addRemove)

export { Pane, SortablePane };
