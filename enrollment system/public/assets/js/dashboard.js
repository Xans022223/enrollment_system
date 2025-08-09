// Profile Dropdown - Moved to individual page files to avoid conflicts
// This functionality is now handled by course.js, user.js, etc.

// School Year Dropdown - Moved to individual page files to avoid conflicts
// This functionality is now handled by course.js, user.js, etc.

// Table Action Buttons (Download, Edit, Delete)
function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const modalMsg = document.getElementById('successModalMsg');
    if (modal && modalMsg) {
        modalMsg.textContent = message;
        modal.classList.add('show');
    }
}
function hideSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.remove('show');
}

let rowToDelete = null;

function showConfirmDeleteModal(row) {
    rowToDelete = row;
    const modal = document.getElementById('confirmDeleteModal');
    if (modal) modal.classList.add('show');
}
function hideConfirmDeleteModal() {
    const modal = document.getElementById('confirmDeleteModal');
    if (modal) modal.classList.remove('show');
    rowToDelete = null;
}

let rowToEdit = null;

function showEditModal(row) {
    rowToEdit = row;
    const cells = row.querySelectorAll('td');
    document.getElementById('editStudentId').value = cells[0].textContent;
    document.getElementById('editName').value = cells[1].textContent;
    document.getElementById('editCourse').value = cells[2].textContent;
    document.getElementById('editSection').value = cells[3].textContent;
    document.getElementById('editStatus').value = cells[4].textContent;
    document.getElementById('editModal').classList.add('show');
}
function hideEditModal() {
    document.getElementById('editModal').classList.remove('show');
    rowToEdit = null;
}

function showLogoutModal() {
    document.getElementById('logoutModal').classList.add('show');
}
function hideLogoutModal() {
    document.getElementById('logoutModal').classList.remove('show');
}

