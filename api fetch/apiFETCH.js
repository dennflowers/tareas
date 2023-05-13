getData('https://reqres.in/api/users?delay=3');

function getData(url) {
    const cacheKey = url;
    const cachedData = JSON.parse(localStorage.getItem(cacheKey));

    if (cachedData && (Date.now() - cachedData.timestamp) < 60000){
        displayData(cachedData.data);
    } else {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            const cachedData = { data: data, timestamp: Date.now() };
            localStorage.setItem(cacheKey, JSON.stringify(cachedData));
            displayData(data);
        })
        .catch( error => console.error(error));
    }
}
function getData(url) {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const userTable = document.getElementById('users-table');
        const tbody = userTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        data.data.forEach( user => {
            const tr = document.createElement('tr');
            const tdId = document.createElement('td');
            const tdEmail = document.createElement('td');
            const tdApellido = document.createElement('td');
            const tdNombre = document.createElement('td');
            const tdAvatar = document.createElement('td');

            tdId.innerText = user.id;
            tdEmail.innerText = user.email;
            tdApellido.innerText = user.first_name;
            tdNombre.innerText = user.last_name;

            const img = document.createElement('img');
            img.src = user.avatar;
            img.classList.add('avatar')
            tdAvatar.appendChild(img);

            tr.appendChild(tdId);
            tr.appendChild(tdEmail);
            tr.appendChild(tdApellido);
            tr.appendChild(tdNombre);
            tr.appendChild(tdAvatar);

            tbody.appendChild(tr);

        });
    })
    .catch(error => console.error(error));
}


window.addEventListener('resize', () => {
    getData('https://reqres.in/api/users?delay=3');
});

const readButton = document.getElementById('read-button');
readButton.addEventListener('click', readData);

function readData() {
    const usersTable = document.getElementById('users-table');
    const data = [];
    const headers = ['ID', 'Email', 'Nombre', 'Apellido'];

    const tbody = usersTable.querySelector('tbody');
    tbody.querySelectorAll('tr').forEach(tr => {
        const row = [];
        tr.querySelectorAll('td').forEach( td => {
            row.push(td.innerText);
        });
        data.push(row);
    });

    const thead = usersTable.querySelector('thead');
    const headerRow = [];
    thead.querySelectorAll('th').forEach(th => {
        headerRow.push(th.innerText);
    });
    headers.push(headerRow);

    const text = headers.join(',') + '\n' + data.map(row => row.join(',')).join('\n');
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'datos.csv');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

