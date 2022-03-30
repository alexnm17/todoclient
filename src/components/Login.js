import React, { useState } from 'react'
import  { useNavigate }  from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Modal, ModalBody, FormGroup, ModalFooter, ModalHeader, Button } from 'reactstrap';
import './Login.css'
import {addNewUser, login, getUser} from "../services/apicalls.js"

export default function Login(){
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const onEmailChange = e => setEmail(e.target.value);
    const onPasswordChange = e => setPassword(e.target.value);
    const onUsernameChange = e => setUsername(e.target.value);


    //const [loginMessage, setLoginMessage] = useState(null);

    const [modalCreate, setModalCreate] = useState(false);

    const navigate = useNavigate();

    const getUserByEmail = async (email) => {
        var data = await getUser(email);
        return data.username;
    }
    
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }

    const loginHandler = async() => {
        const user_name= await getUserByEmail(email);
        const data = {email, password}
        login(data)
            .then(res => {
              console.log(user_name);
              sessionStorage.setItem('userEmail', email);
              sessionStorage.setItem('userName', user_name);
              navigate("/Tasks");
            }).catch(error => {
                alert(error.message)
            })
    }

    const createUser = () => {
        const data = {email, password, username}
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
            <div id="button" class="row">
                <button onClick={loginHandler}>Login</button>
            </div>
            <div> 
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


  

 