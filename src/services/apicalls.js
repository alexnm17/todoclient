import API from './api';

export {
    getTasks,
    addNewUser,
    login,
    getUser
}

/* TASKS CALLS */
function getTasks() {
    return API.get('/tasks').then(res => res.data);
}

/* USER CALLS */
function getUser(email) {
    return API.get('/users/' + email).then(res => res.data);
}

/* LOGIN AND REGISTER CALLS */
function addNewUser(data){
    return API.post('/users/register',data).then(result => result.data);
}

function login(data){
    return API.post('/users/login',data).then(result => result.data);
}
