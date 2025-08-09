// Add Section Modal validation and add to table
const addSectionForm = document.getElementById('addSectionForm');
const addCourse = document.getElementById('addCourse');
const addYearLevel = document.getElementById('addYearLevel');
const addSemester = document.getElementById('addSemester');
const addSectionName = document.getElementById('addSectionName');
const addSectionModal = document.getElementById('addSectionModal');
const addSectionCancelBtn = document.getElementById('addSectionCancelBtn');
const sectionTableBody = document.querySelector('.list-table tbody');

function setFieldError(field, message) {
    field.style.border = '1.5px solid #e74c3c';
    let span = field.parentElement.querySelector('span');
    if (span) span.textContent = message;
}
function clearFieldError(field, defaultMsg) {
    field.style.border = '';
    let span = field.parentElement.querySelector('span');
    if (span) span.textContent = defaultMsg;
}

if (addSectionForm && sectionTableBody) {
    addSectionForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent form from reloading the page
        let valid = true;

        // Validate Course
        if (!addCourse.value) {
            setFieldError(addCourse, 'Please select a course');
            valid = false;
        } else {
            clearFieldError(addCourse, 'Please put course');
        }
        // Validate Year Level
        if (!addYearLevel.value) {
            setFieldError(addYearLevel, 'Please select year level');
            valid = false;
        } else {
            clearFieldError(addYearLevel, 'Please put year level');
        }
        // Validate Semester
        if (!addSemester.value) {
            setFieldError(addSemester, 'Please select semester');
            valid = false;
        } else {
            clearFieldError(addSemester, 'Please put semester');
        }
        // Validate Section Name
        const sectionValue = addSectionName.value.trim();
        const sectionRegex = /^[A-Za-z][A-Za-z0-9-]*$/;
        if (!sectionValue) {
            setFieldError(addSectionName, 'Please put section name');
            valid = false;
        } else if (!sectionRegex.test(sectionValue)) {
            setFieldError(
                addSectionName,
                'Section must start with a letter and only contain letters, numbers, and dashes.'
            );
            valid = false;
        } else {
            clearFieldError(addSectionName, 'Please put section name');
        }

        if (!valid) {
            return;
        }

        // Add the new section to the table
        const sectionRow = document.createElement('tr');
        sectionRow.className = 'section-row';
        sectionRow.innerHTML = `
            <td class="expand-arrow-cell"><span class="expand-arrow" style="font-size:1.2em;vertical-align:middle;cursor:pointer;">&#9654;</span> ${addSectionName.value.trim()}</td>
            <td>${addCourse.value}</td>
            <td>${addSemester.value}</td>
            <td>${addYearLevel.value}</td>
            <td></td>
            <td>
                <button class="action-btn" title="Edit">&#9998;</button>
                <button class="action-btn" title="Delete">&#128465;</button>
            </td>
        `;
        const subjectRow = document.createElement('tr');
        subjectRow.className = 'subject-row';
        subjectRow.style.display = 'none';
        subjectRow.innerHTML = `
            <td colspan="6">
                <div class="expanded-subject-area">
                    <div class="subject-title">Subject Schedule</div>
                    <table>
                        <thead>
                            <tr>
                                <th style="text-align:left;">Subject</th>
                                <th>Mo</th>
                                <th>Tu</th>
                                <th>We</th>
                                <th>Th</th>
                                <th>Fr</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>FIL 101</td>
                                <td>12:00 AM - 1:00 AM</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><button class="action-btn" title="Edit">&#9998;</button></td>
                            </tr>
                            <tr>
                                <td>ENG 101</td>
                                <td></td>
                                <td>8:00 AM - 9:00 AM</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><button class="action-btn" title="Edit">&#9998;</button></td>
                            </tr>
                            <tr>
                                <td>CIN III</td>
                                <td></td>
                                <td></td>
                                <td>10:00 AM - 11:00 AM</td>
                                <td></td>
                                <td></td>
                                <td><button class="action-btn" title="Edit">&#9998;</button></td>
                            </tr>
                            <tr>
                                <td>PPE III</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>2:00 PM - 3:00 PM</td>
                                <td></td>
                                <td><button class="action-btn" title="Edit">&#9998;</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </td>
        `;
        sectionTableBody.appendChild(sectionRow);
        sectionTableBody.appendChild(subjectRow);
        // Attach expand/collapse logic to the new section row
        attachSectionRowListeners(sectionRow);
        // Attach edit/delete listeners to the new section row
        attachEditDeleteListeners(sectionRow);
        // Attach subject edit listeners to the new subject row
        attachSubjectEditListeners(subjectRow);
        addSectionModal.classList.remove('show');
        showSuccessModal('Section added successfully!');
        addSectionForm.reset();
    });

    // Reset validation and close modal on cancel
    if (addSectionCancelBtn) {
        addSectionCancelBtn.addEventListener('click', function () {
            [addCourse, addYearLevel, addSemester, addSectionName].forEach((field, i) => {
                clearFieldError(field, [
                    'Please put course',
                    'Please put year level',
                    'Please put semester',
                    'Please put section name'
                ][i]);
            });
            // Close the modal
            addSectionModal.classList.remove('show');
        });
    }
}

