import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {Col, Row, Grid} from 'react-native-easy-grid';
import { Icon } from 'react-native-elements';

import * as ENDPOINTS from "../../endpoints";

const mapStateToProps = (state) => ({
  user: state.userReducer.userData,
});
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class MyGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      groups: [],
      refreshing: false,
    }
  }

  componentDidMount() {
    this.fetchGroups();
  }

  fetchGroups = () => {
    const { user } = this.props;
    this.setState({refreshing: true})
    fetch(`${ENDPOINTS.BASE}${ENDPOINTS.GET_GROUP}?uid=${user.uid}&token=${user.token}&pageSize=1000`)
      .then(res => res.text())
      .then(
        text => {
          const json = JSON.parse(text);
          if (json.success) {
            let actualPayload = json.datas;
            if (actualPayload === null) {actualPayload = [];}
            this.setState({
              refreshing: false,
              groups: actualPayload
            });
          } else {
            this.setState({refreshing: false});
            console.log("FETCH Group Failed");
         }
        },
        err => {
          console.log(err);
        }
      ).catch(err => console.log(err))
  }

  _renderGroupItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.groupItemView}
        onPress={() => Actions.groupPage({groupObj: item})}
          >
        <Grid>
          <Col size={8} justifyContent={'center'}>
            <Text
              style={styles.listItemFontBold}
              numberOfLines={1}
              ellipsizeMode='tail'
              >{item.groupName}</Text>
            <Text
              style={styles.listItemFont}
              numberOfLines={1}
              ellipsizeMode='tail'
            >{item.groupIntro}</Text>
          </Col>
          <Col size={1} justifyContent={'center'}>
            <Icon
              name='ios-arrow-forward'
              type='ionicon'
              color='#c03431'
              size={25}
            />
          </Col>
        </Grid>
      </TouchableOpacity>
    )
  }

  _keyExtractor = (item, index) => index.toString();

  _renderListSeparator = () => {
    return (
      <View style={styles.listSeparator} />
    );
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior='position'
        style={{flex: 1, backgroundColor: 'white'}}>
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
              我的小组
          </Text>
          <View style={styles.separator} />
        </View>

        <View style={styles.listView}>
          <FlatList
            refreshing={this.state.refreshing}
            onRefresh={this.fetchGroups}
            data={this.state.groups}
            renderItem={this._renderGroupItem}
            ItemSeparatorComponent={this._renderListSeparator}
            keyExtractor={this._keyExtractor}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={this._renderListSeparator}
          />


        </View>
      </KeyboardAvoidingView>
    )

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
  listSeparator: {
    height: 1,
    width: windowWidth * (650/750),
    backgroundColor: "#c03431",
  },
  groupItemView: {
    width: windowWidth * (650/750),
    height: windowHeight * (120/1334),
  },
  listItemFont: {
    fontSize: 14,
    marginBottom: 5,
  },
  listItemFontBold: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  listView: {
    backgroundColor: 'transparent',
    top: windowHeight * (45/1334),
    zIndex: 3,
    height: windowHeight * (1114/1334),
    width: windowWidth,
    alignItems: 'center',
  }

})

export default connect(mapStateToProps)(MyGroups);
