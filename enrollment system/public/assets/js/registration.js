// Registration Table JavaScript

class RegistrationTable {
    constructor() {
        this.registrations = [];
        this.filteredRegistrations = [];
        this.currentPage = 1;
        this.recordsPerPage = 10;
        this.sortColumn = 'course';
        this.sortDirection = 'asc';
        this.currentStep = 1; // Track current step

        this.initializeElements();
        this.bindEvents();
        this.filteredRegistrations = this.registrations;
        this.renderTable();
    }

    initializeElements() {
        this.tableBody = document.getElementById('registrationTableBody');
        this.noRecords = document.getElementById('noRecords');
        this.recordsPerPageSelect = document.getElementById('recordsPerPage');
        this.paginationInfo = document.getElementById('paginationInfo');
        this.newRegistrationBtn = document.getElementById('newRegistrationBtn');

        // Modal elements
        this.modal = document.getElementById('registrationModal');
        this.closeModal = document.getElementById('closeModal');
        this.continueBtn = document.getElementById('continueBtn');
        this.backBtn = document.getElementById('backBtn');
        this.submitBtn = document.getElementById('submitBtn');

        // Form content elements
        this.courseSetupContent = document.getElementById('courseSetupContent');
        this.subjectContent = document.getElementById('subjectContent');

        // Progress indicator elements
        this.step1 = document.getElementById('step1');
        this.step2 = document.getElementById('step2');
        this.progressLine = document.getElementById('progressLine');
        this.subjectsHeading = document.getElementById('subjectsHeading');
        this.subjectTableBody = document.getElementById('subjectTableBody');

        this.notifyModal = document.getElementById('notifyModal');
        this.notifyMessage = document.getElementById('notifyMessage');
        this.notifyCloseBtn = document.getElementById('notifyCloseBtn');
    }

