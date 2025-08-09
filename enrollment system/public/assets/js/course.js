// School Year Dropdown Logic for Course Page
window.addEventListener('DOMContentLoaded', function () {
    console.log('Course.js loaded - Profile dropdown should work now');

    const schoolYearBtn = document.getElementById('schoolYearBtn');
    const schoolYearDropdown = document.getElementById('schoolYearDropdown');
    const yearOptions = document.querySelectorAll('.dropdown-year');

    // Profile Dropdown Logic
    const userAvatar = document.getElementById('userAvatar');
    const profileDropdown = document.getElementById('profileDropdown');

    console.log('Profile elements found:', { userAvatar: !!userAvatar, profileDropdown: !!profileDropdown });

    // Toggle profile dropdown
    if (userAvatar && profileDropdown) {
        userAvatar.addEventListener('click', function (e) {
            console.log('Avatar clicked!');
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
            console.log('Dropdown show class:', profileDropdown.classList.contains('show'));
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

    // Logout functionality (same as user page)
    const logoutLink = document.querySelector('.dropdown-logout a');
    console.log('Logout link found:', !!logoutLink);

    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            console.log('Logout link clicked!');
            e.preventDefault();
            showLogoutConfirmation();
        });
    }

    // Notification Modal Elements (same as user page)
    const notificationModal = document.getElementById('notificationModal');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationConfirmBtn = document.getElementById('notificationConfirmBtn');

    console.log('Notification elements found:', {
        notificationModal: !!notificationModal,
        notificationMessage: !!notificationMessage,
        notificationConfirmBtn: !!notificationConfirmBtn
    });

    function showLogoutConfirmation() {
        console.log('Showing logout confirmation...');
        if (notificationMessage && notificationConfirmBtn) {
            notificationMessage.textContent = 'Are you sure you want to logout?';
            notificationConfirmBtn.textContent = 'Yes, logout!';
            notificationConfirmBtn.style.background = '#ef4444';
            notificationConfirmBtn.onclick = function () {
                console.log('Logout confirmed - redirecting...');
                // Direct redirect like user page
                window.location.href = 'login.html';
            };
            if (notificationModal) {
                notificationModal.style.display = 'block';
            }
        }
    }

    // Close notification when clicking outside (same as user page)
    window.addEventListener('click', function (e) {
        if (e.target === notificationModal) {
            hideNotification();
        }
    });

    // Close notification with OK button
    if (notificationConfirmBtn) {
        notificationConfirmBtn.addEventListener('click', hideNotification);
    }

    function hideNotification() {
        if (notificationModal) {
            notificationModal.style.display = 'none';

            // Reset button to default state
            if (notificationConfirmBtn) {
                notificationConfirmBtn.style.background = '#224ec5';
                notificationConfirmBtn.textContent = 'OK';
            }
        }
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

    // New Course Modal Logic
    const newCourseBtn = document.getElementById('newCourseBtn');
    const newCourseModal = document.getElementById('newCourseModal');
    const closeNewCourseModal = document.getElementById('closeNewCourseModal');
    const cancelNewCourse = document.getElementById('cancelNewCourse');
    const newCourseForm = document.getElementById('newCourseForm');

    // Edit Course Modal Logic
    const editCourseModal = document.getElementById('editCourseModal');
    const closeEditCourseModal = document.getElementById('closeEditCourseModal');
    const cancelEditCourse = document.getElementById('cancelEditCourse');
    const editCourseForm = document.getElementById('editCourseForm');

    // Open new course modal
    if (newCourseBtn && newCourseModal) {
        newCourseBtn.addEventListener('click', function () {
            newCourseModal.classList.add('show');
            // Focus on first input
            document.getElementById('courseType').focus();
        });
    }

    // Close modal functions
    function closeModal() {
        if (newCourseModal) {
            newCourseModal.classList.remove('show');
            // Reset form
            if (newCourseForm) {
                newCourseForm.reset();
            }
        }
    }

    // Close modal with X button
    if (closeNewCourseModal) {
        closeNewCourseModal.addEventListener('click', closeModal);
    }

    // Close modal with Cancel button
    if (cancelNewCourse) {
        cancelNewCourse.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    if (newCourseModal) {
        newCourseModal.addEventListener('click', function (e) {
            if (e.target === newCourseModal) {
                closeModal();
            }
        });
    }

    // Edit modal close functions
    function closeEditModal() {
        if (editCourseModal) {
            editCourseModal.classList.remove('show');
            // Reset form
            if (editCourseForm) {
                editCourseForm.reset();
            }
        }
    }

    // Close edit modal with X button
    if (closeEditCourseModal) {
        closeEditCourseModal.addEventListener('click', closeEditModal);
    }

    // Close edit modal with Cancel button
    if (cancelEditCourse) {
        cancelEditCourse.addEventListener('click', closeEditModal);
    }

    // Close edit modal when clicking outside
    if (editCourseModal) {
        editCourseModal.addEventListener('click', function (e) {
            if (e.target === editCourseModal) {
                closeEditModal();
            }
        });
    }

    // Dynamic form field changes based on course type
    const courseTypeSelect = document.getElementById('courseType');
    const durationField = document.getElementById('durationField');
    const durationLabel = document.getElementById('durationLabel');
    const durationHint = document.getElementById('durationHint');
    const courseYearInput = document.getElementById('courseYear');
    const courseAbbreviationInput = document.getElementById('courseAbbreviation');
    const courseTitleInput = document.getElementById('courseTitle');

    if (courseTypeSelect) {
        courseTypeSelect.addEventListener('change', function () {
            const selectedType = this.value;

            if (selectedType === 'College') {
                // Change to Year field for College
                durationLabel.textContent = 'Year *';
                courseYearInput.placeholder = 'Year';
                durationHint.textContent = 'Please put year';
                courseYearInput.name = 'courseYear';
                courseYearInput.id = 'courseYear';
            } else {
                // Default to Year for other types
                durationLabel.textContent = 'Year *';
                courseYearInput.placeholder = 'Year';
                durationHint.textContent = 'Please put year';
                courseYearInput.name = 'courseYear';
                courseYearInput.id = 'courseYear';
            }
        });
    }

    // No real-time validation - let users type freely
    // Validation will only happen on form submission

    // Handle form submission
    if (newCourseForm) {
        newCourseForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(newCourseForm);
            const courseData = {
                type: formData.get('courseType'),
                duration: formData.get('courseYear') || formData.get('courseMonth'),
                abbreviation: formData.get('courseAbbreviation'),
                title: formData.get('courseTitle')
            };

            // Validate required fields
            if (!courseData.type || !courseData.duration || !courseData.abbreviation || !courseData.title) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Additional validation for field formats
            const selectedType = courseData.type;

            // Year validation for College courses
            const yearPattern = /^[a-zA-Z0-9\s]+$/;
            if (!yearPattern.test(courseData.duration)) {
                showNotification('Please enter a valid year.', 'error');
                return;
            }

            // Check if it's a valid year number
            const yearMatch = courseData.duration.match(/(\d+)/);
            if (yearMatch) {
                const yearNumber = parseInt(yearMatch[1]);
                if (yearNumber < 1 || yearNumber > 4) {
                    showNotification('Year must be between 1 and 4 years for college courses.', 'error');
                    return;
                }
            }

            // Validate Abbreviation format
            const abbreviationPattern = /^[a-zA-Z\s-]+$/;
            if (!abbreviationPattern.test(courseData.abbreviation)) {
                showNotification('Abbreviation field contains invalid characters. Only letters, spaces, and hyphens are allowed.', 'error');
                return;
            }

            // Validate Title format
            const titlePattern = /^[a-zA-Z\s]+$/;
            if (!titlePattern.test(courseData.title)) {
                showNotification('Title field contains invalid characters. Only letters and spaces are allowed.', 'error');
                return;
            }

            // Add new course to table
            addCourseToTable(courseData);

            // Close modal and show success message
            closeModal();
            showNotification('Course added successfully!', 'success');
        });
    }

    // Function to add course to table
    function addCourseToTable(courseData) {
        const tableBody = document.querySelector('.list-table tbody');
        if (!tableBody) return;

        const newRow = document.createElement('tr');

        // Format the display data based on course type
        let yearDisplay = courseData.duration;
        let monthDisplay = '';

        newRow.innerHTML = `
            <td>${courseData.abbreviation}</td>
            <td>${courseData.title}</td>
            <td>${yearDisplay}</td>
            <td>${monthDisplay}</td>
            <td>${courseData.type}</td>
            <td>
                <button class="action-btn" title="Edit">&#9998;</button>
                <button class="action-btn" title="Delete">&#128465;</button>
            </td>
        `;

        // Add event listeners to new action buttons
        const editBtn = newRow.querySelector('.action-btn[title="Edit"]');
        const deleteBtn = newRow.querySelector('.action-btn[title="Delete"]');

        if (editBtn) {
            editBtn.addEventListener('click', function () {
                const cells = newRow.querySelectorAll('td');
                openEditModal(cells, newRow);
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', function () {
                const cells = newRow.querySelectorAll('td');
                showDeleteConfirmation(cells[0].textContent, newRow);
            });
        }

        tableBody.appendChild(newRow);

        // Update pagination info
        updatePaginationInfo();
    }

    // Function to show delete confirmation
    function showDeleteConfirmation(courseName, rowElement) {
        const confirmDeleteModal = document.getElementById('confirmDeleteModal');
        const confirmDeleteYes = document.getElementById('confirmDeleteYes');
        const confirmDeleteCancel = document.getElementById('confirmDeleteCancel');

        if (confirmDeleteModal && confirmDeleteYes && confirmDeleteCancel) {
            // Store the row element for deletion
            confirmDeleteYes.onclick = function () {
                rowElement.remove();
                confirmDeleteModal.classList.remove('show');
                showNotification('Course deleted successfully!', 'success');
                updatePaginationInfo();
            };

            // Cancel deletion
            confirmDeleteCancel.onclick = function () {
                confirmDeleteModal.classList.remove('show');
            };

            // Close modal when clicking outside
            confirmDeleteModal.onclick = function (e) {
                if (e.target === confirmDeleteModal) {
                    confirmDeleteModal.classList.remove('show');
                }
            };

            // Show the confirmation modal
            confirmDeleteModal.classList.add('show');
        }
    }

    // Function to show notification
    function showNotification(message, type = 'info') {
        if (notificationMessage && notificationConfirmBtn) {
            notificationMessage.textContent = message;
            notificationConfirmBtn.textContent = 'OK';

            // Set button color based on type
            if (type === 'success') {
                notificationConfirmBtn.style.background = '#16a34a';
            } else if (type === 'error') {
                notificationConfirmBtn.style.background = '#ef4444';
            } else {
                notificationConfirmBtn.style.background = '#224ec5';
            }

            // Reset onclick to default behavior
            notificationConfirmBtn.onclick = hideNotification;

            if (notificationModal) {
                notificationModal.style.display = 'block';
            }
        }
    }

    // Function to open edit modal with current data
    function openEditModal(cells, rowElement) {
        if (!editCourseModal || !editCourseForm) return;

        // Get current data from table row
        const abbreviation = cells[0].textContent.trim();
        const title = cells[1].textContent.trim();
        const year = cells[2].textContent.trim();
        const month = cells[3].textContent.trim();
        const type = cells[4].textContent.trim();

        // Determine duration and duration type
        let duration = year;
        let durationType = 'Year';

        // Fill the edit form with current data
        document.getElementById('editCourseType').value = type;
        document.getElementById('editCourseAbbreviation').value = abbreviation;
        document.getElementById('editCourseTitle').value = title;
        document.getElementById('editCourseYear').value = duration;

        // Update duration field label based on type
        const editDurationLabel = document.getElementById('editDurationLabel');
        const editDurationHint = document.getElementById('editDurationHint');
        editDurationLabel.textContent = 'Year *';
        editDurationHint.textContent = 'Please put year';

        // Store the row element for updating
        document.getElementById('editRowIndex').value = rowElement.rowIndex;

        // Show the edit modal
        editCourseModal.classList.add('show');
    }

    // Handle edit form submission
    if (editCourseForm) {
        editCourseForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(editCourseForm);
            const courseData = {
                type: formData.get('editCourseType'),
                duration: formData.get('editCourseYear'),
                abbreviation: formData.get('editCourseAbbreviation'),
                title: formData.get('editCourseTitle')
            };

            // Validate required fields
            if (!courseData.type || !courseData.duration || !courseData.abbreviation || !courseData.title) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Additional validation for field formats (same as new course)
            const selectedType = courseData.type;

            // Year validation for College courses
            const yearPattern = /^[a-zA-Z0-9\s]+$/;
            if (!yearPattern.test(courseData.duration)) {
                showNotification('Please enter a valid year.', 'error');
                return;
            }

            // Check if it's a valid year number
            const yearMatch = courseData.duration.match(/(\d+)/);
            if (yearMatch) {
                const yearNumber = parseInt(yearMatch[1]);
                if (yearNumber < 1 || yearNumber > 4) {
                    showNotification('Year must be between 1 and 4 years for college courses.', 'error');
                    return;
                }
            }

            // Validate Abbreviation format
            const abbreviationPattern = /^[a-zA-Z\s-]+$/;
            if (!abbreviationPattern.test(courseData.abbreviation)) {
                showNotification('Abbreviation field contains invalid characters. Only letters, spaces, and hyphens are allowed.', 'error');
                return;
            }

            // Validate Title format
            const titlePattern = /^[a-zA-Z\s]+$/;
            if (!titlePattern.test(courseData.title)) {
                showNotification('Title field contains invalid characters. Only letters and spaces are allowed.', 'error');
                return;
            }

            // Update the table row
            updateCourseInTable(courseData, parseInt(formData.get('editRowIndex')));

            // Close modal and show success message
            closeEditModal();
            showNotification('Course updated successfully!', 'success');
        });
    }

    // Function to update course in table
    function updateCourseInTable(courseData, rowIndex) {
        const tableBody = document.querySelector('.list-table tbody');
        if (!tableBody) return;

        const row = tableBody.rows[rowIndex - 1]; // rowIndex is 1-based
        if (!row) return;

        // Format the display data based on course type
        let yearDisplay = courseData.duration;
        let monthDisplay = '';

        // Update the row content
        const cells = row.querySelectorAll('td');
        cells[0].textContent = courseData.abbreviation;
        cells[1].textContent = courseData.title;
        cells[2].textContent = yearDisplay;
        cells[3].textContent = monthDisplay;
        cells[4].textContent = courseData.type;
    }

    // Function to update pagination info
    function updatePaginationInfo() {
        const tableRows = document.querySelectorAll('.list-table tbody tr');
        const visibleRows = Array.from(tableRows).filter(row => row.style.display !== 'none');
        const totalRecords = visibleRows.length;

        const paginationInfo = document.querySelector('.table-pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = `Displaying 1 - ${totalRecords} of ${totalRecords} records`;
        }
    }

    // Course Filter Logic
    const courseFilter = document.getElementById('courseFilter');
    if (courseFilter) {
        courseFilter.addEventListener('change', function () {
            const selectedCourse = this.value;
            const tableRows = document.querySelectorAll('.list-table tbody tr');

            tableRows.forEach(row => {
                const courseCell = row.querySelector('td:first-child');
                if (courseCell) {
                    const courseText = courseCell.textContent.trim();
                    if (selectedCourse === 'All' || courseText === selectedCourse) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }

    // Search Functionality
    const searchInput = document.querySelector('input[type="text"][placeholder="Search..."]');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('.list-table tbody tr');

            tableRows.forEach(row => {
                const cells = row.querySelectorAll('td');
                let found = false;

                cells.forEach(cell => {
                    if (cell.textContent.toLowerCase().includes(searchTerm)) {
                        found = true;
                    }
                });

                row.style.display = found ? '' : 'none';
            });
        });
    }

    // Table Action Buttons (Edit, Delete)
    document.querySelectorAll('.action-btn[title="Edit"]').forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            const cells = row.querySelectorAll('td');
            openEditModal(cells, row);
        });
    });

    document.querySelectorAll('.action-btn[title="Delete"]').forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            const cells = row.querySelectorAll('td');
            showDeleteConfirmation(cells[0].textContent, row);
        });
    });
});
