// Profile Page JavaScript

// Real-time validation for profile form fields
// Helper validation functions
function isNameValid(value) {
    // Only letters, spaces, hyphens, apostrophes allowed, at least 2 chars
    return /^[A-Za-z\s'-]{1,}$/.test(value.trim());
}

function isEmailValid(value) {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isPhoneValid(value) {
    // Digits, spaces, dashes, parentheses, plus, at least 7 digits
    return /^[0-9\s\-()+]{7,}$/.test(value.trim());
}

function isRequiredText(value) {
    return value.trim().length > 0;
}

function isDateValid(value) {
    // Must be a valid date and not empty
    return Boolean(Date.parse(value));
}

function isYearValid(value, min, max) {
    const year = parseInt(value, 10);
    return !isNaN(year) && year >= min && year <= max;
}

function isZipCodeValid(value) {
    // Exactly 4 digit zip code
    return /^\d{4}$/.test(value.trim());
}

function isStreetValid(value) {
    // Letters, numbers, spaces, hyphens, apostrophes only, at least 2 chars
    return /^[A-Za-z0-9\s'-]{2,}$/.test(value.trim());
}

function isPasswordValid(value) {
    // At least 6 characters (customize as needed)
    return value.length >= 6;
}

function isSelectValid(value) {
    return value !== '' && value !== undefined && value !== null;
}

// Map input IDs to their validators
const validators = {
    // Basic Info
    lastname: isNameValid,
    firstname: isNameValid,
    middlename: value => value === '' || isNameValid(value), // optional
    gender: isSelectValid,
    'civil-status': isSelectValid,
    religion: value => value === '' || isNameValid(value), // optional
    nationality: isNameValid,
    birthday: isDateValid,
    birthplace: isNameValid,
    // Credential
    email: isEmailValid,
    password: isPasswordValid,
    // Address
    street: isStreetValid,
    city: isNameValid,
    province: isNameValid,
    zipcode: isZipCodeValid,
    phone: isPhoneValid,
    // Guardian
    'guardian-name': isNameValid,
    'guardian-relation': isSelectValid,
    'guardian-phone': isPhoneValid,
    // Education
    'elementary-school': isRequiredText,
    'elementary-school-year': value => isYearValid(value, 1990, 2030),
    'high-school': isRequiredText,
    'high-school-year': value => isYearValid(value, 1990, 2030),
    'previous-college': value => value === '' || isRequiredText(value), // optional
    'previous-course': value => value === '' || isRequiredText(value), // optional
};

// Add error message divs to all form fields on DOMContentLoaded
function addErrorMessages() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        // Only add if not already present
        if (!group.querySelector('.error-message')) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            group.appendChild(errorDiv);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    addErrorMessages();
    // Initialize all functionality
    initializeTabs();
    initializeDropdown();
    initializeFormHandling();
    initializeSaveButton();

    Object.keys(validators).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function () {
                validateAndShowError(input, id);
            });
            // For select fields, also validate on change
            if (input.tagName === 'SELECT') {
                input.addEventListener('change', function () {
                    validateAndShowError(input, id);
                });
            }
        }
    });
});

// Tab Functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Dropdown Functionality
function initializeDropdown() {
    const userAvatar = document.getElementById('userAvatar');
    const profileDropdown = document.getElementById('profileDropdown');
    const logoutLink = document.querySelector('.dropdown-logout a');

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

        // Close dropdown when pressing Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                profileDropdown.classList.remove('show');
            }
        });
    }

    // Logout functionality
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
}

// Form Handling
function initializeFormHandling() {
    const formInputs = document.querySelectorAll('input, select');

    formInputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');
            validateField(this, true); // show error on blur
        });

        // Real-time validation for required fields
        input.addEventListener('input', function () {
            validateField(this, false); // validate as user types, but only show error if already blurred
        });
    });
}

// Field Validation
function validateField(field, showError = false) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    const formGroup = field.closest('.form-group');
    const errorDiv = formGroup ? formGroup.querySelector('.error-message') : null;

    // Remove existing validation classes
    field.classList.remove('valid', 'invalid');

    let isValid = true;
    let errorMsg = '';

    if (isRequired && !value) {
        isValid = false;
        errorMsg = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMsg = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?\d{7,16}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMsg = 'Please enter a valid phone number';
        }
    }

    // Date validation
    if (field.type === 'date' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        if (selectedDate > today) {
            isValid = false;
            errorMsg = 'Birthday cannot be in the future';
        }
    }

    if (isValid && value) {
        field.classList.add('valid');
        if (errorDiv) errorDiv.textContent = '';
    } else {
        field.classList.add('invalid');
        if (showError || field === document.activeElement) {
            if (errorDiv) errorDiv.textContent = errorMsg;
        } else {
            if (errorDiv) errorDiv.textContent = '';
        }
    }
    return isValid;
}

// Save Button Functionality
function initializeSaveButton() {
    const saveButton = document.getElementById('saveChanges');

    if (saveButton) {
        saveButton.addEventListener('click', function () {
            saveProfileData();
        });
    }
}

// Save Profile Data
function saveProfileData() {
    const formData = collectFormData();

    if (validateForm(formData)) {
        // Show loading state
        const saveButton = document.getElementById('saveChanges');
        const originalText = saveButton.innerHTML;
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        saveButton.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Success message
            showNotification('Profile updated successfully!', 'success');

            // Reset button
            saveButton.innerHTML = originalText;
            saveButton.disabled = false;

            // Update sidebar info if needed
            updateSidebarInfo(formData);

        }, 2000);
    } else {
        // Show notification modal for missing input fields
        showNotification('Missing information. Please fill out all required fields.');
    }
}

