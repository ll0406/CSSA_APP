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
} from 'react-native';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {Col, Row, Grid} from 'react-native-easy-grid';

import ClassLabel from './ClassLabel';
import * as ENDPOINTS from "../../endpoints";

import { fetchCollection } from '../../actions/classmateActions';

const mapStateToProps = (state) => ({
  user: state.userReducer.userData,
  collection: state.classmateReducer.classCollection,
  isFetchingCollection: state.classmateReducer.isFetching,
});
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class ClassmateHome extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { user, dispatch } = this.props;
    dispatch(fetchCollection(user.uid, user.token));
  }


  _renderSeparator = () => {
    return (
      <View style={styles.separator} />
    );
  };

  _renderListSeparator = () => {
    return (
      <View style={styles.listSeparator} />
    );
  };

  _renderItem = ({item}) => {
    const { classCode, className, classSection, professorName, classSchedule, classLocation, classId, professorId } = item;
    return (
      <ClassLabel
        code={classCode}
        name={className}
        hasArrow={true}
        section={classSection}
        onPressLabel={() => Actions.classDetail({
          professorName,
          classSchedule,
          className,
          classSection,
          classCode,
          classLocation,
          classId,
          professorId
        })}
        />
    )
  }

    _keyExtractor = (item, index) => index.toString();


  render() {
    const { collection } = this.props;
    return(
      <View style={{flex:1, backgroundColor: 'white'}}>
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
              找课友
          </Text>
          <View style={styles.separator} />
        </View>

        <View style={styles.scrollView}>
          <ScrollView contentContainerStyle={{alignItems: 'center'}}>
            <View style={styles.myClassTitleView}>
              <Grid>
                <Col />
                <Col>
                  <Grid>
                    <Col size={1} backgroundColor={'gray'} />
                    <Col size={15} alignItems={'center'} justifyContent={'center'}>
                      <Text style={{fontSize: 16}}>
                        我的课程
                      </Text>
                    </Col>
                    <Col size={1} backgroundColor={'gray'} />
                  </Grid>
                </Col>
                <Col alignItems={'flex-end'}>
                  <TouchableOpacity
                    onPress={() => Actions.findClass()}
                    >
                    <Image
                      source={require('../../img/addMessage.png')}
                      style={styles.addButton}
                    />
                  </TouchableOpacity>
                </Col>
              </Grid>
            </View>

            <View style={styles.classView}>
              {
                (collection === undefined || collection.length === 0) ?
                  <View style={styles.noteView}>
                    <Text>当前还没有加入任何课程哦,</Text>
                    <Text>快去找找课友吧!</Text>
                  </View>
                :
                  <View style={styles.listView}>
                    <FlatList
                      data={this.props.collection}
                      renderItem={this._renderItem}
                      ItemSeparatorComponent={this._renderListSeparator}
                      keyExtractor={this._keyExtractor}
                      showsVerticalScrollIndicator={false}
                      />
                  </View>
              }
            </View>

            <TouchableOpacity
              onPress={() => Actions.myGroups()}
              style={styles.bigButton}>
              <Text style={styles.buttonText}>我的小组</Text>
            </TouchableOpacity>

            {
              false &&
              <TouchableOpacity style={styles.bigButton}>
              <Text style={styles.buttonText}>我的话题</Text>
              </TouchableOpacity>  
            }
          </ScrollView>
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
  listView: {
    backgroundColor: 'transparent',
    width: windowWidth * (65/75),
    justifyContent: 'center',
    alignItems: 'center',
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
  listSeparator: {
    height: windowHeight * (30/1334),
    width: windowWidth * (65/75),
  },
  scrollView: {
    position: 'absolute',
    top: windowHeight * (214/1334),
    height: windowHeight * (1120/1334),
    width: windowWidth,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  myClassTitleView: {
    width: windowWidth * (65/75),
    height: windowHeight * (50/1334),
    marginBottom: windowHeight * (50/1334),
  },
  addButton: {
    height: windowHeight * (50/1334),
    width: windowHeight * (50/1334),
  },
  classView: {
    width: windowWidth * (65/75),
    marginBottom: windowHeight * (50/1334)
  },
  noteView: {
    borderRadius: 10,
    height: windowHeight * (200/1334),
    width: windowWidth * (65/75),
    backgroundColor: '#f8ebeb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigButton: {
    borderRadius: 10,
    height: windowHeight * (100/1334),
    width: windowWidth * (65/75),
    marginBottom: windowHeight * (50/1334),
    backgroundColor: '#d79996',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  }
});

export default connect(mapStateToProps)(ClassmateHome);
