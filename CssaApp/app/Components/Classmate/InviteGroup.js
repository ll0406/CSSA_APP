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
import { connect } from 'react-redux';
import {Col, Row, Grid} from 'react-native-easy-grid';

import {
  fetchFriendsList,
} from '../../actions/friendActions';
import { requestInviteGroup } from '../../actions/classmateActions'


const mapStateToProps = (state) => ({
  user: state.userReducer.userData,
  friendsList: state.friendsReducer.friendsList,
  isFetchingList: state.friendsReducer.isFetching,
});

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id, this.props.item);
  };

  render() {
    const { item, selected } = this.props
    return (
      <TouchableOpacity
        style={styles.friendItem}
        onPress={this._onPress}
        >
        <Grid>
          <Col size={14} style={{justifyContent: 'center'}}>
            <View style={styles.friendImageContainer}>
              <Image
                source={{uri: item.avatar}}
                style={styles.friendImage}
                />
            </View>
          </Col>
          <Col size={41} style={{justifyContent: 'center'}}>
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
          <Col size={10} style={{justifyContent: 'center'}}>
            {
              selected ?
              <Image
                source={require('../../img/selected.png')}
                style={styles.selectIcon}
                />
                :
              <Image
                source={require('../../img/notSelected.png')}
                style={styles.selectIcon}
                />
            }
          </Col>
        </Grid>
      </TouchableOpacity>
    )
  }
}

class InviteGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: (new Map(): Map<string, boolean>),
      selectedList: [],
    };
  }


  _onPressItem = (id: string, item) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle

      let newSelectedList = state.selectedList;
      let index = newSelectedList.indexOf(item)
      if (index >= 0) {
        newSelectedList.splice(index, 1);
      } else {
        newSelectedList.push(item);
      }
      return {
        selected,
        selectedList: newSelectedList
      };
    });
  };

  componentDidMount() {
    const { user, dispatch } = this.props;
    if(user !== undefined) {
      dispatch(fetchFriendsList(user.uid, user.token));
    }
  }

  _renderItem = ({item}) => {
    return (
      <MyListItem
        id={item.friendid}
        onPressItem={this._onPressItem}
        selected={!!this.state.selected.get(item.friendid)}
        item={item}
        />
    )
  }

  _renderHeader = () => {
    return (
      <View style={{width: windowWidth * (65/75), height: 10}} />
    );
  }

  _renderSeparator = () => {
    return (
      <View style={styles.separator} />
    );
  }

  _keyExtractor = (item, index) => index.toString();

  render() {
    const { user, friendsList, isFetchingList, dispatch } = this.props;
    const { selectedList } = this.state;
    return (
    <View
      style={{flex: 1, backgroundColor: 'white'}}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => Actions.pop()}
          >
            <Image
              style={styles.backButton}
              source={require('../../img/leftArrow-red.png')}
              />
          </TouchableOpacity>
          <Text
            style={styles.headerText}
            >
              邀请组员
          </Text>

          <TouchableOpacity
            style={styles.topRightTextContainer}
            onPress={() => {
              if (this.state.selectedList.length > 0) {
                    console.log(this.state.selectedList)
                    console.log(this.props.groupId)
                    Actions.pop();
                  }
              else {
                Alert.alert('邀请失败', '请至少选择一人')
              }
            }}
          >
            <Text
              style={{fontSize: 18, fontWeight: 'bold', color:'#513d3d'}}>
              完成
            </Text>
          </TouchableOpacity>
          <View style={[styles.separator],{position: 'absolute',bottom: 0}} />
        </View>

          <View style={styles.selectedView}>
            {
              (selectedList.length !== 0) &&
              <View style={styles.selectedContainer}>
              <Grid>
                <Col size={4} justifyContent={'center'}>
                  <Text
                    style={styles.selectedText}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    >
                    已选择 {selectedList.map((item) => item.username).join(', ')}
                  </Text>
                </Col>
                <Col size={1} justifyContent={'center'}>
                  <Text
                    style={styles.selectedText}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    >
                    共 {selectedList.length} 人
                  </Text>
                </Col>
              </Grid>
            </View>
          }
          </View>

          <View style={styles.listView}>
            <FlatList
              data={friendsList}
              extraData={this.state}
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
    zIndex: 4,
  },
  friendImageContainer: {
    height: windowHeight * (90/1334),
    width: windowHeight * (90/1334),
    borderRadius: windowHeight * (45/1334),
    overflow: 'hidden',
  },
  friendImage: {
    height: windowHeight * (90/1334),
    width: windowHeight * (90/1334),
    borderRadius: windowHeight * (45/1334),
    overflow: 'hidden',
  },
  headerText: {
    color: '#c03431',
    fontWeight: 'bold',
    fontSize: 18,
    position: 'absolute',
    bottom: windowHeight * (30/1334),
  },
  separator: {
    height: 1,
    width: windowWidth * (65/75),
    backgroundColor: "#c03431",
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
  selectedView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight * (50/1334),
    width: windowWidth,
    position: 'relative',
    left: 0,
    right: 0,
    bottom: 0,
  },
  selectedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: windowHeight * (50/1334),
    width: windowWidth * (65/75),
    backgroundColor: '#d47573',
    borderRadius: 5,
  },
  selectedText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
    marginRight: 5,
  },
  listView: {
    backgroundColor: 'transparent',
    position: 'relative',
    alignItems: 'center',
    height: windowHeight * (1070/1334),
    zIndex: 3,
  },
  friendItem: {
    height: windowHeight * (120/1334),
    width: windowWidth * (65/75),
  },
  usernameFont: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  selectIcon: {
    height: windowHeight * (45/1334),
    width: windowHeight * (45/1334),
  },
  inputView: {
    height: windowHeight * (90/1334),
    width: windowWidth,
    position: 'relative',
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    justifyContent: 'center',
  },
  input: {
    marginLeft: 5,
    height: windowHeight * (90/1334),
    width: '100%',
  },
  topRightTextContainer: {
    position: 'absolute',
    right: windowWidth * (50/750),
    bottom: windowHeight * (30/1334),
  },
});

export default connect(mapStateToProps)(InviteGroup);
