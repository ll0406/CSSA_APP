import {Actions, Router, Scene} from 'react-native-router-flux';
import React, { Component } from 'react';

import NewsPage from './Components/NewsPage2';
import NewsWebScene from './Components/NewsWebScene';
import Inbox from './Components/Inbox2';
import MessagePage from './Components/MessagePage';
import Login from './Components/Login';
import AccountPage from './Components/AccountPage';
import NewsCollection from './Components/NewsCollection';
import FriendsPage from './Components/FriendsPage';
import CreateMessage from './Components/CreateMessage';
import EditInfo from './Components/EditInfo';
import EditInfoDetail from './Components/EditInfoDetail';
import Settings from './Components/Settings';
import AccountInfo from './Components/AccountInfo';
import PwdReset from './Components/PwdReset';
import PersonPage from './Components/PersonPage';
import Confirmation from './Components/Confirmation';
import Register from './Components/Register';

//Classmate Components
import ClassmateHome from './Components/Classmate/ClassmateHome';
import FindClass from './Components/Classmate/FindClass';
import ClassSections from './Components/Classmate/ClassSections';
import ClassDetail from './Components/Classmate/ClassDetail';
import GroupPage from './Components/Classmate/GroupPage';
import PostPage from './Components/Classmate/PostPage';
import MyGroups from './Components/Classmate/MyGroups';
import NewPost from './Components/Classmate/NewPost';
import NewGroup from './Components/Classmate/NewGroup';
import InviteGroup from './Components/Classmate/InviteGroup';
import MemberList from './Components/Classmate/MemberList';


const scenes = Actions.create(
  <Scene key="root">
    <Scene
      key="login"
      component={Login}
      title={"登录"}
      type='replace'
      hideNavBar={true}

      />
    <Scene
      key="register"
      component={Register}
      title={"Register"}
      hideNavBar={true}
      />
    <Scene
      key="newsPage"
      component={NewsPage}
      title={"BUCSSA活动推送"}
      type='replace'
      hideNavBar={true}
      initial
      />
    <Scene
      key="profilePage"
      component={AccountPage}
      type='replace'
      title={"我"}
      hideNavBar={true}
      />
    <Scene
      key="webPage"
      component={NewsWebScene}
      title={"详情"}
      hideNavBar={false}
      />
    <Scene
      key="inbox"
      component={Inbox}
      title={"收件箱"}
      type='replace'
      hideNavBar={true}
      />
    <Scene
      key="messagePage"
      component={MessagePage}
      title={"信息"}
      hideNavBar={true}
      />
    <Scene
      key="collectionPage"
      component={NewsCollection}
      title={"Collection"}
      hideNavBar={true}
      />
    <Scene
      key="friendsPage"
      component={FriendsPage}
      title={"Friends"}
      hideNavBar={true}
      />
    <Scene
      key="settings"
      component={Settings}
      title={"Settings"}
      hideNavBar={true}
      />
    <Scene
      key="createMessage"
      component={CreateMessage}
      title={"CreateMessage"}
      hideNavBar={true}
      />
    <Scene
      key="confirmation"
      component={Confirmation}
      title={"Confirmation"}
      hideNavBar={true}
      />
    <Scene
      key="editInfo"
      component={EditInfo}
      title={"EDITINFO"}
      hideNavBar={true}
      />
    <Scene
      key="editInfoDetail"
      component={EditInfoDetail}
      title={"EditInfoDetail"}
      hideNavBar={true}
      />
    <Scene
      key="accountInfo"
      component={AccountInfo}
      title={"AccountInfo"}
      hideNavBar={true}
      />
    <Scene
      key="pwdReset"
      component={PwdReset}
      title={'PwdReset'}
      hideNavBar={true}
      />
    <Scene
      key="personPage"
      component={PersonPage}
      title={'PersonPage'}
      hideNavBar={true}
     />
    <Scene
      key="classmateHome"
      component={ClassmateHome}
      title={"ClassmateHome"}
      hideNavBar={true}
      />
    <Scene
      key="findClass"
      component={FindClass}
      title={"FindClass"}
      hideNavBar={true}
      />
    <Scene
      key="classSections"
      component={ClassSections}
      title={"ClassSections"}
      hideNavBar={true}
      />
    <Scene
      key="classDetail"
      component={ClassDetail}
      title={"ClassDetail"}
      hideNavBar={true}
      />
    <Scene
      key="groupPage"
      component={GroupPage}
      title={"GroupPage"}
      hideNavBar={true}
      />
    <Scene
      key="postPage"
      component={PostPage}
      title={"PostPage"}
      hideNavBar={true}
      />
    <Scene
      key="myGroups"
      component={MyGroups}
      title={"MyGroups"}
      hideNavBar={true}
      />
    <Scene
      key="newPost"
      component={NewPost}
      title={"NEWPOST"}
      hideNavBar={true}
     />
   <Scene
     key="newGroup"
     component={NewGroup}
     title={"NewGroup"}
     hideNavBar={true}
    />
  <Scene
    key="inviteGroup"
    component={InviteGroup}
    title={"InviteGroup"}
    hideNavBar={true}
   />
 <Scene
   key="memberList"
   component={MemberList}
   title={"MemberList"}
   hideNavBar={true}
  />
  </Scene>
);

export default scenes;
