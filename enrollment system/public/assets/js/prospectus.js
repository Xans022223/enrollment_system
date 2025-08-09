// New Subject Modal Functionality
document.addEventListener('DOMContentLoaded', function () {
    // Profile Dropdown Functionality
    const userAvatar = document.getElementById('userAvatar');
    const profileDropdown = document.getElementById('profileDropdown');

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

    // School Year Dropdown Functionality
    const schoolYearBtn = document.getElementById('schoolYearBtn');
    const schoolYearDropdown = document.getElementById('schoolYearDropdown');

    if (schoolYearBtn && schoolYearDropdown) {
        schoolYearBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            schoolYearDropdown.classList.toggle('show');
        });
    }

    // Close school year dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (schoolYearDropdown && schoolYearDropdown.classList.contains('show')) {
            if (!schoolYearBtn.contains(e.target) && !schoolYearDropdown.contains(e.target)) {
                schoolYearDropdown.classList.remove('show');
            }
        }
    });

    // Update school year on selection
    if (schoolYearDropdown) {
        schoolYearDropdown.querySelectorAll('.dropdown-year').forEach(yearItem => {
            yearItem.addEventListener('click', function () {
                schoolYearBtn.querySelector('span').textContent = this.textContent;
                schoolYearDropdown.classList.remove('show');
            });
        });
    }

    const newSubjectBtn = document.querySelector('.prospectus-new-subject-btn');
    const newSubjectModal = document.getElementById('newSubjectModal');
    const closeNewSubjectModal = document.getElementById('closeNewSubjectModal');
    const cancelNewSubject = document.getElementById('cancelNewSubject');
    const newSubjectForm = document.getElementById('newSubjectForm');
    const successModal = document.getElementById('successModal');
    const successModalMsg = document.getElementById('successModalMsg');
    const successModalOk = document.getElementById('successModalOk');

    // Settings Modal Elements
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsModal = document.getElementById('closeSettingsModal');
    const cancelSettings = document.getElementById('cancelSettings');
    const applySettings = document.getElementById('applySettings');

    // Open New Subject Modal
    newSubjectBtn.addEventListener('click', function () {
        newSubjectModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // Focus on first input
        document.getElementById('subjectCode').focus();
    });

    // Open Settings Modal
    settingsBtn.addEventListener('click', function () {
        settingsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    // Close New Subject Modal
    function closeModal() {
        newSubjectModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Reset form
        newSubjectForm.reset();
        // Reset submit button text
        const submitBtn = document.querySelector('.modal-submit-btn');
        submitBtn.textContent = 'Add Subject';
        // Remove editing row reference
        delete newSubjectForm.dataset.editingRow;
    }

    // Close Settings Modal
    function closeSettingsModalFunc() {
        settingsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Close modal event listeners
    closeNewSubjectModal.addEventListener('click', closeModal);
    cancelNewSubject.addEventListener('click', closeModal);
    closeSettingsModal.addEventListener('click', closeSettingsModalFunc);
    cancelSettings.addEventListener('click', closeSettingsModalFunc);

    // Close modal when clicking outside
    newSubjectModal.addEventListener('click', function (e) {
        if (e.target === newSubjectModal) {
            closeModal();
        }
    });

    // Close settings modal when clicking outside
    settingsModal.addEventListener('click', function (e) {
        if (e.target === settingsModal) {
            closeSettingsModalFunc();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && newSubjectModal.style.display === 'flex') {
            closeModal();
        }
        if (e.key === 'Escape' && settingsModal.style.display === 'flex') {
            closeSettingsModalFunc();
        }
    });

    // Apply Settings functionality
    applySettings.addEventListener('click', function () {
        // Get selected values
        const selectedYear = document.querySelector('input[name="year"]:checked');

        // Handle year/semester selection
        if (selectedYear) {
            const value = selectedYear.value;
            let year = '';
            let semester = '';

            // Parse the value to get year and semester
            if (value === '1st-year-1st-sem') {
                year = '1st Year';
                semester = '1st Sem';
            } else if (value === '1st-year-2nd-sem') {
                year = '1st Year';
                semester = '2nd Sem';
            } else if (value === '2nd-year-1st-sem') {
                year = '2nd Year';
                semester = '1st Sem';
            } else if (value === '2nd-year-2nd-sem') {
                year = '2nd Year';
                semester = '2nd Sem';
            } else if (value === '3rd-year-1st-sem') {
                year = '3rd Year';
                semester = '1st Sem';
            } else if (value === '3rd-year-2nd-sem') {
                year = '3rd Year';
                semester = '2nd Sem';
            } else if (value === '4th-year-1st-sem') {
                year = '4th Year';
                semester = '1st Sem';
            } else if (value === '4th-year-2nd-sem') {
                year = '4th Year';
                semester = '2nd Sem';
            }

            if (year && semester) {
                const selectedYearSem = year + ' - ' + semester;

                // Update the table title
                const tableTitle = document.querySelector('.prospectus-table-title');
                if (tableTitle) {
                    const currentCourse = getCurrentCourse();
                    tableTitle.textContent = currentCourse + ' - ' + selectedYearSem;
                }

                // Filter table based on year/semester
                filterTableByYearSemester(year, semester);

                // Store current year/semester for new subject additions
                window.currentYearSemester = { year: year, semester: semester };

                showSuccessModal('Course settings applied successfully!');
            }
        }

        closeSettingsModalFunc();
    });

    // Get current selected course
    function getCurrentCourse() {
        const activeCourse = document.querySelector('.prospectus-course-item.active');
        if (activeCourse) {
            const courseName = activeCourse.textContent.trim();
            if (courseName === 'BS-IT') {
                return 'BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY';
            } else if (courseName === 'BS-CS') {
                return 'BACHELOR OF SCIENCE IN COMPUTER SCIENCE';
            }
        }
        return 'BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY';
    }

    // Filter table by year and semester
    function filterTableByYearSemester(year, semester) {
        const tableBody = document.querySelector('.prospectus-table tbody');

        // Sample data for different years and semesters
        const yearSemesterData = {
            '1st Year': {
                '1st Sem': [
                    { code: 'FIL 101', title: 'Filipino I', unit: '3', prerequisite: '', room: '1108' },
                    { code: 'ENG 101', title: 'English 101', unit: '3', prerequisite: '', room: '1109' },
                    { code: 'MATH 101', title: 'College Algebra', unit: '3', prerequisite: '', room: '1107' },
                    { code: 'PE 101', title: 'Physical Education I', unit: '2', prerequisite: '', room: '4201' }
                ],
                '2nd Sem': [
                    { code: 'FIL 102', title: 'Filipino II', unit: '3', prerequisite: 'FIL 101', room: '101' },
                    { code: 'ENG 102', title: 'English 102', unit: '3', prerequisite: 'ENG 101', room: '102' },
                    { code: 'MATH 102', title: 'Trigonometry', unit: '3', prerequisite: 'MATH 101', room: '103' },
                    { code: 'PE 102', title: 'Physical Education II', unit: '2', prerequisite: 'PE 101', room: '201' }
                ]
            },
            '2nd Year': {
                '1st Sem': [
                    { code: 'IT 201', title: 'Advanced Programming', unit: '3', prerequisite: 'IT 102', room: '301' },
                    { code: 'IT 202', title: 'Web Technologies', unit: '3', prerequisite: 'IT 101', room: '302' },
                    { code: 'IT 203', title: 'Database Systems', unit: '3', prerequisite: 'IT 103', room: '303' },
                    { code: 'IT 204', title: 'Computer Networks', unit: '3', prerequisite: '', room: '304' }
                ],
                '2nd Sem': [
                    { code: 'IT 205', title: 'Software Engineering', unit: '3', prerequisite: 'IT 201', room: '301' },
                    { code: 'IT 206', title: 'Mobile Development', unit: '3', prerequisite: 'IT 202', room: '302' },
                    { code: 'IT 207', title: 'Data Analytics', unit: '3', prerequisite: 'IT 203', room: '303' },
                    { code: 'IT 208', title: 'Cybersecurity', unit: '3', prerequisite: 'IT 204', room: '304' }
                ]
            },
            '3rd Year': {
                '1st Sem': [
                    { code: 'IT 301', title: 'Artificial Intelligence', unit: '3', prerequisite: 'IT 201', room: '401' },
                    { code: 'IT 302', title: 'Cloud Computing', unit: '3', prerequisite: 'IT 204', room: '402' },
                    { code: 'IT 303', title: 'Big Data Processing', unit: '3', prerequisite: 'IT 207', room: '403' },
                    { code: 'IT 304', title: 'UI/UX Design', unit: '3', prerequisite: 'IT 202', room: '404' }
                ],
                '2nd Sem': [
                    { code: 'IT 305', title: 'Machine Learning', unit: '3', prerequisite: 'IT 301', room: '401' },
                    { code: 'IT 306', title: 'DevOps Practices', unit: '3', prerequisite: 'IT 302', room: '402' },
                    { code: 'IT 307', title: 'Blockchain Technology', unit: '3', prerequisite: 'IT 204', room: '403' },
                    { code: 'IT 308', title: 'Project Management', unit: '3', prerequisite: 'IT 205', room: '404' }
                ]
            },
            '4th Year': {
                '1st Sem': [
                    { code: 'IT 401', title: 'Capstone Project I', unit: '6', prerequisite: 'IT 308', room: '501' },
                    { code: 'IT 402', title: 'Advanced Web Development', unit: '3', prerequisite: 'IT 202', room: '502' },
                    { code: 'IT 403', title: 'Enterprise Systems', unit: '3', prerequisite: 'IT 205', room: '503' },
                    { code: 'IT 404', title: 'Research Methods', unit: '3', prerequisite: '', room: '504' }
                ],
                '2nd Sem': [
                    { code: 'IT 405', title: 'Capstone Project II', unit: '6', prerequisite: 'IT 401', room: '501' },
                    { code: 'IT 406', title: 'Internship', unit: '6', prerequisite: 'IT 401', room: '505' },
                    { code: 'IT 407', title: 'Professional Ethics', unit: '3', prerequisite: '', room: '506' },
                    { code: 'IT 408', title: 'Career Development', unit: '3', prerequisite: '', room: '507' }
                ]
            }
        };

        // Clear existing table content
        tableBody.innerHTML = '';

        // Add filtered data for the selected year and semester
        if (yearSemesterData[year] && yearSemesterData[year][semester]) {
            yearSemesterData[year][semester].forEach(subject => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${subject.code}</td>
                    <td>${subject.title}</td>
                    <td>${subject.unit}</td>
                    <td>${subject.prerequisite}</td>
                    <td>${subject.room}</td>
                    <td>
                        <button class="action-btn" title="Edit">&#9998;</button>
                        <button class="action-btn" title="Delete">&#128465;</button>
                    </td>
                `;
                tableBody.appendChild(newRow);
            });
        }
    }

    // Course Filter Functionality
    const courseItems = document.querySelectorAll('.prospectus-course-item');

    courseItems.forEach(item => {
        item.addEventListener('click', function () {
            // Remove active class from all course items
            courseItems.forEach(course => course.classList.remove('active'));

            // Add active class to clicked course
            this.classList.add('active');

            // Get the course name
            const courseName = this.textContent.trim();

            // Filter table based on course
            filterTableByCourse(courseName);

            // Update table title
            updateTableTitle(courseName);
        });
    });

    // Filter table by course
    function filterTableByCourse(courseName) {
        const tableBody = document.querySelector('.prospectus-table tbody');
        const rows = tableBody.querySelectorAll('tr');

        // Sample data for different courses (you can replace this with actual data)
        const courseData = {
            'BS-IT': [
                { code: 'IT 101', title: 'Introduction to Information Technology', unit: '3', prerequisite: '', room: '101' },
                { code: 'IT 102', title: 'Programming Fundamentals', unit: '3', prerequisite: '', room: '102' },
                { code: 'IT 103', title: 'Database Management', unit: '3', prerequisite: 'IT 102', room: '103' },
                { code: 'IT 104', title: 'Web Development', unit: '3', prerequisite: 'IT 102', room: '104' }
            ],
            'BS-CS': [
                { code: 'CS 101', title: 'Introduction to Computer Science', unit: '3', prerequisite: '', room: '201' },
                { code: 'CS 102', title: 'Data Structures and Algorithms', unit: '3', prerequisite: 'CS 101', room: '202' },
                { code: 'CS 103', title: 'Software Engineering', unit: '3', prerequisite: 'CS 102', room: '203' },
                { code: 'CS 104', title: 'Computer Networks', unit: '3', prerequisite: 'CS 101', room: '204' }
            ]
        };

        // Clear existing table content
        tableBody.innerHTML = '';

        // Add filtered data
        if (courseData[courseName]) {
            courseData[courseName].forEach(subject => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${subject.code}</td>
                    <td>${subject.title}</td>
                    <td>${subject.unit}</td>
                    <td>${subject.prerequisite}</td>
                    <td>${subject.room}</td>
                    <td>
                        <button class="action-btn" title="Edit">&#9998;</button>
                        <button class="action-btn" title="Delete">&#128465;</button>
                    </td>
                `;
                tableBody.appendChild(newRow);
            });
        }
    }

    // Update table title based on selected course
    function updateTableTitle(courseName) {
        const tableTitle = document.querySelector('.prospectus-table-title');
        if (tableTitle) {
            if (courseName === 'BS-IT') {
                tableTitle.textContent = 'BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY - 1st Year - 1st Sem';
            } else if (courseName === 'BS-CS') {
                tableTitle.textContent = 'BACHELOR OF SCIENCE IN COMPUTER SCIENCE - 1st Year - 1st Sem';
            }
        }
    }

    // Set default active course (BS-IT)
    const defaultCourse = document.querySelector('.prospectus-course-item');
    if (defaultCourse) {
        defaultCourse.classList.add('active');
        filterTableByCourse('BS-IT');

        // Set default year/semester context
        window.currentYearSemester = { year: '1st Year', semester: '1st Sem' };
    }

    // Handle form submission
    newSubjectForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(newSubjectForm);
        const subjectData = {
            code: formData.get('subjectCode').trim(),
            title: formData.get('subjectTitle').trim(),
            unit: parseInt(formData.get('subjectUnit')),
            prerequisite: formData.get('subjectPrerequisite').trim(),
            room: formData.get('subjectRoom').trim()
        };

        // Validate form data
        if (!validateSubjectData(subjectData)) {
            return;
        }

        // Simulate adding subject to table (you can replace this with actual API call)
        addSubjectToTable(subjectData);

        // Close modal
        closeModal();
    });

    // Validate subject data
    function validateSubjectData(data) {
        // Subject Code validation: string and int only, no special characters
        const subjectCodeRegex = /^[a-zA-Z0-9\s]+$/;
        if (!data.code) {
            showError('Subject code is required');
            return false;
        }
        if (!subjectCodeRegex.test(data.code)) {
            showError('Subject code can only contain letters, numbers, and spaces');
            return false;
        }

        // Subject Title validation: string and int only, no special characters
        const subjectTitleRegex = /^[a-zA-Z0-9\s]+$/;
        if (!data.title) {
            showError('Subject title is required');
            return false;
        }
        if (!subjectTitleRegex.test(data.title)) {
            showError('Subject title can only contain letters, numbers, and spaces');
            return false;
        }

        // Units validation: numbers only, no strings or characters
        if (!data.unit || isNaN(data.unit)) {
            showError('Units must be a valid number');
            return false;
        }
        if (data.unit < 1) {
            showError('Units must be at least 1');
            return false;
        }
        if (data.unit > 6) {
            showError('Units must be 6 or less');
            return false;
        }

        // Room validation: required field and format
        if (!data.room) {
            showError('Room is required');
            return false;
        }

        // Room validation: numbers only, no strings or special characters
        const roomRegex = /^[0-9]+$/;
        if (!roomRegex.test(data.room)) {
            showError('Room must be a valid number');
            return false;
        }

        // Room number range  (1-5000)
        const roomNumber = parseInt(data.room);
        if (roomNumber < 1 || roomNumber > 5000) {
            showError('Room number must be between 1 and 5000');
            return false;
        }

        return true;
    }

    // Add subject to table
    function addSubjectToTable(subjectData) {
        const tableBody = document.querySelector('.prospectus-table tbody');
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td>${subjectData.code}</td>
            <td>${subjectData.title}</td>
            <td>${subjectData.unit}</td>
            <td>${subjectData.prerequisite || ''}</td>
            <td>${subjectData.room}</td>
            <td>
                <button class="action-btn" title="Edit">&#9998;</button>
                <button class="action-btn" title="Delete">&#128465;</button>
            </td>
        `;

        tableBody.appendChild(newRow);

        // Show context message
        if (window.currentYearSemester) {
            const { year, semester } = window.currentYearSemester;
            showSuccessModal(`Subject added to ${year} - ${semester} successfully!`);
        } else {
            showSuccessModal('Subject added successfully!');
        }
    }

    // Show error message
    function showError(message) {
        showSuccessModal(message, 'error');
    }

    // Show success modal
    function showSuccessModal(message, type = 'success') {
        successModalMsg.textContent = message;
        successModalMsg.style.color = '#333333';
        successModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Close success modal
    successModalOk.addEventListener('click', function () {
        successModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close success modal when clicking outside
    successModal.addEventListener('click', function (e) {
        if (e.target === successModal) {
            successModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Logout functionality
    const logoutBtn = document.querySelector('.dropdown-logout a');
    const logoutYesBtn = document.getElementById('logoutYesBtn');
    const logoutCancelBtn = document.getElementById('logoutCancelBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            profileDropdown.classList.remove('show');
            document.getElementById('logoutModal').style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }

    if (logoutYesBtn) {
        logoutYesBtn.addEventListener('click', function () {
            document.getElementById('logoutModal').style.display = 'none';
            document.body.style.overflow = 'auto';
            // Redirect to sign-in page
            window.location.href = 'login.html';
        });
    }

    if (logoutCancelBtn) {
        logoutCancelBtn.addEventListener('click', function () {
            document.getElementById('logoutModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close logout modal when clicking outside
    const logoutModal = document.getElementById('logoutModal');
    if (logoutModal) {
        logoutModal.addEventListener('click', function (e) {
            if (e.target === logoutModal) {
                logoutModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Add event listeners for existing action buttons (Edit/Delete)
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('action-btn')) {
            const action = e.target.getAttribute('title');
            const row = e.target.closest('tr');

            if (action === 'Edit') {
                handleEditSubject(row);
            } else if (action === 'Delete') {
                handleDeleteSubject(row);
            }
        }
    });

    // Handle edit subject
    function handleEditSubject(row) {
        const cells = row.cells;
        const subjectData = {
            code: cells[0].textContent,
            title: cells[1].textContent,
            unit: cells[2].textContent,
            prerequisite: cells[3].textContent,
            room: cells[4].textContent
        };

        // Populate form with existing data
        document.getElementById('subjectCode').value = subjectData.code;
        document.getElementById('subjectTitle').value = subjectData.title;
        document.getElementById('subjectUnit').value = subjectData.unit;
        document.getElementById('subjectPrerequisite').value = subjectData.prerequisite;
        document.getElementById('subjectRoom').value = subjectData.room;

        // Change form button text
        const submitBtn = document.querySelector('.modal-submit-btn');
        submitBtn.textContent = 'Update Subject';

        // Open modal
        newSubjectModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Store reference to row being edited
        newSubjectForm.dataset.editingRow = row.rowIndex;
    }

    // Handle delete subject
    function handleDeleteSubject(row) {
        const confirmDeleteModal = document.getElementById('confirmDeleteModal');
        const confirmDeleteYes = document.getElementById('confirmDeleteYes');
        const confirmDeleteCancel = document.getElementById('confirmDeleteCancel');

        confirmDeleteModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Handle confirm delete
        const handleConfirmDelete = () => {
            row.remove();
            confirmDeleteModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            showSuccessModal('Subject deleted successfully!');

            // Remove event listeners
            confirmDeleteYes.removeEventListener('click', handleConfirmDelete);
            confirmDeleteCancel.removeEventListener('click', handleCancelDelete);
        };

        // Handle cancel delete
        const handleCancelDelete = () => {
            confirmDeleteModal.style.display = 'none';
            document.body.style.overflow = 'auto';

            // Remove event listeners
            confirmDeleteYes.removeEventListener('click', handleConfirmDelete);
            confirmDeleteCancel.removeEventListener('click', handleCancelDelete);
        };

        confirmDeleteYes.addEventListener('click', handleConfirmDelete);
        confirmDeleteCancel.addEventListener('click', handleCancelDelete);
    }
});
