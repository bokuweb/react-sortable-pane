'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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
  id: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]).isRequired,
  width: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  height: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  minWidth: _propTypes2.default.number,
  maxWidth: _propTypes2.default.number,
  minHeight: _propTypes2.default.number,
  maxHeight: _propTypes2.default.number,
  onDragStart: _propTypes2.default.func,
  onDragEnd: _propTypes2.default.func,
  style: _propTypes2.default.object,
  className: _propTypes2.default.string,
  children: _propTypes2.default.any,
  isResizable: _propTypes2.default.shape({
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