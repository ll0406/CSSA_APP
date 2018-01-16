import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  ImagePickerIOS,
  Image,
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'

//The props is passed to this level of profilePick
const mapStateToProps = (state) => ({
  profileKeys: state.reducer.profileKeys,
  birthday: state.reducer.bd,
})

export default class CameraRollPicker extends Component {
  constructor() {
    super();
    this.state = { image: null };
  }

  componentDidMount() {
    this.pickImage();
  }

  pickImage() {
    // openSelectDialog(config, successCallback, errorCallback);
    ImagePickerIOS.openSelectDialog({}, imageUri => {

      Actions.pop();
    }, error => console.error(error));
  }

  render() {
    return (
    );
  }
}
