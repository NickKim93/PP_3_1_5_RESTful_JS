document.addEventListener('DOMContentLoaded', tableBuilder);


async function tableBuilder() {

    const table = document.getElementById('users');
    let users = await getData();

    let userData = '';
    for (let user of users) {
        let roles = [];
        for (let role of user.roles) {
            roles.push(' ' + role.name.toString().replaceAll('ROLE_', ''));
        }
        userData += '<tr>';
        userData += '<td>' + user.id + '</td>';
        userData += '<td>' + user.username + '</td>';
        userData += '<td>' + user.name + '</td>';
        userData += '<td>' + user.surname + '</td>';
        userData += '<td>' + user.password + '</td>';
        userData += '<td>' + roles + '</td>';
        userData += '<td >' + '<a type="button" class="btnEdit btn btn-primary">Edit</a>' + '</td>';
        userData += '<td>' + '<a type="button" class="btnDelete btn btn-danger">Delete</a>' + '</td>';
        userData += '</tr>';
    }
    table.innerHTML = userData;
}

async function getData() {
    const url = '/api/users';
    let response = await fetch(url);
    return response.json();
}

//New user
const formNew = document.getElementById('formAddUser')
const username = document.getElementById('username')
const name = document.getElementById('name')
const surname = document.getElementById('surname')
const password = document.getElementById('password')
const switchTab = document.querySelector('#btnAddUser');
formNew.addEventListener('submit', (e) => {
    e.preventDefault()
    let roles = roleArray(document.getElementById('userRole'))
    fetch('/api/user', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            username: username.value,
            name: name.value,
            surname: surname.value,
            password: password.value,
            roles: roles
        })
    })
        .then(res => res.json())
        .then(formNew.reset())
        .then(tableBuilder)
        .catch(error => console.log(error))
})
switchTab.addEventListener('click', (event) => {
    const profileTabLink = document.querySelector('#nav-home-tab');
    profileTabLink.click();
});

let roleArray = (options) => {
    let array = []
    for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
            let role = {id: options[i].value}
            array.push(role)
        }
    }
    return array
}

const modalEdit = new bootstrap.Modal(document.getElementById('editModal'))
const editForm = document.getElementById('editForm')
const editId = document.getElementById('editId')
const editUsername = document.getElementById('editUsername')
const editName = document.getElementById('editName')
const editSurname = document.getElementById('editSurname')
const editPassword = document.getElementById('editPassword')
const editRoles = document.getElementById('editRoles')
const allRoles = [{id: 1, role: "ROLE_USER"}, {id: 2, role: "ROLE_ADMIN"}]

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

let idForm = 0
on(document, 'click', '.btnEdit', e => {
    const row = e.target.parentNode.parentNode
    idForm = row.firstElementChild.innerHTML
    fetch('/api/user/' + idForm, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => getUserById(data))
        .catch(error => console.log(error))
    const getUserById = (user) => {
        editId.value = user.id
        editUsername.value = user.username
        editName.value = user.name
        editSurname.value = user.surname
        editPassword.value = user.password
        editRoles.innerHTML = `
            <option value="${allRoles[0].id}">${allRoles[0].role}</option>
            <option value="${allRoles[1].id}">${allRoles[1].role}</option>
            `
        Array.from(editRoles.options).forEach(opt => {
            user.roles.forEach(role => {
                if (role.role === opt.text) {
                    opt.selected = true
                }
            })
        })
        modalEdit.show()
    }
})

editForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let roles = roleArray(document.getElementById('editRoles'))
    fetch('/api/user', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: idForm,
            username: editUsername.value,
            name: editName.value,
            surname: editSurname.value,
            password: editPassword.value,
            roles: roles
        })
    })
        .then(res => res.json())
        .then(tableBuilder)
        .catch(error => console.log(error))
    modalEdit.hide()
})

const modalDelete = new bootstrap.Modal(document.getElementById('deleteModal'))
const deleteForm = document.getElementById('deleteForm')
const deleteId = document.getElementById('deleteId')
const deleteUsername = document.getElementById('deleteUsername')
const deleteName = document.getElementById('deleteName')
const deleteSurname = document.getElementById('deleteSurname')
const deletePassword = document.getElementById('deletePassword')
const deleteRoles = document.getElementById('deleteRoles')

on(document, 'click', '.btnDelete', e => {
    const row = e.target.parentNode.parentNode
    idForm = row.firstElementChild.innerHTML
    fetch('/api/user/' + idForm, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => getUserById(data))
        .catch(error => console.log(error))
    const getUserById = (user) => {
        deleteId.value = user.id
        deleteUsername.value = user.username
        deleteName.value = user.name
        deleteSurname.value = user.surname
        deletePassword.value = user.password
        deleteRoles.innerHTML = `
            <option value="${allRoles[0].id}">${allRoles[0].role}</option>
            <option value="${allRoles[1].id}">${allRoles[1].role}</option>
            `
        Array.from(editRoles.options).forEach(opt => {
            user.roles.forEach(role => {
                if (role.role === opt.text) {
                    opt.selected = true
                }
            })
        })
        modalDelete.show()
    }
})

deleteForm.addEventListener('submit', (e) => {
    e.preventDefault()
    fetch('/api/user/' + idForm, {
        method: 'DELETE'
    })
        .then(tableBuilder)
        .catch(error => console.log(error))
    modalDelete.hide()
})
