import * as React from 'react';
import { Motion, spring } from 'react-motion';
import { ResizableDirection } from 're-resizable';
import ResizeObserver from 'resize-observer-polyfill';
import isEqual from 'lodash.isequal';
import debounce from 'lodash.debounce';
import { Pane, PaneProps } from './pane';

const MAXIMUM_Z_INDEX = 2147483647;
const HYSTERESIS = 10;

declare global {
  interface Window {
    TouchEvent: TouchEvent;
  }
}

function reinsert<T>(array: Array<T>, from: number, to: number): Array<T> {
  const a = array.slice(0);
  const v = a[from];
  a.splice(from, 1);
  a.splice(to, 0, v);
  return a;
}

const directionDict: { [key: string]: PaneResizeDirection } = {
  right: 'x',
  bottom: 'y',
  bottomRight: 'xy',
};

const clamp = (n: number, min = n, max = n): number => Math.max(Math.min(n, max), min);

type Spring = {
  damping?: number;
  stiffness?: number;
  precision?: number;
};

const springConfig: Spring = {
  damping: 30,
  stiffness: 500,
};

export type PaneKey = string | number | null;

export type PaneSize = { width: number; height: number };

export type PaneProperty = {
  key: PaneKey;
  ref: Element | null;
};

export type PaneDirection = 'horizontal' | 'vertical';

export type PaneResizeDirection = 'x' | 'y' | 'xy';

export type PaneMode = 'add' | 'remove';

export type SortablePaneProps = {
  direction?: 'horizontal' | 'vertical';
  margin?: number;
  style?: React.CSSProperties;
  onResize?: (
    e: MouseEvent | TouchEvent,
    key: PaneKey,
    dir: PaneResizeDirection,
    elementRef: HTMLElement,
    delta: PaneSize,
  ) => void;
  onResizeStop?: (
    e: MouseEvent | TouchEvent,
    key: PaneKey,
    dir: PaneResizeDirection,
    elementRef: HTMLElement,
    delta: PaneSize,
  ) => void;
  onResizeStart?: (
    e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
    key: PaneKey,
    dir: PaneResizeDirection,
  ) => void;
  onDragStart?: (
    e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
    key: PaneKey,
    elementRef: HTMLElement,
  ) => void;
  onDragStop?: (e: MouseEvent | TouchEvent, key: PaneKey, elementRef: HTMLElement) => void;
  onOrderChange?: (order: string[]) => void;
  className?: string;
  disableEffect?: boolean;
  isSortable?: boolean;
  dragHandleClassName?: string;
  defaultOrder?: string[];
  order?: string[];
  children: React.ReactElement<PaneProps>[];
};

type State = {
  delta: number;
  mouse: number;
  isPressed: boolean;
  lastPressed: number;
  isResizing: boolean;
  panes: Array<PaneProperty>;
};