let rowToDownload = null;
let currentViewRow = null; // Store the current row being viewed

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

    // Download button for pre-enrolled table (robust version)
    document.querySelectorAll('.action-btn[title="Download"]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const downloadModal = document.getElementById('downloadConfirmModal');
            if (downloadModal) {
                downloadModal.classList.add('show');
                rowToDownload = this.closest('tr');
            } else {
                showSuccessModal('Download modal not found.');
            }
        });
    });
    // Download confirmation modal logic
    const downloadModal = document.getElementById('downloadConfirmModal');
    const downloadConfirmBtn = document.getElementById('downloadConfirmBtn');
    const downloadCancelBtn = document.getElementById('downloadCancelBtn');
    if (downloadCancelBtn && downloadModal) {
        downloadCancelBtn.addEventListener('click', function () {
            downloadModal.classList.remove('show');
            rowToDownload = null;
        });
    }
    if (downloadConfirmBtn && downloadModal) {
        downloadConfirmBtn.addEventListener('click', function () {
            downloadModal.classList.remove('show');
            if (rowToDownload) {
                const info = getStudentInfoFromRow(rowToDownload);
                if (window.jspdf && window.jspdf.jsPDF) {
                    generatePDF(info);
                    showSuccessModal('Student form download started!');
                } else {
                    showSuccessModal('PDF library not loaded.');
                }
                rowToDownload = null;
            } else {
                showSuccessModal('No student row selected.');
            }
        });
    }
    // Print
    const printBtn = document.getElementById('printBtn');
    const printModal = document.getElementById('printModal');
    const printConfirmBtn = document.getElementById('printConfirmBtn');
    const printCancelBtn = document.getElementById('printCancelBtn');
    if (printBtn && printModal) {
        printBtn.addEventListener('click', function () {
            printModal.classList.add('show');
        });
    }
    if (printCancelBtn && printModal) {
        printCancelBtn.addEventListener('click', function () {
            printModal.classList.remove('show');
        });
    }
    if (printConfirmBtn && printModal) {
        printConfirmBtn.addEventListener('click', function () {
            printModal.classList.remove('show');
            showSuccessModal('Table sent to printer!');
            // Print only the table
            const table = document.querySelector('.list-table');
            if (table) {
                const printWindow = window.open('', '', 'height=600,width=900');
                printWindow.document.write('<html><head><title>Print Table</title>');
                printWindow.document.write('<link rel="stylesheet" href="../../public/assets/css/dashboard.css">');
                printWindow.document.write('</head><body >');
                printWindow.document.write(table.outerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
            }
        });
    }
    // Edit - Shows detailed student information modal
    document.querySelectorAll('.action-btn[title="Edit"]').forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            if (!row) return;
            const cells = row.querySelectorAll('td');
            if (!cells.length) return;

            // Store the current row being viewed
            currentViewRow = row;

            // Fill modal fields with row data  
            const viewModal = document.getElementById('viewModal');
            if (!viewModal) return;
            const set = (selector, value) => {
                const el = viewModal.querySelector(selector);
                if (el) el.textContent = value;
            };
            set('[data-field="course"]', cells[2] ? cells[2].textContent : '');
            set('[data-field="year"]', '1st Year'); // Example static
            set('[data-field="semester"]', '1st Sem'); // Example static
            set('[data-field="schoolYear"]', '2025 - 2026'); // Example static
            set('[data-field="status"]', cells[4] ? cells[4].textContent : '');
            set('[data-field="fullname"]', cells[1] ? cells[1].textContent : '');
            set('[data-field="gender"]', 'Male'); // Example static
            set('[data-field="birthday"]', '01/25/2003'); // Example static
            set('[data-field="birthplace"]', 'Ormoc City'); // Example static
            set('[data-field="civilStatus"]', 'Single'); // Example static
            set('[data-field="religion"]', 'Catholic'); // Example static
            set('[data-field="nationality"]', 'Filipino'); // Example static

            // Show/hide buttons based on status
            const status = cells[4] ? cells[4].textContent.trim() : '';
            const enrollBtn = viewModal.querySelector('.card-enroll');
            const pendingBtn = viewModal.querySelector('.card-pending');

            if (enrollBtn && pendingBtn) {
                if (status === 'Pending') {
                    enrollBtn.style.display = 'inline-block';
                    pendingBtn.style.display = 'none';
                } else if (status === 'Enrolled') {
                    enrollBtn.style.display = 'none';
                    pendingBtn.style.display = 'inline-block';
                } else if (status === 'Rejected') {
                    enrollBtn.style.display = 'inline-block';
                    pendingBtn.style.display = 'none';
                } else {
                    enrollBtn.style.display = 'none';
                    pendingBtn.style.display = 'none';
                }
            }

            viewModal.style.display = 'flex';
        });
    });
    // Edit Modal Save/Cancel
    const editForm = document.getElementById('editForm');
    const editCancelBtn = document.getElementById('editCancelBtn');
    if (editForm) {
        editForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (rowToEdit) {
                // Custom validation for each field (shared sila ni dashboard and pre-enrolled)
                const studentId = document.getElementById('editStudentId').value;
                const name = document.getElementById('editName').value;
                const course = document.getElementById('editCourse').value;
                const section = document.getElementById('editSection').value;
                const status = document.getElementById('editStatus').value;
                const studentIdRegex = /^\d+(?:-\d+)*$/;
                const nameRegex = /^[A-Za-z\s]+$/;
                const courseRegex = /^[A-Za-z\s\-]+$/;
                const sectionRegex = /^[A-Za-z0-9\s\-]+$/;
                const statusRegex = /^[A-Za-z\s]+$/;
                if (!studentIdRegex.test(studentId)) {
                    showSuccessModal('Invalid input in Student ID.');
                    return;
                }
                if (!nameRegex.test(name)) {
                    showSuccessModal('Invalid input in Name.');
                    return;
                }
                if (!courseRegex.test(course)) {
                    showSuccessModal('Invalid input in Course.');
                    return;
                }
                if (!sectionRegex.test(section)) {
                    showSuccessModal('Invalid input in Section.');
                    return;
                }
                if (!statusRegex.test(status)) {
                    showSuccessModal('Invalid input in Status.');
                    return;
                }
                const cells = rowToEdit.querySelectorAll('td');
                cells[0].textContent = studentId;
                cells[1].textContent = name;
                cells[2].textContent = course;
                cells[3].textContent = section;
                cells[4].textContent = status;
                hideEditModal();
                showSuccessModal('Record updated successfully!');
            }
        });
    }
    if (editCancelBtn) {
        editCancelBtn.addEventListener('click', hideEditModal);
    }
    // Delete
    document.querySelectorAll('.action-btn[title="Delete"]').forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            showConfirmDeleteModal(row);
        });
    });
    // Confirm Delete Modal buttons
    const yesBtn = document.getElementById('confirmDeleteYes');
    const cancelBtn = document.getElementById('confirmDeleteCancel');
    if (yesBtn) {
        yesBtn.addEventListener('click', function () {
            if (rowToDelete) rowToDelete.remove();
            hideConfirmDeleteModal();
            showSuccessModal('Record deleted successfully!');
        });
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideConfirmDeleteModal);
    }
    // Modal OK button
    const okBtn = document.getElementById('successModalOk');
    if (okBtn) {
        okBtn.addEventListener('click', hideSuccessModal);
    }
    // Pagination Dropdown
    const paginationSelect = document.querySelector('.table-pagination-select');
    const tableRows = document.querySelectorAll('.list-table tbody tr');
    if (paginationSelect && tableRows.length) {
        paginationSelect.addEventListener('change', function () {
            const value = parseInt(this.value, 10);
            tableRows.forEach((row, idx) => {
                row.style.display = idx < value ? '' : 'none';
            });
            // Update info text
            const info = document.querySelector('.table-pagination-info');
            if (info) {
                const showing = Math.min(value, tableRows.length);
                info.textContent = `Displaying 1 - ${showing} of ${tableRows.length} records`;
            }
        });
        // Trigger initial pagination
        paginationSelect.dispatchEvent(new Event('change'));
    }
    // --- Pre-Enrolled Table Filtering ---
    const courseFilter = document.getElementById('courseFilter');
    const searchInput = document.querySelector('input[placeholder="Search..."]');
    function filterTableRows() {
        const selectedCourse = courseFilter ? courseFilter.value : 'All';
        const searchText = searchInput ? searchInput.value.toLowerCase() : '';
        tableRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const id = cells[0].textContent.toLowerCase();
            const name = cells[1].textContent.toLowerCase();
            const course = cells[2].textContent.toLowerCase();
            const section = cells[3].textContent.toLowerCase();
            const status = cells[4].textContent.toLowerCase();
            const matchesCourse = (selectedCourse === 'All' || course === selectedCourse.toLowerCase());
            const matchesSearch = (
                id.includes(searchText) ||
                name.includes(searchText) ||
                course.includes(searchText) ||
                section.includes(searchText) ||
                status.includes(searchText)
            );
            if (matchesCourse && matchesSearch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    if (courseFilter) {
        courseFilter.addEventListener('change', filterTableRows);
    }
    if (searchInput) {
        searchInput.addEventListener('input', filterTableRows);
    }
    // Logout Modal logic
    const logoutBtn = document.querySelector('.dropdown-logout a');
    const logoutYesBtn = document.getElementById('logoutYesBtn');
    const logoutCancelBtn = document.getElementById('logoutCancelBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            hideProfileDropdown();
            showLogoutModal();
        });
    }
    if (logoutYesBtn) {
        logoutYesBtn.addEventListener('click', function () {
            hideLogoutModal();
            // Redirect to sign-in page
            window.location.href = 'login.html';
        });
    }
    if (logoutCancelBtn) {
        logoutCancelBtn.addEventListener('click', hideLogoutModal);
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

    // School Year Dropdown: update year on click
    const schoolYearDropdown = document.getElementById('schoolYearDropdown');
    if (schoolYearDropdown && schoolYearBtn) {
        schoolYearDropdown.querySelectorAll('.dropdown-year').forEach(yearItem => {
            yearItem.addEventListener('click', function () {
                schoolYearBtn.querySelector('span').textContent = this.textContent;
                schoolYearDropdown.classList.remove('show');
            });
        });
    }
    // VIEW BUTTON FUNCTIONALITY for all pages
    document.querySelectorAll('.action-btn[title="View"]').forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            if (!row) return;
            const cells = row.querySelectorAll('td');
            if (!cells.length) return;

            // Store the current row being viewed
            currentViewRow = row;

            // Fill modal fields with row data  
            const viewModal = document.getElementById('viewModal');
            if (!viewModal) return;
            const set = (selector, value) => {
                const el = viewModal.querySelector(selector);
                if (el) el.textContent = value;
            };
            set('[data-field="course"]', cells[2] ? cells[2].textContent : '');
            set('[data-field="year"]', '1st Year'); // Example static
            set('[data-field="semester"]', '1st Sem'); // Example static
            set('[data-field="schoolYear"]', '2025 - 2026'); // Example static
            set('[data-field="status"]', cells[4] ? cells[4].textContent : '');
            set('[data-field="fullname"]', cells[1] ? cells[1].textContent : '');
            set('[data-field="gender"]', 'Male'); // Example static
            set('[data-field="birthday"]', '2000-01-01'); // Example static
            set('[data-field="birthplace"]', 'Sample City'); // Example static
            set('[data-field="civilStatus"]', 'Single'); // Example static
            set('[data-field="religion"]', 'Catholic'); // Example static
            set('[data-field="nationality"]', 'Filipino'); // Example static
            viewModal.style.display = 'flex';
        });
    });
    const viewCloseBtn = document.getElementById('viewCloseBtn');
    if (viewCloseBtn) {
        viewCloseBtn.addEventListener('click', function () {
            const viewModal = document.getElementById('viewModal');
            if (viewModal) viewModal.style.display = 'none';
            currentViewRow = null; // Clear the current row when closing
        });
    }

    // Close view modal when clicking outside
    const viewModal = document.getElementById('viewModal');
    if (viewModal) {
        viewModal.addEventListener('click', function (e) {
            if (e.target === viewModal) {
                viewModal.style.display = 'none';
                currentViewRow = null;
            }
        });
    }
});

