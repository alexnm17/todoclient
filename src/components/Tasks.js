import React, { Component } from "react";
import { Modal, ModalBody, FormGroup, ModalFooter, ModalHeader } from 'reactstrap';
import { Paper,Button } from "@material-ui/core";
import { Checkbox} from "@material-ui/core";
import 'bootstrap/dist/css/bootstrap.min.css'
import './Tasks.css';

import {
    addTask,
    getTasks,
    updateTask,
    deleteTask,
} from "../services/taskServices";

class Tasks extends Component {
    state = { 
        tasks: [],
        currentTask: "",
        modalAdd: false,
        modalUpdate: false,
        taskform: {
            taskname: "",
            priority: "",
            deadline: ""
        }
    };

    async componentDidMount() {
        this.getAllTasks();
    }


    async getAllTasks() {
        try {
            const { data } = await getTasks();
            this.setState({ tasks: data });
        } catch (error) {
            console.log(error);
        }
    }

    handleChange = async e => {
        await this.setState({
            taskform: {
                ...this.state.taskform,
                [e.target.name]: e.target.value
            }
        })
    }

    sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        try{
            var newtask = this.state.taskform;
            addTask(newtask);
            this.getAllTasks();
            this.hideModalAdd();
            await this.sleep(500);
            window.location.reload(true);
            
        }catch (error) {
            alert(error);
        }
            
    };

    handleUpdate = async (e) => {
        e.preventDefault();
        try{
            var newtask = this.state.taskform;
            updateTask(newtask._id,newtask);
            this.getAllTasks();
            this.hideModalUpdate();
        }catch (error) {
            console.log(error);
        }
    }

    
    
    handleComplete = async (currentTask) => {
        const originalTasks = this.state.tasks;
        try {
            const tasks = [...originalTasks];
            const index = tasks.findIndex((task) => task._id === currentTask);
            tasks[index] = { ...tasks[index] };
            tasks[index].completed = !tasks[index].completed;
            this.setState({ tasks });
            await updateTask(currentTask, {
                completed: tasks[index].completed,
            });
        } catch (error) {
            this.setState({ tasks: originalTasks });
            console.log(error);
        }
    };

    handleDelete = async (currentTask) => {
        const originalTasks = this.state.tasks;
        try {
            const tasks = originalTasks.filter(
                (task) => task._id !== currentTask
            );
            this.setState({ tasks });
            await deleteTask(currentTask);
        } catch (error) {
            this.setState({ tasks: originalTasks });
            console.log(error);
        }
    };

    showModalAdd = () => {
        this.setState({ modalAdd: true })
    }

    hideModalAdd = () => {
        this.setState({ modalAdd: false })
    }

    showModalUpdate = (task) => {
        this.setState({ modalUpdate: true, taskform: task })
    }

    hideModalUpdate = () => {
        this.setState({ modalUpdate: false })
    }

    changeHandler = async e => {
        await this.setState({
            taskform: {
                ...this.state.taskform,
                [e.target.name]: e.target.value
            }
        })
    }

    render() {
        var { taskname, priority, deadline } = this.state.taskform;
        var { tasks } = this.state;
        return (
            <div>
                <div className="top">
                <a href="/proyects">
				<Button color="primary">Proyects List</Button>
			    </a>
                </div>
                <div className="App flex">
                <Paper elevation={3} className="container">
                    <div className="heading">TO-DO</div>
                        <Button
                            style={{ height: "40px" }}
                            color="primary"
                            variant="outlined"
                            type="submit"
                            onClick={() => this.showModalAdd()}
                        >
                            Add task
                        </Button>


                    <Modal isOpen={this.state.modalAdd}>
                        <ModalHeader>
                            <div><h3>Add Task</h3></div>
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <label>Name:</label>
                                <input className="form-control" placeholder="Name" type="text" name="taskname" onChange={this.changeHandler} value={taskname}></input>
                            </FormGroup>
                            <FormGroup>
                                <label>Priority:</label>
                                <select name="priority" onChange={this.changeHandler} value={priority} className="form-control">
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                            </FormGroup>
                            <FormGroup>
                                <label>Deadline:</label>
                                <input className="form-control" type="date" name="deadline" onChange={this.changeHandler} value={deadline}></input>
                            </FormGroup>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="primary" onClick={this.handleSubmit}>Accept</Button>
                            <Button color="secondary" onClick={() => this.hideModalAdd()}>Cancel</Button>
                        </ModalFooter>
                    </Modal>


                    
                    <div>
                        {tasks.map((task) => (
                            <Paper
                                key={task._id}
                                className="flex task_container"
                            >
                                <Checkbox
                                    checked={task.completed}
                                    onClick={() => this.handleComplete(task._id)}
                                    color="primary"
                                />
                                <div
                                    className={
                                        task.completed
                                            ? "task line_through"
                                            : "task"
                                    }
                                >
                                    {task.taskname}
                                </div>
                                <div >
                                <Button
                                    onClick={() => this.showModalUpdate(task)}
                                    color="primary"
                                    
                                >
                                    update
                                </Button>
                                </div>
                                <div>
                                <Button
                                    onClick={() => this.handleDelete(task._id)}
                                    color="secondary"
                                    margin="60 px"
                                >
                                    delete
                                </Button>
                                </div>
                               
                            </Paper>
                        ))}
                    </div>
                    
                </Paper>
                <Modal isOpen={this.state.modalUpdate}>
                        <ModalHeader>
                            <div><h3>Update Task</h3></div>
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <label>Name:</label>
                                <input className="form-control" placeholder="Name" type="text" name="taskname" onChange={this.changeHandler} value={this.state.taskform.taskname}></input>
                            </FormGroup>
                            <FormGroup>
                                <label>Priority:</label>
                                <select name="priority" onChange={this.changeHandler} value={this.state.taskform.priority} className="form-control">
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                            </FormGroup>
                            <FormGroup>
                                <label>Deadline:</label>
                                <input className="form-control" type="date" name="deadline" onChange={this.changeHandler} value={this.state.taskform.deadline}></input>
                            </FormGroup>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="primary" onClick={this.handleUpdate}>Accept</Button>
                            <Button color="secondary" onClick={() => this.hideModalUpdate()}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
            </div>
            </div>    
            
            
        );
    }
}

export default Tasks;