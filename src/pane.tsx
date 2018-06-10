import * as React from 'react';
import Resizable from 're-resizable';
import isEqual from 'lodash.isequal';

export type IsPaneResizable = {
  x?: boolean;
  y?: boolean;
  xy?: boolean;
};

export type PaneProps = {
  defaultSize?: {
    width?: string | number;
    height?: string | number;
  };
  size?: {
    width?: string | number;
    height?: string | number;
  };
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  style?: React.CSSProperties;
  className?: string;
  children?: string | React.ReactNode;
  isResizable?: IsPaneResizable;
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
    isResizable: {
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
      if (['isResizable', 'onSizeChange'].indexOf(key) !== -1) return acc;
      acc[key] = this.props[key];
      return acc;
    }, props);
  }

  render() {
    return (
      <Resizable
        enable={{
          top: false,
          right: this.props.isResizable && this.props.isResizable.x,
          bottom: this.props.isResizable && this.props.isResizable.y,
          left: false,
          topRight: false,
          bottomRight: this.props.isResizable && this.props.isResizable.xy,
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