function hideProfileDropdown() {
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileDropdown) profileDropdown.classList.remove('show');
}


// === NOTIFICATION POPUP ===
function showNotification(message) {
    const modal = document.getElementById('notificationModal');
    const msg = document.getElementById('notificationMessage');
    const viewModal = document.getElementById('viewModal');

    // Hide the view modal before showing notification
    if (viewModal) {
        viewModal.style.display = 'none';
    }

    // Only proceed if notification elements exist
    if (modal && msg) {
        msg.textContent = message;
        modal.classList.add('show');
    } else {
        // Fallback to alert if notification modal doesn't exist
        alert(message);
    }
}

// Close notification popup
const notificationCloseBtn = document.getElementById('notificationCloseBtn');
if (notificationCloseBtn) {
    notificationCloseBtn.addEventListener('click', () => {
        const notificationModal = document.getElementById('notificationModal');
        if (notificationModal) {
            notificationModal.classList.remove('show');
        }
    });
}

// Event listeners for the buttons inside View Modal
document.addEventListener('DOMContentLoaded', function () {
    // --- View Modal Action Buttons ---
    const viewModal = document.getElementById('viewModal');

    if (viewModal) {
        // Download Form
        const downloadBtn = viewModal.querySelector('.card-download');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function () {
                // Close the view modal first
                viewModal.style.display = 'none';
                // Then show the download confirmation modal
                document.getElementById('viewDownloadConfirmModal').style.display = 'flex';
            });
        }
        // Enroll
        const enrollBtn = viewModal.querySelector('.card-enroll');
        if (enrollBtn) {
            enrollBtn.addEventListener('click', function () {
                // Set modal message for enroll action based on current status
                const modalMessage = document.getElementById('viewPendingModalMessage');
                const statusCell = currentViewRow ? currentViewRow.querySelector('td:nth-child(5)') : null;
                const currentStatus = statusCell ? statusCell.textContent.trim() : '';

                if (modalMessage) {
                    if (currentStatus === 'Rejected') {
                        modalMessage.textContent = 'Do you want to enroll this rejected student?';
                    } else {
                        modalMessage.textContent = 'Do you want to enroll this student?';
                    }
                }
                // Close the view modal first
                viewModal.style.display = 'none';
                // Then show the enroll confirmation modal
                document.getElementById('viewPendingConfirmModal').style.display = 'flex';
            });
        }

        // Pending
        const pendingBtn = viewModal.querySelector('.card-pending');
        if (pendingBtn) {
            pendingBtn.addEventListener('click', function () {
                // Set modal message for pending action
                const modalMessage = document.getElementById('viewPendingModalMessage');
                if (modalMessage) {
                    modalMessage.textContent = 'Do you want to mark this student as Pending?';
                }
                document.getElementById('viewPendingConfirmModal').style.display = 'flex';
            });
        }
        // Reject
        const rejectBtn = viewModal.querySelector('.card-reject');
        if (rejectBtn) {
            rejectBtn.addEventListener('click', function () {
                document.getElementById('viewRejectConfirmModal').style.display = 'flex';
            });
        }
    }

    // --- Confirmation Modal Logic ---
    // Download Confirm
    const viewDownloadConfirmBtn = document.getElementById('viewDownloadConfirmBtn');
    const viewDownloadCancelBtn = document.getElementById('viewDownloadCancelBtn');
    if (viewDownloadConfirmBtn) {
        viewDownloadConfirmBtn.addEventListener('click', function () {
            document.getElementById('viewDownloadConfirmModal').style.display = 'none';
            // Actually download the form
            const info = getStudentInfoFromModal();
            if (info) generatePDF(info);
            showNotification('Download form successful.');
        });
    }
    if (viewDownloadCancelBtn) {
        viewDownloadCancelBtn.addEventListener('click', function () {
            document.getElementById('viewDownloadConfirmModal').style.display = 'none';
            // Reopen the view modal if user cancels
            const viewModal = document.getElementById('viewModal');
            if (viewModal) {
                viewModal.style.display = 'flex';
            }
        });
    }

    // Close download confirmation modal when clicking outside
    const viewDownloadConfirmModal = document.getElementById('viewDownloadConfirmModal');
    if (viewDownloadConfirmModal) {
        viewDownloadConfirmModal.addEventListener('click', function (e) {
            if (e.target === viewDownloadConfirmModal) {
                viewDownloadConfirmModal.style.display = 'none';
                // Reopen the view modal if user clicks outside
                const viewModal = document.getElementById('viewModal');
                if (viewModal) {
                    viewModal.style.display = 'flex';
                }
            }
        });
    }

    // Pending/Enroll Confirm
    const viewPendingConfirmBtn = document.getElementById('viewPendingConfirmBtn');
    const viewPendingCancelBtn = document.getElementById('viewPendingCancelBtn');
    if (viewPendingConfirmBtn) {
        viewPendingConfirmBtn.addEventListener('click', function () {
            document.getElementById('viewPendingConfirmModal').style.display = 'none';

            // Update the table status based on current status
            if (currentViewRow) {
                const statusCell = currentViewRow.querySelector('td:nth-child(5)'); // Status column
                if (statusCell) {
                    const currentStatus = statusCell.textContent.trim();
                    if (currentStatus === 'Pending') {
                        statusCell.textContent = 'Enrolled';
                        showNotification('Student enrolled successfully!');
                    } else if (currentStatus === 'Enrolled') {
                        statusCell.textContent = 'Pending';
                        showNotification('Student marked as Pending.');
                    } else if (currentStatus === 'Rejected') {
                        statusCell.textContent = 'Enrolled';
                        showNotification('Student enrolled successfully!');
                    }
                }
            }

            // Close the view modal
            const viewModal = document.getElementById('viewModal');
            if (viewModal) {
                viewModal.style.display = 'none';
            }
        });
    }
    if (viewPendingCancelBtn) {
        viewPendingCancelBtn.addEventListener('click', function () {
            document.getElementById('viewPendingConfirmModal').style.display = 'none';
            // Reopen the view modal if it was closed (from enroll action)
            const viewModal = document.getElementById('viewModal');
            if (viewModal && viewModal.style.display === 'none') {
                viewModal.style.display = 'flex';
            }
        });
    }

    // Close pending/enroll confirmation modal when clicking outside
    const viewPendingConfirmModal = document.getElementById('viewPendingConfirmModal');
    if (viewPendingConfirmModal) {
        viewPendingConfirmModal.addEventListener('click', function (e) {
            if (e.target === viewPendingConfirmModal) {
                viewPendingConfirmModal.style.display = 'none';
                // Reopen the view modal if it was closed (from enroll action)
                const viewModal = document.getElementById('viewModal');
                if (viewModal && viewModal.style.display === 'none') {
                    viewModal.style.display = 'flex';
                }
            }
        });
    }

    // Reject Confirm
    const viewRejectConfirmBtn = document.getElementById('viewRejectConfirmBtn');
    const viewRejectCancelBtn = document.getElementById('viewRejectCancelBtn');
    if (viewRejectConfirmBtn) {
        viewRejectConfirmBtn.addEventListener('click', function () {
            document.getElementById('viewRejectConfirmModal').style.display = 'none';

            // Update the table status to "Rejected"
            if (currentViewRow) {
                const statusCell = currentViewRow.querySelector('td:nth-child(5)'); // Status column
                if (statusCell) {
                    statusCell.textContent = 'Rejected';
                    showNotification('Student has been rejected.');
                }
            }

            // Close the view modal
            const viewModal = document.getElementById('viewModal');
            if (viewModal) {
                viewModal.style.display = 'none';
            }
        });
    }
    if (viewRejectCancelBtn) {
        viewRejectCancelBtn.addEventListener('click', function () {
            document.getElementById('viewRejectConfirmModal').style.display = 'none';
        });
    }

    // Close reject confirmation modal when clicking outside
    const viewRejectConfirmModal = document.getElementById('viewRejectConfirmModal');
    if (viewRejectConfirmModal) {
        viewRejectConfirmModal.addEventListener('click', function (e) {
            if (e.target === viewRejectConfirmModal) {
                viewRejectConfirmModal.style.display = 'none';
            }
        });
    }
});

