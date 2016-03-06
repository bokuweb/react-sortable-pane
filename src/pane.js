import React, { Component, PropTypes } from 'react';

export default class Pane extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    minHeight: PropTypes.number,
    maxHeight: PropTypes.number,
    style: PropTypes.object,
    children: PropTypes.any,
  };

  static defaultProps = {
    style: {},
  };

  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
}

