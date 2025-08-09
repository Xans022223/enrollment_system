// Payment Management JavaScript

// Global variables
let currentEditRow = null;
let currentDeleteRow = null;
let paymentData = [
    {
        studentId: '2021-001',
        studentName: 'koy manampan',
        paymentType: 'Tuition Fee',
        amount: '₱25,000',
        dueDate: '2025-01-15',
        status: 'Paid',
        description: 'First semester tuition fee payment'
    },
    {
        studentId: '2021-002',
        studentName: 'Jane Smith',
        paymentType: 'Laboratory Fee',
        amount: '₱5,000',
        dueDate: '2025-01-20',
        status: 'Pending',
        description: 'Computer laboratory fee for programming courses'
    },
    {
        studentId: '2021-003',
        studentName: 'Mike Johnson',
        paymentType: 'Tuition Fee',
        amount: '₱12,000',
        dueDate: '2025-01-10',
        status: 'Pending',
        description: 'Second semester tuition fee payment'
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    initializePaymentPage();
    setupEventListeners();
    updatePaginationInfo();
});

// Initialize payment page
function initializePaymentPage() {
    // Set current date as default for new payments
    const today = new Date().toISOString().split('T')[0];
    const dueDateInput = document.getElementById('dueDate');
    if (dueDateInput) {
        dueDateInput.min = today;
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Profile dropdown functionality
    setupProfileDropdown();


    // Modal functionality
    setupModalEventListeners();

    // Form functionality
    setupFormEventListeners();

    // Filter and search functionality
    setupFilterAndSearch();


    // Success modal functionality
    setupSuccessModal();

    // Delete modal functionality
    setupDeleteModal();

    // Logout functionality
    setupLogoutModal();
}

// Profile dropdown functionality
function setupProfileDropdown() {
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
}

// School year dropdown functionality
function setupSchoolYearDropdown() {
    const schoolYearBtn = document.getElementById('schoolYearBtn');
    const schoolYearDropdown = document.getElementById('schoolYearDropdown');

    if (schoolYearBtn && schoolYearDropdown) {
        schoolYearBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            schoolYearDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!schoolYearBtn.contains(e.target) && !schoolYearDropdown.contains(e.target)) {
                schoolYearDropdown.classList.remove('show');
            }
        });

        // Handle year selection
        schoolYearDropdown.querySelectorAll('.dropdown-year').forEach(yearItem => {
            yearItem.addEventListener('click', function () {
                schoolYearBtn.querySelector('span').textContent = this.textContent;
                schoolYearDropdown.classList.remove('show');
            });
        });
    }
}

// Modal functionality
function setupModalEventListeners() {
    // New payment button
    const newPaymentBtn = document.getElementById('newPaymentBtn');
    const paymentModal = document.getElementById('paymentModal');
    const closeModal = document.getElementById('closeModal');

    if (newPaymentBtn && paymentModal) {
        newPaymentBtn.addEventListener('click', function () {
            openPaymentModal();
        });
    }

    if (closeModal && paymentModal) {
        closeModal.addEventListener('click', function () {
            closePaymentModal();
        });
    }

    // Close modal when clicking outside
    if (paymentModal) {
        paymentModal.addEventListener('click', function (e) {
            if (e.target === paymentModal) {
                closePaymentModal();
            }
        });
    }

    // View payment modal
    const viewPaymentModal = document.getElementById('viewPaymentModal');
    const closeViewModal = document.getElementById('closeViewModal');

    if (closeViewModal && viewPaymentModal) {
        closeViewModal.addEventListener('click', function () {
            closeViewPaymentModal();
        });
    }

    if (viewPaymentModal) {
        viewPaymentModal.addEventListener('click', function (e) {
            if (e.target === viewPaymentModal) {
                closeViewPaymentModal();
            }
        });
    }
}

