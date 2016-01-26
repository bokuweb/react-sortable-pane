import React, {Component} from 'react';
import SortablePane from '../../src';

export default class Example extends Component{
  render() {
    return (
      <SortablePane
         marginRight={10}
         customStyle={{
           fontSize: "40px",
           textAlign:"center",
           paddingTop:"30px",
           height:"400px",
           border: "solid 1px #ccc",
           borderRadius: "5px",
         }}
         >
        <div>A</div>
        <div>B</div>
        <div>C</div>
      </SortablePane>
    );
  }
}
