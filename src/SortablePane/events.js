import isEqual from 'lodash.isequal';

export default {

  //TODO: REFACTOR rename to handleResize?
  onResize(i, dir, size, rect) {
    LOG()
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
  },

  handleResizeStart(i) {
    const order = this.getPanePropsArrayOf('order');
    this.setState({ isResizing: true });
    this.props.onResizeStart({ id: this.state.panes[order.indexOf(i)].id });
  },

  handleResizeStop(i, dir, size, rect) {
    const { panes } = this.state;
    const order = this.getPanePropsArrayOf('order');
    this.setState({ isResizing: false });
    this.props.onResizeStop({ id: panes[order.indexOf(i)].id, dir, size, rect });
  },

  handleMouseDown(pos, pressX, pressY, { target, pageX, pageY }) { //NOTE: destructures pageX, pageY from React's `SyntheticMouseEvent`
    if (!!this.props.dragHandleClass && !target.classList.contains(this.props.dragHandleClass)) return

    this.setState({
      delta: this.isHorizontal() ? pageX - pressX : pageY - pressY,
      mouse: this.isHorizontal() ? pressX : pressY,
      isPressed: true,
      lastPressed: pos,
    });
  },

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
  },

  handleTouchStart(key, pressLocation, e) {
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  },

  handleTouchMove(e) {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  },

  handleMouseUp() {
    this.setState({ isPressed: false, delta: 0 });
  }
}



const reinsert = (array, from, to) => {
  const a = array.slice(0);
  const v = a[from];
  a.splice(from, 1);
  a.splice(to, 0, v);
  return a;
};

const clamp = (n, min = n, max = n) => Math.max(Math.min(n, max), min);