// Form functionality
function setupFormEventListeners() {
    const paymentForm = document.getElementById('paymentForm');
    const cancelBtn = document.getElementById('cancelBtn');

    if (paymentForm) {
        paymentForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handlePaymentSubmit();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function () {
            closePaymentModal();
        });
    }
}



// Filter and search functionality
function setupFilterAndSearch() {
    const statusFilter = document.getElementById('paymentStatusFilter');
    const searchInput = document.getElementById('searchInput');

    if (statusFilter) {
        statusFilter.addEventListener('change', filterPayments);
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterPayments);
    }
}

// Pagination functionality
function setupPagination() {
    const recordsPerPage = document.getElementById('recordsPerPage');

    if (recordsPerPage) {
        recordsPerPage.addEventListener('change', function () {
            updatePaginationInfo();
        });
    }
}

// Success modal functionality
function setupSuccessModal() {
    const successCloseBtn = document.getElementById('successCloseBtn');

    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', function () {
            hideSuccessModal();
        });
    }
}

// Delete modal functionality
function setupDeleteModal() {
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const deleteModal = document.getElementById('deleteModal');

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function () {
            confirmDeletePayment();
        });
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function () {
            hideDeleteModal();
        });
    }

    if (deleteModal) {
        deleteModal.addEventListener('click', function (e) {
            if (e.target === deleteModal) {
                hideDeleteModal();
            }
        });
    }
}

// Logout modal functionality
function setupLogoutModal() {
    const logoutBtn = document.querySelector('.dropdown-logout a');
    const logoutYesBtn = document.getElementById('logoutYesBtn');
    const logoutCancelBtn = document.getElementById('logoutCancelBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            showLogoutModal();
        });
    }

    if (logoutYesBtn) {
        logoutYesBtn.addEventListener('click', function () {
            hideLogoutModal();
            window.location.href = 'login.html';
        });
    }

    if (logoutCancelBtn) {
        logoutCancelBtn.addEventListener('click', function () {
            hideLogoutModal();
        });
    }

    // Close logout modal when clicking outside
    const logoutModal = document.getElementById('logoutModal');
    if (logoutModal) {
        logoutModal.addEventListener('click', function (e) {
            if (e.target === logoutModal) {
                hideLogoutModal();
            }
        });
    }
}

// Payment functions
function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('paymentForm');

    if (modal && modalTitle) {
        modalTitle.textContent = 'New Payment';
        modal.classList.add('show');

        // Reset form
        if (form) {
            form.reset();
        }

        // Set current date as minimum due date
        const dueDateInput = document.getElementById('dueDate');
        if (dueDateInput) {
            const today = new Date().toISOString().split('T')[0];
            dueDateInput.min = today;
        }
    }
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.remove('show');
        currentEditRow = null;
    }
}

function openEditPaymentModal(row) {
    const modal = document.getElementById('paymentModal');
    const modalTitle = document.getElementById('modalTitle');
    const cells = row.querySelectorAll('td');

    if (modal && modalTitle && cells.length >= 6) {
        modalTitle.textContent = 'Edit Payment';
        modal.classList.add('show');

        // Fill form with current data
        document.getElementById('studentId').value = cells[0].textContent;
        document.getElementById('studentName').value = cells[1].textContent;
        document.getElementById('paymentType').value = cells[2].textContent;
        document.getElementById('amount').value = cells[3].textContent.replace('₱', '');
        document.getElementById('dueDate').value = cells[4].textContent;
        document.getElementById('paymentStatus').value = cells[5].querySelector('.status-badge').textContent;

        currentEditRow = row;
    }
}

function handlePaymentSubmit() {
    const form = document.getElementById('paymentForm');
    const formData = new FormData(form);

    // Validate form
    if (!validatePaymentForm(formData)) {
        return;
    }

    if (currentEditRow) {
        // Update existing payment
        updatePaymentRow(currentEditRow, formData);
        showSuccessModal('Payment updated successfully!');
    } else {
        // Add new payment
        addNewPayment(formData);
        showSuccessModal('Payment added successfully!');
    }

    closePaymentModal();
}

