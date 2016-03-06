import React, {Component} from 'react';
import SortablePane, {Pane} from '../../src';

const style = {
  fontSize: "40px",
  textAlign:"center",
  paddingTop:"60px",
  height:"400px",
  border: "solid 1px #ccc",
  borderRadius: "5px",
  backgroundColor: "#fff"
};

export default class Example extends Component{
  onResize(i) {
    console.log(`resize pane${i}`);
  }
  render() {
    return (
      <SortablePane
         margin={10}
         onResize={this.onResize.bind(this)}
         onOrderChange={order => console.dir(order)}
      >
        <Pane
           width={200}
           height={500}
           minWidth={100}
           maxWidth={800}
           style={style}>
          A
        </Pane>
        <Pane
           width={300}
           height={400}
           minWidth={100}
           style={style}>
          B
        </Pane>
        <Pane
           width={100}
           height={200}
           minWidth={100}
           style={style}>
          C
        </Pane>
      </SortablePane>
    );
  }
}
