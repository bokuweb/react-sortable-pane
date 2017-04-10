import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    isResizable: PropTypes.shape({
      x: React.PropTypes.bool,
      y: React.PropTypes.bool,
      xy: React.PropTypes.bool,
    }),
  };

  static defaultProps = {
    onDragStart: () => null,
    onDragEnd: () => null,
    style: {},
    className: '',
    isResizable: {
      x: true,
      y: true,
      xy: true,
    },
  };

  render() {
    return (
      <div className={this.props.className}>{this.props.children}</div>
    );
  }
}
