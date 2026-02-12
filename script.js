// Login Section
document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginButton = document.getElementById('loginButton') || document.querySelector('button');
    const form = document.getElementById('loginForm') || emailInput?.closest('form');

    let errorEl = document.getElementById('errorMessage');
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.id = 'errorMessage';
        errorEl.setAttribute('role', 'alert');
        errorEl.style.color = 'red';
        errorEl.style.marginTop = '0.5rem';
        if (form && form.parentNode) form.parentNode.insertBefore(errorEl, form.nextSibling);
        else if (loginButton && loginButton.parentNode) loginButton.parentNode.insertBefore(errorEl, loginButton.nextSibling);
        else document.body.appendChild(errorEl);
    }

    function showError(msg) { errorEl.textContent = msg; }
    function clearError() { errorEl.textContent = ''; }
    function validEmail(email) { return /^\S+@\S+\.\S+$/.test(email); }

    function handleAuthEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        clearError();

        const email = (emailInput?.value || '').trim();
        const password = (passwordInput?.value || '').trim();

        if (!email || !password) {
            showError('กรุณากรอกอีเมลและรหัสผ่าน');
            return;
        }
        if (!validEmail(email)) {
            showError('กรุณากรอกอีเมลให้ถูกต้อง');
            return;
        }
        if (password.length < 6) {
            showError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
            return;
        }

        // Try to authenticate against a previously registered user
        const stored = JSON.parse(localStorage.getItem('registeredUser') || 'null');
        if (stored) {
            if (stored.email === email && stored.password === password) {
                const currentUser = { name: stored.name || '', email: stored.email, phone: stored.phone || '' };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                window.location.href = 'home.html';
            } else {
                showError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            }
            return;
        }

        // If no registered user exists, create a simple currentUser record and proceed
        const currentUser = { name: '', email: email, phone: '' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = 'home.html';
    }

    if (form) form.addEventListener('submit', handleAuthEvent);
    if (loginButton) loginButton.addEventListener('click', handleAuthEvent);
});

// register section
document.addEventListener('DOMContentLoaded', function () {
    // detect register page by presence of a register button
    const registerButton = Array.from(document.querySelectorAll('button')).find(b => /สมัคร/i.test(b.textContent || ''));
    if (!registerButton) return;

    const nameInput = document.querySelector('input[type="text"]');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInputs = Array.from(document.querySelectorAll('input[type="password"]'));
    const passwordInput = passwordInputs[0];
    const confirmInput = passwordInputs[1];

    // Inline error container
    let regError = document.getElementById('registerErrorMessage');
    if (!regError) {
        regError = document.createElement('div');
        regError.id = 'registerErrorMessage';
        regError.setAttribute('role', 'alert');
        regError.style.color = 'red';
        regError.style.marginTop = '0.5rem';
        if (registerButton && registerButton.parentNode) registerButton.parentNode.insertBefore(regError, registerButton.nextSibling);
        else document.body.appendChild(regError);
    }

    function showRegError(msg) { regError.textContent = msg; }
    function clearRegError() { regError.textContent = ''; }
    function validEmail(email) { return /^\S+@\S+\.\S+$/.test(email); }

    registerButton.addEventListener('click', function (e) {
        e.preventDefault();
        clearRegError();

        const name = (nameInput?.value || '').trim();
        const email = (emailInput?.value || '').trim();
        const password = (passwordInput?.value || '').trim();
        const confirm = (confirmInput?.value || '').trim();

        if (!name) { showRegError('กรุณากรอกชื่อ'); return; }
        if (!email) { showRegError('กรุณากรอกอีเมล'); return; }
        if (!validEmail(email)) { showRegError('กรุณากรอกอีเมลให้ถูกต้อง'); return; }
        if (!password) { showRegError('กรุณากรอกรหัสผ่าน'); return; }
        if (password.length < 6) { showRegError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'); return; }
        if (password !== confirm) { showRegError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน'); return; }

        // Save registered user to localStorage as an object
        const user = { name: name, email: email, password: password };
        try {
            localStorage.setItem('registeredUser', JSON.stringify(user));
        } catch (err) {
            showRegError('ไม่สามารถบันทึกข้อมูล โปรดลองใหม่');
            return;
        }

        // Also set the current user session
        try {
            localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email, phone: user.phone || '' }));
        } catch (err) {
            // ignore session save errors
        }

        // Optional: show success alert then redirect
        alert('สมัครสมาชิกสำเร็จ');
        window.location.href = 'index.html';
    });
});

// profile section
document.addEventListener('DOMContentLoaded', function () {
    // Detect profile inputs (ids preferred, fall back to common types)
    const nameInput = document.getElementById('profileName') || document.querySelector('input[data-profile="name"]') || document.querySelector('input[type="text"]');
    const emailInput = document.getElementById('profileEmail') || document.querySelector('input[data-profile="email"]') || document.querySelector('input[type="email"]');
    const phoneInput = document.getElementById('profilePhone') || document.querySelector('input[data-profile="phone"]') || document.querySelector('input[type="tel"]');

    if (!nameInput && !emailInput && !phoneInput) return; // not a profile page

    // Find a save button (id preferred)
    const saveButton = document.getElementById('saveProfileButton') || Array.from(document.querySelectorAll('button')).find(b => /บันทึก|save/i.test(b.textContent || ''));

    function loadProfile() {
        const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!current) return;
        if (nameInput) nameInput.value = current.name || '';
        if (emailInput) emailInput.value = current.email || '';
        if (phoneInput) phoneInput.value = current.phone || '';
    }

    function saveProfile() {
        const current = JSON.parse(localStorage.getItem('currentUser') || '{}');
        current.name = nameInput ? nameInput.value.trim() : (current.name || '');
        current.email = emailInput ? emailInput.value.trim() : (current.email || '');
        current.phone = phoneInput ? phoneInput.value.trim() : (current.phone || '');
        localStorage.setItem('currentUser', JSON.stringify(current));

        // Keep registeredUser in sync when present
        const reg = JSON.parse(localStorage.getItem('registeredUser') || 'null');
        if (reg) {
            reg.name = current.name;
            reg.email = current.email;
            reg.phone = current.phone;
            localStorage.setItem('registeredUser', JSON.stringify(reg));
        }

        // Feedback
        try { alert('บันทึกข้อมูลเรียบร้อย'); } catch (e) { /* ignore */ }
    }

    loadProfile();
    if (saveButton) saveButton.addEventListener('click', function (e) { e.preventDefault(); saveProfile(); });
});
