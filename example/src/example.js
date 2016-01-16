import React, {Component} from 'react';
import SortablePane from '../../src';

export default class Example extends Component{
  render() {
    return (
      <SortablePane
         marginRight={10}>
        <div>a</div>
        <div>b</div>
      </SortablePane>
    );
  }
}
