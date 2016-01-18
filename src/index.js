import React, {Component, PropTypes} from 'react';
import {Motion, spring} from 'react-motion';
import range from 'lodash.range';
import Resizable from 'react-resizable-box';

const reinsert = (arr, from, to) => {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
};

const clamp = (n, min, max) => {
  const _min = min || n;
  const _max = max || n;
  return Math.max(Math.min(n, _max), _min);
};

const springConfig = [500, 30];

export default class Demo extends Component{
  constructor(props) {
    super(props);
    this.state = {
      delta: 0,
      mouse: 0,
      isPressed: false,
      lastPressed: 0,
      order: range(this.props.children.length),
      widthList: range(this.props.children.length).map(item => 0),
      isResizing: false
    };
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp .bind(this);

    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  componentDidMount() {
    const children = Array.prototype.slice.call(this.refs.panes.children);
    const width = children.map(child => child.clientWidth);
    this.setState({widthList: width});
  }

  componentWillUnmount() {
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleMouseUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleResizeStart() {
    this.setState({isResizing: true});
  }

  handleResizeStop() {
    this.setState({isResizing: false});
  }

  handleTouchStart(key, pressLocation, e) {
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  }

  handleTouchMove(e) {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  }

  handleMouseDown(pos, pressX, {pageX}) {
    this.setState({
      delta : pageX - pressX,
      mouse : pressX,
      isPressed : true,
      lastPressed :  pos
    });
  }

  handleMouseMove({pageX}) {
    const {isPressed, delta, order, lastPressed, widthList, isResizing} = this.state;
    if (isPressed && !isResizing) {
      const mouse = pageX - delta;
      const {length} = this.props.children;
      const row = clamp(Math.round(this.getItemCountByPositionX(mouse)), 0, length - 1);
      const newOrder = reinsert(order, order.indexOf(lastPressed), row);
      const newWidthList = reinsert(widthList, order.indexOf(lastPressed), row);
      this.setState({mouse: mouse, order: newOrder, widthList: newWidthList});
    }
  }

  handleMouseUp() {
    this.setState({isPressed: false, delta: 0});
  }

  onResize(i, size) {
    let {widthList} = this.state;
    widthList[i] = size.width;
    this.setState({widthList});
    this.forceUpdate();
  }

  getItemCountByPositionX(x) {
    const {widthList} = this.state;
    const {marginRight} = this.props;
    let sum = 0;
    if (x < 0) return 0;
    for (let i = 0; i < widthList.length; i++) {
      sum += widthList[i] + marginRight;
      if (sum >= x) return i+1;
    }
    return widthList.length;
  }

  getItemPositionXByIndex(index) {
    const {widthList} = this.state;
    let sum = 0;
    for (let i = 0; i < index; i++) sum += widthList[i] + this.props.marginRight;
    return sum;
  }

  render() {
    const {mouse, isPressed, lastPressed, order} = this.state;
    const {length} = this.props.children;
    return (
      <div ref="panes">
        {range(length).map(i => {
          const style = lastPressed === i && isPressed
            ? {
                scale: spring(1.05, springConfig),
                shadow: spring(16, springConfig),
                x: mouse
              }
            : {
                scale: spring(1, springConfig),
                shadow: spring(1, springConfig),
                x: spring(this.getItemPositionXByIndex(order.indexOf(i)), springConfig)
              };
          return (
            <Motion style={style} key={i}>
              {({scale, shadow, x}) =>
               <Resizable customClass="demo8-item" onResize={this.onResize.bind(this, order.indexOf(i))}
                            canResize={{x:true, y:false, xy:false}}
                            customStyle={{
                              boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                              transform: `translate3d(${x}px, 0, 0) scale(${scale})`,
                              WebkitTransform: `translate3d(${x}px, 0, 0) scale(${scale})`,
                              zIndex: i === lastPressed ? 99 : i,
                              position: 'absolute'
                            }}
                            onMouseDown={this.handleMouseDown.bind(this, i, x)}
                            onTouchStart={this.handleTouchStart.bind(this, i, x)}
                            onResizeStart={this.handleResizeStart.bind(this)}
                            onResizeStop={this.handleResizeStop.bind(this)} >
                   {this.props.children[i]}
                 </Resizable>
               }
            </Motion>
          );
        })}
      </div>
    );
  }
}
