import React from 'react';
import { Motion, spring } from 'react-motion';
import Resizable from '/lib/react-resizable-box/src/index.js';
import Pane from './Pane';

export default {

  renderPanes() {
    const { mouse, isPressed, lastPressed } = this.state;
    const order = this.getPanePropsArrayOf('order');
    LOG('order', order)
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
            // LOG(x, this.state.panes[0].width, this.state.panes[1].width)
            return (
              <Resizable
                customClass={child.props.className}
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
                onResize={onResize}
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
  },

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


const springConfig = {
  stiffness: 500,
  damping: 30,
  onRest: (...args) => console.log(...args)
};
