// Utility: Show modal notification
function showModalNotification(message, type = 'info') {
    let modal = document.getElementById('modalNotification');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalNotification';
        modal.setAttribute('role', 'alert');
        modal.setAttribute('aria-live', 'assertive');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.background = '#fff';
        modal.style.color = '#222';
        modal.style.padding = '32px 40px';
        modal.style.borderRadius = '18px';
        modal.style.boxShadow = '0 8px 32px rgba(60,72,88,0.18)';
        modal.style.zIndex = '9999';
        modal.style.fontSize = '1.15rem';
        modal.style.textAlign = 'center';
        modal.style.minWidth = '220px';
        modal.style.maxWidth = '90vw';
        modal.style.display = 'none';
        modal.style.cursor = 'pointer';
        document.body.appendChild(modal);
        modal.addEventListener('click', () => { modal.style.display = 'none'; });
    }
    modal.textContent = message;
    modal.style.display = 'block';
    if (type === 'success') modal.style.background = '#e6ffe6';
    else if (type === 'error') modal.style.background = '#ffe6e6';
    else if (type === 'loading') modal.style.background = '#e6f0ff';
    else modal.style.background = '#fff';
    setTimeout(() => { modal.style.display = 'none'; }, 2000);
}

function isValidEmail(email) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function disableButton(btn, state) {
    if (!btn) return;
    btn.disabled = state;
    btn.style.opacity = state ? '0.6' : '1';
    btn.style.pointerEvents = state ? 'none' : 'auto';
}

// Login Form
(function handleLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    const btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = form.email.value.trim();
        const password = form.password.value;
        if (!isValidEmail(email)) {
            showModalNotification('Please enter a valid email.', 'error');
            return;
        }
        if (password.length < 6) {
            showModalNotification('Password must be at least 6 characters.', 'error');
            return;
        }
        disableButton(btn, true);
        showModalNotification('Logging in...', 'loading');
        setTimeout(() => {
            showModalNotification('Login successful! (Demo)', 'success');
            disableButton(btn, false);
        }, 1200);
    });
})();

// Signup Form
(function handleSignupForm() {
    const form = document.getElementById('signupForm');
    if (!form) return;
    const btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const lastname = form.lastname.value.trim();
        const firstname = form.firstname.value.trim();
        const middlename = form.middlename ? form.middlename.value.trim() : '';
        const email = form.email.value.trim();
        const password = form.password.value;
        const confirm = form.confirm_password.value;
        // Name validation: only allow letters and spaces
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!lastname || !firstname) {
            showModalNotification('Please fill in all required fields.', 'error');
            return;
        }
        if (!nameRegex.test(lastname)) {
            showModalNotification('Lastname must only contain letters and spaces.', 'error');
            return;
        }
        if (!nameRegex.test(firstname)) {
            showModalNotification('Firstname must only contain letters and spaces.', 'error');
            return;
        }
        if (middlename && !nameRegex.test(middlename)) {
            showModalNotification('Middlename must only contain letters and spaces.', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            showModalNotification('Please enter a valid email.', 'error');
            return;
        }
        if (password.length < 6) {
            showModalNotification('Password must be at least 6 characters.', 'error');
            return;
        }
        if (password !== confirm) {
            showModalNotification('Passwords do not match.', 'error');
            return;
        }
        disableButton(btn, true);
        showModalNotification('Registering...', 'loading');
        setTimeout(() => {
            showModalNotification('Registration submitted! (Demo)', 'success');
            disableButton(btn, false);
        }, 1200);
    });
})();

// Forgot Password Form
(function handleForgotForm() {
    const form = document.getElementById('forgotForm');
    if (!form) return;
    const btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = form.email.value.trim();
        if (!isValidEmail(email)) {
            showModalNotification('Please enter a valid email.', 'error');
            return;
        }
        disableButton(btn, true);
        showModalNotification('Requesting password reset...', 'loading');
        setTimeout(() => {
            showModalNotification('Password reset request sent! (Demo)', 'success');
            disableButton(btn, false);
        }, 1200);
    });
})();
