// Schedule page functionality
document.addEventListener('DOMContentLoaded', function () {
    initializeSchedulePage();

    // Logout functionality
    const logoutLink = document.querySelector('.dropdown-logout a');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
});

function initializeSchedulePage() {
    // Initialize course filter
    initializeCourseFilter();

    // Initialize dropdown functionality
    initializeDropdowns();

    // Initialize table interactions
    initializeTableInteractions();
}

// Course Filter functionality
function initializeCourseFilter() {
    const courseFilter = document.getElementById('courseFilter');

    if (courseFilter) {
        courseFilter.addEventListener('change', function () {
            filterScheduleTable(this.value);
        });
    }
}

// Filter the schedule table based on course selection
function filterScheduleTable(selectedCourse) {
    const tableBody = document.querySelector('.schedule-table tbody');
    const rows = tableBody.querySelectorAll('tr');
    let visibleRows = 0;

    rows.forEach(row => {
        const courseCell = row.cells[1]; // Course column is index 1

        if (selectedCourse === 'all' || courseCell.textContent.toLowerCase() === selectedCourse.toLowerCase()) {
            row.style.display = '';
            visibleRows++;
        } else {
            row.style.display = 'none';
        }
    });

    // Update records info
    updateRecordsInfo(visibleRows, rows.length);
}

// Update the records information display
function updateRecordsInfo(visible, total) {
    const recordsInfo = document.querySelector('.records-info span');
    if (recordsInfo) {
        recordsInfo.textContent = `Displaying 1 - ${visible} of ${visible} records`;
    }
}

// Initialize dropdown functionality for profile and other dropdowns
function initializeDropdowns() {
    const userAvatar = document.getElementById('userAvatar');
    const profileDropdown = document.getElementById('profileDropdown');

    if (userAvatar && profileDropdown) {
        userAvatar.addEventListener('click', function (e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!userAvatar.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
    }
}

// Initialize table interactions
function initializeTableInteractions() {
    const table = document.querySelector('.schedule-table');
    if (table) {
        const rows = table.querySelectorAll('tbody .schedule-row');
        rows.forEach(row => {
            // Arrow click handler
            const arrow = row.querySelector('.dropdown-arrow');
            if (arrow) {
                arrow.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const isExpanded = row.classList.contains('expanded');
                    // Always close all rows first
                    document.querySelectorAll('.schedule-row.expanded').forEach(r => {
                        r.classList.remove('expanded');
                        const next = r.nextElementSibling;
                        if (next && next.classList.contains('expand-row')) {
                            next.style.display = 'none';
                        }
                    });
                    // If not expanded, open this one
                    if (!isExpanded) {
                        row.classList.add('expanded');
                        const expandRow = row.nextElementSibling;
                        if (expandRow && expandRow.classList.contains('expand-row')) {
                            expandRow.style.display = '';
                        }
                    }
                    // If already expanded, do nothing (all rows are now closed)
                });
            }
            // Row click (optional: select row)
            row.addEventListener('click', function () {
                rows.forEach(r => r.classList.remove('active-row'));
                this.classList.add('active-row');
                handleRowClick(this);
            });
        });
    }
}

// Handle row click events
function handleRowClick(row) {
    const section = row.cells[0].textContent;
    const course = row.cells[1].textContent;
    const semester = row.cells[2].textContent;
    const yearLevel = row.cells[3].textContent;
    const subjectCount = row.cells[4].textContent;

    console.log('Selected schedule:', {
        section,
        course,
        semester,
        yearLevel,
        subjectCount
    });

    // You can implement additional functionality here
    // such as showing a modal with detailed information
}

// Utility function to add new schedule rows (for future use)
function addScheduleRow(scheduleData) {
    const tableBody = document.querySelector('.schedule-table tbody');

    if (tableBody && scheduleData) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${scheduleData.section}</td>
            <td>${scheduleData.course}</td>
            <td>${scheduleData.semester}</td>
            <td>${scheduleData.yearLevel}</td>
            <td>${scheduleData.subjectCount}</td>
        `;

        tableBody.appendChild(row);

        // Re-initialize table interactions for new row
        initializeTableInteractions();
    }
}

// Utility function to refresh the schedule table
function refreshScheduleTable() {
    // This function can be used to reload data from server
    // For now, it just resets the filter
    const courseFilter = document.getElementById('courseFilter');
    if (courseFilter) {
        courseFilter.value = 'all';
        filterScheduleTable('all');
    }
}

// Export functions for use in other scripts if needed
window.schedulePageUtils = {
    addScheduleRow,
    refreshScheduleTable,
    filterScheduleTable
};
