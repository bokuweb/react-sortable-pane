import React, {Component} from 'react';
import SortablePane from '../../src';

export default class Example extends Component{
  render() {
    return (
      <SortablePane
         marginRight={10}>
        <div
           style={{
             fontSize: "40px",
             textAlign:"center",
             paddingTop:"30px",
             height:"400px",
             border: "solid 1px #ccc"
           }}>A</div>
        <div
           style={{
             fontSize: "40px",
             textAlign:"center",
             paddingTop:"30px",
             height:"300px",
             border: "solid 1px #ccc"
           }}>B</div>
      </SortablePane>
    );
  }
}
