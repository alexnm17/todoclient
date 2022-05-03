import React, { useState, useEffect } from "react";
import { Row, Col, Modal, ModalBody, FormGroup, ModalFooter, ModalHeader } from 'reactstrap';
import { Paper, Button} from "@material-ui/core";
import 'bootstrap/dist/css/bootstrap.min.css'
import './Tasks.css';
import TopBar from './bars/AdminTopBar';
import {getUsers,addNewUser, updateUser, deleteUser} from "../services/apicalls.js"



export default function Users(){

    const color= "#ffbb00";
    document.body.style.backgroundColor = color;

    const [users, setUsers] = useState(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [userid, setUserid] = useState("");

    const onEmailChange = e => setEmail(e.target.value);
    const onPasswordChange = e => setPassword(e.target.value);
    const onUsernameChange = e => setUsername(e.target.value);
    const onRoleChange = e => setRole(e.target.value);

    const [modalCreate, setModalCreate] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    

    const getAllUsers = () => {
        getUsers().then((users) => {
            setUsers(users);
        });
    }
    
    useEffect(() =>{
        getAllUsers();
      },[]);

    const createUser = () => {
        const data = {email, password, username, role}
        console.log(data);
        addNewUser(data)
            .then(res => {
              alert("User created")
              setModalCreate(false)
              
            }).catch(error => {
                alert(error.message)
            })
    }

    const handleUpdate= async () => {
        try{
            var data = {};
            if(password ===null || password ===""){
                data = {email, username, role}
            }else{
                data = {email, password, username, role}
            }
            console.log(data);
            await updateUser(userid,data);
            getAllUsers();
            setModalUpdate(false);

        }catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async (user_id) =>{
        try {
            await deleteUser(user_id);
            getAllUsers();
            
        } catch (error) {
            console.log(error);
        }
    };

    const showModalUpdate = (user) => {
        setUsername(user.username);
        setEmail(user.email);
        setPassword(null);
        setRole(user.role);
        setUserid(user._id);
        setModalUpdate(true);
        
    }
        
    return users === null ? (
            <div>
                <h1>Loading...</h1>
            </div>
            ):(
                <div>
                    <TopBar/>
                    <Row>
                        <Col>     
                        </Col>
                    </Row> 
                <div className="App flex">
                <Paper elevation={3} className="container">
                    <div className="heading flex">User List</div>
                        <div className="flex">
                            <Button
                                color="primary"
                                variant="outlined"
                                type="submit"
                                onClick={(() =>setModalCreate(true))}
                            >
                                Add user
                            </Button>
                        </div>

                    <Modal isOpen={modalCreate}>
                        <ModalHeader>
                            <div><h3>Add User</h3></div>
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <label>Username:</label>
                                <input className="form-control" placeholder="Name" type="text" name="username" onChange={onUsernameChange} value={username}></input>
                            </FormGroup>
                            <FormGroup>
                                <label>Email:</label>
                                <input className="form-control" type="text" name="email" onChange={onEmailChange} value={email}></input>
                            </FormGroup>
                            <FormGroup>
                                <label>Password:</label>
                                <input className="form-control" type="password" name="password" onChange={onPasswordChange} value={password}></input>
                            </FormGroup>
                            <FormGroup>
                                <label>Role:</label>
                                <select name="role" onChange={onRoleChange} value={role} className="form-control">
                                    <option>User</option>
                                    <option>Administrator</option>
                                </select>
                            </FormGroup>
                            
                        </ModalBody>

                        <ModalFooter>
                            <Button color="primary" onClick={createUser}>Accept</Button>
                            <Button color="secondary" onClick={() =>setModalCreate(false)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>


                    
                    <div>
                        {users.map((user) => (
                            <Paper
                                key={user._id}
                                className="flex task_container"
                            >
                                <div className="task">
                                    {user.username}
                                </div>
                                <div >
                                <Button
                                    onClick={() => showModalUpdate(user)}
                                    color="primary"
                                >
                                    ✏️
                                </Button>
                                </div>
                                <div>
                                <Button
                                    onClick={() =>handleDelete(user._id)}
                                    color="secondary"
                                    margin="60 px"
                                >
                                    🗑️
                                </Button>
                                </div>
                               
                            </Paper>
                        ))}
                    </div>
                    
                </Paper>
                <Modal isOpen={modalUpdate}>
                        <ModalHeader>
                            <div><h3>Update User</h3></div>
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <label>Name:</label>
                                <input className="form-control" placeholder="Name" type="text" name="username" onChange={onUsernameChange} value={username}></input>
                            </FormGroup>
                            <FormGroup>
                                <label>Email:</label>
                                <input className="form-control" type="text" name="email" onChange={onEmailChange} value={email}></input>
                            </FormGroup>
                            <FormGroup>
                                <label>Password:</label>
                                <input className="form-control" type="password" name="password" onChange={onPasswordChange} value={password}></input>
                            </FormGroup>
                            <FormGroup>
                                <label>Role:</label>
                                <select name="role" onChange={onRoleChange} value={role} className="form-control">
                                    <option>User</option>
                                    <option>Administrator</option>
                                </select>
                            </FormGroup>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="primary" onClick={() => handleUpdate()}>Accept</Button>
                            <Button color="secondary" onClick={() => setModalUpdate(false)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
            </div>
            </div>    
            
            
    );
}
