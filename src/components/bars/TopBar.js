import React, { useState, useEffect} from 'react';
import  {Button,Modal, ModalBody, FormGroup, ModalFooter, ModalHeader } from 'reactstrap';
import {Nav,NavLink,Bars,NavMenu,NavBtn,NavBtnLink,NavText,SideBars} from './NavBarElements';

import  { useNavigate, Link }  from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from './SidebarData';
import './Sidebar.css';
import {getUser, addNotification, updateUser, deleteNotification,getNotifications, getProject, updateProject} from "../../services/apicalls.js"


export default function TopBar() {
  const [modalNavigate, setModalNavigate] = useState(false);
  const navigate = useNavigate();

  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

  const [modalFriends, setModalFriends] = useState(false);
  const [modalFriendNotifications, setModalNotifications] = useState(false);
  const [modalShareNotifications, setModalShareNotifications] = useState(false);

  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [friend_notifications, setFriendNotifications] = useState([]);
  const [share_notifications, setShareNotifications] = useState([]);
  const [email, setEmail] = useState("");
  const onEmailChange = e => setEmail(e.target.value);

  useEffect(() =>{
    getAllFriends(sessionStorage.getItem('userEmail'));
    getAllFriendNotifications(sessionStorage.getItem('userEmail'));
    getAllShareNotifications(sessionStorage.getItem('userEmail'));
  },[]);

  const reloadData=() =>{
    getAllFriends(sessionStorage.getItem('userEmail'));
    getAllFriendNotifications(sessionStorage.getItem('userEmail'));
    getAllShareNotifications(sessionStorage.getItem('userEmail'));
  }
  

  const getAllFriends = async (email) => {
    var userFriends = [];
    const user = await getUser(email);
    setUser(user);
    const friendsEmail = user.friends;
    
    for(var i=0; i<friendsEmail.length; i++) {
      var userFriend = await getUser(friendsEmail[i]);
      userFriends.push(userFriend)
      }
    setFriends(userFriends);
}

const getAllFriendNotifications = async (email) => {
  const allNotifications = await getNotifications();
  const userNotifications = [];
  
  for(var i=0; i<allNotifications.length; i++) {
    if(allNotifications[i].receiver === email){
      if(allNotifications[i].type === 'friend')
        userNotifications.push(allNotifications[i]);
    }
 
    }
  setFriendNotifications(userNotifications);

}

const getAllShareNotifications = async (email) => {
  const allNotifications = await getNotifications();
  const userNotifications = [];
  
  for(var i=0; i<allNotifications.length; i++) {
    if(allNotifications[i].receiver === email){
      if(allNotifications[i].type === 'Share')
        userNotifications.push(allNotifications[i]);
    }
      
    }
  setShareNotifications(userNotifications);

}

  const showModal = (name) => {
    if(name === 'Friends'){
      setModalNotifications(false);
      setModalShareNotifications(true);
      setModalFriends(true);
    }
    if(name === 'Friend Requests'){
      setModalFriends(false);
      setModalShareNotifications(false);
      setModalNotifications(true);
    }
    if(name === 'Sharing Notifications'){
      setModalFriends(false);
      setModalNotifications(false);
      setModalShareNotifications(true);
    }
  }

  const handleDeleteFriend= async (friendEmail) => {
    try{
        //Remove friend email form user friends list
        const userFriends = user.friends;
        for(var i = 0; i < userFriends.length; i++) {
            if(userFriends[i]===friendEmail){
                userFriends.splice(i, 1);
            }     
        }
        var friends = userFriends;
        var data = {friends}
        
        await updateUser(user._id,data);

        //Remove user email from friend list
        const friend = await getUser(friendEmail);
        const friendList = friend.friends;
        for(var i = 0; i < friendList.length; i++) {
            if(friendList[i]===user.email){
              friendList.splice(i, 1);
            }     
        }
        friends = friendList;
        data = {friends}
        await updateUser(friend._id,data);

        reloadData();

    }catch (error) {
        console.log(error);
    }
  }

  const handleDeleteNotification =async (id) =>{
    await deleteNotification(id);
    reloadData();
    setModalNotifications(false);
  }

  const handleAddNotification= async () => {
    try{
        const sender = user.email;
        const receiver = email;
        const type = "friend";
        const data = {sender, receiver, type}

        await addNotification(data);
        alert("Friend request sended to "+ receiver);

    }catch (error) {
        console.log(error);
    }
  }

  const handleAddFriend= async (email1, email2,notification_id) => {
    try{
      const user1 = await getUser(email1);
      const user2 = await getUser(email2);
      const friends1 = user1.friends;
      const friends2 = user2.friends;
      console.log(friends1);
      console.log(email2);
      if(!contains(friends1,email2)){
        if(!contains(friends2,email1)){
          friends1.push(email2);
          friends2.push(email1);
          var friends = friends1;
          var data = {friends};
          console.log(friends);
          await updateUser(user1._id,data);
          friends = friends2;
          data = {friends};
          await updateUser(user2._id,data);
          await deleteNotification(notification_id);
          reloadData();
          setModalNotifications(false);
        }else{
          alert("You are already friends");
        }
        }else{
          alert("You are already friends");
        }

    }catch (error) {
        console.log(error);
    }
  }

  const handleAddShare= async (email, project_id,notification_id) => {
    try{
      const project = await getProject(project_id);
      const sharedTo = project.sharedTo;
      sharedTo.push(email);
      const data = {sharedTo};
      await updateProject(project_id,data);
      await deleteNotification(notification_id);
      setModalShareNotifications(false);
      setModalShareNotifications(true);
    }catch (error) {
        console.log(error);
    }
  }

  const contains = (array, email) =>{
    const itcontains = false;
    for(var i = 0; i < array.length; i++){
      if(email===array[i]){
        itcontains = true;
      }
    }
    return itcontains;
  }
  
  
  return sessionStorage.getItem('userRole')==="User"?(
    <>
      <Nav>
        <SideBars onClick={showSidebar}/>
        <NavText>
          <span className="text-white">{sessionStorage.getItem('userName') + " ("+sessionStorage.getItem('userRole')+")"} </span>
        </NavText>
        <Bars onClick={() =>setModalNavigate(true)}/>
        <NavMenu>
          <NavLink to='/Tasks' activeStyle>
            Tasks
          </NavLink>
          <NavLink to='/Projects' activeStyle>
            Projects
          </NavLink>
          <NavLink to='/SharedProjects' activeStyle>
            Shared Projects
          </NavLink>
        </NavMenu>
        <NavBtn>
          <NavBtnLink to='/'>Log Out</NavBtnLink>
        </NavBtn>
      </Nav>
      <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path} onClick={()=>showModal(item.title)}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      

      <Modal isOpen={modalNavigate}>
        <ModalHeader>
          <div><h3>Go To:</h3></div>
        </ModalHeader>
        <ModalBody>
            <FormGroup>
              <Button color="primary" onClick={() => navigate("/Tasks")}>Tasks</Button>
              <Button color="primary" onClick={() => navigate("/Projects")}>Projects</Button>
            </FormGroup>
            <FormGroup>
              <Button color="danger" onClick={() => navigate("/")}>Log Out</Button>
            </FormGroup>
        </ModalBody>
        <ModalFooter>
            <Button color="secondary" onClick={() => setModalNavigate(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalFriends}>
        <ModalHeader>
          <div><h3>Friends</h3></div>
        </ModalHeader>
        <ModalBody>
        <FormGroup>
          <input className="form-control" placeholder="User Email" type="text" name="email" onChange={onEmailChange} value={email}></input>
          <Button style={{ height: "40px"}} color="primary" variant="outlined" type="submit" onClick={() => handleAddNotification()}>Add Friend</Button>
        </FormGroup>
        <FormGroup>
          <table className="table" style={{ marginTop: 15, marginLeft: 15 }}>
            <thead>
              <tr>
                <th>UserName</th>
                <th>Email</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {friends.map(friend =>
                  <tr key={friend._id}>
                      <td>{friend.username}</td>
                      <td>{friend.email}</td>
                      <td><button style={{ marginRight: 10 }} onClick={() => handleDeleteFriend(friend.email)}>X</button></td>
                  </tr>
              )}
          </tbody>
          </table>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
            <Button color="danger" onClick={() => setModalFriends(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalFriendNotifications}>
        <ModalHeader>
          <div><h3>Friend Requests</h3></div>
        </ModalHeader>
        <ModalBody>
        <FormGroup>
          <table className="table" style={{ marginTop: 15, marginLeft: 15 }}>
            <thead>
              <tr>
                <th>UserName</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {friend_notifications.map(notification =>
                  <tr key={notification._id}>
                      <td>{notification.sender}</td>
                      <td><button style={{ marginRight: 10 }} onClick={() => handleAddFriend(notification.sender, notification.receiver, notification._id)}>Yes</button></td>
                      <td><button style={{ marginRight: 10 }} onClick={() => handleDeleteNotification(notification._id)}>No</button></td>
                  </tr>
              )}
          </tbody>
          </table>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
            <Button color="danger" onClick={() => setModalNotifications(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalShareNotifications}>
        <ModalHeader>
          <div><h3>Sharing Requests</h3></div>
        </ModalHeader>
        <ModalBody>
        <FormGroup>
          <table className="table" style={{ marginTop: 15, marginLeft: 15 }}>
            <thead>
              <tr>
                <th>UserName</th>
                <th>Project</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {share_notifications.map(notification =>
                  <tr key={notification._id}>
                      <td>{notification.sender}</td>
                      <td>{notification.project_name}</td>
                      <td><button style={{ marginRight: 10 }} onClick={() => handleAddShare(notification.receiver,notification.project_id,notification._id)}>Yes</button></td>
                      <td><button style={{ marginRight: 10 }} onClick={() => handleDeleteNotification(notification._id)}>No</button></td>
                  </tr>
              )}
          </tbody>
          </table>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
            <Button color="danger" onClick={() => setModalShareNotifications(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
      
    </>
  ):(
    <>
      <Nav>
        <NavLink to='/'>
        <span className="text-white">{sessionStorage.getItem('userName') + " ("+sessionStorage.getItem('userRole')+")"} </span>
        </NavLink>
        <Bars onClick={() =>setModalNavigate(true)}/>
        <NavMenu>
          <NavLink to='/AdminTasks' activeStyle>
            Tasks
          </NavLink>
          <NavLink to='/AdminProjects' activeStyle>
            Projects
          </NavLink>
          <NavLink to='/Users' activeStyle>
            Users
          </NavLink>
        </NavMenu>
        <NavBtn>
          <NavBtnLink to='/'>Log Out</NavBtnLink>
        </NavBtn>
      </Nav>
      <Modal isOpen={modalNavigate}>
        <ModalHeader>
          <div><h3>Go To:</h3></div>
        </ModalHeader>
        <ModalBody>
            <FormGroup>
              <Button color="primary" onClick={() => navigate("/AdminTasks")}>Tasks</Button>
              <Button color="primary" onClick={() => navigate("/AdminProjects")}>Projects</Button>
              <Button color="primary" onClick={() => navigate("/Users")}>Projects</Button>
            </FormGroup>
            <FormGroup>
              <Button color="danger" onClick={() => navigate("/")}>Log Out</Button>
            </FormGroup>
        </ModalBody>
        <ModalFooter>
            <Button color="secondary" onClick={() => setModalNavigate(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
      
    </>


  );
};
