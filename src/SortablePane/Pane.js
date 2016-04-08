import React, { Component, PropTypes } from 'react';

export default class Pane extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]).isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    minHeight: PropTypes.number,
    maxHeight: PropTypes.number,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.any,
  };

  static defaultProps = {
    style: {},
    className: '',
  };

  render() {
    return (
      <div className={this.props.className}>{this.props.children}</div>
    );
  }
}
