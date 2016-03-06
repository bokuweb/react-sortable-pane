import React, { Component, PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
import range from 'lodash.range';
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
    margin: PropTypes.number,
    customClass: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.array,
    onResizeStart: PropTypes.func,
    onResize: PropTypes.func,
    onResizeStop: PropTypes.func,
    disableEffect: PropTypes.bool,
    onOrderChange: PropTypes.func,
  };

  static defaultProps = {
    margin: 0,
    onClick: () => null,
    onTouchStart: () => null,
    onResizeStart: () => null,
    onResize: () => null,
    onResizeStop: () => null,
    onOrderChange: () => null,
    customStyle: {},
    disableEffect: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      delta: 0,
      mouse: 0,
      isPressed: false,
      lastPressed: 0,
      order: range(this.props.children.length),
      widthList: range(this.props.children.length).map(() => 0),
      isResizing: false,
    };
    this.handleTouchMove = ::this.handleTouchMove;
    this.handleMouseUp = ::this.handleMouseUp;
    this.handleMouseMove = ::this.handleMouseMove;

    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  componentDidMount() {
    this.setWidth();
  }

  componentWillUnmount() {
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleMouseUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  onResize(i, { width }) {
    const { widthList, order } = this.state;
    widthList[order.indexOf(i)] = width;
    this.setState({ widthList });
    this.forceUpdate();
    this.props.onResize(i);
  }

  getItemCountByPositionX(x) {
    const { widthList } = this.state;
    const { margin } = this.props;
    let sum = 0;
    if (x < 0) return 0;
    for (let i = 0; i < widthList.length; i++) {
      sum += widthList[i] + margin;
      if (sum >= x) return i + 1;
    }
    return widthList.length;
  }

  setWidth() {
    const children = Array.prototype.slice.call(this.refs.panes.children);
    const width = children.map(child => child.clientWidth);
    this.setState({ widthList: width });
  }

  getItemPositionXByIndex(index) {
    const { widthList } = this.state;
    let sum = 0;
    for (let i = 0; i < index; i++) sum += widthList[i] + this.props.margin;
    return sum;
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
    const { isPressed, delta, order, lastPressed, widthList, isResizing } = this.state;
    if (isPressed && !isResizing) {
      const mouse = pageX - delta;
      const { length } = this.props.children;
      const row = clamp(Math.round(this.getItemCountByPositionX(mouse)), 0, length - 1);
      const newOrder = reinsert(order, order.indexOf(lastPressed), row);
      const newWidthList = reinsert(widthList, order.indexOf(lastPressed), row);
      this.setState({ mouse, order: newOrder, widthList: newWidthList });
      if (!isEqual(order, newOrder)) this.props.onOrderChange(newOrder);
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
    const { mouse, isPressed, lastPressed, order } = this.state;
    const { children, disableEffect } = this.props; // TODO: Add disableFloatEffect
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
        <Motion style={style} key={i}>
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
                isResizable={{ x: true, y: false, xy: false }}
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
                  zIndex: i === lastPressed ? 99 : i,
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

