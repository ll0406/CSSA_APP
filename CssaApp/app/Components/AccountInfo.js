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
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Col, Row, Grid } from 'react-native-easy-grid';

import Footer from './Footer';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const mapStateToProps = (state) => ({
  user: state.userReducer.userData,
})

class AccountInfo extends Component {
  constructor(props) {
    super(props);
  }
  _keyExtractor = (item, index) => index;

  _renderSeparator = () => {
    return (
      <View style={styles.separator} />
    );
  };

  _renderItem = ({item}) => {
    const { user } = this.props;
    const { onPressFunc, label } = item;
    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => onPressFunc()}
        >
        <Text style={styles.bodyFont}> {label} </Text>
      </TouchableOpacity>
    )
  }

  _renderHeader = () => {
    const { user } = this.props
    return (
      <View style={styles.listHeader}>
        <Grid>
          <Row size={1} />
          <Row size={1}>
            <Col size={1} justifyContent={'center'}>
              <Text style={styles.bodyFont}> 账号 </Text>
            </Col>
            <Col size={5} justifyContent={'center'} style={{backgroundColor: '#fdf1f0', borderRadius: 10}}>
              <Text
                style={styles.accountInfoText}
                >
                {user.username}
              </Text>
            </Col>
          </Row>
          <Row size={0.5} />
          <Row size={1}>
            <Col size={1} justifyContent={'center'}>
              <Text style={styles.bodyFont}> 密码 </Text>
            </Col>
            <Col size={5} justifyContent={'center'} style={{backgroundColor: '#fdf1f0', borderRadius: 10}}>
              <Text
                style={styles.accountInfoText}
                >
                **********
              </Text>
            </Col>
          </Row>
          <Row size={1} />
        </Grid>
        <View style={styles.separator} />
      </View>
    )
  }

  render() {
    const { user } = this.props
    let listData = [
      {
        label: '修改密码',
        onPressFunc: function(){
          Actions.pwdReset({uid: user.uid, token: user.token})
        }
      }
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
              账户信息
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
            ListFooterComponent={this._renderSeparator}
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
  listHeader: {
    height: windowHeight * (250/1334),
  },
  accountInfoText: {
    fontSize: 16,
    marginLeft: 5,
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
    height: windowHeight * (130/1334),
    width: windowWidth * (65/75),
    justifyContent: 'center',
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
  }
});

export default connect(mapStateToProps)(AccountInfo)
