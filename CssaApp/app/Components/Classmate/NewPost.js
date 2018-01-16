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
import { Jiro } from 'react-native-textinput-effects';

import * as ENDPOINTS from "../../endpoints";

import { createPost } from '../../actions/classmateActions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: '',
      content: '',
    }
  }

  render() {
    const { user, classId } = this.props
    return(
      <View style={{flex:1, backgroundColor: 'white'}}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              setTimeout(()=> {Actions.refresh({})}, 50);
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
              新建话题
          </Text>

          <TouchableOpacity
            style={styles.topRightTextContainer}
            onPress={() => {
              if (this.state.subject !== '' && this.state.subject.match(/^\s+$/) === null &&
                  this.state.content !== '' && this.state.content.match(/^\s+$/) === null) {
                    createPost(user.uid, classId, this.state.subject, this.state.content, user.token)
                    setTimeout(()=> {Actions.refresh({})}, 50);
                    Actions.pop();
                  }
              else {
                Alert.alert('发表失败', '请填写完整的题目/内容')
              }
            }}
          >
            <Text
              style={{fontSize: 18, fontWeight: 'bold', color:'#007AFF'}}>
              发表
            </Text>
          </TouchableOpacity>

          <View style={styles.separator} />
        </View>

        <View
          style={styles.formView}>
          <View
            style={styles.subjectInputContainer}
            >
            <Text style={{color: '#d17772',fontSize: 18, fontWeight: 'bold', marginBottom: 10}}> 题目 </Text>
            <TextInput
              style={{
                color: 'black',
                fontSize: 16,
                marginLeft: 15,
                marginRight: 15,
              }}
              ref={'SubjectInput'}
              returnKeyType={'done'}
              blurOnSubmit={true}
              onSubmitEditing={() => {this.refs.SubjectInput.blur()}}
              placeholder={'…请在此输入'}
              placeholderTextColor={'lightgray'}
              value={this.state.subject}
              onChangeText={(text) => {
               this.setState({subject: text})
              }}
            />
          </View>

          <View style={styles.separatorView}>
            <View style={styles.midSeparator} />
          </View>

          <View
            style={styles.contentInputContainer}
            >
            <Text style={{color: '#d17772',fontSize: 18, fontWeight: 'bold', marginBottom: 10}}> 内容 </Text>
            <TextInput
              multiline
              style={{
                color: 'black',
                fontSize: 16,
                marginLeft: 15,
                marginRight: 15,
                marginTop: 5,
                marginBottom: 5,
                height:windowHeight * (380/1334),
              }}
              blurOnSubmit={true}
              returnKeyType={'done'}
              ref={'ContentInput'}
              placeholder={'…请在此输入'}
              placeholderTextColor={'lightgray'}
              value={this.state.cotent}
              onChangeText={(text) => {
               this.setState({content: text})
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
  subjectInputContainer: {
    height: windowHeight * (150/1334),
    width: windowWidth * (65/75),
    justifyContent: 'center'
  },
  contentInputContainer: {
    height: windowHeight * (400/1334),
    width: windowWidth * (65/75),
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
  submitButton: {
    height: windowHeight * (100/1334),
    width: windowWidth * (65/75),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#c03431',
    marginTop: 40
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  topRightTextContainer: {
    position: 'absolute',
    right: windowWidth * (50/750),
    bottom: windowHeight * (30/1334),
  },
});
