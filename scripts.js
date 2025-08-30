// Define API endpoint URLs
const apiUrl = "http://127.0.0.1:5500/api"; //server's API base URL
const customersEndpoint = `${apiUrl}/customers`;

// MongoDB connection URI
const uri = "mongodb+srv://naomikmutuaya:root@cluster0.yfzuibo.mongodb.net/";

document.addEventListener('DOMContentLoaded', function() {
    // Fetch existing customers and populate the table
    fetchCustomers();

    // Handle form submission for adding a new customer
    document.getElementById('addCustomerForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        const formData = new FormData(event.target);
        const customerData = {};
        formData.forEach((value, key) => {
            customerData[key] = value;
        });

        // Call function to add the customer
        addCustomer(customerData);

        // Clear form fields
        event.target.reset();
    });

    // Retrieve Customers
    document.getElementById('retrieveButton').addEventListener('click', fetchCustomers);

    // Update Customer (Edit)
    document.getElementById('customerTableBody').addEventListener('click', function(event) {
        if (event.target.classList.contains('editButton')) {
            const customerId = event.target.dataset.id;
            editCustomer(customerId);
        }
    });

    // Delete Customer
    document.getElementById('customerTableBody').addEventListener('click', function(event) {
        if (event.target.classList.contains('deleteButton')) {
            const customerId = event.target.dataset.id;
            deleteCustomer(customerId);
        }
    });
});

// Function to fetch existing customers and populate the table
function fetchCustomers() {
    fetch(customersEndpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch customers: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(customers => {
            const customerTableBody = document.getElementById('customerTableBody');
            customerTableBody.innerHTML = ''; // Clear existing table rows
            customers.forEach(customer => {
                const row = `
                    <tr>
                        <td>${customer._id}</td>
                        <td>${customer.firstName}</td>
                        <td>${customer.lastName}</td>
                        <!-- Add more columns as needed -->
                        <td>
                            <button class="deleteButton" data-id="${customer._id}">Delete</button>
                            <button class="editButton" data-id="${customer._id}">Edit</button>
                        </td>
                    </tr>
                `;
                customerTableBody.innerHTML += row;
            });
        })
        .catch(error => console.error('Error fetching customers:', error));
}

// Function to add a new customer
function addCustomer(customerData) {
    fetch(customersEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add customer');
        }
        return response.json(); // Return the response data
    })
    .then(newCustomer => {
        // Display the newly added customer without refreshing the entire table
        displayNewCustomer(newCustomer);
    })
    .catch(error => console.error('Error adding customer:', error));
}

// Function to display the newly added customer without refreshing the entire table
function displayNewCustomer(customer) {
    const customerTableBody = document.getElementById('customerTableBody');
    const row = `
        <tr>
            <td>${customer._id}</td>
            <td>${customer.firstName}</td>
            <td>${customer.lastName}</td>
            <!-- Add more columns as needed -->
            <td>
                <button class="deleteButton" data-id="${customer._id}">Delete</button>
                <button class="editButton" data-id="${customer._id}">Edit</button>
            </td>
        </tr>
    `;
    customerTableBody.innerHTML += row;
}

// Function to delete a customer
function deleteCustomer(customerId) {
    fetch(`${customersEndpoint}/${customerId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete customer');
        }
        // Remove the deleted customer row from the table without refreshing the entire table
        removeCustomerRow(customerId);
    })
    .catch(error => console.error('Error deleting customer:', error));
}

// Function to remove the deleted customer row from the table without refreshing the entire table
function removeCustomerRow(customerId) {
    const customerRow = document.querySelector(`#customerTableBody tr[data-id="${customerId}"]`);
    if (customerRow) {
        customerRow.remove();
    }
}

// Function to edit a customer
function editCustomer(customerId) {
    console.log("Editing customer with ID:", customerId);
}
