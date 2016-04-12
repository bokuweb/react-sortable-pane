export default {

  componentDidMount() {
    this.setSize();
  },

  componentWillReceiveProps (nextProps) {
    // this.updateOrder(this.props.panes, 0, 'removePane')
    // LOG()
    // this.setSize()
  },

  componentWillUpdate(nextProps) {
    // const { panes } = this.state;
    // if (nextProps.children.length > panes.length) return this.addPane(nextProps);
    // if (nextProps.children.length < panes.length) return this.removePane(nextProps);
    // return null;
  },

  componentDidUpdate() {
    LOG(this.state)
    //
    // if (this.hasAdded) {
    //   this.hasAdded = false;
    if (this.state.isPressed) return
      this.setSize()
    // }
  },

  componentWillUnmount() {
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleMouseUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }
}
