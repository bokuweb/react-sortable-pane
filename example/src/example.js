import React, { Component } from 'react';
import { SortablePane, Pane } from '../../src';

const style = {
  fontSize: '40px',
  textAlign: 'center',
  paddingTop: '60px',
  paddingRight: '60px',
  height: '400px',
  border: 'solid 1px #ccc',
  borderRadius: '5px',
  backgroundColor: '#fff',
};

export default class Example extends Component {
  constructor(props) {
    super(props);
    this.id = 3;
    this.state = {
      order: [0, 1, 2],
      list: [
        <Pane
          id={1}
          key={1}
          width={200}
          height={70}
          minWidth={100}
          maxWidth={800}
          minHeight={100}
          style={style}
        >
          1
        </Pane>,
        <Pane
          id={2}
          key={2}
          width={300}
          height={50}
          minWidth={100}
          minHeight={100}
          style={style}
        >
          2
        </Pane>,
        <Pane
          id={3}
          key={3}
          width={100}
          height={40}
          minWidth={100}
          minHeight={100}
          style={style}
        >
          3
        </Pane>,
      ],
    };
    this.add = ::this.add;
    this.remove = ::this.remove;
    this.onResize = ::this.onResize;
    setInterval(() => this.setState({ order: this.state.order.map(order => (order + 1) % 3) }), 1000);
  }

  onResize(i) {
    console.log(`resize pane id = ${i}`);
  }

  add() {
    this.state.list.splice(~~(Math.random() * this.state.list.length), 0, (
      <Pane
        id={++this.id}
        key={this.id}
        width={~~(Math.random() * 200) + 100}
        height={~~(Math.random() * 200) + 100}
        minWidth={50}
        minHeight={100}
        style={style}
      >
       {this.id}
      </Pane>
    ));
    this.setState({ list: this.state.list });
  }

  remove() {
    this.state.list.splice(~~(Math.random() * this.state.list.length), 1);
    this.setState({ list: this.state.list });
  }

  render() {
    return (
      <div>
        <a onClick={this.add} >add</a>
        <a onClick={this.remove} >remove</a>
        <SortablePane
          direction="vertical"
          margin={10}
          onResize={this.onResize}
          onOrderChange={(pane) => console.dir(pane)}
          order={this.state.order}
        >
          {this.state.list}
        </SortablePane>
      </div>
    );
  }
}