// Add this utility to attach expand/collapse logic to a section row
function attachSectionRowListeners(sectionRow) {
    const expandCell = sectionRow.querySelector('.expand-arrow-cell');
    if (expandCell) {
        expandCell.style.cursor = 'pointer';
        expandCell.addEventListener('click', function () {
            const arrow = this.querySelector('.expand-arrow');
            const sectionRow = this.closest('.section-row');
            const subjectRow = sectionRow.nextElementSibling;
            // Close all other subject rows and reset arrows
            document.querySelectorAll('.subject-row').forEach(row => {
                if (row !== subjectRow) {
                    row.style.display = 'none';
                }
            });
            document.querySelectorAll('.expand-arrow').forEach(a => {
                if (a !== arrow) {
                    a.classList.remove('rotated');
                }
            });
            // Toggle the clicked one
            const isOpen = subjectRow.style.display === '' || subjectRow.style.display === 'table-row';
            if (isOpen) {
                subjectRow.style.display = 'none';
                arrow.classList.remove('rotated');
            } else {
                subjectRow.style.display = 'table-row';
                arrow.classList.add('rotated');
            }
        });
    }
}

// Add this function to show success modal
function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const modalMsg = document.getElementById('successModalMsg');
    if (modal && modalMsg) {
        modalMsg.textContent = message;
        modal.classList.add('show');
    }
    const okBtn = document.getElementById('successModalOk');
    if (okBtn) {
        okBtn.onclick = function () {
            modal.classList.remove('show');
        };
    }
}

