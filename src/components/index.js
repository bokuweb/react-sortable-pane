/* @flow */

import * as React from 'react';
import { Motion, spring } from 'react-motion';
import Resizable from 're-resizable';
import ResizeObserver from 'resize-observer-polyfill';
import type { ResizeDirection } from 're-resizable';
import isEqual from 'lodash.isequal';
import debounce from 'lodash.debounce';
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
  damping?: number,
  stiffness?: number,
  precision?: number,
};

const springConfig: Spring = {
  damping: 30,
  stiffness: 500,
};

type PaneId = string | number;

export type PaneSize = { width: number, height: number };

export type PaneProperty = $Exact<{
  id: PaneId,
  width: number | string,
  height: number | string,
}>;

export type PaneDirection = 'horizontal' | 'vertical';

export type PaneMode = 'add' | 'remove';

export type PaneResizeData = $Exact<{
  pane: PaneProperty,
  direction: 'x' | 'y' | 'xy',
  delta: PaneSize,
}>;

export type IdWithPanes = {
  id: PaneId,
  panes: PaneProperty[],
};

export type SortablePaneProps = $Exact<{
  direction?: 'horizontal' | 'vertical',
  margin?: number,
  style?: { [key: string]: string },
  children?: Pane[],
  onResize?: (
    e: MouseEvent | TouchEvent,
    id: PaneId,
    panes: PaneProperty[],
    data: PaneResizeData,
  ) => void,
  onResizeStop?: (
    e: MouseEvent | TouchEvent,
    id: PaneId,
    panes: PaneProperty[],
    data: PaneResizeData,
  ) => void,
  onResizeStart?: (
    e: SyntheticMouseEvent<HTMLElement> | SyntheticTouchEvent<HTMLElement>,
    id: PaneId,
    panes: PaneProperty[],
  ) => void,
  onDragStart?: (
    e: SyntheticMouseEvent<HTMLElement> | SyntheticTouchEvent<HTMLElement>,
    id: PaneId,
    panes: PaneProperty[],
  ) => void,
  onDragStop?: (e: MouseEvent | TouchEvent, id: PaneId, panes: PaneProperty[]) => void,
  onOrderChange?: (oldPanes: PaneProperty[], newPanes: PaneProperty[]) => void,
  className?: string,
  disableEffect?: boolean,
  isSortable?: boolean,
  dragHandleClassName?: string,
  grid?: [number, number],
}>;

type State = {
  delta: number,
  mouse: number,
  isPressed: boolean,
  lastPressed: number,
  isResizing: boolean,
  panes: Array<PaneProperty>,
};

const HYSTERESIS = 10;

class SortablePane extends React.Component<SortablePaneProps, State> {
  panes: React$ElementRef<'div'> | null;
  sizePropsUpdated: boolean;
  handleTouchMove: () => void;
  handleMouseUp: () => void;
  handleMove: (e: MouseEvent | Touch) => void;
  resizeObserver: ResizeObserver;
  debounceUpdate: () => void;

  static defaultProps = {
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
  };

  constructor(props: SortablePaneProps) {
    super(props);
    this.state = {
      delta: 0,
      mouse: 0,
      isPressed: false,
      lastPressed: 0,
      isResizing: false,
      panes: (this.props.children || []).map((child: Pane) => ({
        id: child.props.id,
        width: child.props.width,
        height: child.props.height,
      })),
    };
    this.sizePropsUpdated = false;
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.debounceUpdate = debounce(this.updateSize.bind(this), 100);
  }

  componentDidMount() {
    if (typeof window !== 'undefined' && this.panes) {
      const { panes } = this;
      panes.addEventListener('touchmove', this.handleTouchMove);
      panes.addEventListener('touchend', this.handleMouseUp);
      panes.addEventListener('mousemove', this.handleMove);
      panes.addEventListener('mouseup', this.handleMouseUp);
      panes.addEventListener('mouseleave', this.handleMouseUp);
      this.resizeObserver = new ResizeObserver(this.debounceUpdate);
    }
    if (this.panes && this.panes.parentElement instanceof Element) {
      this.resizeObserver.observe(this.panes.parentElement);
    }
    this.updateSize();
  }

