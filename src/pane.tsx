import * as React from 'react';
import Resizable from 're-resizable';

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
};

export const Pane: React.SFC<PaneProps> = (props: PaneProps) => {
  return (
    <Resizable
      {...props}
      enable={{
        top: false,
        right: props.isResizable && props.isResizable.x,
        bottom: props.isResizable && props.isResizable.y,
        left: false,
        topRight: false,
        bottomRight: props.isResizable && props.isResizable.xy,
        bottomLeft: false,
        topLeft: false,
      }}
    >
      {props.children}
    </Resizable>
  );
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
