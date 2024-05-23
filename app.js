document.addEventListener('DOMContentLoaded', function() {
    const employeeForm = document.getElementById('employeeForm');
    const employeeTable = document.getElementById('employeeTable')?.getElementsByTagName('tbody')[0];

    let employees = JSON.parse(localStorage.getItem('employees')) || [];

    // Function to render the employee list
    function renderEmployees() {
        if (!employeeTable) return;

        employeeTable.innerHTML = '';
        employees.forEach((employee, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><input class="inline-edit" type="text" value="${employee.name}" onblur="updateEmployee(${index}, 'name', this.value)"></td>
                <td><input class="inline-edit" type="text" value="${employee.position}" onblur="updateEmployee(${index}, 'position', this.value)"></td>
                <td><input class="inline-edit" type="email" value="${employee.email}" onblur="updateEmployee(${index}, 'email', this.value)"></td>
                <td><input class="inline-edit" type="tel" value="${employee.phone}" onblur="updateEmployee(${index}, 'phone', this.value)"></td>
                <td><input class="inline-edit" type="text" value="${employee.department}" onblur="updateEmployee(${index}, 'department', this.value)"></td>
                <td><input class="inline-edit" type="date" value="${employee.dob}" onblur="updateEmployee(${index}, 'dob', this.value)"></td>
                <td><textarea class="inline-edit" onblur="updateEmployee(${index}, 'address', this.value)">${employee.address}</textarea></td>
                <td><input class="inline-edit" type="date" value="${employee.startDate}" onblur="updateEmployee(${index}, 'startDate', this.value)"></td>
                <td>${employee.resume ? '<a href="#" onclick="viewResume('+index+')">View</a>' : 'No Resume'}</td>
                <td>
                    <button onclick="deleteEmployee(${index})">Delete</button>
                </td>
            `;
            employeeTable.appendChild(row);
        });
    }

    // Function to add a new employee
    employeeForm?.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const position = document.getElementById('position').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const department = document.getElementById('department').value;
        const dob = document.getElementById('dob').value;
        const address = document.getElementById('address').value;
        const startDate = document.getElementById('startDate').value;
        const resume = document.getElementById('resume').files[0];

        if (resume) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const resumeBase64 = e.target.result;
                employees.push({ name, position, email, phone, department, dob, address, startDate, resume: resumeBase64 });
                localStorage.setItem('employees', JSON.stringify(employees));
                window.location.href = 'employee-list.html';
            };
            reader.readAsDataURL(resume);
        } else {
            employees.push({ name, position, email, phone, department, dob, address, startDate, resume: null });
            localStorage.setItem('employees', JSON.stringify(employees));
            window.location.href = 'employee-list.html';
        }
    });

    // Function to update an employee's information
    window.updateEmployee = function(index, field, value) {
        employees[index][field] = value;
        localStorage.setItem('employees', JSON.stringify(employees));
    }

    // Function to delete an employee
    window.deleteEmployee = function(index) {
        if (confirm('Are you sure you want to delete this employee?')) {
            employees.splice(index, 1);
            localStorage.setItem('employees', JSON.stringify(employees));
            renderEmployees();
        }
    }

    // Function to view a resume
    window.viewResume = function(index) {
        const resumeBase64 = employees[index].resume;
        if (resumeBase64) {
            const win = window.open();
            win.document.write('<iframe src="' + resumeBase64 + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        }
    }

    renderEmployees();
});