// --- Section Page Button Logic ---
window.addEventListener('DOMContentLoaded', function () {
    // Attach expand/collapse logic to all static section rows
    document.querySelectorAll('.section-row').forEach(sectionRow => {
        attachSectionRowListeners(sectionRow);
    });

    // New Section Button
    const newSectionBtn = document.getElementById('newSectionBtn');
    if (newSectionBtn && addSectionModal) {
        newSectionBtn.addEventListener('click', function () {
            addSectionModal.classList.add('show');
        });
    }

    // Edit and Delete for static rows
    function attachEditDeleteListeners(sectionRow) {
        const editBtn = sectionRow.querySelector('.action-btn[title="Edit"]');
        const deleteBtn = sectionRow.querySelector('.action-btn[title="Delete"]');
        if (editBtn) {
            editBtn.addEventListener('click', function () {
                // Fill modal with current row data
                const cells = sectionRow.querySelectorAll('td');
                document.getElementById('editSectionName').value = cells[0].innerText.replace(/^[^\w]*|\s*$/g, '');
                document.getElementById('editCourse').value = cells[1].innerText;
                document.getElementById('editSemester').value = cells[2].innerText;
                document.getElementById('editYearLevel').value = cells[3].innerText;
                document.getElementById('editSubjectCount').value = cells[4].innerText;
                document.getElementById('editModal').classList.add('show');
                // Store row for saving
                window._editingSectionRow = sectionRow;
            });
        }
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function () {
                document.getElementById('confirmDeleteModal').classList.add('show');
                window._deletingSectionRow = sectionRow;
            });
        }
    }
    document.querySelectorAll('.section-row').forEach(attachEditDeleteListeners);

    // Edit Modal Save/Cancel
    const editForm = document.getElementById('editForm');
    const editCancelBtn = document.getElementById('editCancelBtn');
    if (editForm) {
        editForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const row = window._editingSectionRow;
            if (row) {
                const cells = row.querySelectorAll('td');
                cells[0].innerHTML = `<span class='expand-arrow' style='font-size:1.2em;vertical-align:middle;cursor:pointer;'>&#9654;</span> ` + document.getElementById('editSectionName').value;
                cells[1].innerText = document.getElementById('editCourse').value;
                cells[2].innerText = document.getElementById('editSemester').value;
                cells[3].innerText = document.getElementById('editYearLevel').value;
                cells[4].innerText = document.getElementById('editSubjectCount').value;
                showSuccessModal('Section updated successfully!');
                document.getElementById('editModal').classList.remove('show');
                attachSectionRowListeners(row); // re-attach expand logic
                attachEditDeleteListeners(row); // re-attach edit/delete
                window._editingSectionRow = null;
            }
        });
    }
    if (editCancelBtn) {
        editCancelBtn.addEventListener('click', function () {
            document.getElementById('editModal').classList.remove('show');
            window._editingSectionRow = null;
        });
    }

    // Delete Modal Yes/Cancel
    const deleteYesBtn = document.getElementById('confirmDeleteYes');
    const deleteCancelBtn = document.getElementById('confirmDeleteCancel');
    if (deleteYesBtn) {
        deleteYesBtn.addEventListener('click', function () {
            const row = window._deletingSectionRow;
            if (row) {
                // Remove both section and subject row
                const subjectRow = row.nextElementSibling;
                row.remove();
                if (subjectRow && subjectRow.classList.contains('subject-row')) subjectRow.remove();
                showSuccessModal('Section deleted successfully!');
                window._deletingSectionRow = null;
            }
            document.getElementById('confirmDeleteModal').classList.remove('show');
        });
    }
    if (deleteCancelBtn) {
        deleteCancelBtn.addEventListener('click', function () {
            document.getElementById('confirmDeleteModal').classList.remove('show');
            window._deletingSectionRow = null;
        });
    }

    // Logout logic
    const logoutBtn = document.querySelector('.dropdown-logout a');
    const logoutYesBtn = document.getElementById('logoutYesBtn');
    const logoutCancelBtn = document.getElementById('logoutCancelBtn');

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

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            profileDropdown.classList.remove('show');
            document.getElementById('logoutModal').classList.add('show');
        });
    }
    if (logoutYesBtn) {
        logoutYesBtn.addEventListener('click', function () {
            document.getElementById('logoutModal').classList.remove('show');
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }
    if (logoutCancelBtn) {
        logoutCancelBtn.addEventListener('click', function () {
            document.getElementById('logoutModal').classList.remove('show');
        });
    }

    // Close logout modal when clicking outside
    const logoutModal = document.getElementById('logoutModal');
    if (logoutModal) {
        logoutModal.addEventListener('click', function (e) {
            if (e.target === logoutModal) {
                logoutModal.classList.remove('show');
            }
        });
    }

    // When a new section is added, attach listeners
    if (addSectionForm) {
        addSectionForm.addEventListener('submit', function () {
            // Wait for DOM update
            setTimeout(function () {
                const rows = document.querySelectorAll('.section-row');
                const lastRow = rows[rows.length - 1];
                attachEditDeleteListeners(lastRow);
            }, 10);
        });
    }
});

// --- Subject Schedule Edit Modal Logic ---
// (No changes needed for static rows, but for dynamic rows, re-attach the event listener)

