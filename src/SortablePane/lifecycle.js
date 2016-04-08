export default {

  componentDidMount() {
    this.setSize();
  },

  componentWillReceiveProps (nextProps) {
    // this.updateOrder(this.props.panes, 0, 'removePane')
    // LOG()
    // this.setSize()
  },

  componentWillReceivePropsAndTransferToState (nextProps) {
    // LOG(this.state.panes, nextProps)
    nextProps.children.map((pane, index) => LOG(pane.props))
    let { panes } = this.state;
    panes = panes.map((pane, index) => {
      return {
        width: nextProps.children[index].props.width,
        height: nextProps.children[index].props.height,
        order: pane.order,
        id: pane.id,
      }
    })
    this.setState({panes})

  },

  componentWillUpdate(nextProps) {
    console.log('hi')
    // const { panes } = this.state;
    // if (nextProps.children.length > panes.length) return this.addPane(nextProps);
    // if (nextProps.children.length < panes.length) return this.removePane(nextProps);
    // return null;
    LOG()
    // this.setSize()
  },

  componentDidUpdate() {
    // if (this.hasAdded) {
    //   this.hasAdded = false;
    LOG(this.state)
    // if (this.state.isPressed) return

    // this.setSize()
    // }
  },

  componentWillUnmount() {
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleMouseUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }
}
