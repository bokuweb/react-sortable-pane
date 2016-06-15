'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var Pane = function (_Component) {
  _inherits(Pane, _Component);

  function Pane() {
    _classCallCheck(this, Pane);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Pane.prototype.render = function render() {
    return _react2.default.createElement(
      'div',
      { className: this.props.className },
      this.props.children
    );
  };

  return Pane;
}(_react.Component);

Pane.propTypes = {
  id: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]).isRequired,
  width: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
  height: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
  minWidth: _react.PropTypes.number,
  maxWidth: _react.PropTypes.number,
  minHeight: _react.PropTypes.number,
  maxHeight: _react.PropTypes.number,
  onDragStart: _react.PropTypes.func,
  onDragEnd: _react.PropTypes.func,
  style: _react.PropTypes.object,
  className: _react.PropTypes.string,
  children: _react.PropTypes.any,
  isResizable: _react.PropTypes.shape({
    x: _react2.default.PropTypes.bool,
    y: _react2.default.PropTypes.bool,
    xy: _react2.default.PropTypes.bool
  })
};
Pane.defaultProps = {
  onDragStart: function onDragStart() {
    return null;
  },
  onDragEnd: function onDragEnd() {
    return null;
  },
  style: {},
  className: '',
  isResizable: {
    x: true,
    y: true,
    xy: true
  }
};
exports.default = Pane;
module.exports = exports['default'];