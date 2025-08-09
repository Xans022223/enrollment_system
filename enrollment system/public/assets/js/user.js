// School Year Dropdown Logic for User Page
window.addEventListener('DOMContentLoaded', function () {
    const schoolYearBtn = document.getElementById('schoolYearBtn');
    const schoolYearDropdown = document.getElementById('schoolYearDropdown');
    const yearOptions = document.querySelectorAll('.dropdown-year');

    // Profile Dropdown Logic
    const userAvatar = document.getElementById('userAvatar');
    const profileDropdown = document.getElementById('profileDropdown');

    // Toggle profile dropdown
    if (userAvatar && profileDropdown) {
        userAvatar.addEventListener('click', function (e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
    }

    // Close profile dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (profileDropdown && profileDropdown.classList.contains('show')) {
            if (!userAvatar.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        }
    });

    // Logout functionality
    const logoutLink = document.querySelector('.dropdown-logout a');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            showLogoutConfirmation();
        });
    }

    function showLogoutConfirmation() {
        notificationMessage.textContent = 'Are you sure you want to logout?';
        notificationConfirmBtn.textContent = 'Yes, logout!';
        notificationConfirmBtn.style.background = '#ef4444';
        notificationConfirmBtn.onclick = function () {
            // Here you would typically redirect to logout page or clear session
            window.location.href = 'login.html';
        };
        notificationModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Toggle dropdown
    if (schoolYearBtn && schoolYearDropdown) {
        schoolYearBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            schoolYearDropdown.classList.toggle('show');
        });
    }

    // Select year
    yearOptions.forEach(option => {
        option.addEventListener('click', function (e) {
            e.stopPropagation();
            const selectedYear = this.textContent;
            schoolYearBtn.querySelector('span').textContent = selectedYear;
            schoolYearDropdown.classList.remove('show');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (schoolYearDropdown && schoolYearDropdown.classList.contains('show')) {
            if (!schoolYearBtn.contains(e.target) && !schoolYearDropdown.contains(e.target)) {
                schoolYearDropdown.classList.remove('show');
            }
        }
    });

    // User Registration Modal Logic
    const modal = document.getElementById('userRegistrationModal');
    const newUserBtn = document.getElementById('newUserBtn');
    const closeModal = document.getElementById('closeModal');
    const continueBtn = document.getElementById('continueBtn');
    const backBtn = document.getElementById('backBtn');
    const submitBtn = document.getElementById('submitBtn');
    const step1Content = document.getElementById('step1Content');
    const step2Content = document.getElementById('step2Content');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');

    // Edit User Modal Logic
    const editModal = document.getElementById('editUserModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const editUserForm = document.getElementById('editUserForm');
    let currentEditRow = null;

    // Notification Modal Elements
    const notificationModal = document.getElementById('notificationModal');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationConfirmBtn = document.getElementById('notificationConfirmBtn');

    // Check if notification elements exist
    if (!notificationModal) {
        console.error('Notification modal not found!');
    }
    if (!notificationMessage) {
        console.error('Notification message element not found!');
    }
    if (!notificationConfirmBtn) {
        console.error('Notification confirm button element not found!');
    }

    // Open modal
    if (newUserBtn) {
        newUserBtn.addEventListener('click', function () {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function () {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            resetModal();
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            resetModal();
        }
    });

    // Continue to step 2
    if (continueBtn) {
        continueBtn.addEventListener('click', function () {
            if (validateStep1()) {
                step1Content.classList.remove('active');
                step2Content.classList.add('active');
                step1.classList.remove('active');
                step2.classList.add('active');
            }
        });
    }

    // Back to step 1
    if (backBtn) {
        backBtn.addEventListener('click', function () {
            step2Content.classList.remove('active');
            step1Content.classList.add('active');
            step2.classList.remove('active');
            step1.classList.add('active');
        });
    }

    // Submit form
    if (submitBtn) {
        submitBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (validateStep2()) {
                submitUserRegistration();
            }
        });
    }

    // Notification functions
    function showNotification(message) {
        if (notificationMessage && notificationModal) {
            notificationMessage.textContent = message;
            notificationModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        } else {
            console.error('Notification elements not available');
            alert(message); // Fallback to alert if modal not available
        }
    }

    function hideNotification() {
        if (notificationModal) {
            notificationModal.style.display = 'none';
            document.body.style.overflow = 'auto';

            // Reset button to default state
            if (notificationConfirmBtn) {
                notificationConfirmBtn.style.background = '#22c55e';
                notificationConfirmBtn.textContent = 'OK';
            }
        }
    }

    // Notification event listeners - REMOVED CONFLICTING LISTENER
    // The delete confirmation logic is handled in the main event listener below

    // Close notification when clicking outside
    window.addEventListener('click', function (e) {
        if (e.target === notificationModal) {
            hideNotification();
        }
    });

    // Improved Delete and Edit functionality with better event delegation
    document.addEventListener('click', function (e) {
        // Check if it's a delete button
        if (e.target.classList.contains('action-btn') && e.target.title === 'Delete') {
            console.log('Delete button clicked!');
            e.preventDefault();
            e.stopPropagation();

            const row = e.target.closest('tr');
            if (!row) {
                console.error('No table row found!');
                return;
            }

            const userId = row.cells[0].textContent;
            const userName = row.cells[1].textContent;

            console.log('Row found:', row);
            console.log('User ID:', userId);
            console.log('User Name:', userName);

            // Show delete confirmation
            showDeleteConfirmation(userId, userName, row);
        }

        // Check if it's an edit button
        if (e.target.classList.contains('action-btn') && e.target.title === 'Edit') {
            console.log('Edit button clicked!');
            e.preventDefault();
            e.stopPropagation();

            const row = e.target.closest('tr');
            openEditModal(row);
        }
    });

    function openEditModal(row) {
        currentEditRow = row;

        // Get current user data from the table
        const userId = row.cells[0].textContent;
        const fullName = row.cells[1].textContent;
        const email = row.cells[2].textContent;
        const contact = row.cells[3].textContent;

        // Split full name into firstname and lastname
        const nameParts = fullName.split(' ');
        const firstname = nameParts[0] || '';
        const lastname = nameParts.slice(1).join(' ') || '';

        // Remove +63 prefix from contact for editing
        const contactNumber = contact.startsWith('+63') ? contact.substring(3) : contact;

        // Populate edit form fields
        document.getElementById('editLastname').value = lastname;
        document.getElementById('editFirstname').value = firstname;
        document.getElementById('editContact').value = contactNumber;
        document.getElementById('editEmail').value = email;

        // Show edit modal
        editModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Close edit modal
    if (closeEditModal) {
        closeEditModal.addEventListener('click', function () {
            editModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            currentEditRow = null;
        });
    }

    // Cancel edit
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function () {
            editModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            currentEditRow = null;
        });
    }

    // Save edit changes
    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (validateEditForm()) {
                saveUserChanges();
            }
        });
    }

    // Close edit modal when clicking outside
    window.addEventListener('click', function (e) {
        if (e.target === editModal) {
            editModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            currentEditRow = null;
        }
    });

    // Global variable to store the row to be deleted
    let rowToDelete = null;
    let isDeleteConfirmation = false;

    // Search functionality
    function initializeSearch() {
        const searchInput = document.querySelector('input[placeholder="Search..."]');

        if (searchInput) {
            console.log('Search input found, setting up search functionality...');
            searchInput.addEventListener('input', filterUserTable);
        } else {
            console.error('Search input not found!');
        }
    }

    function filterUserTable() {
        const searchInput = document.querySelector('input[placeholder="Search..."]');
        const searchText = searchInput ? searchInput.value.toLowerCase() : '';
        const tableBody = document.querySelector('.list-table tbody');
        const rows = tableBody.querySelectorAll('tr');

        console.log('Filtering table with search text:', searchText);

        rows.forEach(row => {
            const userId = row.cells[0].textContent.toLowerCase();
            const name = row.cells[1].textContent.toLowerCase();
            const email = row.cells[2].textContent.toLowerCase();
            const contact = row.cells[3].textContent.toLowerCase();

            const matchesSearch = (
                userId.includes(searchText) ||
                name.includes(searchText) ||
                email.includes(searchText) ||
                contact.includes(searchText)
            );

            if (matchesSearch) {
                row.style.display = '';
                console.log('Row matches search:', name);
            } else {
                row.style.display = 'none';
                console.log('Row hidden:', name);
            }
        });

        // Update pagination info after filtering
        updatePaginationInfo();
    }

    // Initialize search when page loads
    initializeSearch();

    function showDeleteConfirmation(userId, userName, row) {
        console.log('=== SHOW DELETE CONFIRMATION START ===');
        console.log('User ID:', userId);
        console.log('User Name:', userName);
        console.log('Row object:', row);
        console.log('Row exists:', !!row);
        console.log('Row parent:', row ? row.parentNode : 'No row');

        const confirmDeleteModal = document.getElementById('confirmDeleteModal');
        const confirmDeleteYes = document.getElementById('confirmDeleteYes');
        const confirmDeleteCancel = document.getElementById('confirmDeleteCancel');

        if (!confirmDeleteModal || !confirmDeleteYes || !confirmDeleteCancel) {
            console.error('Delete confirmation modal elements not found!');
            // Fallback to confirm dialog
            if (confirm(`Are you sure you want to delete user "${userName}"?`)) {
                deleteUser(row);
            }
            return;
        }

        if (!row) {
            console.error('No row provided to delete!');
            return;
        }

        // Store the row to be deleted
        rowToDelete = row;
        isDeleteConfirmation = true;

        console.log('SET: rowToDelete =', rowToDelete);
        console.log('SET: isDeleteConfirmation =', isDeleteConfirmation);

        // Set up delete confirmation
        confirmDeleteYes.onclick = function () {
            console.log('Delete confirmed for row:', rowToDelete);
            deleteUser(rowToDelete);
            confirmDeleteModal.classList.remove('show');
        };

        // Cancel deletion
        confirmDeleteCancel.onclick = function () {
            console.log('Delete cancelled');
            confirmDeleteModal.classList.remove('show');
            // Reset flags
            isDeleteConfirmation = false;
            rowToDelete = null;
        };

        // Close modal when clicking outside
        confirmDeleteModal.onclick = function (e) {
            if (e.target === confirmDeleteModal) {
                confirmDeleteModal.classList.remove('show');
                // Reset flags
                isDeleteConfirmation = false;
                rowToDelete = null;
            }
        };

        // Show the confirmation modal
        confirmDeleteModal.classList.add('show');

        console.log('BEFORE SHOWING MODAL: rowToDelete =', rowToDelete);
        console.log('BEFORE SHOWING MODAL: isDeleteConfirmation =', isDeleteConfirmation);
        console.log('=== SHOW DELETE CONFIRMATION COMPLETE ===');
    }

    // Notification confirm button click handler (for regular notifications only)
    if (notificationConfirmBtn) {
        console.log('Setting up notification confirm button event listener...');
        notificationConfirmBtn.addEventListener('click', function () {
            console.log('Notification confirm button clicked!');
            hideNotification();
        });
        console.log('Event listener set up successfully!');
    } else {
        console.error('notificationConfirmBtn not found during setup!');
    }

    function deleteUser(row) {
        console.log('=== DELETE USER FUNCTION START ===');
        console.log('Row to delete:', row);
        console.log('Row HTML:', row.outerHTML);

        if (!row) {
            console.error('No row provided to delete!');
            return;
        }

        try {
            // Remove the row from the table
            console.log('Attempting to remove row...');
            row.remove();
            console.log('Row removed successfully!');

            // Update pagination info
            console.log('Updating pagination...');
            updatePaginationInfo();

            // Show success message
            console.log('Showing success notification...');
            showNotification('User deleted successfully!');

            // Reset flags
            isDeleteConfirmation = false;
            rowToDelete = null;

            console.log('=== DELETE USER FUNCTION COMPLETE ===');
        } catch (error) {
            console.error('Error during deletion:', error);
            showNotification('Error deleting user: ' + error.message);
        }
    }

    // Validation functions
    function validateStep1() {
        const lastname = document.getElementById('lastname').value.trim();
        const firstname = document.getElementById('firstname').value.trim();
        const contact = document.getElementById('contact').value.trim();

        // Lastname validation - string only, no numbers or special characters
        if (!lastname) {
            showNotification('Please enter the lastname');
            return false;
        }

        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(lastname)) {
            showNotification('Invalid input in Lastname. Only letters and spaces allowed.');
            return false;
        }

        if (lastname.length < 2) {
            showNotification('Lastname must be at least 2 characters long');
            return false;
        }

        // Firstname validation - string only, no numbers or special characters
        if (!firstname) {
            showNotification('Please enter the firstname');
            return false;
        }

        if (!nameRegex.test(firstname)) {
            showNotification('Invalid input in Firstname. Only letters and spaces allowed.');
            return false;
        }

        if (firstname.length < 2) {
            showNotification('Firstname must be at least 2 characters long');
            return false;
        }

        // Contact validation - numbers only, no letters or special characters
        if (!contact) {
            showNotification('Please enter the contact number');
            return false;
        }

        // Check if it's exactly 10 digits (without +63)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(contact)) {
            showNotification('Invalid input in Contact. Only 10 digits allowed after +63.');
            return false;
        }

        return true;
    }

    function validateStep2() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!email) {
            showNotification('Please enter the email address');
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Invalid input in Email. Please enter a valid email address');
            return false;
        }

        if (!password) {
            showNotification('Please enter the password');
            return false;
        }

        if (password.length < 6) {
            showNotification('Password must be at least 6 characters long');
            return false;
        }

        if (password !== confirmPassword) {
            showNotification('Passwords do not match');
            return false;
        }

        return true;
    }

    function submitUserRegistration() {
        // Collect form data
        const formData = {
            lastname: document.getElementById('lastname').value.trim(),
            firstname: document.getElementById('firstname').value.trim(),
            contact: '+63' + document.getElementById('contact').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value
        };

        // Here you would typically send the data to your backend
        console.log('User registration data:', formData);

        // Add new user to the table
        addUserToTable(formData);

        // Show success notification
        showNotification('User registered successfully!');

        // Close modal and reset form
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetModal();

        // Optionally refresh the user table or add the new user to the table
        // You can implement this based on your backend integration
    }

    function addUserToTable(userData) {
        const tableBody = document.querySelector('.list-table tbody');

        // Generate a new user ID (you can modify this logic based on your needs)
        const existingUsers = tableBody.querySelectorAll('tr');
        const newUserId = `ADMIN-${String(existingUsers.length + 1).padStart(5, '0')}`;

        // Create new table row
        const newRow = document.createElement('tr');

        // Create table cells
        const userIdCell = document.createElement('td');
        userIdCell.textContent = newUserId;

        const nameCell = document.createElement('td');
        nameCell.textContent = `${userData.firstname} ${userData.lastname}`;

        const emailCell = document.createElement('td');
        emailCell.textContent = userData.email;

        const contactCell = document.createElement('td');
        contactCell.textContent = userData.contact;

        const actionsCell = document.createElement('td');
        actionsCell.innerHTML = `
            <button class="action-btn" title="Edit">&#9998;</button>
            <button class="action-btn" title="Delete">&#128465;</button>
        `;

        // Add cells to row
        newRow.appendChild(userIdCell);
        newRow.appendChild(nameCell);
        newRow.appendChild(emailCell);
        newRow.appendChild(contactCell);
        newRow.appendChild(actionsCell);

        // Add row to table
        tableBody.appendChild(newRow);

        // Update pagination info
        updatePaginationInfo();
    }

    function updatePaginationInfo() {
        const tableBody = document.querySelector('.list-table tbody');
        const allRows = tableBody.querySelectorAll('tr');
        const visibleRows = tableBody.querySelectorAll('tr:not([style*="display: none"])');
        const totalRecords = allRows.length;
        const visibleRecords = visibleRows.length;
        const paginationInfo = document.querySelector('.table-pagination-info');

        if (paginationInfo) {
            if (visibleRecords === totalRecords) {
                paginationInfo.textContent = `Displaying 1 - ${totalRecords} of ${totalRecords} records`;
            } else {
                paginationInfo.textContent = `Displaying ${visibleRecords} of ${totalRecords} records (filtered)`;
            }
        }
    }

    function resetModal() {
        // Reset form fields
        document.getElementById('lastname').value = '';
        document.getElementById('firstname').value = '';
        document.getElementById('contact').value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('confirmPassword').value = '';

        // Reset to step 1
        step2Content.classList.remove('active');
        step1Content.classList.add('active');
        step2.classList.remove('active');
        step1.classList.add('active');
    }

    function validateEditForm() {
        const lastname = document.getElementById('editLastname').value.trim();
        const firstname = document.getElementById('editFirstname').value.trim();
        const contact = document.getElementById('editContact').value.trim();
        const email = document.getElementById('editEmail').value.trim();

        // Lastname validation - string only, no numbers or special characters
        if (!lastname) {
            showNotification('Please enter the lastname');
            return false;
        }

        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(lastname)) {
            showNotification('Invalid input in Lastname. Only letters and spaces allowed.');
            return false;
        }

        if (lastname.length < 2) {
            showNotification('Lastname must be at least 2 characters long');
            return false;
        }

        // Firstname validation - string only, no numbers or special characters
        if (!firstname) {
            showNotification('Please enter the firstname');
            return false;
        }

        if (!nameRegex.test(firstname)) {
            showNotification('Invalid input in Firstname. Only letters and spaces allowed.');
            return false;
        }

        if (firstname.length < 2) {
            showNotification('Firstname must be at least 2 characters long');
            return false;
        }

        // Contact validation - numbers only, no letters or special characters
        if (!contact) {
            showNotification('Please enter the contact number');
            return false;
        }

        // Check if it's exactly 10 digits (without +63)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(contact)) {
            showNotification('Invalid input in Contact. Only 10 digits allowed after +63.');
            return false;
        }

        // Email validation
        if (!email) {
            showNotification('Please enter the email address');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Invalid input in Email. Please enter a valid email address');
            return false;
        }

        return true;
    }

    function saveUserChanges() {
        if (!currentEditRow) return;

        // Get updated form data
        const updatedData = {
            lastname: document.getElementById('editLastname').value.trim(),
            firstname: document.getElementById('editFirstname').value.trim(),
            contact: '+63' + document.getElementById('editContact').value.trim(),
            email: document.getElementById('editEmail').value.trim()
        };

        // Update the table row
        currentEditRow.cells[1].textContent = `${updatedData.firstname} ${updatedData.lastname}`;
        currentEditRow.cells[2].textContent = updatedData.email;
        currentEditRow.cells[3].textContent = updatedData.contact;

        // Close edit modal
        editModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentEditRow = null;

        // Show success notification
        showNotification('User updated successfully!');

        console.log('Updated user data:', updatedData);
    }
}); 