'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortablePane = exports.Pane = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMotion = require('react-motion');

var _reactResizableBox = require('react-resizable-box');

var _reactResizableBox2 = _interopRequireDefault(_reactResizableBox);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

var _pane = require('./pane');

var _pane2 = _interopRequireDefault(_pane);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var reinsert = function reinsert(array, from, to) {
  var a = array.slice(0);
  var v = a[from];
  a.splice(from, 1);
  a.splice(to, 0, v);
  return a;
};

var clamp = function clamp(n) {
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : n;
  var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : n;
  return Math.max(Math.min(n, max), min);
};

var springConfig = [500, 30];

var SortablePane = function (_Component) {
  _inherits(SortablePane, _Component);

  function SortablePane(props) {
    _classCallCheck(this, SortablePane);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = {
      delta: 0,
      mouse: 0,
      isPressed: false,
      lastPressed: 0,
      isResizing: false,
      panes: _this.props.children.map(function (child, order) {
        return {
          id: child.props.id,
          width: child.props.width,
          height: child.props.height,
          order: order
        };
      })
    };
    _this.sizePropsUpdated = false;
    _this.handleTouchMove = _this.handleTouchMove.bind(_this);
    _this.handleMouseUp = _this.handleMouseUp.bind(_this);
    _this.handleMouseMove = _this.handleMouseMove.bind(_this);
    if (typeof window !== 'undefined') {
      window.addEventListener('touchmove', _this.handleTouchMove);
      window.addEventListener('touchend', _this.handleMouseUp);
      window.addEventListener('mousemove', _this.handleMouseMove);
      window.addEventListener('mouseup', _this.handleMouseUp);
    }
    return _this;
  }

  SortablePane.prototype.componentDidMount = function componentDidMount() {
    this.setSize();
  };

  SortablePane.prototype.componentWillReceiveProps = function componentWillReceiveProps(next) {
    var newPanes = [];
    var order = this.getPanePropsArrayOf('order');
    if (!(0, _lodash2.default)(this.props.order, next.order)) {
      for (var i = 0; i < next.order.length; i++) {
        newPanes[next.order[i]] = this.state.panes[order[i]];
      }
      this.setState({ panes: newPanes });
    }
    for (var _i = 0; _i < this.props.children.length; _i++) {
      if (next.children[_i]) {
        var width = this.props.children[_i].props.width;
        var height = this.props.children[_i].props.height;
        var newWidth = next.children[_i].props.width;
        var newHeight = next.children[_i].props.height;
        if (width !== newWidth || height !== newHeight) this.sizePropsUpdated = true;
      }
    }
  };

  SortablePane.prototype.componentDidUpdate = function componentDidUpdate() {
    var panes = this.state.panes;

    if (this.props.children.length > panes.length) return this.addPane();
    if (this.props.children.length < panes.length) return this.removePane();

    if (this.sizePropsUpdated) {
      this.sizePropsUpdated = false;
      this.setSize();
    }
    return null;
  };

  SortablePane.prototype.componentWillUnmount = function componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('touchmove', this.handleTouchMove);
      window.removeEventListener('touchend', this.handleMouseUp);
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('mouseup', this.handleMouseUp);
    }
  };

  SortablePane.prototype.onResize = function onResize(i, dir, size, rect) {
    var _this2 = this;

    var panes = this.state.panes;

    var order = this.getPanePropsArrayOf('order');
    panes = panes.map(function (pane, index) {
      if (order.indexOf(i) === index) {
        var _refs$panes$children$ = _this2.refs.panes.children[i],
            offsetWidth = _refs$panes$children$.offsetWidth,
            offsetHeight = _refs$panes$children$.offsetHeight;

        return {
          width: offsetWidth,
          height: offsetHeight,
          order: pane.order,
          id: pane.id
        };
      }
      return pane;
    });
    this.setState({ panes: panes });
    this.props.onResize({ id: panes[order.indexOf(i)].id, dir: dir, size: size, rect: rect });
  };

  SortablePane.prototype.getPanePropsArrayOf = function getPanePropsArrayOf(key) {
    return this.state.panes.map(function (pane) {
      return pane[key];
    });
  };

  SortablePane.prototype.getPaneSizeList = function getPaneSizeList() {
    var width = this.getPanePropsArrayOf('width');
    var height = this.getPanePropsArrayOf('height');
    return this.isHorizontal() ? width : height;
  };

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


  SortablePane.prototype.getSurroundingHalfSizes = function getSurroundingHalfSizes(currentPane, sizes, margin) {
    var nextPane = currentPane + 1;
    var prevPane = currentPane - 1;

    return sizes.reduce(function (sums, val, index) {
      var newSums = {};
      if (index < prevPane) {
        newSums.previous = sums.previous + val + margin;
      } else if (index === prevPane) {
        newSums.previous = sums.previous + val / 2;
      } else {
        newSums.previous = sums.previous;
      }

      if (index < nextPane) {
        newSums.next = sums.next + val + margin;
      } else if (index === nextPane) {
        newSums.next = sums.next + val / 2;
      } else {
        newSums.next = sums.next;
      }
      return newSums;
    }, { previous: 0, next: 0 });
  };

  /**
   * Determine where a particular pane should be ordered
   *
   * @param  {number} position     - Top of the current pane
   * @param  {number} paneIndex    - Index of the pane
   * @return {number}              - New index of the pane based on position
   */


  SortablePane.prototype.getItemCountByPosition = function getItemCountByPosition(position, paneIndex) {
    var size = this.getPaneSizeList();
    var margin = this.props.margin;

    var halfsizes = this.getSurroundingHalfSizes(paneIndex, size, margin);

    if (position + size[paneIndex] > halfsizes.next) return paneIndex + 1;
    if (position < halfsizes.previous) return paneIndex - 1;
    return paneIndex;
  };

  SortablePane.prototype.setSize = function setSize() {
    var _this3 = this;

    var panes = this.props.children.map(function (child, i) {
      var _refs$panes$children$2 = _this3.refs.panes.children[i],
          offsetWidth = _refs$panes$children$2.offsetWidth,
          offsetHeight = _refs$panes$children$2.offsetHeight;

      return {
        id: child.props.id,
        width: offsetWidth,
        height: offsetHeight,
        order: i
      };
    });
    if (!(0, _lodash2.default)(panes, this.state.panes)) this.setState({ panes: panes });
  };

  SortablePane.prototype.getItemPositionByIndex = function getItemPositionByIndex(index) {
    var size = this.getPaneSizeList();
    var sum = 0;
    for (var i = 0; i < index; i++) {
      sum += size[i] + this.props.margin;
    }return sum;
  };

  SortablePane.prototype.isHorizontal = function isHorizontal() {
    return this.props.direction === 'horizontal';
  };

  SortablePane.prototype.updateOrder = function updateOrder(panes, index, mode) {
    return panes.map(function (pane) {
      if (pane.order >= index) {
        var id = pane.id,
            width = pane.width,
            height = pane.height,
            order = pane.order;

        return { id: id, width: width, height: height, order: mode === 'add' ? order + 1 : order - 1 };
      }
      return pane;
    });
  };

  SortablePane.prototype.addPane = function addPane() {
    var _this4 = this;

    var newPanes = this.state.panes;
    this.props.children.forEach(function (child, i) {
      var ids = _this4.state.panes.map(function (pane) {
        return pane.id;
      });
      if (ids.indexOf(child.props.id) === -1) {
        newPanes = _this4.updateOrder(newPanes, i, 'add');
        var id = child.props.id;

        var _refs$panes$children$3 = _this4.refs.panes.children[i].getBoundingClientRect(),
            width = _refs$panes$children$3.width,
            height = _refs$panes$children$3.height;

        var pane = { id: id, width: width, height: height, order: i };
        newPanes.splice(i, 0, pane);
      }
    });
    this.setState({ panes: newPanes });
  };

  SortablePane.prototype.removePane = function removePane() {
    var _this5 = this;

    var newPanes = void 0;
    this.state.panes.forEach(function (pane, i) {
      var ids = _this5.props.children.map(function (child) {
        return child.props.id;
      });
      if (ids.indexOf(pane.id) === -1) {
        newPanes = _this5.updateOrder(_this5.state.panes, pane.order, 'remove');
        newPanes.splice(i, 1);
      }
    });
    this.setState({ panes: newPanes });
  };

  SortablePane.prototype.handleResizeStart = function handleResizeStart(i) {
    var order = this.getPanePropsArrayOf('order');
    this.setState({ isResizing: true });
    this.props.onResizeStart({ id: this.state.panes[order.indexOf(i)].id });
  };

  SortablePane.prototype.handleResizeStop = function handleResizeStop(i, dir, size, rect) {
    var panes = this.state.panes;

    var order = this.getPanePropsArrayOf('order');
    this.setState({ isResizing: false });
    this.props.onResizeStop({ id: panes[order.indexOf(i)].id, dir: dir, size: size, rect: rect });
  };

  SortablePane.prototype.handleMouseDown = function handleMouseDown(pos, pressX, pressY, _ref) {
    var pageX = _ref.pageX,
        pageY = _ref.pageY;

    this.setState({
      delta: this.isHorizontal() ? pageX - pressX : pageY - pressY,
      mouse: this.isHorizontal() ? pressX : pressY,
      isPressed: true,
      lastPressed: pos
    });
    this.props.children[pos].props.onDragStart();
    this.props.onDragStart(this.props.children[pos].props.id);
  };

  SortablePane.prototype.handleMouseMove = function handleMouseMove(_ref2) {
    var pageX = _ref2.pageX,
        pageY = _ref2.pageY;
    var _state = this.state,
        isPressed = _state.isPressed,
        delta = _state.delta,
        lastPressed = _state.lastPressed,
        isResizing = _state.isResizing,
        panes = _state.panes;
    var onOrderChange = this.props.onOrderChange;

    if (isPressed && !isResizing) {
      var mouse = this.isHorizontal() ? pageX - delta : pageY - delta;
      var length = this.props.children.length;

      var order = this.getPanePropsArrayOf('order');
      var newPosition = this.getItemCountByPosition(mouse, order.indexOf(lastPressed));
      var row = clamp(Math.round(newPosition), 0, length - 1);
      var newPanes = reinsert(panes, order.indexOf(lastPressed), row);
      this.setState({ mouse: mouse, panes: newPanes });
      if (!(0, _lodash2.default)(panes, newPanes)) onOrderChange(panes, newPanes);
    }
  };

  SortablePane.prototype.handleTouchStart = function handleTouchStart(key, pressLocation, e) {
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  };

  SortablePane.prototype.handleTouchMove = function handleTouchMove(e) {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  };

  SortablePane.prototype.handleMouseUp = function handleMouseUp(e) {
    if (this.props.children.length === 0) return;
    this.setState({ isPressed: false, delta: 0 });
    var lastPressedId = this.props.children[this.state.lastPressed].props.id;
    this.props.children[this.state.lastPressed].props.onDragEnd(e, this.state.panes.find(function (p) {
      return p.id === lastPressedId;
    }));
    this.props.onDragEnd(e, lastPressedId, this.state.panes);
  };

  SortablePane.prototype.renderPanes = function renderPanes() {
    var _this6 = this;

    var _state2 = this.state,
        mouse = _state2.mouse,
        isPressed = _state2.isPressed,
        lastPressed = _state2.lastPressed,
        isResizing = _state2.isResizing;

    var order = this.getPanePropsArrayOf('order');
    var _props = this.props,
        children = _props.children,
        disableEffect = _props.disableEffect,
        isSortable = _props.isSortable,
        zIndex = _props.zIndex;

    return children.map(function (child, i) {
      var springPosition = (0, _reactMotion.spring)(_this6.getItemPositionByIndex(order.indexOf(i)), springConfig);
      var style = lastPressed === i && isPressed ? {
        scale: disableEffect ? 1 : (0, _reactMotion.spring)(1.05, springConfig),
        shadow: disableEffect ? 0 : (0, _reactMotion.spring)(16, springConfig),
        x: _this6.isHorizontal() ? mouse : 0,
        y: !_this6.isHorizontal() ? mouse : 0
      } : {
        scale: disableEffect ? 1 : (0, _reactMotion.spring)(1, springConfig),
        shadow: disableEffect ? 0 : (0, _reactMotion.spring)(0, springConfig),
        x: _this6.isHorizontal() ? springPosition : 0,
        y: !_this6.isHorizontal() ? springPosition : 0
      };
      return _react2.default.createElement(
        _reactMotion.Motion,
        { style: style, key: child.props.id },
        function (_ref3) {
          var scale = _ref3.scale,
              shadow = _ref3.shadow,
              x = _ref3.x,
              y = _ref3.y;

          var onResize = _this6.onResize.bind(_this6, i);
          var onMouseDown = isSortable ? _this6.handleMouseDown.bind(_this6, i, x, y) : function () {
            return null;
          };
          var onTouchStart = _this6.handleTouchStart.bind(_this6, i, x, y);
          var onResizeStart = _this6.handleResizeStart.bind(_this6, i);
          var onResizeStop = _this6.handleResizeStop.bind(_this6, i);
          var userSelect = isPressed || isResizing ? {
            userSelect: 'none',
            MozUserSelect: 'none',
            WebkitUserSelect: 'none',
            MsUserSelect: 'none'
          } : {
            userSelect: 'auto',
            MozUserSelect: 'auto',
            WebkitUserSelect: 'auto',
            MsUserSelect: 'auto'
          };

          // take a copy rather than direct-manipulating the child's prop, which violates React
          // and causes problems if the child's prop is a static default {}, which then will be
          // shared across all children!
          var customStyle = _extends({}, child.props.style);
          _extends(customStyle, _extends({
            boxShadow: 'rgba(0, 0, 0, 0.2) 0px ' + shadow + 'px ' + 2 * shadow + 'px 0px',
            transform: 'translate3d(' + x + 'px, ' + y + 'px, 0px) scale(' + scale + ')',
            WebkitTransform: 'translate3d(' + x + 'px, ' + y + 'px, 0px) scale(' + scale + ')',
            MozTransform: 'translate3d(' + x + 'px, ' + y + 'px, 0px) scale(' + scale + ')',
            MsTransform: 'translate3d(' + x + 'px, ' + y + 'px, 0px) scale(' + scale + ')',
            zIndex: i === lastPressed ? zIndex + children.length : zIndex + i,
            position: 'absolute'
          }, userSelect));

          var extendsProps = {
            onMouseDown: onMouseDown,
            onTouchStart: onTouchStart
          };

          return _react2.default.createElement(
            _reactResizableBox2.default,
            {
              className: child.props.className,
              onResize: onResize,
              enable: {
                top: false,
                right: child.props.isResizable.x,
                bottomRight: child.props.isResizable.xy,
                bottom: child.props.isResizable.y,
                left: false,
                topRight: false,
                bottomLeft: false,
                topLeft: false
              },
              width: child.props.width,
              height: child.props.height,
              minWidth: child.props.minWidth,
              minHeight: child.props.minHeight,
              maxWidth: child.props.maxWidth,
              maxHeight: child.props.maxHeight,
              style: customStyle,
              onResizeStart: onResizeStart,
              onResizeStop: onResizeStop,
              extendsProps: extendsProps
            },
            child.props.children
          );
        }
      );
    });
  };

  SortablePane.prototype.render = function render() {
    var _props2 = this.props,
        style = _props2.style,
        className = _props2.className;

    return _react2.default.createElement(
      'div',
      {
        ref: 'panes',
        className: className,
        style: _extends({ position: 'relative' }, style)
      },
      this.renderPanes()
    );
  };

  return SortablePane;
}(_react.Component);

