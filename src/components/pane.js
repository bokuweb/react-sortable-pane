/* @flow */

import React from 'react';

export type IsPaneResizable = {
  x?: boolean;
  y?: boolean;
  xy?: boolean;
};

export type PaneProps = {
  id: string | number;
  width: string | number;
  height: string | number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  style?: { [key: string]: string };
  className?: string;
  children?: string | React$Element<any>;
  isResizable: IsPaneResizable;
}

export default class Pane extends React.Component {
  props: PaneProps;

  static defaultProps = {
    minWidth: 0,
    minHeight: 0,
    maxWidth: undefined,
    maxHeight: undefined,
    style: {},
    className: '',
    isResizable: {
      x: true,
      y: true,
      xy: true,
    },
    children: '',
  };

  render() {
    return (
      <div className={this.props.className}>
        {this.props.children}
      </div>
    );
  }
}