    bindEvents() {
        // Records per page
        this.recordsPerPageSelect.addEventListener('change', () => {
            this.recordsPerPage = parseInt(this.recordsPerPageSelect.value);
            this.currentPage = 1;
            this.renderTable();
        });

        // New registration button
        this.newRegistrationBtn.addEventListener('click', () => {
            this.showNewRegistrationModal();
        });

        // Sort functionality
        document.querySelectorAll('.sortable').forEach(th => {
            th.addEventListener('click', () => {
                this.handleSort(th.dataset.sort);
            });
        });

        // Modal events
        this.closeModal.addEventListener('click', () => {
            this.hideModal();
        });

        this.continueBtn.addEventListener('click', () => {
            this.handleContinue();
        });

        this.backBtn.addEventListener('click', () => {
            this.handleBack();
        });

        this.submitBtn.addEventListener('click', () => {
            this.handleSubmit();
        });

        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.hideModal();
            }
        });

        this.notifyCloseBtn.addEventListener('click', () => {
            this.hideNotify();
        });
    }

    handleSort(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        // Update sort indicators
        document.querySelectorAll('.sortable i').forEach(icon => {
            icon.className = 'fas fa-sort';
        });

        const currentSortIcon = document.querySelector(`[data-sort="${column}"] i`);
        if (currentSortIcon) {
            currentSortIcon.className = this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
        }

        this.sortRegistrations();
        this.renderTable();
    }

    sortRegistrations() {
        this.filteredRegistrations.sort((a, b) => {
            let aValue = a[this.sortColumn];
            let bValue = b[this.sortColumn];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) {
                return this.sortDirection === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return this.sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    renderTable() {
        this.sortRegistrations();
        const startIndex = (this.currentPage - 1) * this.recordsPerPage;
        const endIndex = startIndex + this.recordsPerPage;
        const paginatedRegistrations = this.filteredRegistrations.slice(startIndex, endIndex);

        if (paginatedRegistrations.length === 0) {
            this.tableBody.innerHTML = '';
            this.noRecords.classList.remove('hidden');
        } else {
            this.noRecords.classList.add('hidden');
            this.tableBody.innerHTML = paginatedRegistrations.map(registration => {
                let courseDisplay = '';
                if (registration.course.toLowerCase() === 'bsit') courseDisplay = 'BS-IT';
                else if (registration.course.toLowerCase() === 'bscs') courseDisplay = 'BS-CS';
                else if (registration.course.toLowerCase() === 'bsis') courseDisplay = 'BS-IS';
                else courseDisplay = registration.course.toUpperCase();
                let statusDisplay = registration.status.toUpperCase();
                return `
                <tr>
                    <td>${registration.studentId}</td>
                    <td>${registration.name}</td>
                        <td>${courseDisplay}</td>
                    <td>
                            ${statusDisplay}
                    </td>
                    <td>
                        <button class="action-btn" title="Delete" onclick="registrationTable.deleteRegistration('${registration.id}')">&#128465;</button>
                    </td>
                </tr>
                `;
            }).join('');
        }

        this.updatePaginationInfo();
    }

    updatePaginationInfo() {
        const totalRecords = this.filteredRegistrations.length;
        const startRecord = totalRecords === 0 ? 0 : (this.currentPage - 1) * this.recordsPerPage + 1;
        const endRecord = Math.min(this.currentPage * this.recordsPerPage, totalRecords);

        this.paginationInfo.textContent = `Displaying ${startRecord} - ${endRecord} of ${totalRecords} records`;
    }

    deleteRegistration(id) {
        const registration = this.registrations.find(r => r.id === id);
        if (registration) {
            // Show custom confirmation modal
            const confirmDeleteModal = document.getElementById('confirmDeleteModal');
            const confirmDeleteYes = document.getElementById('confirmDeleteYes');
            const confirmDeleteCancel = document.getElementById('confirmDeleteCancel');
            if (confirmDeleteModal && confirmDeleteYes && confirmDeleteCancel) {
                confirmDeleteModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                confirmDeleteYes.onclick = null;
                confirmDeleteCancel.onclick = null;
                // Confirm delete
                confirmDeleteYes.onclick = () => {
                    this.registrations = this.registrations.filter(r => r.id !== id);
                    this.filteredRegistrations = this.registrations;
                    this.renderTable();
                    confirmDeleteModal.style.display = 'none';
                    document.body.style.overflow = '';
                    this.showNotify('Registration deleted successfully!');
                };
                // Cancel delete
                confirmDeleteCancel.onclick = () => {
                    confirmDeleteModal.style.display = 'none';
                    document.body.style.overflow = '';
                };
                // Close modal when clicking outside
                confirmDeleteModal.onclick = (e) => {
                    if (e.target === confirmDeleteModal) {
                        confirmDeleteModal.style.display = 'none';
                        document.body.style.overflow = '';
                    }
                };
            }
        }
    }

    showNewRegistrationModal() {
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        this.resetForm();
    }

    hideModal() {
        this.modal.classList.remove('show');
        document.body.style.overflow = '';
        this.resetForm();
    }

    resetForm() {
        this.currentStep = 1;
        this.updateStepDisplay();
    }

    updateStepDisplay() {
        // Update progress indicator
        if (this.currentStep === 1) {
            this.step1.classList.add('active');
            this.step1.classList.remove('completed');
            this.step2.classList.remove('active', 'completed');
            this.progressLine.classList.remove('completed');
        } else if (this.currentStep === 2) {
            this.step1.classList.remove('active');
            this.step1.classList.add('completed');
            this.step2.classList.add('active');
            this.step2.classList.remove('completed');
            this.progressLine.classList.add('completed');
        }

        // Update content visibility
        if (this.currentStep === 1) {
            this.courseSetupContent.style.display = 'block';
            this.subjectContent.style.display = 'none';
            this.backBtn.style.display = 'none';
            this.continueBtn.style.display = 'inline-flex';
            this.submitBtn.style.display = 'none';
        } else if (this.currentStep === 2) {
            this.courseSetupContent.style.display = 'none';
            this.subjectContent.style.display = 'block';
            this.backBtn.style.display = 'inline-flex';
            this.continueBtn.style.display = 'none';
            this.submitBtn.style.display = 'inline-flex';
            // Update subjects table and heading
            const course = document.getElementById('course').value;
            this.updateSubjectsTable(course);
        }
    }

    updateSubjectsTable(course) {
        // Define subjects per course
        const subjects = {
            'bsit': [
                { code: 'IT 101', title: 'Introduction to IT', unit: 3, prereq: '' },
                { code: 'IT 102', title: 'Programming 1', unit: 3, prereq: '' },
                { code: 'IT 103', title: 'Computer Hardware', unit: 3, prereq: '' },
                { code: 'IT 104', title: 'Web Development', unit: 3, prereq: 'Programming 1' }
            ],
            'bscs': [
                { code: 'CS 101', title: 'Introduction to Computer Science', unit: 3, prereq: '' },
                { code: 'CS 102', title: 'Discrete Math', unit: 3, prereq: '' },
                { code: 'CS 103', title: 'Data Structures', unit: 3, prereq: 'Discrete Math' },
                { code: 'CS 104', title: 'Algorithms', unit: 3, prereq: 'Data Structures' }
            ],
            'bsis': [
                { code: 'IS 101', title: 'Intro to IS', unit: 3, prereq: '' },
                { code: 'IS 102', title: 'Business Systems', unit: 3, prereq: '' },
                { code: 'IS 103', title: 'Database Systems', unit: 3, prereq: '' },
                { code: 'IS 104', title: 'Systems Analysis', unit: 3, prereq: 'Database Systems' }
            ]
        };
        const courseMap = {
            'bsit': 'BS-IT',
            'bscs': 'BS-CS',
            'bsis': 'BS-IS'
        };
        // Update heading
        this.subjectsHeading.textContent = `Subjects (Course: ${courseMap[course] || ''})`;
        // Update table
        const rows = (subjects[course] || []).map(subj =>
            `<tr><td>${subj.code}</td><td>${subj.title}</td><td>${subj.unit}</td><td>${subj.prereq}</td></tr>`
        ).join('');
        this.subjectTableBody.innerHTML = rows;
    }

    handleContinue() {
        // Validate course setup form
        const studentType = document.getElementById('studentType').value;
        const course = document.getElementById('course').value;
        const yearLevel = document.getElementById('yearLevel').value;
        const semester = document.getElementById('semester').value;

        if (!studentType || !course || !yearLevel || !semester) {
            this.showNotify('Missing information. Please fill out all required fields.');
            return;
        }

        // Move to next step
        this.currentStep = 2;
        this.updateStepDisplay();
    }

    handleBack() {
        // Move to previous step
        this.currentStep = 1;
        this.updateStepDisplay();
    }

    handleSubmit() {
        // Get form values
        const studentType = document.getElementById('studentType').value;
        const course = document.getElementById('course').value;
        const yearLevel = document.getElementById('yearLevel').value;
        const semester = document.getElementById('semester').value;

        // Here you would typically save the data and submit
        // Show custom notification modal
        this.showNotify('Registration submitted successfully!');
        // Close modal
        this.hideModal();

        // Add to table
        const newRegistration = {
            id: Date.now().toString(),
            studentId: `2024-${String(this.registrations.length + 1).padStart(4, '0')}`,
            name: 'New Student', // SA DATABASE NA TO MAG UUPDATE
            course: course,
            status: 'pending'
        };

        this.registrations.push(newRegistration);
        this.filteredRegistrations = this.registrations;
        this.renderTable();
    }

    showNotify(message) {
        this.notifyMessage.textContent = message;
        this.notifyModal.style.display = 'flex';
        // Auto-hide after 2.5 seconds for success, not for errors
        if (this.notifyTimeout) clearTimeout(this.notifyTimeout);
        if (message.toLowerCase().includes('success')) {
            this.notifyTimeout = setTimeout(() => {
                this.hideNotify();
            }, 2500);
        }
    }

    hideNotify() {
        this.notifyModal.style.display = 'none';
        if (this.notifyTimeout) clearTimeout(this.notifyTimeout);
    }
}

// Initialize the registration table when the page loads
let registrationTable;
document.addEventListener('DOMContentLoaded', () => {
    registrationTable = new RegistrationTable();
    // Profile dropdown functionality
    const userAvatar = document.getElementById('userAvatar');
    const profileDropdown = document.getElementById('profileDropdown');
    if (userAvatar && profileDropdown) {
        userAvatar.addEventListener('click', () => {
            profileDropdown.classList.toggle('show');
        });
        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (!userAvatar.contains(event.target) && !profileDropdown.contains(event.target)) {
                profileDropdown.classList.remove('show');
            }
        });
    }

    // Logout functionality
    const logoutLink = document.querySelector('.dropdown-logout a');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
});