SortablePane.propTypes = {
  order: _propTypes2.default.arrayOf(_propTypes2.default.number),
  direction: _propTypes2.default.oneOf(['horizontal', 'vertical']),
  margin: _propTypes2.default.number,
  style: _propTypes2.default.object,
  children: _propTypes2.default.array,
  onResizeStart: _propTypes2.default.func,
  onResize: _propTypes2.default.func,
  onResizeStop: _propTypes2.default.func,
  onDragStart: _propTypes2.default.func,
  onDragEnd: _propTypes2.default.func,
  onOrderChange: _propTypes2.default.func,
  className: _propTypes2.default.string,
  disableEffect: _propTypes2.default.bool,
  isSortable: _propTypes2.default.bool,
  zIndex: _propTypes2.default.number
};
SortablePane.defaultProps = {
  order: [],
  direction: 'horizontal',
  margin: 0,
  onClick: function onClick() {
    return null;
  },
  onTouchStart: function onTouchStart() {
    return null;
  },
  onResizeStart: function onResizeStart() {
    return null;
  },
  onResize: function onResize() {
    return null;
  },
  onResizeStop: function onResizeStop() {
    return null;
  },
  onDragStart: function onDragStart() {
    return null;
  },
  onDragEnd: function onDragEnd() {
    return null;
  },
  onOrderChange: function onOrderChange() {
    return null;
  },
  customStyle: {},
  className: '',
  disableEffect: false,
  isSortable: true,
  zIndex: 100
};
exports.Pane = _pane2.default;
exports.SortablePane = SortablePane;