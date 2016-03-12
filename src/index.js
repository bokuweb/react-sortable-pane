import React, { Component, PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
import Resizable from 'react-resizable-box';
import isEqual from 'lodash.isequal';
import Pane from './pane';

export {
  Pane,
};

const reinsert = (array, from, to) => {
  const a = array.slice(0);
  const v = a[from];
  a.splice(from, 1);
  a.splice(to, 0, v);
  return a;
};

const clamp = (n, min = n, max = n) => Math.max(Math.min(n, max), min);

const springConfig = [500, 30];

export default class SortablePane extends Component {
  static propTypes = {
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    margin: PropTypes.number,
    customClass: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.array,
    onResizeStart: PropTypes.func,
    onResize: PropTypes.func,
    onResizeStop: PropTypes.func,
    disableEffect: PropTypes.bool,
    onOrderChange: PropTypes.func,
    isResizable: PropTypes.shape({
      x: React.PropTypes.bool,
      y: React.PropTypes.bool,
      xy: React.PropTypes.bool,
    }),
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
    disableEffect: false,
    isResizable: {
      x: true,
      y: true,
      xy: true,
    },
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
    this.handleTouchMove = ::this.handleTouchMove;
    this.handleMouseUp = ::this.handleMouseUp;
    this.handleMouseMove = ::this.handleMouseMove;

    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  // componentDidMount() {
  //   this.setWidth();
  // }

  componentWillUpdate(next) {
    const { panes } = this.state;
    if (next.children.length > panes.length) return this.addPane(next);
    if (next.children.length < panes.length) return this.removePane(next);
    return null;
  }

  componentWillUnmount() {
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleMouseUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  onResize(i, { width }) {
    let { panes } = this.state;
    const order = this.getPanePropWithArray('order');
    panes = panes.map((pane, index) => {
      if (order.indexOf(i) === index) {
        return {
          width,
          order: pane.order,
          id: pane.id,
        };
      }
      return pane;
    });
    this.setState({ panes });
    this.props.onResize(panes[order.indexOf(i)].id);
  }

  getPanePropWithArray(key) {
    return this.state.panes.map(pane => pane[key]);
  }

  getItemCountByPositionX(x) {
    const width = this.getPanePropWithArray('width');
    const { margin } = this.props;
    let sum = 0;
    if (x < 0) return 0;
    for (let i = 0; i < width.length; i++) {
      sum += width[i] + margin;
      if (sum >= x) return i + 1;
    }
    return width.length;
  }

  // setWidth() {
  //   const panes = this.props.children.map((child, i) => ({
  //     id: child.props.id,
  //     width: this.refs.panes.children[i].clientWidth,
  //     order: i,
  //   }));
  //   this.setState({ panes });
  // }

  getItemPositionXByIndex(index) {
    const width = this.getPanePropWithArray('width');
    let sum = 0;
    for (let i = 0; i < index; i++) sum += width[i] + this.props.margin;
    return sum;
  }

  updateOrder(panes, order, mode) {
    return panes.map(pane => {
      if (pane.order >= order) {
        return {
          id: pane.id,
          width: pane.width,
          order: mode === 'add' ? pane.order + 1 : pane.order - 1,
        };
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
        const pane = {
          id: child.props.id,
          width: child.props.width,
          order: i,
        };
        newPanes.splice(i, 0, pane);
      }
    });
    this.setState({ panes: newPanes });
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
    this.setState({ isResizing: true });
    this.props.onResizeStart(i);
  }

  handleResizeStop(i) {
    this.setState({ isResizing: false });
    this.props.onResizeStop(i);
  }

  handleMouseDown(pos, pressX, { pageX }) {
    this.setState({
      delta: pageX - pressX,
      mouse: pressX,
      isPressed: true,
      lastPressed: pos,
    });
  }

  handleMouseMove({ pageX }) {
    const { isPressed, delta, lastPressed, isResizing, panes } = this.state;
    if (isPressed && !isResizing) {
      const mouse = pageX - delta;
      const { length } = this.props.children;
      const order = this.getPanePropWithArray('order');
      const row = clamp(Math.round(this.getItemCountByPositionX(mouse)), 0, length - 1);
      const newPanes = reinsert(panes, order.indexOf(lastPressed), row);
      this.setState({ mouse, panes: newPanes });
      if (!isEqual(panes, newPanes)) this.props.onOrderChange(newPanes);
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
    const order = this.getPanePropWithArray('order');
    const { children, disableEffect } = this.props;
    return children.map((child, i) => {
      const style = lastPressed === i && isPressed
              ? {
                scale: disableEffect ? 1 : spring(1.05, springConfig),
                shadow: disableEffect ? 0 : spring(16, springConfig),
                x: mouse,
              }
              : {
                scale: spring(1, springConfig),
                shadow: spring(0, springConfig),
                x: spring(this.getItemPositionXByIndex(order.indexOf(i)), springConfig),
              };
      return (
        <Motion style={style} key={child.props.id}>
          {({ scale, shadow, x }) => {
            const onResize = this.onResize.bind(this, i);
            const onMouseDown = this.handleMouseDown.bind(this, i, x);
            const onTouchStart = this.handleTouchStart.bind(this, i, x);
            const onResizeStart = this.handleResizeStart.bind(this, i);
            const onResizeStop = this.handleResizeStop.bind(this, i);
            return (
              <Resizable
                customClass={this.props.customClass}
                onResize={onResize}
                isResizable={{ x: true, y: true, xy: true }}
                width={child.props.width}
                height={child.props.height}
                minWidth={child.props.minWidth}
                minHeight={child.props.minHeight}
                maxWidth={child.props.maxWidth}
                maxHeight={child.props.maxHeight}
                customStyle={Object.assign(child.props.style, {
                  boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                  transform: `translate3d(${x}px, 0, 0) scale(${scale})`,
                  WebkitTransform: `translate3d(${x}px, 0, 0) scale(${scale})`,
                  zIndex: i === lastPressed ? 99 : i, // TODO: Add this.props.zIndex
                  position: 'absolute',
                })}
                onMouseDown={onMouseDown}
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
    const { style, customClass } = this.props;
    return (
      <div
        ref="panes"
        className={customClass}
        style={style}
      >
        { this.renderPanes() }
      </div>
    );
  }
}

