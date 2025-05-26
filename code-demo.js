// Sample data store
let dataStore = {
    users: [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" }
    ]
};

// Code templates for each method
const codeTemplates = {
    GET: `// GET request to fetch all users
async function getUsers() {
    try {
        // Simulating API call
        const response = await fetch('/api/users');
        const users = await response.json();
        
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}`,

    POST: `// POST request to create a new user
async function createUser(userData) {
    try {
        // Simulating API call
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const newUser = await response.json();
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}`,

    PUT: `// PUT request to update a user
async function updateUser(userId, userData) {
    try {
        // Simulating API call
        const response = await fetch(\`/api/users/\${userId}\`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const updatedUser = await response.json();
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}`,

    DELETE: `// DELETE request to remove a user
async function deleteUser(userId) {
    try {
        // Simulating API call
        const response = await fetch(\`/api/users/\${userId}\`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}`
};

// Result templates for each method
const resultTemplates = {
    GET: {
        success: `{
    "users": [
        { "id": 1, "name": "John Doe", "email": "john@example.com" },
        { "id": 2, "name": "Jane Smith", "email": "jane@example.com" }
    ]
}`,
        error: `{
    "error": "Failed to fetch users",
    "message": "Network error occurred"
}`
    },
    POST: {
        success: `{
    "id": 3,
    "name": "New User",
    "email": "newuser@example.com",
    "message": "User created successfully"
}`,
        error: `{
    "error": "Failed to create user",
    "message": "Invalid user data"
}`
    },
    PUT: {
        success: `{
    "id": 1,
    "name": "Updated Name",
    "email": "updated@example.com",
    "message": "User updated successfully"
}`,
        error: `{
    "error": "Failed to update user",
    "message": "User not found"
}`
    },
    DELETE: {
        success: `{
    "message": "User deleted successfully",
    "id": 1
}`,
        error: `{
    "error": "Failed to delete user",
    "message": "User not found"
}`
    }
};

// DOM elements
const codeOutput = document.getElementById('code-output');
const resultOutput = document.getElementById('result-output');
const dataOutput = document.getElementById('data-output');
const methodButtons = document.querySelectorAll('.method-btn');

// Function to update code display with animation
function updateCodeDisplay(code) {
    codeOutput.innerHTML = `<code>${code}</code>`;
    codeOutput.classList.add('highlight');
    setTimeout(() => codeOutput.classList.remove('highlight'), 1000);
}

// Function to update result display with animation
function updateResultDisplay(result) {
    resultOutput.innerHTML = result;
    resultOutput.classList.add('highlight');
    setTimeout(() => resultOutput.classList.remove('highlight'), 1000);
}

// Function to update data display
function updateDataDisplay() {
    dataOutput.innerHTML = JSON.stringify(dataStore, null, 4);
}

// Function to simulate API call
async function simulateApiCall(method) {
    // Show loading state
    resultOutput.innerHTML = 'Loading...';
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success/failure randomly
    const isSuccess = Math.random() > 0.3; // 70% success rate
    
    if (isSuccess) {
        // Update data store based on method
        switch(method) {
            case 'GET':
                // No changes to data store
                break;
            case 'POST':
                dataStore.users.push({
                    id: dataStore.users.length + 1,
                    name: "New User",
                    email: "newuser@example.com"
                });
                break;
            case 'PUT':
                if (dataStore.users.length > 0) {
                    dataStore.users[0].name = "Updated Name";
                    dataStore.users[0].email = "updated@example.com";
                }
                break;
            case 'DELETE':
                if (dataStore.users.length > 0) {
                    dataStore.users.shift();
                }
                break;
        }
        
        updateDataDisplay();
        return resultTemplates[method].success;
    } else {
        return resultTemplates[method].error;
    }
}

// Add click handlers to method buttons
methodButtons.forEach(button => {
    button.addEventListener('click', async () => {
        // Update active button
        methodButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Get selected method
        const method = button.dataset.method;
        
        // Update code display
        updateCodeDisplay(codeTemplates[method]);
        
        // Simulate API call and update result
        const result = await simulateApiCall(method);
        updateResultDisplay(result);
    });
});

// Initialize with GET method
methodButtons[0].click(); 