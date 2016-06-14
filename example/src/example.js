import React, { Component } from 'react';
import { SortablePane, Pane } from '../../src';
import { Button } from 're-bulma';

const style = {
  fontSize: '40px',
  textAlign: 'center',
  borderRadius: '5px',
  padding: '15px',
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
          width={420}
          height={120}
          minWidth={100}
          maxWidth={800}
          minHeight={100}
          style={style}
          className="item"
        >
          <span>no1<br />resize or sort me!!</span>
        </Pane>,
        <Pane
          id={2}
          key={2}
          width={450}
          height={100}
          minWidth={100}
          minHeight={100}
          style={style}
          className="item"
        >
          <span>no2<br />resize or sort me!!</span>
        </Pane>,
        <Pane
          id={3}
          key={3}
          width={470}
          height={110}
          minWidth={100}
          minHeight={100}
          style={style}
          className="item"
        >
          <span>no3<br />resize or sort me!!</span>
        </Pane>,
      ],
    };
    this.add = ::this.add;
    this.remove = ::this.remove;
    this.onResize = ::this.onResize;
    // setInterval(() => this.setState({ order: this.state.order.map(order => (order + 1) % 3) }), 1000);
  }

  onResize(i) {
    console.log(`resize pane id = ${i}`);
  }

  add() {
    this.state.list.splice(~~(Math.random() * this.state.list.length), 0, (
      <Pane
        id={++this.id}
        key={this.id}
        width={~~(Math.random() * 100) + 350}
        height={~~(Math.random() * 200) + 100}
        minWidth={50}
        minHeight={100}
        style={style}
        className="item"
      >
        <span>no{this.id}<br />resize or sort me!!</span>
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
        <h1>sortable pane</h1>
        <Button
          onClick={this.add}
          style="isOutlined"
          color="isPrimary"
          customStyle={{
            color: '#fff', borderColor: '#fff',
          }}
        >
          Add
        </Button>
        <Button
          onClick={this.remove}
          style="isOutlined"
          color="isPrimary"
          customStyle={{
            color: '#fff', borderColor: '#fff', margin: '0 0 30px 10px',
          }}
        >
          Remove</Button>
        <SortablePane
          direction="vertical"
          margin={20}
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
