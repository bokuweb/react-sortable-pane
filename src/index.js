import React, { Component, PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
import Resizable from '/lib/react-resizable-box/src/index.js';
import isEqual from 'lodash.isequal';
import Pane from './pane';

const reinsert = (array, from, to) => {
  const a = array.slice(0);
  const v = a[from];
  a.splice(from, 1);
  a.splice(to, 0, v);
  return a;
};

const clamp = (n, min = n, max = n) => Math.max(Math.min(n, max), min);

const springConfig = [500, 30];

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

  componentDidMount() {
    this.setSize();
  }

  componentWillUpdate(next) {
    const { panes } = this.state;
    if (next.children.length > panes.length) return this.addPane(next);
    if (next.children.length < panes.length) return this.removePane(next);
    return null;
  }

  componentDidUpdate() {
    if (this.hasAdded) {
      this.hasAdded = false;
      this.setSize();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleMouseUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  onResize(i, dir, size, rect) {
    let { panes } = this.state;
    const order = this.getPanePropsArrayOf('order');
    panes = panes.map((pane, index) => {
      if (order.indexOf(i) === index) {
        return {
          width: rect.width,
          height: rect.height,
          order: pane.order,
          id: pane.id,
        };
      }
      return pane;
    });
    this.setState({ panes });
    this.props.onResize({ id: panes[order.indexOf(i)].id, dir, size, rect });
  }

  getPanePropsArrayOf(key) {
    return this.state.panes.map(pane => pane[key]);
  }

  getPaneSizeList() {
    const width = this.getPanePropsArrayOf('width');
    const height = this.getPanePropsArrayOf('height');
    return this.isHorizontal() ? width : height;
  }

  getItemCountByPosition(position) {
    const size = this.getPaneSizeList();
    const { margin } = this.props;
    let sum = 0;
    if (position < 0) return 0;
    for (let i = 0; i < size.length; i++) {
      sum += size[i] + margin;
      if (sum >= position) return i + 1;
    }
    return size.length;
  }

  setSize() {
    const panes = this.props.children.map((child, i) => {
      const { width, height } = this.refs.panes.children[i].getBoundingClientRect();
      return {
        id: child.props.id,
        width,
        height,
        order: i,
      };
    });
    if (!isEqual(panes, this.state.panes)) this.setState({ panes });
  }

  getItemPositionByIndex(index) {
    const size = this.getPaneSizeList();
    let sum = 0;
    for (let i = 0; i < index; i++) sum += size[i] + this.props.margin;
    return sum;
  }

  isHorizontal() {
    return this.props.direction === 'horizontal';
  }

  updateOrder(panes, index, mode) {
    return panes.map(pane => {
      if (pane.order >= index) {
        const { id, width, height, order } = pane;
        return { id, width, height, order: mode === 'add' ? order + 1 : order - 1 };
      }
      return pane;
    });
  }

  addPane(next) {
    let newPanes = this.state.panes;
    next.children.forEach((child, i) => {
      const ids = this.state.panes.map(pane => pane.id);
      if (ids.indexOf(child.props.id) === -1) {
        newPanes = this.updateOrder(newPanes, i, 'add');
        const { id, width, height } = child.props;
        const pane = { id, width, height, order: i };
        newPanes.splice(i, 0, pane);
      }
    });
    this.setState({ panes: newPanes });
    this.hasAdded = true;
  }

  removePane(next) {
    let newPanes;
    this.state.panes.forEach((pane, i) => {
      const ids = next.children.map(child => child.props.id);
      if (ids.indexOf(pane.id) === -1) {
        newPanes = this.updateOrder(this.state.panes, i, 'remove');
        newPanes.splice(i, 1);
      }
    });
    this.setState({ panes: newPanes });
  }

  handleResizeStart(i) {
    const order = this.getPanePropsArrayOf('order');
    this.setState({ isResizing: true });
    this.props.onResizeStart({ id: this.state.panes[order.indexOf(i)].id });
  }

  handleResizeStop(i, dir, size, rect) {
    const { panes } = this.state;
    const order = this.getPanePropsArrayOf('order');
    this.setState({ isResizing: false });
    this.props.onResizeStop({ id: panes[order.indexOf(i)].id, dir, size, rect });
  }

handleMouseDown(pos, pressX, pressY, { target, pageX, pageY }) { //NOTE: destructures pageX, pageY from React's `SyntheticMouseEvent`
    if (!!this.props.dragHandleClass && !target.classList.contains(this.props.dragHandleClass))
      return;

    this.setState({
      delta: this.isHorizontal() ? pageX - pressX : pageY - pressY,
      mouse: this.isHorizontal() ? pressX : pressY,
      isPressed: true,
      lastPressed: pos,
    });
  }

  handleMouseMove({ pageX, pageY }) {
    const { isPressed, delta, lastPressed, isResizing, panes } = this.state;
    const { onOrderChange } = this.props;
    if (isPressed && !isResizing) {
      const mouse = this.isHorizontal() ? pageX - delta : pageY - delta;
      const { length } = this.props.children;
      const order = this.getPanePropsArrayOf('order');
      const row = clamp(Math.round(this.getItemCountByPosition(mouse)), 0, length - 1);
      const newPanes = reinsert(panes, order.indexOf(lastPressed), row);
      this.setState({ mouse, panes: newPanes });
      if (!isEqual(panes, newPanes)) onOrderChange(panes, newPanes);
    }
  }

  handleTouchStart(key, pressLocation, e) {
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  }

  handleTouchMove(e) {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  }

  handleMouseUp() {
    this.setState({ isPressed: false, delta: 0 });
  }

  renderPanes() {
    const { mouse, isPressed, lastPressed } = this.state;
    const order = this.getPanePropsArrayOf('order');
    const { children, disableEffect } = this.props;
    return children.map((child, i) => {
      const springPosition = spring(this.getItemPositionByIndex(order.indexOf(i)), springConfig);
      const style = lastPressed === i && isPressed
              ? {
                scale: disableEffect ? 1 : spring(0.95, springConfig),
                shadow: disableEffect ? 0 : spring(16, springConfig),
                x: this.isHorizontal() ? mouse : 0,
                y: !this.isHorizontal() ? mouse : 0,
              }
              : {
                scale: spring(1, springConfig),
                shadow: spring(0, springConfig),
                x: this.isHorizontal() ? springPosition : 0,
                y: !this.isHorizontal() ? springPosition : 0,
              };
      return (
        <Motion style={style} key={child.props.id}>
          {({ scale, shadow, x, y }) => {
            const onResize = this.onResize.bind(this, i);
            const onMouseDown = this.handleMouseDown.bind(this, i, x, y);
            const onTouchStart = this.handleTouchStart.bind(this, i, x, y);
            const onResizeStart = this.handleResizeStart.bind(this, i);
            const onResizeStop = this.handleResizeStop.bind(this, i);
            return (
              <Resizable
                customClass={child.props.className}
                onResize={onResize}
                isResizable={this.props.isResizable}
                width={child.props.width}
                height={child.props.height}
                minWidth={child.props.minWidth}
                minHeight={child.props.minHeight}
                maxWidth={child.props.maxWidth}
                maxHeight={child.props.maxHeight}
                customStyle={Object.assign(child.props.style, {
                  boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                  transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                  WebkitTransform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                  MozTransform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                  MsTransform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                  zIndex: i === lastPressed ? 99 : i, // TODO: Add this.props.zIndex
                  position: 'absolute',
                })}
                onMouseDown={
                  onMouseDown
                  // (...args) => console.log(...args)
                }
                onTouchStart={onTouchStart}
                onResizeStart={onResizeStart}
                onResizeStop={onResizeStop}
              >
                { child.props.children }
              </Resizable>
            );
          }}
        </Motion>
      );
    });
  }

  render() {
    const { style, className } = this.props;
    return (
      <div
        ref="panes"
        className={className}
        style={style}
      >
        { this.renderPanes() }
      </div>
    );
  }
}

export { Pane, SortablePane };
