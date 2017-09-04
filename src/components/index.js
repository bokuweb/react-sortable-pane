/* @flow */

import * as React from 'react';
// $FlowIgnore
import { Motion, spring } from 'react-motion';
import Resizable from 'react-resizable-box';
// $FlowIgnore
import type { Direction } from 'react-resizable-box';
import isEqual from 'lodash.isequal';
import Pane from './pane';

function reinsert<T>(array: Array<T>, from: number, to: number): Array<T> {
  const a = array.slice(0);
  const v = a[from];
  a.splice(from, 1);
  a.splice(to, 0, v);
  return a;
}

const directionDict = {
  right: 'x',
  bottom: 'y',
  bottomRight: 'xy',
};

const clamp = (n: number, min = n, max = n): number => Math.max(Math.min(n, max), min);

type Spring = {
  damping?: number;
  stiffness?: number;
  precision?: number;
}

const springConfig: Spring = {
  damping: 30,
  stiffness: 500,
};

type PaneId = string | number;

export type PaneSize = { width: number; height: number; }

export type PaneProperty = $Exact<{
  id: PaneId;
  width: number | string;
  height: number | string;
  order: number;
}>

export type PaneDirection = 'horizontal' | 'vertical';

export type PaneMode = 'add' | 'remove';

export type PaneResizeData = $Exact<{
  pane: PaneProperty;
  direction: $Values<typeof directionDict>;
  delta: PaneSize;
}>

export type IdWithPanes = {
  id: PaneId;
  panes: PaneProperty[];
}

export type SortablePaneProps = $Exact<{
  order: number[];
  direction?: Direction;
  margin?: number;
  style?: { [key: string]: string };
  children?: Pane[];
  onResize?: (
    e: MouseEvent | TouchEvent,
    id: PaneId,
    panes: PaneProperty[],
    data: PaneResizeData
  ) => void;
  onResizeStop?: (
    e: MouseEvent | TouchEvent,
    id: PaneId,
    panes: PaneProperty[],
    data: PaneResizeData
  ) => void;
  onResizeStart?: (
    e: SyntheticMouseEvent<HTMLElement> | SyntheticTouchEvent<HTMLElement>,
    id: PaneId,
    panes: PaneProperty[]
  ) => void;
  onDragStart?: (
    e: SyntheticMouseEvent<HTMLElement> | SyntheticTouchEvent<HTMLElement>,
    id: PaneId,
    panes: PaneProperty[]
  ) => void;
  onDragStop?: (
    e: MouseEvent | TouchEvent,
    id: PaneId,
    panes: PaneProperty[]
  ) => void;
  onOrderChange?: (oldPanes: PaneProperty[], newPanes: PaneProperty[]) => void;
  className?: string;
  disableEffect?: boolean;
  isSortable?: boolean;
  zIndex?: number;
  dragHandleClassName?: string;
  grid?: [number, number];
}>

