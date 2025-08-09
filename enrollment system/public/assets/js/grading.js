// School Year Dropdown Logic for Grading Page
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

    // Grading Table Expand/Collapse Functionality
    const expandArrows = document.querySelectorAll('.expand-arrow');
    const subjectRows = document.querySelectorAll('.subject-row');

    expandArrows.forEach((arrow, index) => {
        arrow.addEventListener('click', function () {
            const subjectRow = subjectRows[index];
            const isExpanded = subjectRow.style.display !== 'none';

            if (isExpanded) {
                // Collapse
                subjectRow.style.display = 'none';
                this.textContent = '▶';
                this.style.transform = 'rotate(0deg)';
            } else {
                // Expand
                subjectRow.style.display = 'table-row';
                this.textContent = '▼';
                this.style.transform = 'rotate(0deg)';
            }
        });
    });

    // Grade Modal Functionality
    const editGradeModal = document.getElementById('editGradeModal');
    const closeGradeModal = document.getElementById('closeGradeModal');
    const cancelGradeBtn = document.getElementById('cancelGradeBtn');
    const saveGradeBtn = document.getElementById('saveGradeBtn');
    const editGradeForm = document.getElementById('editGradeForm');
    let currentEditRow = null;

    // Open grade modal when edit button is clicked
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('action-btn') && e.target.title === 'Edit') {
            const row = e.target.closest('tr');
            const cells = row.cells;

            // Get student name from the parent section row
            const sectionRow = row.closest('.expanded-subject-area').closest('tr').previousElementSibling;
            const studentName = sectionRow.cells[2].textContent; // Name column

            // Get subject details from the current row
            const subjectCode = cells[0].textContent;
            const subjectTitle = cells[1].textContent;
            const subjectUnit = cells[2].textContent;
            const currentGrade = cells[3].textContent;

            // Populate modal fields
            document.getElementById('studentName').value = studentName;
            document.getElementById('subjectCode').value = subjectCode;
            document.getElementById('subjectTitle').value = subjectTitle;
            document.getElementById('subjectUnit').value = subjectUnit;
            document.getElementById('finalGrade').value = currentGrade;

            // Store reference to the row being edited
            currentEditRow = row;

            // Show modal
            editGradeModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });

    // Close modal
    if (closeGradeModal) {
        closeGradeModal.addEventListener('click', function () {
            editGradeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            resetGradeModal();
        });
    }

    // Cancel button
    if (cancelGradeBtn) {
        cancelGradeBtn.addEventListener('click', function () {
            editGradeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            resetGradeModal();
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function (e) {
        if (e.target === editGradeModal) {
            editGradeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            resetGradeModal();
        }
    });

    // Save grade
    if (saveGradeBtn) {
        saveGradeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (validateGradeForm()) {
                saveGrade();
            }
        });
    }

    function validateGradeForm() {
        const finalGrade = document.getElementById('finalGrade').value;

        // Check if final grade is empty
        if (!finalGrade) {
            showNotification('Please enter a final grade.');
            return false;
        }

        // Check if final grade is a valid integer
        if (!Number.isInteger(Number(finalGrade)) || finalGrade.includes('.') || finalGrade.includes(',')) {
            showNotification('Invalid input! Final Grade must be a whole number (integer) only. No decimals, letters, or special characters allowed.');
            return false;
        }

        // Check if final grade is within valid range (65-100 only)
        const gradeNum = parseInt(finalGrade);
        if (gradeNum < 65 || gradeNum > 100) {
            showNotification('Please enter a valid grade between 65 and 100 only.');
            return false;
        }

        return true;
    }

    function saveGrade() {
        const finalGrade = document.getElementById('finalGrade').value;
        const gradeNum = parseInt(finalGrade);

        // Automatically set remark based on grade range (65-100 only)
        let remark;
        if (gradeNum >= 75 && gradeNum <= 100) {
            remark = 'Passed';
        } else if (gradeNum >= 65 && gradeNum <= 74) {
            remark = 'Failed';
        } else {
            remark = 'Failed'; // Default for any other case
        }

        if (currentEditRow) {
            // Update the table row
            currentEditRow.cells[3].textContent = finalGrade;
            currentEditRow.cells[4].textContent = remark;

            // Close modal
            editGradeModal.style.display = 'none';
            document.body.style.overflow = 'auto';

            // Show success message
            showNotification('Grade updated successfully!');

            // Reset modal
            resetGradeModal();
        }
    }

    function resetGradeModal() {
        if (editGradeForm) {
            editGradeForm.reset();
        }
        currentEditRow = null;
    }

    function showNotification(message) {
        if (notificationMessage && notificationModal) {
            notificationMessage.textContent = message;
            notificationModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    // Add event listener for OK button to close notification
    if (notificationConfirmBtn) {
        notificationConfirmBtn.addEventListener('click', function () {
            if (notificationModal) {
                notificationModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Course Filter Functionality
    const courseFilter = document.getElementById('courseFilter');
    if (courseFilter) {
        courseFilter.addEventListener('change', function () {
            const selectedCourse = this.value;
            const tableRows = document.querySelectorAll('.list-table tbody .section-row');

            tableRows.forEach(row => {
                const courseCell = row.querySelector('td:nth-child(5)'); // Course column
                if (courseCell) {
                    const courseText = courseCell.textContent.trim();
                    if (selectedCourse === 'All' || courseText === selectedCourse) {
                        row.style.display = '';
                        // Also show/hide the corresponding subject row
                        const subjectRow = row.nextElementSibling;
                        if (subjectRow && subjectRow.classList.contains('subject-row')) {
                            subjectRow.style.display = row.style.display;
                        }
                    } else {
                        row.style.display = 'none';
                        // Also hide the corresponding subject row
                        const subjectRow = row.nextElementSibling;
                        if (subjectRow && subjectRow.classList.contains('subject-row')) {
                            subjectRow.style.display = 'none';
                        }
                    }
                }
            });
            updatePaginationInfo();
        });
    }

    // Search Functionality
    const searchInput = document.querySelector('input[type="text"][placeholder="Search..."]');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('.list-table tbody .section-row');

            tableRows.forEach(row => {
                const cells = row.querySelectorAll('td');
                let found = false;

                cells.forEach(cell => {
                    if (cell.textContent.toLowerCase().includes(searchTerm)) {
                        found = true;
                    }
                });

                if (found) {
                    row.style.display = '';
                    // Also show the corresponding subject row if it was expanded
                    const subjectRow = row.nextElementSibling;
                    if (subjectRow && subjectRow.classList.contains('subject-row')) {
                        // Keep the subject row hidden if it was hidden before
                        if (subjectRow.style.display === 'table-row') {
                            subjectRow.style.display = 'table-row';
                        }
                    }
                } else {
                    row.style.display = 'none';
                    // Also hide the corresponding subject row
                    const subjectRow = row.nextElementSibling;
                    if (subjectRow && subjectRow.classList.contains('subject-row')) {
                        subjectRow.style.display = 'none';
                    }
                }
            });
            updatePaginationInfo();
        });
    }

    // Function to update pagination info
    function updatePaginationInfo() {
        const visibleRows = document.querySelectorAll('.list-table tbody .section-row:not([style*="display: none"])');
        const totalRecords = visibleRows.length;

        const paginationInfo = document.querySelector('.table-pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = `Displaying 1 - ${totalRecords} of ${totalRecords} records`;
        }
    }
});
