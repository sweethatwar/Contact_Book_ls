let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

function saveToLocalStorage() {
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

function displayContacts() {
  const tableBody = document.querySelector('#contactTable tbody');
  tableBody.innerHTML = '';

  contacts.forEach((contact, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${contact.name}</td>
      <td>${contact.number}</td>
      <td>${contact.email}</td>
      <td>
        <button class="btn btn-info btn-sm" onclick="editContact(${index})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteContact(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function addContact(event) {
  event.preventDefault();

  const name = document.getElementById('contactName').value.trim();
  const number = document.getElementById('contactNumber').value.trim();
  const email = document.getElementById('contactEmail').value.trim();

  if (!name || !/^[A-Za-z\s]+$/.test(name)) {
    showStatus('Please enter a valid name (letters and spaces only).', 'danger');
    return;
  }

  if (!number || !/^\d+$/.test(number)) {
    showStatus('Please enter a valid phone number (digits only).', 'danger');
    return;
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!email || !emailRegex.test(email)) {
    showStatus('Please enter a valid email address.', 'danger');
    return;
  }

  const existingIndex = contacts.findIndex(contact => contact.number === number);

  if (existingIndex >= 0) {
    contacts[existingIndex] = { name, number, email };
    showStatus('Contact updated successfully!', 'success');
  } else {
    contacts.push({ name, number, email });
    showStatus('Contact added successfully!', 'success');
  }

  saveToLocalStorage();
  displayContacts();
  document.getElementById('contactForm').reset();
}

function editContact(index) {
  const contact = contacts[index];
  document.getElementById('contactName').value = contact.name;
  document.getElementById('contactNumber').value = contact.number;
  document.getElementById('contactEmail').value = contact.email;
}

function deleteContact(index) {
  contacts.splice(index, 1);
  saveToLocalStorage();
  displayContacts();
  showStatus('Contact deleted successfully!', 'warning');
}

function searchContacts() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#contactTable tbody tr');

  rows.forEach(row => {
    const nameCell = row.children[1];
    const numberCell = row.children[2];

    if (nameCell && numberCell) {
      const name = nameCell.textContent.toLowerCase();
      const number = numberCell.textContent.toLowerCase();

      if (name.includes(searchTerm) || number.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    }
  });
}

function showStatus(message, type) {
  const statusContainer = document.getElementById('statusContainer');
  statusContainer.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

document.getElementById('contactForm').addEventListener('submit', addContact);

displayContacts();