// PDF Download for Download Form buttons
function generatePDF(studentInfo) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set page dimensions and margins
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // School colors (matching website)
    const primaryColor = [45, 130, 241]; // #2d82f1 (blue)
    const secondaryColor = [247, 236, 93]; // #f7ec5d (yellow)
    const darkColor = [35, 36, 58]; // #23243a (dark)
    const lightGray = [245, 246, 250]; // #f5f6fa

    // Header with school colors
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // School name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('National College of Science and Technology', pageWidth / 2, 25, { align: 'center' });

    // Subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Pre-Enrollment Form', pageWidth / 2, 35, { align: 'center' });

    // Content area
    let y = 60;

    // Form title with accent
    doc.setFillColor(...secondaryColor);
    doc.rect(margin, y - 5, contentWidth, 15, 'F');
    doc.setTextColor(...darkColor);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('STUDENT INFORMATION', pageWidth / 2, y + 5, { align: 'center' });

    y += 25;

    // Student details section
    const details = [
        { label: 'Student ID', value: studentInfo['Student ID'] || 'N/A' },
        { label: 'Full Name', value: studentInfo['Fullname'] || 'N/A' },
        { label: 'Course', value: studentInfo['Course'] || 'N/A' },
        { label: 'Section', value: studentInfo['Section'] || 'N/A' },
        { label: 'Year Level', value: studentInfo['Year Level'] || 'N/A' },
        { label: 'Semester', value: studentInfo['Semester'] || 'N/A' },
        { label: 'School Year', value: studentInfo['School Year'] || 'N/A' },
        { label: 'Status', value: studentInfo['Status'] || 'N/A' }
    ];

    // styled table for student details
    const tableTop = y;
    const rowHeight = 12;
    const labelWidth = 60;
    const valueWidth = contentWidth - labelWidth;

    details.forEach((detail, index) => {
        const rowY = tableTop + (index * rowHeight);

        // Row background (alternating)
        if (index % 2 === 0) {
            doc.setFillColor(...lightGray);
            doc.rect(margin, rowY - 2, contentWidth, rowHeight, 'F');
        }

        // Label
        doc.setTextColor(...darkColor);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(detail.label + ':', margin + 5, rowY + 3);

        // Value
        doc.setTextColor(70, 70, 70);
        doc.setFont('helvetica', 'normal');
        doc.text(detail.value, margin + labelWidth + 5, rowY + 3);

        // Border
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, rowY + rowHeight - 2, margin + contentWidth, rowY + rowHeight - 2);
    });

    y = tableTop + (details.length * rowHeight) + 20;

    // Academic Information section
    doc.setFillColor(...secondaryColor);
    doc.rect(margin, y - 5, contentWidth, 15, 'F');
    doc.setTextColor(...darkColor);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('ACADEMIC INFORMATION', pageWidth / 2, y + 5, { align: 'center' });

    y += 25;

    // Sample subjects table
    const subjects = [
        { code: 'FL 101', title: 'FILIPINO 1', units: '3', prerequisite: '—' },
        { code: 'ENG 101', title: 'ENGLISH 1', units: '3', prerequisite: '—' },
        { code: 'CS 101', title: 'INTRO TO COMPUTING', units: '3', prerequisite: '—' },
        { code: 'MATH 101', title: 'MATHEMATICS', units: '3', prerequisite: '—' }
    ];

    // Subjects table header
    const subjectTableTop = y;
    const subjectRowHeight = 10;
    const colWidths = [25, 80, 20, 35];
    let colX = margin;

    // Header background
    doc.setFillColor(...primaryColor);
    doc.rect(margin, subjectTableTop - 2, contentWidth, subjectRowHeight, 'F');

    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('CODE', colX + 5, subjectTableTop + 3);
    colX += colWidths[0];
    doc.text('SUBJECT TITLE', colX + 5, subjectTableTop + 3);
    colX += colWidths[1];
    doc.text('UNITS', colX + 5, subjectTableTop + 3);
    colX += colWidths[2];
    doc.text('PRE-REQUISITE', colX + 5, subjectTableTop + 3);

    // Subjects data
    subjects.forEach((subject, index) => {
        const rowY = subjectTableTop + ((index + 1) * subjectRowHeight);
        colX = margin;

        // Row background
        if (index % 2 === 0) {
            doc.setFillColor(...lightGray);
            doc.rect(margin, rowY - 2, contentWidth, subjectRowHeight, 'F');
        }

        // Subject data
        doc.setTextColor(70, 70, 70);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(subject.code, colX + 5, rowY + 3);
        colX += colWidths[0];
        doc.text(subject.title, colX + 5, rowY + 3);
        colX += colWidths[1];
        doc.text(subject.units, colX + 5, rowY + 3);
        colX += colWidths[2];
        doc.text(subject.prerequisite, colX + 5, rowY + 3);

        // Border
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, rowY + subjectRowHeight - 2, margin + contentWidth, rowY + subjectRowHeight - 2);
    });

    y = subjectTableTop + ((subjects.length + 1) * subjectRowHeight) + 20;

    // Footer
    doc.setFillColor(...darkColor);
    doc.rect(0, pageHeight - 30, pageWidth, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated on: ' + new Date().toLocaleDateString(), margin, pageHeight - 15);
    doc.text('NCST Enrollment System', pageWidth - margin, pageHeight - 15, { align: 'right' });

    // Save the PDF
    const fileName = `${studentInfo['Student ID'] || 'student'}_enrollment_form.pdf`;
    doc.save(fileName);
}
function getStudentInfoFromModal() {
    const modal = document.getElementById('viewModal');
    if (!modal) return null;
    return {
        'Student ID': '', // Not shown in modal, can be added if needed
        'Fullname': modal.querySelector('[data-field="fullname"]').textContent,
        'Course': modal.querySelector('[data-field="course"]').textContent,
        'Year Level': modal.querySelector('[data-field="year"]').textContent,
        'Semester': modal.querySelector('[data-field="semester"]').textContent,
        'School Year': modal.querySelector('[data-field="schoolYear"]').textContent,
        'Status': modal.querySelector('[data-field="status"]').textContent,
    };
}
function getStudentInfoFromRow(row) {
    const cells = row.querySelectorAll('td');
    return {
        'Student ID': cells[0] ? cells[0].textContent : '',
        'Fullname': cells[1] ? cells[1].textContent : '',
        'Course': cells[2] ? cells[2].textContent : '',
        'Section': cells[3] ? cells[3].textContent : '',
        'Status': cells[4] ? cells[4].textContent : '',
    };
}
// Download Form in modal
const downloadButtons = document.querySelectorAll('.modal-actions .download');
if (downloadButtons.length > 0) {
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const info = getStudentInfoFromModal();
            if (info) generatePDF(info);
        });
    });
}

// ===== Schedule Maintenance Modal Logic =====
document.addEventListener('DOMContentLoaded', function () {
    // Open modal
    const openBtn = document.getElementById('openScheduleModalBtn');
    const modal = document.getElementById('scheduleModal');
    const closeBtn = document.getElementById('closeScheduleModal');
    if (openBtn && modal && closeBtn) {
        openBtn.addEventListener('click', function () {
            modal.classList.add('show');
        });
        closeBtn.addEventListener('click', function () {
            modal.classList.remove('show');
        });
        // Close modal on overlay click (optional)
        modal.addEventListener('click', function (e) {
            if (e.target === modal) modal.classList.remove('show');
        });
    }
    // Enable/disable time inputs based on checkbox
    const scheduleCheckboxes = document.querySelectorAll('.schedule-day-row input[type="checkbox"]');
    if (scheduleCheckboxes.length > 0) {
        scheduleCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const row = this.closest('.schedule-day-row');
                if (row) {
                    row.querySelectorAll('input[type="time"]').forEach(input => {
                        input.disabled = !this.checked;
                    });
                }
            });
        });
    }
});


