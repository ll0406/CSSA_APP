import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  DatePickerIOS,
  Picker,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';

import {
  infoUpdate
} from '../actions/userActions'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const mapStateToProps = (state) => ({
  user: state.userReducer.userData,
})

class EditInfoDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: this.props.info,
    }
  }

  render() {
    const { attribute, dataType, attTitle, user, dispatch } = this.props
    console.log(this.state)

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => Actions.pop()}
          >
            <Image
              style={styles.backButton}
              source={require('../img/leftArrow-red.png')}
              />
          </TouchableOpacity>
          <Text
            style={styles.headerText}
            >
            {attTitle}
          </Text>

          <TouchableOpacity
            style={styles.topRightTextContainer}
            onPress={() => {
              let finalInfo = this.state.info;
              let finalAttribute = attribute;
              if (attribute === 'dateOfBirth') {
                finalInfo = [finalInfo.getFullYear(), finalInfo.getMonth()+1, finalInfo.getDate()]
                finalAttribute = 'dateOfBirth';
              } else if (attribute === 'major') {
                finalAttribute = 'field2';
              }
              dispatch(infoUpdate(dataType, user.uid, finalAttribute, finalInfo, user.token))}
            }
          >
            <Text
              style={{fontSize: 18, fontWeight: 'bold', color:'#007AFF'}}>
              保存
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mainPage}>
          {
            (attribute !== 'dateOfBirth' &&
            attribute !== 'gender'
            ) &&
            <View style={{
              borderRadius: 10,
              borderWidth: 1,
              borderColor: 'lightgray',
              height: windowHeight * (90/1334),
              width: '95%',
            }}>
              <TextInput
                onChangeText={(text) => {
                  this.setState({info: text})
                }}
                autoGrow={true}
                style={{
                  height: windowHeight * (90/1334),
                  marginLeft: 10,
                }}
                value={this.state.info}
                />
              </View>
          }

          {
            (attribute === 'dateOfBirth') &&
            <DatePickerIOS
              style={{width: '100%'}}
              mode={'date'}
              date={this.state.info}
              onDateChange={(time) => {
                this.setState({info: time})
              }}
             />
          }

          {
            (attribute === 'gender') &&
            <Picker
              style={{width: '100%'}}
              selectedValue={this.state.info}
              onValueChange={(itemValue, itemIndex) => this.setState({info: itemValue})}>
              <Picker.Item label='请选择...' value='0' />
              <Picker.Item label="♂" value="1" />
              <Picker.Item label="♀" value="2" />
              <Picker.Item label="未公开" value="3" />
            </Picker>
          }
        </View>

      </View>
    )

  }

}

const styles = StyleSheet.create({
  topBar: {
    height: windowHeight * (124/1334),
    backgroundColor: '#ededed',
    alignItems: 'center',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowColor: 'black',
    shadowOffset: { height: 2, width: 2 },
    zIndex: 2,
  },
  headerText: {
    color: '#c03431',
    fontWeight: 'bold',
    fontSize: 18,
    position: 'absolute',
    bottom: windowHeight * (30/1334),
  },
  mainPage: {
    backgroundColor: 'white',
    position: 'absolute',
    top: windowHeight * (154/1334),
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    height: windowHeight * (1180/1334),
    zIndex: 1,
  },
  separator: {
    height: 1,
    width: windowWidth * (65/75),
    backgroundColor: "#c03431",
  },
  bodyFont: {
    fontSize: 16,
    fontWeight: 'bold',
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
  topRightTextContainer: {
    position: 'absolute',
    right: windowWidth * (50/750),
    bottom: windowHeight * (30/1334),
  },
});

export default connect(mapStateToProps)(EditInfoDetail)