  componentDidUpdate() {
    const { panes } = this.state;
    const children = this.props.children || [];
    if (children.length > panes.length) return this.addPane();
    if (children.length < panes.length) return this.removePane();
    if (this.sizePropsUpdated) {
      this.sizePropsUpdated = false;
      this.updateSize();
    }
    return undefined;
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined' && this.panes) {
      const { panes } = this;
      panes.removeEventListener('touchmove', this.handleTouchMove);
      panes.removeEventListener('touchend', this.handleMouseUp);
      panes.removeEventListener('mousemove', this.handleMove);
      panes.removeEventListener('mouseup', this.handleMouseUp);
      if (this.panes && this.panes.parentElement instanceof Element) {
        this.resizeObserver.unobserve(this.panes.parentElement);
      }
    }
  }

  get order(): number[] {
    const children = this.props.children || [];
    return this.state.panes.map((p) => {
      return children.findIndex((c) => {
        return p.id === c.props.id;
      });
    });
  }

  onResize(
    i: number,
    e: MouseEvent | TouchEvent,
    dir: ResizeDirection,
    elementRef: HTMLElement,
    delta: PaneSize,
  ) {
    let { panes } = this.state;
    panes = panes.map((pane: PaneProperty, index: number) => {
      if (this.order.indexOf(i) === index && this.panes) {
        const { offsetWidth, offsetHeight } = this.panes.children[i];
        return {
          width: offsetWidth,
          height: offsetHeight,
          id: pane.id,
        };
      }
      return pane;
    });
    this.setState({ panes });
    const pane = panes[this.order.indexOf(i)];
    if (!pane) return;
    if (!this.props.onResize) return;
    let direction;
    if (dir === 'right' || dir === 'bottom' || dir === 'bottomRight') {
      direction = directionDict[dir];
    } else {
      return;
    }
    this.props.onResize(e, pane.id, panes, {
      pane,
      direction,
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

    return sizes.reduce(
      (sums, size, index) => {
        const newSums = {};
        if (index < prevPane) {
          newSums.previous = sums.previous + size + margin;
        } else if (index === prevPane) {
          newSums.previous = sums.previous + (size / 2);
        } else {
          newSums.previous = sums.previous;
        }

        if (index < nextPane) {
          newSums.next = sums.next + size + margin;
        } else if (index === nextPane) {
          newSums.next = sums.next + (size / 2);
        } else {
          newSums.next = sums.next;
        }
        return newSums;
      },
      { previous: 0, next: 0 },
    );
  };

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
    const halfSizes = this.getSurroundingHalfSizes(paneIndex, size, margin || 0);
    if (position + size[paneIndex] > halfSizes.next + HYSTERESIS) return paneIndex + 1;
    if (position < halfSizes.previous - HYSTERESIS) return paneIndex - 1;
    return paneIndex;
  }

  /**
   * Update pane size
   */
  updateSize() {
    if (!this.panes || !this.panes.children) return;
    const { panes } = this;
    const newPanes = (this.props.children || []).map((child, i) => {
      const { offsetWidth, offsetHeight } = panes.children[i];
      return {
        id: child.props.id,
        width: offsetWidth,
        height: offsetHeight,
      };
    });
    if (!isEqual(newPanes, this.state.panes)) this.setState({ panes: newPanes });
  }

  getItemPositionByIndex(index: number) {
    const size = this.getPaneSizeList();
    let sum = 0;
    if (size.some(s => typeof s === 'string')) return 0;
    for (let i = 0; i < index; i += 1) {
      sum += size[i] + this.props.margin;
    }
    return sum;
  }

  isHorizontal() {
    return this.props.direction === 'horizontal';
  }

  addPane() {
    if (!this.panes || !this.panes.children) return;
    const newPanes = this.state.panes;
    const children = this.props.children || [];
    children.forEach((child, i) => {
      const ids = this.state.panes.map(pane => pane.id);
      if (ids.indexOf(child.props.id) === -1) {
        const { id } = child.props;
        const { panes } = this;
        if (!panes) return;
        const { width, height } = panes.children[i].getBoundingClientRect();
        const pane = { id, width, height };
        newPanes.splice(i, 0, pane);
      }
    });
    this.setState({ panes: newPanes });
  }

  removePane() {
    const newPanes = this.state.panes;
    this.state.panes.forEach((pane, i) => {
      const ids = (this.props.children || []).map(child => child.props.id);
      if (ids.indexOf(pane.id) === -1) {
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
    this.setState({ isResizing: true });
    const { id } = panes[this.order.indexOf(i)];
    if (typeof id === 'undefined') return;
    if (this.props.onResizeStart) {
      this.props.onResizeStart(e, id, panes);
    }
  }

  handleResizeStop(
    i: number,
    e: MouseEvent | TouchEvent,
    dir: ResizeDirection,
    elementRef: HTMLElement,
    delta: PaneSize,
  ) {
    const { panes } = this.state;
    this.setState({ isResizing: false });
    const pane = panes[this.order.indexOf(i)];
    const { id } = pane;
    if (typeof id === 'undefined') return;
    if (this.props.onResizeStop) {
      let direction;
      if (dir === 'right' || dir === 'bottom' || dir === 'bottomRight') {
        direction = directionDict[dir];
      } else {
        return;
      }
      this.props.onResizeStop(e, id, panes, {
        pane,
        direction,
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
    if (window && window.TouchEvent && e.nativeEvent instanceof window.TouchEvent) {
      const event = e.nativeEvent.touches[0];
      delta = this.isHorizontal() ? event.pageX - pressX : event.pageY - pressY;
    } else if (window && window.MouseEvent && e.nativeEvent instanceof window.MouseEvent) {
      const event: MouseEvent = e.nativeEvent;
      delta = this.isHorizontal() ? event.pageX - pressX : event.pageY - pressY;
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

  handleMove({ pageX, pageY }: { pageX: number, pageY: number }) {
    const {
      isPressed, delta, lastPressed, isResizing, panes,
    } = this.state;
    if (isPressed && !isResizing) {
      const mouse = this.isHorizontal() ? pageX - delta : pageY - delta;
      const { length } = this.props.children || [];
      const newPosition = this.getItemCountByPosition(mouse, this.order.indexOf(lastPressed));
      const pos = clamp(Math.round(newPosition), 0, length - 1);
      const newPanes = reinsert(panes, this.order.indexOf(lastPressed), pos);
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
    this.handleMove(e.touches[0]);
  }

  handleMouseUp(e: MouseEvent | TouchEvent) {
    const children = this.props.children || [];
    if (children.length === 0) return;
    this.setState({ isPressed: false, delta: 0 });
    const child = children[this.state.lastPressed];
    const lastPressedId = child.props.id;
    if (!this.props.isSortable) return;
    if (this.props.onDragStop) {
      this.props.onDragStop(e, lastPressedId, this.state.panes);
    }
  }

  renderPanes() {
    const {
      mouse, isPressed, lastPressed, isResizing,
    } = this.state;
    const { disableEffect, isSortable } = this.props;
    const children = this.props.children || [];
    return children.map((child: Pane, i) => {
      const pos = this.getItemPositionByIndex(this.order.indexOf(i));
      const springPosition = spring(pos, springConfig);
      const style =
        lastPressed === i && isPressed && !isResizing
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
          {({
            scale, shadow, x, y,
          }) => {
            const onResize = this.onResize.bind(this, i);
            const onMouseDown = isSortable ? this.handleMouseDown.bind(this, i, x, y) : () => null;
            const onTouchStart = this.handleTouchStart.bind(this, i, x, y);
            const onResizeStart = this.handleResizeStart.bind(this, i);
            const onResizeStop = this.handleResizeStop.bind(this, i);
            const userSelect =
              isPressed || isResizing
                ? {
                  userSelect: 'none',
                  MozUserSelect: 'none',
                  WebkitUserSelect: 'none',
                  MsUserSelect: 'none',
                }
                : {
                  userSelect: 'auto',
                  MozUserSelect: 'auto',
                  WebkitUserSelect: 'auto',
                  MsUserSelect: 'auto',
                };

            // take a copy rather than direct-manipulating the child's prop, which violates React
            // and causes problems if the child's prop is a static default {}, which then will be
            // shared across all children!
            const customStyle = Object.assign({}, child.props.style);
            Object.assign(
              customStyle,
              {
                boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                transform: `translate3d(${x}px, ${y}px, 0px) scale(${scale})`,
                WebkitTransform: `translate3d(${x}px, ${y}px, 0px) scale(${scale})`,
                MozTransform: `translate3d(${x}px, ${y}px, 0px) scale(${scale})`,
                MsTransform: `translate3d(${x}px, ${y}px, 0px) scale(${scale})`,
                zIndex:
                  i === lastPressed && this.state.isPressed
                    ? 999999
                    : (child.props.style && child.props.style.zIndex) || 'auto',
                position: 'absolute',
              },
              userSelect,
            );

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
                defaultSize={{
                  width: child.props.width,
                  height: child.props.height,
                }}
                minWidth={child.props.minWidth}
                minHeight={child.props.minHeight}
                maxWidth={child.props.maxWidth}
                maxHeight={child.props.maxHeight}
                style={customStyle}
                onResizeStart={onResizeStart}
                onResizeStop={onResizeStop}
                grid={this.props.grid}
                {...extendsProps}
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
        ref={(c: React$ElementRef<'div'> | null) => {
          this.panes = c;
        }}
        className={className}
        style={{ position: 'relative', height: '100%', ...style }}
      >
        {this.renderPanes()}
      </div>
    );
  }
}

export { Pane, SortablePane };
