import isEqual from 'lodash.isequal';

export default {

  /**
   * NOTE: called by `componentDidMount`, `componentDidUpdate` if pane has been added dynamically
   */
  setSize() {
    const panes = this.props.children.map((child, i) => {
      const { width, height } = this.refs.panes.children[i].getBoundingClientRect();
      LOG('i:', i, 'width:', width)
      return {
        id: child.props.id,
        width,
        height,
        order: i,
      };
    });
    if (!isEqual(panes, this.state.panes)) this.setState({ panes });
  },


  getPanePropsArrayOf(key) {
    return this.state.panes.map(pane => pane[key]);
  },

  getPaneSizeList() {
    const width = this.getPanePropsArrayOf('width');
    const height = this.getPanePropsArrayOf('height');
    return this.isHorizontal() ? width : height;
  },

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
  },

  getItemPositionByIndex(index) {
    const size = this.getPaneSizeList();
    let sum = 0;
    for (let i = 0; i < index; i++) sum += size[i] + this.props.margin;
    // LOG(index, sum)
    return sum;
  },

  isHorizontal() {
    return this.props.direction === 'horizontal';
  }
}
