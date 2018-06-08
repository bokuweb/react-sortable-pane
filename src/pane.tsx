import * as React from 'react';
import Resizable from 're-resizable';

export type IsPaneResizable = {
  x?: boolean;
  y?: boolean;
  xy?: boolean;
};

export type PaneProps = {
  width?: string | number;
  height?: string | number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  style?: React.CSSProperties;
  className?: string;
  children?: string | React.ReactNode;
  isResizable?: IsPaneResizable;
  grid?: [number, number];
};

/*
export default class Pane extends React.Component<PaneProps> {
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
    return <div className={this.props.className}>{this.props.children}</div>;
  }
}
*/

export const Pane: React.SFC<PaneProps> = (props: PaneProps) => {
  return <Resizable {...props}>{props.children}</Resizable>;
};

Pane.defaultProps = {
  minWidth: 0,
  minHeight: 0,
  maxWidth: undefined,
  maxHeight: undefined,
  style: {},
  className: '',
  grid: [1, 1],
  isResizable: {
    x: true,
    y: true,
    xy: true,
  },
};