class SortablePane extends React.Component<SortablePaneProps, {
  delta: number;
  mouse: number;
  isPressed: boolean;
  lastPressed: number;
  isResizing: boolean;
  panes: Array<PaneProperty>;
}> {
  panes: (React$ElementRef<'div'> | null);
  sizePropsUpdated: boolean;
  handleTouchMove: () => void;
  handleMouseUp: () => void;
  handleMouseMove: (touch: Touch) => void;

  static defaultProps = {
    order: [],
    direction: 'horizontal',
    style: {},
    children: [],
    margin: 0,
    onClick: () => null,
    onTouchStart: () => null,
    onResizeStart: () => null,
    onResize: () => null,
    onResizeStop: () => null,
    onDragStart: () => null,
    onDragStop: () => null,
    onOrderChange: () => null,
    className: '',
    disableEffect: false,
    isSortable: true,
    zIndex: 100,
  };

  constructor(props: SortablePaneProps) {
    super(props);
    this.state = {
      delta: 0,
      mouse: 0,
      isPressed: false,
      lastPressed: 0,
      isResizing: false,
      panes: (this.props.children || []).map((child: Pane, order: number) => ({
        id: child.props.id,
        width: child.props.width,
        height: child.props.height,
        order,
      })),
    };
    this.sizePropsUpdated = false;
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    if (typeof window !== 'undefined') {
      window.addEventListener('touchmove', this.handleTouchMove);
      window.addEventListener('touchend', this.handleMouseUp);
      window.addEventListener('mousemove', this.handleMouseMove);
      window.addEventListener('mouseup', this.handleMouseUp);
    }
  }

  componentDidMount() {
    this.setSize();
  }

  componentWillReceiveProps(next: SortablePaneProps) {
    const newPanes = [];
    const order = this.getPanePropsArrayOf('order');
    if (!isEqual(this.props.order, next.order)) {
      for (let i = 0; i < next.order.length; i += 1) {
        if (this.state.panes.length) {
          const pane = this.state.panes[parseInt(order[i], 10)];
          newPanes[next.order[i]] = pane;
        }
      }
      this.setState({ panes: newPanes });
    }

    if (!next.children || next.children.length === 0) return;
    const children = this.props.children || [];
    for (let i = 0; i < children.length; i += 1) {
      if (next.children[i]) {
        const child = children[i];
        if (child) {
          const width = child.props.width;
          const height = child.props.height;
          const newWidth = next.children[i].props.width;
          const newHeight = next.children[i].props.height;
          if (width !== newWidth || height !== newHeight) this.sizePropsUpdated = true;
        }
      }
    }
  }

  componentDidUpdate() {
    const { panes } = this.state;
    const children = this.props.children || [];
    if (children.length > panes.length) return this.addPane();
    if (children.length < panes.length) return this.removePane();
    if (this.sizePropsUpdated) {
      this.sizePropsUpdated = false;
      this.setSize();
    }
    return undefined;
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('touchmove', this.handleTouchMove);
      window.removeEventListener('touchend', this.handleMouseUp);
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('mouseup', this.handleMouseUp);
    }
  }

  onResize(
    i: number,
    e: MouseEvent | TouchEvent,
    dir: Direction,
    refToElement: HTMLElement,
    delta: PaneSize,
  ) {
    let { panes } = this.state;
    const order = this.getPanePropsArrayOf('order');
    panes = panes.map((pane: PaneProperty, index: number) => {
      if (order.indexOf(i) === index && this.panes) {
        const { offsetWidth, offsetHeight } = this.panes.children[i];
        return {
          width: offsetWidth,
          height: offsetHeight,
          order: pane.order,
          id: pane.id,
        };
      }
      return pane;
    });
    this.setState({ panes });
    const pane = panes[order.indexOf(i)];
    if (!pane) return;
    if (!this.props.onResize) return;
    this.props.onResize(e, pane.id, panes, {
      pane,
      direction: directionDict[dir],
      delta,
    });
  }

  getPanePropsArrayOf(key: $Keys<PaneProperty>) {
    return this.state.panes.map((pane: PaneProperty) => pane[`${key}`]);
  }

  getPaneSizeList(): Array<number> {
    const width = this.getPanePropsArrayOf('width');
    const height = this.getPanePropsArrayOf('height');
    return this.isHorizontal() ? width : height;
  }

  /**
   * Find the position sum of halfway points of panes surrounding a given pane
   *
   *  |-------------|
   *  |             | ---> 'previous' halfway
   *  |-------------|
   *                  <--- margin
   *  |-------------|
   *  | currentPane |
   *  |-------------|
   *                  <--- margin
   *  |-------------|
   *  |             |
   *  |             | ---> 'next' halfway
   *  |             |
   *  |-------------|
   *
   *
   * @param  {number}   currentPane - Index of rerference pane
   * @param  {number[]} sizes       - Array of pane sizes
   * @param  {number}   margin      - The margin between panes
   * @return {object}               - Object containing 'prevoius' and 'next'
   *                                  pane halfway points
   */
  getSurroundingHalfSizes = (currentPane: number, sizes: number[], margin: number) => {
    const nextPane = currentPane + 1;
    const prevPane = currentPane - 1;

    return sizes.reduce((sums, val, index) => {
      const newSums = {};
      if (index < prevPane) {
        newSums.previous = sums.previous + val + margin;
      } else if (index === prevPane) {
        newSums.previous = sums.previous + (val / 2);
      } else {
        newSums.previous = sums.previous;
      }

      if (index < nextPane) {
        newSums.next = sums.next + val + margin;
      } else if (index === nextPane) {
        newSums.next = sums.next + (val / 2);
      } else {
        newSums.next = sums.next;
      }
      return newSums;
    }, { previous: 0, next: 0 });
  }

  /**
   * Determine where a particular pane should be ordered
   *
   * @param  {number} position     - Top of the current pane
   * @param  {number} paneIndex    - Index of the pane
   * @return {number}              - New index of the pane based on position
   */
  getItemCountByPosition(position: number, paneIndex: number): number {
    const size: number[] = this.getPaneSizeList();
    const { margin } = this.props;
    const halfsizes = this.getSurroundingHalfSizes(paneIndex, size, margin || 0);

    if (position + size[paneIndex] > halfsizes.next) return paneIndex + 1;
    if (position < halfsizes.previous) return paneIndex - 1;
    return paneIndex;
  }

  setSize() {
    if (!this.panes || !this.panes.children) return;
    const panes = this.panes;
    const children = this.props.children || [];
    const newPanes = children.map((child, i) => {
      const { offsetWidth, offsetHeight } = panes.children[i];
      return {
        id: child.props.id,
        width: offsetWidth,
        height: offsetHeight,
        order: i,
      };
    });
    if (!isEqual(newPanes, this.state.panes)) this.setState({ panes: newPanes });
  }

  getItemPositionByIndex(index: number) {
    const size = this.getPaneSizeList();
    let sum = 0;
    for (let i = 0; i < index; i += 1) {
      sum += size[i] + this.props.margin;
    }
    return sum;
  }

  isHorizontal() {
    return this.props.direction === 'horizontal';
  }

  updateOrder = (panes: PaneProperty[], index: number, mode: PaneMode) => {
    return panes.map((pane: any) => {
      if (pane.order >= index) {
        const { id, width, height, order } = pane;
        return { id, width, height, order: mode === 'add' ? order + 1 : order - 1 };
      }
      return pane;
    });
  }

  addPane() {
    if (!this.panes || !this.panes.children) return;
    const panes = this.panes;
    let newPanes = this.state.panes;
    const children = this.props.children || [];
    children.forEach((child, i) => {
      const ids = this.state.panes.map(pane => pane.id);
      if (ids.indexOf(child.props.id) === -1) {
        newPanes = this.updateOrder(newPanes, i, 'add');
        const { id } = child.props;
        const { width, height } = panes.children[i].getBoundingClientRect();
        const pane = { id, width, height, order: i };
        newPanes.splice(i, 0, pane);
      }
    });
    this.setState({ panes: newPanes });
  }

  removePane() {
    let newPanes;
    const children = this.props.children || [];
    this.state.panes.forEach((pane, i) => {
      const ids = children.map(child => child.props.id);
      if (ids.indexOf(pane.id) === -1) {
        newPanes = this.updateOrder(this.state.panes, pane.order, 'remove');
        newPanes.splice(i, 1);
      }
    });
    this.setState({ panes: newPanes });
  }

  handleResizeStart(
    i: number,
    e: SyntheticMouseEvent<HTMLElement> | SyntheticTouchEvent<HTMLElement>,
  ) {
    const { panes } = this.state;
    const order = this.getPanePropsArrayOf('order');
    this.setState({ isResizing: true });
    const id = panes[order.indexOf(i)].id;
    if (typeof id === 'undefined') return;
    if (this.props.onResizeStart) {
      this.props.onResizeStart(e, id, panes);
    }
  }

  handleResizeStop(
    i: number,
    e: MouseEvent | TouchEvent,
    dir: Direction,
    refToElement: HTMLElement,
    delta: PaneSize) {
    const { panes } = this.state;
    const order = this.getPanePropsArrayOf('order');
    this.setState({ isResizing: false });
    const pane = panes[order.indexOf(i)];
    const id = pane.id;
    if (typeof id === 'undefined') return;
    if (this.props.onResizeStop) {
      this.props.onResizeStop(e, id, panes, {
        pane,
        direction: directionDict[dir],
        delta,
      });
    }
  }

  handleMouseDown(
    pos: number,
    pressX: number,
    pressY: number,
    e: SyntheticMouseEvent<HTMLElement> | SyntheticTouchEvent<HTMLElement>,
  ) {
    if (this.props.dragHandleClassName) {
      if (e.target instanceof HTMLElement) {
        if (!e.target.classList.contains(this.props.dragHandleClassName)) {
          return;
        }
      }
    }
    let delta;
    if (e.nativeEvent instanceof TouchEvent) {
      const event = e.nativeEvent.touches[0];
      delta = this.isHorizontal() ? event.pageX - pressX : event.pageY - pressY;
    } else if (e.nativeEvent instanceof MouseEvent) {
      const event: MouseEvent = e.nativeEvent;
      delta = this.isHorizontal()
        ? event.pageX - pressX
        : event.pageY - pressY;
    }
    this.setState({
      delta,
      mouse: this.isHorizontal() ? pressX : pressY,
      isPressed: true,
      lastPressed: pos,
    });
    if (!this.props.children) return;
    const child = this.props.children[pos];
    if (!child) return;
    if (this.props.onDragStart) {
      this.props.onDragStart(e, child.props.id, this.state.panes);
    }
  }

  handleMouseMove({ pageX, pageY }: { pageX: number, pageY: number }) {
    const { isPressed, delta, lastPressed, isResizing, panes } = this.state;
    if (isPressed && !isResizing) {
      const mouse = this.isHorizontal() ? pageX - delta : pageY - delta;
      const { length } = this.props.children || [];
      const order = this.getPanePropsArrayOf('order');
      const newPosition = this.getItemCountByPosition(mouse, order.indexOf(lastPressed));
      const row = clamp(Math.round(newPosition), 0, length - 1);
      const newPanes = reinsert(panes, order.indexOf(lastPressed), row);
      this.setState({ mouse, panes: newPanes });
      if (!this.props.onOrderChange) return;
      if (!isEqual(panes, newPanes)) {
        if (this.props.onOrderChange) {
          this.props.onOrderChange(panes, newPanes);
        }
      }
    }
  }

  handleTouchStart(key: number, x: number, y: number, e: SyntheticTouchEvent<HTMLElement>) {
    this.handleMouseDown(key, x, y, e);
  }

  handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  }

  handleMouseUp(e: MouseEvent | TouchEvent) {
    const children = this.props.children || [];
    if (children.length === 0) return;
    this.setState({ isPressed: false, delta: 0 });
    const child = children[this.state.lastPressed];
    const lastPressedId = child.props.id;
    // const pane = this.state.panes.find(p => p.id === lastPressedId);
    if (!this.props.isSortable) return;
    if (this.props.onDragStop) {
      this.props.onDragStop(e, lastPressedId, this.state.panes);
    }
  }

  renderPanes() {
    const { mouse, isPressed, lastPressed, isResizing } = this.state;
    const order = this.getPanePropsArrayOf('order');
    const { disableEffect, isSortable, zIndex } = this.props;
    const children = this.props.children || [];
    return children.map((child, i) => {
      const springPosition = spring(this.getItemPositionByIndex(order.indexOf(i)), springConfig);
      const style = lastPressed === i && isPressed
        ? {
          scale: disableEffect ? 1 : spring(1.05, springConfig),
          shadow: disableEffect ? 0 : spring(16, springConfig),
          x: this.isHorizontal() ? mouse : 0,
          y: !this.isHorizontal() ? mouse : 0,
        }
        : {
          scale: disableEffect ? 1 : spring(1, springConfig),
          shadow: disableEffect ? 0 : spring(0, springConfig),
          x: this.isHorizontal() ? springPosition : 0,
          y: !this.isHorizontal() ? springPosition : 0,
        };
      return (
        <Motion style={style} key={child.props.id}>
          {({ scale, shadow, x, y }) => {
            const onResize = this.onResize.bind(this, i);
            const onMouseDown = isSortable ? this.handleMouseDown.bind(this, i, x, y) : () => null;
            const onTouchStart = this.handleTouchStart.bind(this, i, x, y);
            const onResizeStart = this.handleResizeStart.bind(this, i);
            const onResizeStop = this.handleResizeStop.bind(this, i);
            const userSelect = (isPressed || isResizing)
              ? {
                userSelect: 'none',
                MozUserSelect: 'none',
                WebkitUserSelect: 'none',
                MsUserSelect: 'none',
              } : {
                userSelect: 'auto',
                MozUserSelect: 'auto',
                WebkitUserSelect: 'auto',
                MsUserSelect: 'auto',
              };

            // take a copy rather than direct-manipulating the child's prop, which violates React
            // and causes problems if the child's prop is a static default {}, which then will be
            // shared across all children!
            const customStyle = Object.assign({}, child.props.style);
            Object.assign(customStyle, {
              boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
              transform: `translate3d(${x}px, ${y}px, 0px) scale(${scale})`,
              WebkitTransform: `translate3d(${x}px, ${y}px, 0px) scale(${scale})`,
              MozTransform: `translate3d(${x}px, ${y}px, 0px) scale(${scale})`,
              MsTransform: `translate3d(${x}px, ${y}px, 0px) scale(${scale})`,
              zIndex: i === lastPressed ? zIndex + children.length : zIndex + i,
              position: 'absolute',
            }, userSelect);

            const extendsProps = {
              onMouseDown,
              onTouchStart,
            };

            return (
              <Resizable
                className={child.props.className}
                onResize={onResize}
                enable={{
                  top: false,
                  right: child.props.isResizable.x,
                  bottomRight: child.props.isResizable.xy,
                  bottom: child.props.isResizable.y,
                  left: false,
                  topRight: false,
                  bottomLeft: false,
                  topLeft: false,
                }}
                width={child.props.width}
                height={child.props.height}
                minWidth={child.props.minWidth}
                minHeight={child.props.minHeight}
                maxWidth={child.props.maxWidth}
                maxHeight={child.props.maxHeight}
                style={customStyle}
                onResizeStart={onResizeStart}
                onResizeStop={onResizeStop}
                extendsProps={extendsProps}
                grid={this.props.grid}
              >
                {child.props.children}
              </Resizable>
            );
          }}
        </Motion>
      );
    });
  }

  render() {
    const { style, className } = this.props;
    return (
      <div
        ref={(c: (React$ElementRef<'div'> | null)) => { this.panes = c; }}
        className={className}
        style={{ position: 'relative', height: '100%', ...style }}
      >
        {this.renderPanes()}
      </div>
    );
  }
}

export { Pane, SortablePane };
