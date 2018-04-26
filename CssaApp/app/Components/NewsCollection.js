import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';

import Footer from './Footer';
import NewsCard from './NewsCard';

import {
  fetchThreadCollection,
  requestAddThread,
  requestDeleteThread
 } from  '../actions/newsCollectionAction';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';


const mapStateToProps = (state) => ({
  isFetching: state.newsPageReducer.isFetching,
  user: state.userReducer.userData,
  collectionList: state.collectionReducer.collectionList,
  tidList: state.collectionReducer.tidList
})

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class NewsCollection extends Component {
  constructor(props) {
    super(props);
  }

  addToCollection = (tid, subject, author, dateline) => {
    const { dispatch, user } = this.props;
    dispatch(
      requestAddThread(user.uid, tid, subject, author, dateline, user.token)
    );
  }

  deleteFromCollection = (tid, subject, author, dateline) => {
    const { dispatch, user } = this.props;
    dispatch(
      requestDeleteThread(user.uid, tid, subject, author, dateline, user.token)
    );
  }

  goToWeb = (link) => {
    Actions.webPage({this_url:link});
  }

  componentDidMount() {
    const { dispatch, user, collectionList } = this.props;

    if (user !== undefined) {
      dispatch(fetchThreadCollection(user.uid, user.token));
    }
  }

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item}) => {
    const { user } = this.props

    console.log('Start to render colelction item');
    console.log(item);

    return (
      <NewsCard
          newsObj={item}
          isLoggedIn={(user !== undefined)}
          addAction={this.addToCollection}
          deleteAction={this.deleteFromCollection}
          isInCollection={true}
          isTransparent={true}
        />
    )
  }

  _renderHeader= () => {
    return (
      <View style={{width: windowWidth * (61/75), height: 20}} />
    );
  }

  render() {
    const { user, collectionList} = this.props;

    return (
      <View style={{flex:1, backgroundColor: 'white'}}>
        <View style={styles.backgroundImageView}>
          <Image
            style={styles.backgroundImage}
            source={require('../img/iconBackground.png')}
          />
        </View>

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
              收藏
          </Text>
        </View>

        <View style={styles.listView}>
          <FlatList
            data={collectionList}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={this._renderHeader}
            />
        </View>

        <Footer />
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

export default connect(mapStateToProps)(NewsCollection)
