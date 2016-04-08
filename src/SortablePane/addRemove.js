export default {
  updateOrder(panes, index, mode) {
    LOG()
    return panes.map(pane => {
      if (pane.order >= index) {
        const { id, width, height, order } = pane;
        return { id, width, height, order: mode === 'add' ? order + 1 : order - 1 };
      }
      return pane;
    });
  },

  addPane(nextProps) {
    LOG()
    // console.log(nextProps)
    let newPanes = this.state.panes;
    nextProps.children.forEach((child, i) => {
      // console.log(child, i)
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
  },

  removePane(nextProps) {
    LOG()
    let newPanes;
    this.state.panes.forEach((pane, i) => {
      const ids = nextProps.children.map(child => child.props.id);
      if (ids.indexOf(pane.id) === -1) {
        newPanes = this.updateOrder(this.state.panes, i, 'remove');
        newPanes.splice(i, 1);
      }
    });
    this.setState({ panes: newPanes });
  }
}
