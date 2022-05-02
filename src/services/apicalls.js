import API from './api';

/* TASKS CALLS */
export function getTasks() {
    return API.get('/tasks').then(res => res.data);
}

export function getTasksByEmail(email) {
    return API.get('/tasks/' + email).then(res => res.data);
}

export function deleteTask(idtask) {
    return API.delete('/tasks/'+idtask).then(result => result.data);
}

export function addTask(data){
    return API.post('/tasks', data).then(result => result.data);
}

export function updateTask(task_id, data){
    return API.put('/tasks/'+task_id, data).then(result => result)
}

/* PROJECTS CALLS */
export function getProjects() {
    return API.get('/projects').then(res => res.data);
}

export function deleteProject(idproject) {
    return API.delete('/projects/'+idproject).then(result => result.data);
}

export function addProject(data){
    return API.post('/projects', data).then(result => result.data);
}

export function updateProject(project_id, data){
    return API.put('/projects/'+project_id, data).then(result => result)
}

/* NOTIFICATION CALLS */
export function getNotifications() {
    return API.get('/notifications').then(res => res.data);
}

export function addNotification(data){
    return API.post('/notifications',data).then(result => result.data);
}

export function deleteNotification(idnotification) {
    return API.delete('/notifications/'+idnotification).then(result => result.data);
}


/* USER CALLS */
export function getUser(email) {
    return API.get('/users/' + email).then(res => res.data);
}

/* LOGIN AND REGISTER CALLS */
export function addNewUser(data){
    return API.post('/users/register',data).then(result => result.data);
}

export function login(data){
    return API.post('/users/login',data).then(result => result.data);
}

export function getUsers(){
    return API.get('/users/').then(result => result.data);
}

export function updateUser(user_id, data){
    return API.put('/users/'+user_id, data).then(result => result)
}

export function deleteUser(iduser) {
    return API.delete('/users/'+iduser).then(result => result.data);
}
