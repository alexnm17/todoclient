import React, { useState, useEffect } from 'react'
import  { useNavigate }  from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Modal, ModalBody, FormGroup, ModalFooter, ModalHeader, Button } from 'reactstrap';
import './Login.css'
import {addNewUser, login, getUser} from "../services/apicalls.js"

export default function Login(){ 
    document.body.style.background = "linear-gradient(135deg, rgba(34,193,195,1) 0%, rgb(48, 206, 61) 100%)";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("User");

    const onEmailChange = e => setEmail(e.target.value);
    const onPasswordChange = e => setPassword(e.target.value);
    const onUsernameChange = e => setUsername(e.target.value);
    const onRoleChange = e => setRole(e.target.value);

    //const [loginMessage, setLoginMessage] = useState(null);
    const [modalCreate, setModalCreate] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.setItem('sessionToken', "");
      });

    const getUserByEmail = async (email) => {
        var data = await getUser(email);
        return data;
    }

    const loginHandler = async() => {
        const user_data= await getUserByEmail(email);
        const data = {email, password, role:user_data.role}
        login(data)
            .then(res => {
              sessionStorage.setItem('sessionToken', res._id);
              if(user_data.role==="User"){
                navigate("/Tasks");
                window.location.reload(true);
              }
              if(user_data.role==="Administrator"){
                navigate("/AdminTasks");
                window.location.reload(true);
              }
      
            }).catch(error => {
                alert(error.message)
            })
    }

    const createUser = () => {
        const data = {email, password, username, role}
        console.log(data);
        addNewUser(data)
            .then(res => {
              alert("User created")
              setModalCreate(false)
              loginHandler();
              
            }).catch(error => {
                alert(error.message)
            })
    }

      return(
        <div id="loginform">
          <h2 id="headerTitle">Login</h2>
          <div className="Form">
            <div class="row">
                <label>Email</label>
                <input type="text" onChange={onEmailChange} class="form-control" name="email" placeholder="Enter your Email" />
            </div> 
            <div class="row">
                <label>Password</label>
                <input type="password" onChange={onPasswordChange} class="form-control" name="password" placeholder="Enter your Password" />
            </div> 
            <div class="row">
                <button class="button" onClick={loginHandler}>Login</button>
            </div>
            <div class="row"> 
                <button class="button1" onClick={() => setModalCreate(true)}>Create new account</button>
            </div>

          </div>
          <Modal isOpen={modalCreate}>
                        <ModalHeader>
                            <div><h3>Create Account</h3></div>
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <label>Name:</label>
                                <input className="form-control" placeholder="Name" type="text" name="username" onChange={onUsernameChange} value={username}></input>
                            </FormGroup>
                            <FormGroup>
                                <label>Email:</label>
                                <input className="form-control" placeholder="Email" type="text" name="email" onChange={onEmailChange} value={email}></input>
                            </FormGroup>
                            <FormGroup>
                                <label>Password:</label>
                                <input className="form-control" placeholder="Password" type="password" name="password" onChange={onPasswordChange} value={password}></input>
                            </FormGroup>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="primary" onClick={createUser}>Create</Button>
                            <Button color="danger" onClick={() =>setModalCreate(false)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
        </div>
      );
    }


  

 