import * as React from 'react';
import Resizable from 're-resizable';
import isEqual from 'lodash.isequal';

export type IsPaneResizable = {
  x?: boolean;
  y?: boolean;
  xy?: boolean;
};

export type PaneSize = string | number;

export type PaneProps = {
  defaultSize?: {
    width?: PaneSize;
    height?: PaneSize;
  };
  size?: {
    width?: PaneSize;
    height?: PaneSize;
  };
  minWidth?: PaneSize;
  maxWidth?: PaneSize;
  minHeight?: PaneSize;
  maxHeight?: PaneSize;
  style?: React.CSSProperties;
  className?: string;
  children?: string | React.ReactNode;
  resizable?: IsPaneResizable;
  grid?: [number, number];
  onSizeChange?: () => void;
  [otherProps: string]: any;
};

export class Pane extends React.Component<PaneProps> {
  static defaultProps = {
    minWidth: 0,
    minHeight: 0,
    maxWidth: undefined,
    maxHeight: undefined,
    style: {},
    className: '',
    grid: [1, 1],
    resizable: {
      x: true,
      y: true,
      xy: true,
    },
  };

  componentDidUpdate(prevProps: PaneProps) {
    if (isEqual(prevProps.size, this.props.size)) return;
    if (!this.props.onSizeChange) return;
    this.props.onSizeChange();
  }

  get createAllowedProps(): PaneProps {
    const props: PaneProps = {};
    return Object.keys(this.props).reduce((acc: PaneProps, key: string) => {
      if (['resizable', 'onSizeChange'].indexOf(key) !== -1) return acc;
      acc[key] = this.props[key];
      return acc;
    }, props);
  }

  render() {
    return (
      <Resizable
        enable={{
          top: false,
          right: this.props.resizable && this.props.resizable.x,
          bottom: this.props.resizable && this.props.resizable.y,
          left: false,
          topRight: false,
          bottomRight: this.props.resizable && this.props.resizable.xy,
          bottomLeft: false,
          topLeft: false,
        }}
        {...this.createAllowedProps}
      >
        {this.props.children}
      </Resizable>
    );
  }
}
