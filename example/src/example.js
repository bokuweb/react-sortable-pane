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

let id = 0;

export default class Example extends Component{
  constructor(props) {
    super(props);
    this.state = {
      list : [
          <Pane
        id="a"
        width={200}
        height={500}
        minWidth={100}
        maxWidth={800}
        minHeight={100}
        style={style}
          >
          A
        </Pane>,
        <Pane
           id="b"
           width={300}
           height={400}
           minWidth={100}
           minHeight={100}
           style={style}
           >
          B
        </Pane>,
        <Pane
           id="c"
           width={100}
           height={200}
           minWidth={100}
           minHeight={100}
           style={style}
           >
          C
        </Pane>,
      ]
    }
  }

  onResize(i) {
    console.log(`resize pane${i}`);
  }

  render() {
    return (
      <div>
        <a onClick={() => {
            this.state.list.splice(1, 0, <Pane
                                              id={id++}
                                              width={50}
                                              height={100}
                                              minWidth={50}
                                              minHeight={100}
                                              style={style}
                                              >
                                   {id}
                                   </Pane>);
            this.setState({list: this.state.list})}} >add</a>
        <a onClick={() => {
          this.state.list.splice(1, 1);
          this.setState({list: this.state.list})}} >remove</a>
        <SortablePane
           ref="pane" 
           margin={10}
           onResize={this.onResize.bind(this)}
           onOrderChange={order => console.dir(order)}
          >
          {this.state.list}
        </SortablePane>
      </div>
    );
  }
}