// Helper to attach subject edit logic to a subject-row
function attachSubjectEditListeners(subjectRow) {
    subjectRow.querySelectorAll('.action-btn[title="Edit"]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const row = btn.closest('tr');
            window._editingSubjectRow = row;
            // Get subject name and times from the row
            const cells = row.querySelectorAll('td');
            const subjectName = cells[0].innerText;
            document.getElementById('scheduleTeacher').value = subjectName + ' Teacher';
            // Reset all days
            document.querySelectorAll('#scheduleForm .modal-form-group').forEach((group, idx) => {
                if (idx === 0) return; // skip teacher
                const checkbox = group.querySelector('.schedule-day');
                const from = group.querySelector('.schedule-from');
                const to = group.querySelector('.schedule-to');
                checkbox.checked = false;
                from.value = '';
                to.value = '';
                from.disabled = true;
                to.disabled = true;
            });
            // Populate days/times from table if present
            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach((day, i) => {
                const cellIdx = i + 1; // skip subject name
                const group = document.querySelectorAll('#scheduleForm .modal-form-group')[i + 1];
                const checkbox = group.querySelector('.schedule-day');
                const from = group.querySelector('.schedule-from');
                const to = group.querySelector('.schedule-to');
                const cell = cells[cellIdx];
                if (cell && cell.innerText.trim()) {
                    checkbox.checked = true;
                    from.disabled = false;
                    to.disabled = false;
                    const match = cell.innerText.match(/(\d{1,2}:\d{2} [AP]M)\s*-\s*(\d{1,2}:\d{2} [AP]M)/);
                    if (match) {
                        from.value = to24(match[1]);
                        to.value = to24(match[2]);
                    } else {
                        from.value = '';
                        to.value = '';
                    }
                }
            });
            document.getElementById('scheduleModal').classList.add('show');
        });
    });
}

// Attach to all static subject-rows on load
window.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.subject-row').forEach(attachSubjectEditListeners);
});

// When a new section is added, also attach to its subject-row
if (addSectionForm) {
    addSectionForm.addEventListener('submit', function () {
        setTimeout(function () {
            const subjectRows = document.querySelectorAll('.subject-row');
            const lastSubjectRow = subjectRows[subjectRows.length - 1];
            attachSubjectEditListeners(lastSubjectRow);
        }, 10);
    });
}

// Enable/disable time inputs based on checkbox
Array.from(document.querySelectorAll('#scheduleForm .schedule-day')).forEach(cb => {
    cb.addEventListener('change', function () {
        const group = this.closest('.modal-form-group');
        group.querySelector('.schedule-from').disabled = !this.checked;
        group.querySelector('.schedule-to').disabled = !this.checked;
    });
});

// Cancel button closes the modal
const scheduleCancelBtn = document.getElementById('scheduleCancelBtn');
if (scheduleCancelBtn) {
    scheduleCancelBtn.addEventListener('click', function () {
        document.getElementById('scheduleModal').classList.remove('show');
        window._editingSubjectRow = null;
    });
}

// Convert 12-hour time to 24-hour format for <input type="time">
function to24(timeStr) {
    if (!timeStr) return '';
    const [time, ampm] = timeStr.split(' ');
    let [h, m] = time.split(':');
    h = parseInt(h, 10);
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${m}`;
}
function to12(timeStr) {
    if (!timeStr) return '';
    let [h, m] = timeStr.split(':');
    h = parseInt(h, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${m} ${ampm}`;
}

// Save changes to subject row
const scheduleForm = document.getElementById('scheduleForm');
if (scheduleForm) {
    scheduleForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const row = window._editingSubjectRow;
        if (row) {
            const cells = row.querySelectorAll('td');
            // Update teacher (not shown in table, but you can store it elsewhere if needed)
            // Update days/times
            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach((day, i) => {
                const group = document.querySelectorAll('#scheduleForm .modal-form-group')[i + 1];
                const checkbox = group.querySelector('.schedule-day');
                const from = group.querySelector('.schedule-from');
                const to = group.querySelector('.schedule-to');
                if (checkbox.checked && from.value && to.value) {
                    cells[i + 1].innerText = `${to12(from.value)} - ${to12(to.value)}`;
                } else {
                    cells[i + 1].innerText = '';
                }
            });
            document.getElementById('scheduleModal').classList.remove('show');
            window._editingSubjectRow = null;
        }
    });
}