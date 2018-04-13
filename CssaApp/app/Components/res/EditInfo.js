import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-native-easy-grid';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const mapStateToProps = (state) => ({
  user: state.userReducer.userData,
})

class EditInfo extends Component {
  constructor(props) {
    super(props);
  }

  _keyExtractor = (item, index) => index;

  _renderSeparator = () => {
    return (
      <View style={styles.separator} />
    );
  };

  render() {
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
              修改信息
          </Text>
        </View>

      </View>
    )
  }


}

const styles = StyleSheet.create({
  backgroundImageView: {
    height: windowHeight,
    width: windowWidth,
    overflow: 'hidden',
    zIndex: 1,
    position: 'absolute',
  },
  backgroundImage: {
    position: 'absolute',
    height: windowWidth * (447/750),
    width: windowWidth * (447/750),
    bottom: windowHeight * (12/1334),
    left: windowWidth * (-65/750),
  },
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
  listView: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: windowHeight * (124/1334),
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    height: windowHeight * (1099/1334),
    zIndex: 3,
  },
  separator: {
    height: 1,
    width: windowWidth * (65/75),
    backgroundColor: "#c03431",
  },
  bodyFont: {
    fontSize: 14,
  },
  msgImageContainer: {
    height: windowHeight * (90/1334),
    width: windowHeight * (90/1334),
    borderRadius: windowHeight * (45/1334),
    overflow: 'hidden',
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
  }
});

export default connect(mapStateToProps)(EditInfo)
