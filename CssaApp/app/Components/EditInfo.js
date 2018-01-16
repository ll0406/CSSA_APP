import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  FlatList,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-native-easy-grid';


import Footer from './Footer';
import {
  avatarUpdate
} from '../actions/userActions'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const mapStateToProps = (state) => ({
  user: state.userReducer.userData,
})

class EditInfo extends Component {
  constructor(props) {
    super(props);
  }

  parseDate = (input) => {
    let parts = input.split('-');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1]-1, parts[2]);
  }

  _keyExtractor = (item, index) => index;

  _renderSeparator = () => {
    return (
      <View style={styles.separator} />
    );
  };

  _renderHeader = () => {
    const { user } = this.props
    return (
      <View style={styles.editAvatarContainer}>
        <Grid>
          <Col justifyContent={'center'}>
            <Text style={styles.bodyFont}> 头像 </Text>
          </Col>
          <Col justifyContent={'center'} alignItems={'flex-end'}>
            <TouchableOpacity
              style={styles.avatarImageContainer}
              onPress={this.pickImage}
              >
              <Image
                style={styles.avatarImage}
                source={{uri: `http://www.bucssa.net/uc_server/data/avatar/000/00/00/${user.uid}_avatar_big.jpg?random_number=${new Date().getTime()}`}}
                />
            </TouchableOpacity>
          </Col>
        </Grid>
        <View style={styles.separator} />
      </View>
    )
  }

  _renderItem = ({item}) => {
    const { user } = this.props;
    const { listLeft, listRight, attribute, dataType, actualData } = item; //Actualdata is optinal, may be UNDEfined
    return (
      <View style={styles.listItem}>
        <Grid>
          <Col justifyContent={'center'}>
            <Text style={styles.bodyFont}>{listLeft}</Text>
          </Col>
          <Col justifyContent={'center'} alignItems={'flex-end'}>
            <TouchableOpacity
              onPress={() => {
                  let info = listRight;
                  if(attribute === 'dateOfBirth') {
                    info = this.parseDate(listRight);
                  } else if (attribute === 'gender') {
                    info = actualData;
                  }
                  Actions.editInfoDetail({attTitle: listLeft, info, attribute, dataType, actualData})
                }
              }
              >
              <Text
                style={styles.bodyFont}
                numberOfLines={1}
                ellipsizeMode='tail'
                >{listRight === '' ? '未公开' : listRight}</Text>
            </TouchableOpacity>
          </Col>
        </Grid>
      </View>
    )
  }

  pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
      compressImageQuality: 0.8,
    }).then(image => {
      console.log(image);
      const { user, dispatch } = this.props;
      const data = `data:${image.mime};base64,${image.data}`;
      dispatch(avatarUpdate(data, user.uid, user.token));
      setTimeout(() => {
        this.forceUpdate();
      }, 2000)
    }).catch((err) => {
      console.log(err);
    }
    );
  }


  render() {
    const { user } = this.props;
    let gender;
    if (user.gender == 1) {
      gender = '♂';
    } else if (user.gender == 2) {
      gender = '♀';
    } else {
      gender = '';
    }
    let listData = [
      {
        listLeft: '昵称',
        listRight: user.nickname,
        attribute: 'nickname',
        dataType: 'string'
      },
      {
        listLeft: '性别',
        listRight: gender,
        attribute: 'gender',
        dataType: 'int',
        actualData: user.gender
      },
      {
        listLeft: '专业',
        listRight: user.major,
        attribute: 'major',
        dataType: 'string'
      },
      {
        listLeft: '生日',
        listRight: user.dateOfBirth,
        attribute: 'dateOfBirth',
        dataType: 'string'
      },
      {
        listLeft: '感情状态',
        listRight: user.affectivestatus,
        attribute: 'affectivestatus',
        dataType: 'string'
      },
      {
        listLeft: '个性签名',
        listRight: user.bio,
        attribute: 'bio',
        dataType: 'string'
      },
    ]


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

        <View style={styles.listView}>
          <FlatList
            data={listData}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this._renderSeparator}
            ListHeaderComponent={this._renderHeader}
            />
        </View>

        <Footer />
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
  listView: {
    backgroundColor: 'white',
    position: 'absolute',
    top: windowHeight * (174/1334),
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    height: windowHeight * (1060/1334),
    zIndex: 1,
  },
  listItem: {
    height: windowHeight * (100/1334),
    width: windowWidth * (65/75),
  },
  separator: {
    height: 1,
    width: windowWidth * (65/75),
    backgroundColor: "#c03431",
  },
  editAvatarContainer: {
    height: windowHeight * (190/1334),
    width: windowWidth * (65/75),
  },
  avatarImageContainer: {
    backgroundColor: 'white',
    height: windowHeight * (160/1334),
    width: windowHeight * (160/1334),
    borderRadius: windowHeight * (80/1334),
    borderWidth: 1,
    borderColor: '#c03431',
    overflow: 'hidden'
  },
  avatarImage: {
    height: windowHeight * (160/1334),
    width: windowHeight * (160/1334),
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
  }
});

export default connect(mapStateToProps)(EditInfo)