// Collect form data
function collectFormData() {
    const formData = {};
    const formInputs = document.querySelectorAll('input, select');

    formInputs.forEach(input => {
        if (input.name) {
            formData[input.name] = input.value;
        }
    });

    return formData;
}

// Validate entire form
function validateForm(formData) {
    const requiredFields = document.querySelectorAll('input[required], select[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

// Update sidebar information
function updateSidebarInfo(formData) {
    const studentName = document.querySelector('.student-name');
    const studentEmail = document.querySelector('.student-email');
    const studentCourse = document.querySelector('.student-course');
    const studentSection = document.querySelector('.student-section');
    const studentSemester = document.querySelector('.student-semester');

    if (formData.firstname && formData.lastname) {
        const fullName = `${formData.firstname.toUpperCase()} ${formData.lastname.toUpperCase()}`;
        if (studentName) {
            studentName.textContent = fullName;
        }
    }

    if (formData.email) {
        if (studentEmail) {
            studentEmail.textContent = formData.email;
        }
    }

    // Course, Section, Semester (hanapin sa formData, kung wala, 'n/a')
    if (studentCourse) {
        studentCourse.textContent = formData.course ? formData.course : 'n/a';
    }
    if (studentSection) {
        studentSection.textContent = formData.section ? formData.section : 'n/a';
    }
    if (studentSemester) {
        studentSemester.textContent = formData.semester ? formData.semester : 'n/a';
    }
}


function showNotification(message, type = 'info') {
    const notificationModal = document.getElementById('notificationModal');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationConfirmBtn = document.getElementById('notificationConfirmBtn');
    if (notificationModal && notificationMessage && notificationConfirmBtn) {
        notificationMessage.textContent = message;
        notificationConfirmBtn.textContent = 'OK';
        notificationConfirmBtn.style.background = '#2dc36a';
        notificationModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        // Confirm button closes modal
        notificationConfirmBtn.onclick = hideNotification;
    } else {
        alert(message); // fallback
    }
}

function hideNotification() {
    const notificationModal = document.getElementById('notificationModal');
    const notificationConfirmBtn = document.getElementById('notificationConfirmBtn');
    if (notificationModal) {
        notificationModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (notificationConfirmBtn) {
            notificationConfirmBtn.style.background = '#2dc36a';
            notificationConfirmBtn.textContent = 'OK';
        }
    }
}
// Close modal when clicking outside
window.addEventListener('click', function (e) {
    const notificationModal = document.getElementById('notificationModal');
    if (e.target === notificationModal) {
        hideNotification();
    }
});

// Get notification icon
function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Get notification color
function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#48bb78';
        case 'error': return '#e53e3e';
        case 'warning': return '#ed8936';
        default: return '#4299e1';
    }
}



// Auto-save functionality (optional)
let autoSaveTimeout;
function setupAutoSave() {
    const formInputs = document.querySelectorAll('input, select');

    formInputs.forEach(input => {
        input.addEventListener('input', function () {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                // Auto-save after 3 seconds of inactivity
                const formData = collectFormData();
                if (validateForm(formData)) {
                    console.log('Auto-saving...', formData);
                    // Here you would typically send data to server
                }
            }, 3000);
        });
    });
}

// Initialize auto-save
setupAutoSave();

// Helper to show error messages
function validateAndShowError(input, id) {
    const value = input.value;
    const formGroup = input.closest('.form-group');
    const errorDiv = formGroup ? formGroup.querySelector('.error-message') : null;
    let errorMsg = '';
    const isRequired = input.hasAttribute('required');

    // Only show 'This field is required' if empty and required
    if (isRequired && value.trim() === '') {
        errorMsg = 'This field is required';
    } else if ((id === 'phone' || id === 'guardian-phone') && !/^\d{11}$/.test(value)) {
        errorMsg = 'Please enter a valid 11-digit phone number';
    } else if (!validators[id](value)) {
        // Custom error messages per field
        switch (id) {
            case 'lastname':
            case 'firstname':
            case 'middlename':
            case 'nationality':
            case 'birthplace':
            case 'religion':
            case 'guardian-name':
            case 'elementary-school':
            case 'high-school':
            case 'previous-college':
            case 'previous-course':
                errorMsg = 'Please enter a valid value (letters only)';
                break;
            case 'birthday':
            case 'elementary-school-year':
            case 'high-school-year':
                errorMsg = 'Please enter a valid year';
                break;
            case 'email':
                errorMsg = 'Please enter a valid email address';
                break;
            case 'password':
                errorMsg = 'Password must be at least 6 characters';
                break;
            case 'street':
            case 'city':
            case 'province':
                errorMsg = 'Please enter a valid value (letters and numbers only)';
                break;
            case 'zipcode':
                errorMsg = 'Please enter a valid zip code (numbers only)';
                break;
            default:
                errorMsg = 'Invalid input';
        }
    }
    // Only show one error message at a time
    if ((isRequired && value.trim() === '') || !validators[id](value) || ((id === 'phone' || id === 'guardian-phone') && !/^\d{11}$/.test(value))) {
        input.classList.add('invalid');
        if (errorDiv) errorDiv.textContent = errorMsg;
    } else {
        input.classList.remove('invalid');
        if (errorDiv) errorDiv.textContent = '';
    }
}
