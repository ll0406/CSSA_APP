import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Alert
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import {Col, Row, Grid} from 'react-native-easy-grid';

import * as ENDPOINTS from "../../endpoints";

import { createGroup } from '../../actions/classmateActions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class NewGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: '',
      groupTag: '',
      groupIntro: '',
    }
  }

  render() {
    const { user, thisCourse } = this.props
    return(
      <View style={{flex:1, backgroundColor: 'white'}}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              setTimeout(()=> {Actions.refresh({})}, 150);
              Actions.pop();
            }}
          >
            <Image
              style={styles.backButton}
              source={require('../../img/leftArrow-red.png')}
              />
          </TouchableOpacity>

          <Text
            style={styles.headerText}
            >
              创建小组
          </Text>

          <TouchableOpacity
            style={styles.topRightTextContainer}
            onPress={() => {
              if (this.state.groupName !== '' && this.state.groupName.match(/^\s+$/) === null &&
                  this.state.groupTag !== '' && this.state.groupTag.match(/^\s+$/) === null) {
                    createGroup(user.uid, this.state.groupName, this.state.groupIntro, `${this.state.groupTag}, ${thisCourse}`, user.token)
                    setTimeout(()=> {Actions.refresh({})}, 150);
                    Actions.pop();
                  }
              else {
                Alert.alert('创建失败', '请填写完整小组名称/课程Tag')
              }
            }}>
            <Text
              style={{fontSize: 18, fontWeight: 'bold', color:'#007AFF'}}>
              创建
            </Text>
          </TouchableOpacity>
          <View style={styles.separator} />
        </View>

        <View
          style={styles.formView}>

          <View
            style={styles.inputContainer}
            >
            <Text style={{color: '#d17772',fontSize: 18, fontWeight: 'bold', marginBottom: 10}}> 小组名 </Text>
            <TextInput
              style={{
                color: 'black',
                fontSize: 16,
                marginLeft: 15,
                marginRight: 15,
              }}
              ref={'groupNameInput'}
              returnKeyType={'done'}
              blurOnSubmit={true}
              onSubmitEditing={() => {this.refs.groupNameInput.blur()}}
              placeholder={'…请在此输入'}
              placeholderTextColor={'lightgray'}
              value={this.state.groupName}
              onChangeText={(text) => {
               this.setState({groupName: text})
              }}
            />
          </View>

          <View style={styles.separatorView}>
            <View style={styles.midSeparator} />
          </View>

          <View
              style={styles.inputContainer}
              >
              <Text style={{color: '#d17772',fontSize: 18, fontWeight: 'bold', marginBottom: 10}}> 小组简介 </Text>
              <TextInput
                style={{
                  color: 'black',
                  fontSize: 16,
                  marginLeft: 15,
                  marginRight: 15,
                }}
                ref={'groupIntroInput'}
                returnKeyType={'done'}
                blurOnSubmit={true}
                onSubmitEditing={() => {this.refs.groupIntroInput.blur()}}
                placeholder={'…请在此输入'}
                placeholderTextColor={'lightgray'}
                value={this.state.groupIntro}
                onChangeText={(text) => {
                 this.setState({groupIntro: text})
                }}
              />
          </View>

          <View style={styles.separatorView}>
            <View style={styles.midSeparator} />
          </View>

          <View
            style={styles.inputContainer}
            >
            <Text style={{color: '#d17772',fontSize: 18, fontWeight: 'bold', marginBottom: 10}}> {`额外课程Tag (${thisCourse} 以外)`} </Text>
            <TextInput
              style={{
                color: 'black',
                fontSize: 16,
                marginLeft: 15,
                marginRight: 15,
              }}
              ref={'groupIntroInput'}
              returnKeyType={'done'}
              blurOnSubmit={true}
              onSubmitEditing={() => {this.refs.groupIntroInput.blur()}}
              placeholder={'请用此格式: CS 101, MA 666, ...'}
              placeholderTextColor={'lightgray'}
              value={this.state.groupTag}
              onChangeText={(text) => {
               this.setState({groupTag: text})
              }}
            />
          </View>

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  topBar: {
    height: windowHeight * (124/1334),
    backgroundColor: 'white',
    alignItems: 'center',
  },
  headerText: {
    color: '#c03431',
    fontWeight: 'bold',
    fontSize: 18,
    position: 'absolute',
    bottom: windowHeight * (30/1334),
  },
  buttonContainer: {
    height: windowHeight * (50/1334),
    width: windowWidth * (50/1334),
    position: 'absolute',
    left: windowWidth * (50/750),
    bottom: windowHeight * (18/1334),
  },
  backButton: {
    height: windowHeight * (41/1334),
    width: windowHeight * (41/1334),
  },
  separator: {
    height: 1,
    width: windowWidth * (65/75),
    backgroundColor: "#c03431",
    position: 'absolute',
    bottom: 0,
  },
  formView: {
    height: windowHeight * (1160/1334),
    width: windowWidth,
    marginTop: windowHeight * (50/1334),
    alignItems: 'center',
    flex: 1,
  },
  inputContainer: {
    height: windowHeight * (150/1334),
    width: windowWidth * (65/75),
    justifyContent: 'center'
  },
  separatorView: {
    height: windowHeight * (50/1334),
    width: windowWidth * (65/75),
    justifyContent: 'center',
    alignItems: 'center'
  },
  midSeparator: {
    height: 2,
    width: windowWidth * (60/75),
    backgroundColor: "#d17772",
  },
  topRightTextContainer: {
    position: 'absolute',
    right: windowWidth * (50/750),
    bottom: windowHeight * (30/1334),
  },
});
