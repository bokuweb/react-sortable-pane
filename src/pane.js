import React, { Component, PropTypes } from 'react';

export default class Pane extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    height: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    minHeight: PropTypes.number,
    maxHeight: PropTypes.number,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.any,
  };

  static defaultProps = {
    onDragStart: () => null,
    onDragEnd: () => null,
    style: {},
    className: '',
  };

  render() {
    return (
      <div className={this.props.className}>{this.props.children}</div>
    );
  }
}
