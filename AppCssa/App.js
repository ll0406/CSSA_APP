import {Provider} from 'react-redux';
import React, { Component } from 'react';
import store from './app/store';
import AppWithScene from './app/index.js';

export default class App extends Component{
  constructor(props) {
      super(props);
      this.state = {
        fontLoaded: true,
    }
  }

    render() {
      const { fontLoaded } = this.state
      if(fontLoaded) {
        return(
            <Provider store={store}>
                <AppWithScene />
            </Provider>
          );
      }
      else {
        return(null);
      }
    }
}