function validatePaymentForm(formData) {
    const studentId = formData.get('studentId');
    const studentName = formData.get('studentName');
    const paymentType = formData.get('paymentType');
    const amount = formData.get('amount');
    const dueDate = formData.get('dueDate');
    const paymentStatus = formData.get('paymentStatus');

    // Check for missing fields with specific messages
    if (!studentId) {
        showSuccessModal('Student ID field is required.');
        return false;
    }

    if (!studentName) {
        showSuccessModal('Student Name field is required.');
        return false;
    }

    if (!paymentType) {
        showSuccessModal('Payment Type field is required.');
        return false;
    }

    if (!amount) {
        showSuccessModal('Amount field is required.');
        return false;
    }

    if (!dueDate) {
        showSuccessModal('Due Date field is required.');
        return false;
    }

    if (!paymentStatus) {
        showSuccessModal('Status field is required.');
        return false;
    }

    // Validate Student ID format (only numbers and hyphens allowed)
    const studentIdRegex = /^[0-9-]+$/;
    if (!studentIdRegex.test(studentId)) {
        showSuccessModal('Student ID invalid format');
        return false;
    }

    // Validate Student Name format (only letters, spaces, and hyphens allowed)
    const studentNameRegex = /^[a-zA-Z\s-]+$/;
    if (!studentNameRegex.test(studentName)) {
        showSuccessModal('Student Name can only contain letters, spaces, and hyphens.');
        return false;
    }

    // Validate Amount format (only numbers allowed)
    const amountRegex = /^[0-9]+$/;
    if (!amountRegex.test(amount)) {
        showSuccessModal('Amount can only contain numbers.');
        return false;
    }

    if (amount <= 0) {
        showSuccessModal('Amount must be greater than 0.');
        return false;
    }

    return true;
}

function updatePaymentRow(row, formData) {
    const cells = row.querySelectorAll('td');

    if (cells.length >= 6) {
        cells[0].textContent = formData.get('studentId');
        cells[1].textContent = formData.get('studentName');
        cells[2].textContent = formData.get('paymentType');
        cells[3].textContent = '₱' + parseFloat(formData.get('amount')).toLocaleString();
        cells[4].textContent = formData.get('dueDate');

        // Update status badge
        const statusBadge = cells[5].querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.textContent = formData.get('paymentStatus');
            statusBadge.className = 'status-badge status-' + formData.get('paymentStatus').toLowerCase();
        }
    }
}

function addNewPayment(formData) {
    const tableBody = document.getElementById('paymentTableBody');
    const newRow = document.createElement('tr');

    const statusClass = 'status-' + formData.get('paymentStatus').toLowerCase();

    newRow.innerHTML = `
        <td>${formData.get('studentId')}</td>
        <td>${formData.get('studentName')}</td>
        <td>${formData.get('paymentType')}</td>
        <td>₱${parseFloat(formData.get('amount')).toLocaleString()}</td>
        <td>${formData.get('dueDate')}</td>
        <td><span class="status-badge ${statusClass}">${formData.get('paymentStatus')}</span></td>
        <td>
            <button class="action-btn" title="Edit" onclick="editPayment(this)">&#9998;</button>
            <button class="action-btn" title="Delete" onclick="deletePayment(this)">&#128465;</button>
        </td>
    `;

    tableBody.appendChild(newRow);

    // Add to payment data array
    paymentData.push({
        studentId: formData.get('studentId'),
        studentName: formData.get('studentName'),
        paymentType: formData.get('paymentType'),
        amount: '₱' + parseFloat(formData.get('amount')).toLocaleString(),
        dueDate: formData.get('dueDate'),
        status: formData.get('paymentStatus'),
        description: formData.get('description') || ''
    });
}

