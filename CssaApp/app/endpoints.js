//Endpoints
export const BASE = 'https://app.bucssa.net/api/v1';

//User
export const LOGIN = '/user/account/login.php';
export const USER_AUTH = '/user/userinfo/getMyInfos.php';
export const USER_UPDATE = '/user/userinfo/zeditUserInfo.php';
export const AVATAR_UPDATE = '/user/userinfo/uploadAvatar.php';
export const EDIT_INFOSTRING = '/user/userinfo/editInfoStr.php';
export const EDIT_INFOINT = '/user/userinfo/editInfoInt.php';
export const EDIT_PWD = '/user/account/editPwd.php';
export const EDIT_BIRTH = '/user/userinfo/editDoB.php';
export const REGISTER = '/user/account/register.php';

//Message & SysMessage
export const CHECK_NEW_MESSAGELIST = '/personalMessage/check/newByUid.php';
export const GET_MESSAGE_LIST = '/personalMessage/chat/get.php';
export const GET_MESSAGE = '/personalMessage/message/getByPlid.php';
export const DELETE_MESSAGE = '/personalMessage/chat/delete.php';
export const CHECK_NEW_MESSAGE = '/personalMessage/check/newByPlid.php';
export const GET_MESSAGE_BYOFFSET = '/personalMessage/message/getByOffset.php';
export const REPLY = '/personalMessage/message/reply.php';
export const SET_READ = '/personalMessage/chat/setRead.php';
export const CREATE_MESSAGE = '/personalMessage/chat/create.php';
export const SYSTEM_MESSAGE = '/systemMessage/message/getByUid.php';

//thread
export const GET_THREAD_COLLECTION = '/thread/collection/get.php';
export const ADD_THREAD_TO_COLLECTION = '/thread/collection/add.php';
export const DELETE_THREAD_FROM_COLLLECTION = '/thread/collection/delete.php';
export const GET_OFFICIAL_THREAD = '/thread/getOfficialThreads.php';

//Friends
export const GET_FRIENDSLIST = '/user/friend/getFriends.php';
export const ADD_FRIEND_REQUEST = '/user/friend/add.php';
export const DELETE_FRIEND = '/user/friend/delete.php';
export const GET_PERSON_INFO = '/user/friend/getOthersInfo.php';

//Classmates
export const GET_CLASS = '/classmate/class/getClass.php';
export const ADD_CLASS = '/classmate/class/addClassCollection.php';
export const GET_CLASS_COLLECTION = '/classmate/class/getClassCollection.php';
export const CREATE_GROUP = '/classmate/group/create.php';
export const GET_GROUP = '/classmate/group/get.php';
export const REQUEST_JOIN_GROUP = '/classmate/group/requestJoin.php';
export const REQUEST_INVITE_GROUP = '/classmate/group/inviteJoin.php';
export const CREATE_POST = '/classmate/post/create.php';
export const GET_COMMENT = '/classmate/post/getComment.php';
export const GET_POST = '/classmate/post/getPost.php';
export const MAKE_COMMENT = '/classmate/post/makeComment.php';
export const DEL_COMMENT = '/classmate/post/deleteComment.php';
export const GET_MEMBERS = '/classmate/group/member.php';
export const HANDLE_INVITE = '/classmate/group/handleInvite.php';
export const HANDLE_REQUEST = '/classmate/group/handleRequest.php';
export const EDIT_ROLE = '/classmate/group/editRole.php';
export const LEAVE_GROUP = '/classmate/group/leave.php';
