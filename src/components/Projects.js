import React, { Component } from "react";
import { Modal, ModalBody, FormGroup, ModalFooter, ModalHeader } from 'reactstrap';
import { Paper,Button } from "@material-ui/core";
import 'bootstrap/dist/css/bootstrap.min.css'
import {
    addProject,
    getProjects,
    updateProject,
    deleteProject,
    getProject
} from "../services/projectServices";

import { 
    getTask, getTasks
}from "../services/taskServices";

class projects extends Component {
    state = { 
        projects: [],
        currentproject: null,
        tasks: [],
        currentproject: "",
        modalAdd: false,
        modalView: false,
        projectform: {
            projectname: ""
            
        },
        taskform: {
            taskname: "",
            priority: "",
            deadline: ""
        },
        projectupdate:{
            projectname: "Nombre inicial",
            tasks: []
        }
    };

    async componentDidMount() {
        this.getAllprojects();
    }

    async getAllprojects() {
        try {
            const { data } = await getProjects();
            this.setState({ projects: data });
        } catch (error) {
            console.log(error);
        }
    }

    async getTask(id){
        return await getTask(id)
    }

    getProjectTasks(projectid){
        var project = getProject(projectid);
        var tasksids = project[tasks]
        var tasks = [];
        for (var i = 0; i < tasksids.length; i++) {
            tasks.push(getTasks(tasksids[i]));

        }
        return tasks;

    }

    handleChange = async e => {
        await this.setState({
            projectform: {
                ...this.state.projectform,
                [e.target.name]: e.target.value
            }
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        try{
            var newproject = this.state.projectform;
            await addProject(newproject);
            this.getAllprojects();
            /*await updateTask(currentTask, {
                completed: tasks[index].completed,
            });*/
            this.hideModalAdd();
            //window.location.reload(true);
            
        }catch (error) {
            alert(error);
        }
            
    };

    handleUpdate = async (e) => {
        e.preventDefault();
        try{
            var newproject = this.state.projectform;
            updateProject(newproject._id,newproject);
            this.getAllprojects();
            this.hidemodalView();
        }catch (error) {
            console.log(error);
        }
    }

    handleDelete = async (currentProject) => {
        const originalProjects = this.state.projects;
        try {
            const projects = originalProjects.filter(
                (project) => project._id !== currentProject
            );
            this.setState({ projects });
            await deleteProject(currentProject);
        } catch (error) {
            this.setState({ projects: originalProjects });
            console.log(error);
        }
    };

    addTask= async(task) => {
        
        var newproject = this.state.projectform;
        var addproject = await getProject(newproject._id);
        var taskList=addproject.data.tasks;
        taskList.push(task);
        this.state.projectupdate["tasks"]=taskList;
        console.log(this.state.projectupdate["tasks"]);
        
        await updateProject(newproject._id,this.state.projectupdate);
        

    }

    showModalAdd = () => {
        this.setState({ modalAdd: true })
    }

    hideModalAdd = () => {
        this.setState({ modalAdd: false })
    }

    showmodalView = (project) => {
        this.setState({ modalView: true, projectform: project});
    }

    hidemodalView = () => {
        this.setState({ modalView: false })
    }

    changeHandler = async e => {
        await this.setState({
            projectform: {
                ...this.state.projectform,
                [e.target.name]: e.target.value
            }
        })
    }

    changeAddHandler = async e => {
        await this.setState({
            taskform: {
                ...this.state.taskform,
                [e.target.name]: e.target.value
            }
        })
    }

    render() {
        var {projectname} = this.state.projectform;
        var { taskname, priority, deadline } = this.state.taskform;
        const { projects: projects } = this.state;

        return (
            <div>
                <div className="top">
                <a href="/">
				<Button color="primary">Tasks List</Button>
			    </a>
                </div>
            <div className="App flex">
                <Paper elevation={3} className="container">
                    <div className="heading">Projects List</div>
                        <Button
                            style={{ height: "40px" }}
                            color="primary"
                            variant="outlined"
                            type="submit"
                            onClick={() => this.showModalAdd()}
                        >
                            Add project
                        </Button>


                    <Modal isOpen={this.state.modalAdd}>
                        <ModalHeader>
                            <div><h3>Add project</h3></div>
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <label>Name:</label>
                                <input className="form-control" placeholder="Name" type="text" name="projectname" onChange={this.changeHandler} value={projectname}></input>
                            </FormGroup>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="primary" onClick={this.handleSubmit}>Accept</Button>
                            <Button color="secondary" onClick={() => this.hideModalAdd()}>Cancel</Button>
                        </ModalFooter>
                    </Modal>


                    
                    <div>
                        {projects.map((project) => (
                            <Paper
                                key={project._id}
                                className="flex task_container"
                            >
                                <div className="task">
                                    {project.projectname}
                                </div>
                                
                                <div>
                                <Button
                                    onClick={() => this.handleDelete(project._id)}
                                    color="secondary"
                                >
                                    delete
                                </Button>
                                </div>              
                            </Paper>
                        ))}
                    </div>
                    
                </Paper>
                <Modal isOpen={this.state.modalView}>
                        <ModalHeader>
                            <div><h3>{projectname}</h3></div>
                        </ModalHeader>

                        <ModalBody>
                            <div className="flex">
                                <Button
                                color="primary"
                                variant="outlined"
                                type="submit"
                                
                                onClick={() => this.addTask(this.state.taskform)}
                                >
                            Add task
                            </Button></div>
                        
                        <FormGroup>
                                <label>Name:</label>
                                <input className="form-control" placeholder="Name" type="text" name="taskname" onChange={this.changeAddHandler} value={taskname}></input>
                                <label>Priority:</label>
                                <select name="priority" onChange={this.changeAddHandler} value={priority} className="form-control">
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                                <label>Deadline:</label>
                                <input className="form-control" type="date" name="deadline" onChange={this.changeAddHandler} value={deadline}></input>
                            </FormGroup>
                        <table className="table" style={{ marginTop: 15, marginLeft: 15 }}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Priority</th>
                                    <th>Deadline</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.tasks.map(task =>
                                    <tr key={task._id}>
                                        <td>{task}</td>
                                        <td>{task.priority}</td>
                                        <td>{task.deadline}</td>
                                        <td>
                                            <button className="secondary" id={task.idTask} style={{ marginRight: 10 }} onClick={() => this.showModalDelete(task)}>Delete Task</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="primary" onClick={this.handleUpdate}>Accept</Button>
                            <Button color="secondary" onClick={() => this.hidemodalView()}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
            </div>
            </div>    
        );
    }
}

export default projects;