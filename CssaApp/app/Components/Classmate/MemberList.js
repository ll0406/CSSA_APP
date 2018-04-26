import React, { Component } from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Dimensions,
  FlatList,
  Alert
 } from 'react-native';

 import { Actions } from 'react-native-router-flux';
 import {Col, Row, Grid} from 'react-native-easy-grid';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import * as ENDPOINTS from "../../endpoints";


export default class MemberList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      members: [],
    }
  }

  componentDidMount() {
    this.fetchMembers();
  }

  fetchMembers = () => {
    const { groupId } = this.props;
    fetch(`${ENDPOINTS.BASE}${ENDPOINTS.GET_MEMBERS}?groupId=${groupId}&pageSize=1000`)
      .then(res => res.text())
      .then(
        text => {
          const json = JSON.parse(text);
          if (json.success) {
            let actualPayload = json.datas;
            console.log("FETCH members Success");
            console.log(json);
            if (actualPayload === null) {actualPayload = [];}
            this.setState({
              members: actualPayload
            });
          } else {
            console.log("FETCH members Failed");
         }
        },
        err => {
          console.log(err);
        }
      ).catch(err => Alert.alert('网络出错', err))
  }

  _renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => Actions.personPage({requestUid:item.userid})}
        >
        <Grid>
          <Col size={14} style={{justifyContent: 'center'}}>
            <View style={styles.imageContainer}>
              <Image
                source={{uri: item.avatar}}
                style={styles.itemImage}
                />
            </View>
          </Col>
          <Col size={51} style={{justifyContent: 'center'}}>
            <Text
              style={styles.usernameFont}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {
                item.username
              }
            </Text>
          </Col>
        </Grid>
      </TouchableOpacity>
    )
  }

  _renderHeader = () => {
    return (
      <View style={{width: windowWidth * (61/75), height: 20}} />
    );
  }

  _renderSeparator = () => {
    return (
      <View style={styles.separator} />
    );
  }

  _keyExtractor = (item, index) => index.toString();


  render() {
    const { members } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
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
            成员列表
        </Text>
        <View style={styles.topBarSeparator} />
      </View>

        <View style={styles.listView}>
          <FlatList
            data={members}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this._renderSeparator}
            ListHeaderComponent={this._renderHeader}
            ListFooterComponent={this._renderSeparator}
            />
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
  topBarSeparator: {
    height: 1,
    width: windowWidth * (65/75),
    backgroundColor: "#c03431",
    position: 'absolute',
    bottom: 0,
  },
  imageContainer: {
    height: windowHeight * (90/1334),
    width: windowHeight * (90/1334),
    borderRadius: windowHeight * (45/1334),
    overflow: 'hidden',
  },
  itemImage: {
    height: windowHeight * (90/1334),
    width: windowHeight * (90/1334),
    borderRadius: windowHeight * (45/1334),
    overflow: 'hidden',
  },
  separator: {
    height: 1,
    width: windowWidth * (65/75),
    backgroundColor: "#c03431",
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
  listItem: {
    height: windowHeight * (120/1334),
    width: windowWidth * (65/75),
  },
  usernameFont: {
    fontWeight: 'bold',
    fontSize: 14,
  }

});
