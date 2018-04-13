import React, {Component, PropTypes} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  WebView,
  Dimensions,
} from 'react-native';

import {Actions} from 'react-native-router-flux'

export default class NewsWebScene extends Component {
  constructor(props) {
            super(props);
            this.state = {
              loading:true
            };
  }

  render() {
    return (
          <WebView
            source={{uri:this.props.this_url}}
          />
    )
  }
}
