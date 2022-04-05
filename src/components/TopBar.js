import React, { useState} from 'react';
import  {Button,Modal, ModalBody, FormGroup, ModalFooter, ModalHeader } from 'reactstrap';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
  NavText
} from './NavBarElements';
import  { useNavigate }  from 'react-router-dom';


export default function TopBar() {
  const [modalNavigate, setModalNavigate] = useState(false);
  const navigate = useNavigate();
  
  return sessionStorage.getItem('userRole')==="User"?(
    <>
      <Nav>
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
      
    </>
  ):(
    <>
      <Nav>
        <NavLink to='/'>
          TO DO LIST
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
      
    </>


  );
};
