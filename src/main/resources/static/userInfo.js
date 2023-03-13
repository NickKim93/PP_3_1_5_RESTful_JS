fetch("/api/user/")
    .then(response => response.json())
    .catch(error => console.log(error))

let userPageInfo = ' '
const showUserInfo = (user) => {
    const container = document.getElementById("tbody-user")
    userPageInfo +=
        `<tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.name}</td>
            <td>${user.surname}</td>
            <td>${user.roles.map(role => role.name.toString().replaceAll('ROLE_', ''))}</td>
        </tr>`
    container.innerHTML = userPageInfo
}
fetch("/api/user/")
    .then(response => response.json())
    .then(data => showUserInfo(data))
    .catch(error => console.log(error))