// Action button functions
function viewPayment(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');

    if (cells.length >= 6) {
        // Fill view modal with data
        document.getElementById('viewStudentId').textContent = cells[0].textContent;
        document.getElementById('viewStudentName').textContent = cells[1].textContent;
        document.getElementById('viewPaymentType').textContent = cells[2].textContent;
        document.getElementById('viewAmount').textContent = cells[3].textContent;
        document.getElementById('viewDueDate').textContent = cells[4].textContent;
        document.getElementById('viewStatus').textContent = cells[5].querySelector('.status-badge').textContent;

        // Find description from payment data
        const payment = paymentData.find(p => p.studentId === cells[0].textContent);
        document.getElementById('viewDescription').textContent = payment ? payment.description : 'No description available';

        // Show view modal
        const viewModal = document.getElementById('viewPaymentModal');
        if (viewModal) {
            viewModal.classList.add('show');
        }
    }
}

function editPayment(button) {
    const row = button.closest('tr');
    openEditPaymentModal(row);
}

function deletePayment(button) {
    const row = button.closest('tr');
    currentDeleteRow = row;
    showDeleteModal();
}

function confirmDeletePayment() {
    if (currentDeleteRow) {
        // Remove from payment data array
        const studentId = currentDeleteRow.querySelector('td').textContent;
        paymentData = paymentData.filter(p => p.studentId !== studentId);

        // Remove from table
        currentDeleteRow.remove();

        hideDeleteModal();
        showSuccessModal('Payment deleted successfully!');
        updatePaginationInfo();
    }
}

// Modal control functions
function closeViewPaymentModal() {
    const modal = document.getElementById('viewPaymentModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const messageEl = document.getElementById('successMessage');

    if (modal && messageEl) {
        messageEl.textContent = message;
        modal.classList.add('show');
    }
}

function hideSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function showDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function hideDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.remove('show');
        currentDeleteRow = null;
    }
}

function showLogoutModal() {
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function hideLogoutModal() {
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Filter and search functions
function filterPayments() {
    const statusFilter = document.getElementById('paymentStatusFilter');
    const searchInput = document.getElementById('searchInput');
    const tableRows = document.querySelectorAll('#paymentTableBody tr');

    const selectedStatus = statusFilter ? statusFilter.value : 'All';
    const searchText = searchInput ? searchInput.value.toLowerCase() : '';

    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 6) {
            const studentId = cells[0].textContent.toLowerCase();
            const studentName = cells[1].textContent.toLowerCase();
            const paymentType = cells[2].textContent.toLowerCase();
            const amount = cells[3].textContent.toLowerCase();
            const dueDate = cells[4].textContent.toLowerCase();
            const status = cells[5].querySelector('.status-badge').textContent.toLowerCase();

            const matchesStatus = selectedStatus === 'All' || status === selectedStatus.toLowerCase();
            const matchesSearch = (
                studentId.includes(searchText) ||
                studentName.includes(searchText) ||
                paymentType.includes(searchText) ||
                amount.includes(searchText) ||
                dueDate.includes(searchText) ||
                status.includes(searchText)
            );

            if (matchesStatus && matchesSearch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });

    updatePaginationInfo();
}



// Pagination functions
function updatePaginationInfo() {
    const recordsPerPage = document.getElementById('recordsPerPage');
    const paginationInfo = document.getElementById('paginationInfo');
    const visibleRows = document.querySelectorAll('#paymentTableBody tr:not([style*="display: none"])');

    if (recordsPerPage && paginationInfo) {
        const limit = parseInt(recordsPerPage.value);
        const total = visibleRows.length;
        const showing = Math.min(limit, total);

        paginationInfo.textContent = `Displaying 1 - ${showing} of ${total} records`;
    }
}

// Utility functions
function formatCurrency(amount) {
    return '₱' + parseFloat(amount).toLocaleString();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// Export functions for global access
window.viewPayment = viewPayment;
window.editPayment = editPayment;
window.deletePayment = deletePayment;
