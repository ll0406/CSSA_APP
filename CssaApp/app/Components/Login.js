import React, { Component } from 'react';
import { View,
  KeyboardAvoidingView,
  Button,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  NetInfo,
  Alert,
  ActivityIndicator,
 } from 'react-native';

import {Actions} from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import { connect } from 'react-redux';
import { Jiro } from 'react-native-textinput-effects';

import * as ENDPOINTS from "../endpoints";
import { fetchLogin, userAuth, clearLoginError } from "../actions/userActions";
import { connectionState } from "../actions/networkActions";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const mapStateToProps = (state) => ({
      user: state.userReducer.userData,
      isFetching: state.userReducer.isFetching,
      isConnected: state.networkReducer.isConnected,
    })

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user:"",
      pass:"",
      cookieLogin: false,
      missingField: false,
      alert: false,
    }
  }

  componentDidMount() {
     NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
  }


  _handleConnectionChange = (isConnected) => {
    this.props.dispatch(connectionState({ status: isConnected }));
  };

  userInput = () => {
    return (
      <Jiro
        label={'用户名'}
        // this is used as active and passive border color
        borderColor={'white'}
        labelStyle={{
          color: 'white',
          fontSize: 20,
        }}
        inputStyle={{ color: 'firebrick' }}
        autoCapitalize={'none'}
        onChangeText={(text) => {
          this.setState({user: text})
        }}
        value={this.state.user}
      />
    );
  }

  passInput = () => {
    return (
      <Jiro
        label={'密码'}
        // this is used as active and passive border color
        borderColor={'white'}
        labelStyle={{
          color: 'white',
          fontSize: 20,
        }}
        inputStyle={{ color: 'firebrick' }}
        autoCapitalize={'none'}
        onChangeText={(text) => this.setState({pass: text})}
        secureTextEntry
        style={{marginBottom: 30}}
        value={this.state.pass}
      />
    );
  }

  componentWillReceiveProps(nextProps) {
    const { user, isFetching, dispatch, isConnected } = nextProps;
    //If user defined, then try log in with token
    if (user && !isFetching) {
      this.setState({cookieLogin: true, user: user.username, pass:'*******'});
      if (isConnected) {
        dispatch(userAuth(user.uid, user.token));
      } else {
        setTimeout(() => {
          if (!this.props.isConnected) {
            Alert.alert('网络异常','请检查网络连接');
          }
        }, 2500)
      }
    }
  }

  handleLogin = () => {
    const { user, pass } = this.state;
    const { dispatch, isConnected } = this.props;

    if (user === "" || pass === "") {
      this.setState({
        missingField: true,
      })
      return;
    }
    else {
      this.setState({
        missingField: false,
      })
      if (isConnected) {
        dispatch(fetchLogin(user, pass));
      } else {
        setTimeout(() => {
          if (!isConnected) {
            Alert.alert('网络异常','请检查网络连接');
          }
        }, 1500)
      }
    }
  }

  handleGuestLogin = () => {
    const { dispatch } = this.props;
    dispatch(clearLoginError());
    Actions.newsPage();
  }

  handleRegister = () => {
    Actions.register();
  }

  handleForgetPass = () => {

  }

  render() {
    const { isFetching } = this.props;
    const {cookieLogin, missingField} = this.state;

    return (
        <ImageBackground
          style={{
              flex: 1,
              position: 'absolute',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
            }}
          source={require('../img/login_bg.png')}
          >
            <KeyboardAvoidingView
              style={styles.container}
              behavior={'padding'}
              keyboardVerticalOffset={0}
              >
              {this.userInput()}
              <View style={{height: 30}} />
              {this.passInput()}

              <TouchableOpacity
                onPress={this.handleLogin}
                style={{
                  marginBottom: 15,
                  height: 50,
                  width:'100%',
                  backgroundColor:'firebrick',
                  alignItems:'center',
                  justifyContent:'center',
                  borderRadius: 10
                }}
                >

                <Text style={{color:'white', fontSize: 20, fontWeight:'bold'}}> 登录 </Text>

              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.handleRegister}
                style={{
                  marginBottom: 15,
                  height: 50,
                  width:'100%',
                  backgroundColor:'firebrick',
                  alignItems:'center',
                  justifyContent:'center',
                  borderRadius: 10
                }}
                >

                <Text style={{color:'white', fontSize: 20, fontWeight:'bold'}}> 注册 </Text>

              </TouchableOpacity>

              <View style={{height: 20, width: '100%', alignItems: 'flex-end', backgroundColor: 'transparent'}}>
                <TouchableOpacity
                  onPress={this.handleForgetPass}
                  style={{
                    marginBottom: 15,
                    alignItems:'center',
                    justifyContent:'center'
                  }}
                  >
                  <Text style={{color:'white', fontSize: 16, fontWeight:'bold', textDecorationLine: 'underline'}}> 找回密码 </Text>
                </TouchableOpacity>
              </View>

              <View style={{height: 100, width: '100%', alignItems: 'center', backgroundColor: 'transparent'}}>
                {
                  isFetching &&
                  <ActivityIndicator
                    size={'large'}
                    color={'white'}
                  />
                }
              </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: windowHeight * (140/1334),
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  alert: {

  }
});


export default connect(mapStateToProps)(Login)
