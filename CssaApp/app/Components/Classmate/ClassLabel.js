import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class ClassLabel extends Component {

  render() {
    const { code, name, section, hasArrow } = this.props
    let labelText = `${section ? section : ''}  ${name}`
    return (
      <TouchableOpacity
        onPress={this.props.onPressLabel}
        style={styles.bottomView}
        >
        <Grid>
          <Col size={4} >
            <View style={styles.midView}>
              <View style={styles.topView}>
                <Text
                  style={styles.codeText}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  >
                  {code}
                </Text>
              </View>
            </View>
          </Col>
          <Col size={1} />
          <Col size={9} justifyContent={'center'} >
            <Text
              style={styles.nameText}
              numberOfLines={1}
              ellipsizeMode='tail'
              >
              {labelText}
            </Text>
          </Col>
          <Col size={2} alignItems={'center'} justifyContent={'center'}>
            {
              hasArrow &&
              <Icon
                name='ios-arrow-forward'
                type='ionicon'
                color='white'
                size={20}
              />
            }
          </Col>
        </Grid>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  bottomView: {
    borderRadius: 5,
    height: windowHeight * (60/1334),
    width: windowWidth * (65/75),
    backgroundColor: '#f8ebeb',
    zIndex: 3,
  },
  midView: {
    borderRadius: 5,
    height: windowHeight * (60/1334),
    width: windowWidth * (18/75),
    backgroundColor: '#d79996',
    zIndex: 4,
  },
  topView: {
    borderRadius: 5,
    backgroundColor: '#c03431',
    height: windowHeight * (60/1334),
    width: windowWidth * (16/75),
    zIndex: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  codeText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Courier',
  },
  nameText: {
    fontSize: 14,
    color: 'black',
  }
});
