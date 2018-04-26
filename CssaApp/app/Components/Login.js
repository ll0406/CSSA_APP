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
      isFetching: state.networkReducer.isFetching,
      errors: state.userReducer.errors
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

  handleConnectionChange = (isConnected) => {
    console.log(isConnected);
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    NetInfo.isConnected.fetch().done(
      (isConnected) => {console.log(isConnected)}
    );

  }

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
    console.log("WILL RECIVE PROPS", nextProps);
    const { user, isFetching, dispatch, errors } = nextProps;

    //If user defined, then try log in with token
    if (user && !isFetching) {
      this.setState({cookieLogin: true, user: user.username, pass:'*******'});
      if (errors.length === 0) {
        dispatch(userAuth(user.uid, user.token));
      }
    }
  }

  handleLogin = () => {
    const { user, pass } = this.state;
    const { dispatch } = this.props;

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
      dispatch(fetchLogin(user, pass));
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
              behavior={'position'}
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
              </KeyboardAvoidingView>

              <View style={{height: 35, width: '100%', alignItems: 'flex-end', backgroundColor: 'transparent'}}>
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

        </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: windowHeight * (150/1334),
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  alert: {

  }
});


export default connect(mapStateToProps)(Login)
