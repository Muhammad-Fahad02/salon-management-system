const API_URL = '/api';

function checkLogin() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
    }
    return JSON.parse(user);
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

async function loadServices() {
    const res = await fetch(`${API_URL}/services`);
    const data = await res.json();
    document.getElementById('services-grid').innerHTML = data.map(s => `
        <div class="card">
            <h3>${s.serviceName}</h3>
            <p class="price">PKR ${s.price}</p>
            <p>${s.duration} mins</p>
        </div>
    `).join('');
}

async function loadDropdowns() {
    const [sRes, stRes] = await Promise.all([
        fetch(`${API_URL}/services`),
        fetch(`${API_URL}/staff`)
    ]);
    const services = await sRes.json();
    const staff = await stRes.json();

    document.getElementById('serviceSelect').innerHTML = services.map(s => `<option value="${s.serviceId}">${s.serviceName}</option>`).join('');
    document.getElementById('staffSelect').innerHTML = staff.map(s => `<option value="${s.staffId}">${s.name}</option>`).join('');
}

if(document.getElementById('bookingForm')) {
    const currentUser = checkLogin();
    loadDropdowns();

    document.getElementById('bookingForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            customerId: currentUser.id,
            serviceId: document.getElementById('serviceSelect').value,
            staffId: document.getElementById('staffSelect').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value
        };
        await fetch(`${API_URL}/book`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        });
        alert('Appointment Booked Successfully!');
        window.location.href = 'index.html';
    });
}

async function loadDashboardTable() {
    const user = checkLogin(); 
    
    const url = `${API_URL}/appointments?staffId=${user.id}&role=${user.role}`;

    const res = await fetch(url);
    const data = await res.json();
    
    const tbody = document.getElementById('adminTable'); 
    const title = document.getElementById('dashTitle');
    
    if(title) {
        title.innerText = user.role === 'Manager' ? 'Master Schedule' : 'My Schedule';
    }

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No appointments found.</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(a => `
        <tr>
            <td>${new Date(a.date).toLocaleDateString()}</td>
            <td>${a.time}</td>
            <td>${a.Customer}</td>
            <td>${a.serviceName}</td>
            <td>${a.Staff}</td>
            <td><span style="color:green; font-weight:bold">${a.status}</span></td>
        </tr>
    `).join('');
}

if(document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const role = document.getElementById('role').value;
        const data = {
            role,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            password: document.getElementById('password').value,
            gender: role === 'customer' ? document.getElementById('gender').value : null,
            jobTitle: role === 'staff' ? document.getElementById('jobTitle').value : null
        };

        const res = await fetch(`${API_URL}/signup`, {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)
        });
        
        if(res.ok) {
            alert('Account created! Please login.');
            window.location.href = 'login.html';
        } else {
            alert('Signup failed.');
        }
    });
}

if(document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPass').value,
            role: document.getElementById('loginRole').value 
        };

        const res = await fetch(`${API_URL}/login`, {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)
        });
        const result = await res.json();

        if(result.success) {
            localStorage.setItem('user', JSON.stringify({
                id: result.id,
                name: result.name,
                role: result.role
            }));

            alert('Welcome ' + result.name);

            if (result.role === 'customer') {
                window.location.href = 'booking.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        } else {
            alert('Invalid Email or Password');
        }
    });
}