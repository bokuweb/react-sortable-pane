import React, { Component, PropTypes } from 'react';

export default class Pane extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
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