class SortablePane extends React.Component<SortablePaneProps, State> {
  panesWrapper!: HTMLDivElement;
  resizeObserver!: ResizeObserver;
  sizePropsUpdated: boolean;
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
    const order = props.order || props.defaultOrder;
    const children = props.children || [];
    this.state = {
      delta: 0,
      mouse: 0,
      isPressed: false,
      lastPressed: 0,
      isResizing: false,
      panes: order
        ? order.map(key => {
            const c = children.find(c => c.key === key);
            if (typeof c === 'undefined') {
              throw new Error(
                `key [${key}] is not found in props.children. Please set correct key name to Pane component.`,
              );
            }
            return {
              key: c.key,
              ref: null,
            };
          })
        : children.map(child => ({
            key: child.key,
            ref: null,
          })),
    };
    this.sizePropsUpdated = false;
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.debounceUpdate = debounce(() => this.forceUpdate(), 100);
  }

  componentDidMount() {
    if (typeof window !== 'undefined' && this.panesWrapper) {
      const { panesWrapper } = this;
      panesWrapper.addEventListener('touchmove', this.handleTouchMove);
      panesWrapper.addEventListener('touchend', this.handleMouseUp);
      panesWrapper.addEventListener('mousemove', this.handleMove);
      panesWrapper.addEventListener('mouseup', this.handleMouseUp);
      panesWrapper.addEventListener('mouseleave', this.handleMouseUp);
      this.resizeObserver = new ResizeObserver(this.debounceUpdate);
    }
    if (this.panesWrapper && this.panesWrapper.parentElement instanceof Element) {
      this.resizeObserver.observe(this.panesWrapper);
    }
    if (!this.panesWrapper || !this.panesWrapper.children) return;
    const panes = [].slice.apply(this.panesWrapper.children) || [];
    const newPanes = this.panes.map((pane, i) => {
      return {
        key: pane.key,
        ref: panes[this.order[i]],
      };
    });
    this.setState({ panes: newPanes });
  }

  componentDidUpdate(prevProps: SortablePaneProps) {
    const { panes } = this.state;
    const children = this.props.children || [];
    if (children.length > panes.length) return this.addPane();
    if (children.length < panes.length) return this.removePane();
    if (!isEqual(prevProps.order, this.props.order)) {
      if (!this.panesWrapper) return;
      const newPanes = (this.props.order || []).map((key: string) => {
        const index = [].slice.apply(this.props.children).findIndex((c: JSX.Element) => {
          return c.key === key;
        });
        return {
          ref: this.panesWrapper.children[index],
          key,
        };
      });
      this.setState({ panes: newPanes });
    }
    return undefined;
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined' && this.panesWrapper) {
      const { panesWrapper } = this;
      panesWrapper.removeEventListener('touchmove', this.handleTouchMove);
      panesWrapper.removeEventListener('touchend', this.handleMouseUp);
      panesWrapper.removeEventListener('mousemove', this.handleMove);
      panesWrapper.removeEventListener('mouseup', this.handleMouseUp);
      if (this.panesWrapper && this.panesWrapper.parentElement instanceof Element) {
        this.resizeObserver.unobserve(this.panesWrapper);
      }
    }
  }

  get order(): number[] {
    const children = this.props.children || [];
    if (this.props.order) {
      return this.props.order.map(key => {
        return children.findIndex(c => {
          return key === c.key;
        });
      });
    }
    return this.panes.map(p => {
      return children.findIndex(c => {
        return p.key === c.key;
      });
    });
  }

  get panes() {
    return this.state.panes.filter(p => !!p);
  }

  onResize(i: number, e: MouseEvent | TouchEvent, dir: ResizableDirection, elementRef: HTMLElement, delta: PaneSize) {
    const { panes } = this.state;
    this.forceUpdate();
    const pane = panes[this.order.indexOf(i)];
    if (!pane) return;
    if (!this.props.onResize) return;
    let direction: PaneResizeDirection;
    if (dir === 'right' || dir === 'bottom' || dir === 'bottomRight') {
      direction = directionDict[dir];
    } else {
      return;
    }
    this.props.onResize(e, pane.key, direction, elementRef, delta);
  }

  getPaneSizeList(): Array<number> {
    const width = this.panes.map((pane: PaneProperty) =>
      Number((pane.ref && (pane.ref as HTMLElement).offsetWidth) || 0),
    );
    const height = this.panes.map((pane: PaneProperty) =>
      Number((pane.ref && (pane.ref as HTMLElement).offsetHeight) || 0),
    );
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
   * @param  {number}   currentPane - Index of reference pane
   * @param  {number[]} sizes       - Array of pane sizes
   * @param  {number}   margin      - The margin between panes
   * @return {object}               - Object containing 'previous' and 'next'
   *                                  pane halfway points
   */
  getSurroundingHalfSizes = (
    currentPane: number,
    sizes: number[],
    margin: number,
  ): { previous: number; next: number } => {
    const nextPane = currentPane + 1;
    const prevPane = currentPane - 1;

    return sizes.reduce(
      (sums: { previous: number; next: number }, size: number, index: number) => {
        const newSums = { previous: 0, next: 0 };
        if (index < prevPane) {
          newSums.previous = sums.previous + size + margin;
        } else if (index === prevPane) {
          newSums.previous = sums.previous + size / 2;
        } else {
          newSums.previous = sums.previous;
        }

        if (index < nextPane) {
          newSums.next = sums.next + size + margin;
        } else if (index === nextPane) {
          newSums.next = sums.next + size / 2;
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

  getItemPositionByIndex(index: number) {
    const size = this.getPaneSizeList();
    let sum = 0;
    if (size.some(s => typeof s === 'string')) return 0;
    for (let i = 0; i < index; i += 1) {
      sum += size[i] + (this.props.margin || 0);
    }
    return sum;
  }

  isHorizontal() {
    return this.props.direction === 'horizontal';
  }

  addPane() {
    if (!this.panesWrapper || !this.panesWrapper.children) return;
    const newPanes = this.panes;
    const children = this.props.children || [];
    children.forEach((child, i) => {
      const keys = this.panes.map(pane => pane.key);
      if (keys.indexOf(child.key) === -1) {
        const { key } = child;
        const { panesWrapper } = this;
        const pane = { key, ref: panesWrapper.children[i] };
        newPanes.splice(i, 0, pane);
      }
    });
    this.setState({ panes: newPanes });
  }

  removePane() {
    const newPanes = this.panes;
    this.panes.forEach((pane, i) => {
      const keys = (this.props.children || []).map(child => child.key);
      if (keys.indexOf(pane.key) === -1) {
        newPanes.splice(i, 1);
      }
    });
    this.setState({ panes: newPanes });
  }

  handleResizeStart(
    i: number,
    e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
    dir: ResizableDirection,
  ) {
    const { panes } = this.state;
    this.setState({ isResizing: true });
    const { key } = panes[this.order.indexOf(i)];
    if (typeof key === 'undefined') return;
    if (this.props.onResizeStart) {
      let direction: PaneResizeDirection;
      if (dir === 'right' || dir === 'bottom' || dir === 'bottomRight') {
        direction = directionDict[dir];
      } else {
        return;
      }
      this.props.onResizeStart(e, key, direction);
    }
  }

  handleResizeStop(
    i: number,
    e: MouseEvent | TouchEvent,
    dir: ResizableDirection,
    elementRef: HTMLElement,
    delta: PaneSize,
  ) {
    const { panes } = this.state;
    this.setState({ isResizing: false });
    const pane = panes[this.order.indexOf(i)];
    const { key } = pane;
    if (typeof key === 'undefined') return;

    if (this.props.onResizeStop) {
      let direction: PaneResizeDirection;
      if (dir === 'right' || dir === 'bottom' || dir === 'bottomRight') {
        direction = directionDict[dir];
      } else {
        return;
      }
      this.props.onResizeStop(e, key, direction, elementRef, delta);
    }
  }

  handleMouseDown(
    pos: number,
    pressX: number,
    pressY: number,
    e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
  ) {
    if (this.props.dragHandleClassName) {
      if (e.target instanceof HTMLElement) {
        if (!e.target.classList.contains(this.props.dragHandleClassName)) {
          return;
        }
      }
    }
    let delta = 0;
    if (window && window.TouchEvent && e.nativeEvent instanceof TouchEvent) {
      const event = e.nativeEvent.touches[0];
      delta = this.isHorizontal() ? event.pageX - pressX : event.pageY - pressY;
    } else if (MouseEvent && e.nativeEvent instanceof MouseEvent) {
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
    if (child.props.onMouseDown) child.props.onMouseDown(e);
    if (this.props.onDragStart) {
      const c = this.panes.find(p => p.key === child.key);
      if (c && c.ref) {
        this.props.onDragStart(e, child.key, c.ref as HTMLElement);
      }
    }
  }

  handleMove({ pageX, pageY }: { pageX: number; pageY: number }) {
    const { isPressed, delta, lastPressed, isResizing, panes } = this.state;
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
          this.props.onOrderChange(newPanes.map(p => String(p.key)));
        }
      }
    }
  }

  handleTouchStart(
    key: number,
    x: number,
    y: number,
    e: React.TouchEvent<HTMLElement>,
    child: React.ReactElement<PaneProps>,
  ) {
    if (child.props.onTouchStart) child.props.onTouchStart(e);
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
    const lastPressedId = child.key;
    if (!this.props.isSortable) return;
    if (this.props.onDragStop) {
      const c = this.panes.find(p => p.key === child.key);
      if (c && c.ref) {
        this.props.onDragStop(e, child.key, c.ref as HTMLElement);
      }
    }
  }

  renderPanes() {
    const { mouse, isPressed, lastPressed, isResizing } = this.state;
    const { disableEffect, isSortable } = this.props;
    const children = this.props.children || [];
    return children.map((child, i) => {
      const pos = this.props.order
        ? this.getItemPositionByIndex(this.props.order.indexOf(String(child.key)))
        : this.getItemPositionByIndex(this.order.indexOf(i));
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
        <Motion style={style} key={String(child.key)}>
          {({ scale, shadow, x, y }) => {
            const onResize = this.onResize.bind(this, i);
            const onMouseDown = isSortable
              ? this.handleMouseDown.bind(this, i, x, y)
              : (e: React.MouseEvent<HTMLElement>) => {
                  if (child.props.onMouseDown) child.props.onMouseDown(e);
                };
            const onTouchStart = this.handleTouchStart.bind(this, i, x, y, child);
            const onResizeStart = this.handleResizeStart.bind(this, i);
            const onResizeStop = this.handleResizeStop.bind(this, i);
            const onSizeChange = () => this.forceUpdate();
            const style = {
              ...child.props.style,
              boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
              transform: `translate3d(${x}px, ${y}px, 0px) scale(${scale})`,
              WebkitTransform: `translate3d(${x}px, ${y}px, 0px) scale(${scale})`,
              MozTransform: `translate3d(${x}px, ${y}px, 0px) scale(${scale})`,
              MsTransform: `translate3d(${x}px, ${y}px, 0px) scale(${scale})`,
              zIndex: (i === lastPressed && this.state.isPressed
                ? MAXIMUM_Z_INDEX
                : (child.props.style && child.props.style.zIndex) || 'auto') as 'auto' | number,
              position: 'absolute' as 'absolute',
              userSelect: isPressed || isResizing ? ('none' as 'none') : ('auto' as 'auto'),
            };
            return React.cloneElement(child, {
              onMouseDown,
              onTouchStart,
              onResizeStart,
              onResizeStop,
              onResize,
              onSizeChange,
              style,
            });
          }}
        </Motion>
      );
    });
  }

  render() {
    const { style, className } = this.props;
    return (
      <div
        ref={(c: HTMLDivElement | null) => {
          if (c) {
            this.panesWrapper = c;
          }
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
