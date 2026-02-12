// Login Section
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginButton = document.querySelector('button');

    loginButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert('กรุณากรอกอีเมลและรหัสผ่าน');
            return;
        }

        if (!email.includes('@')) {
            alert('กรุณากรอกอีเมลให้ถูกต้อง');
            return;
        }

        if (password.length < 6) {
            alert('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
            return;
        }

        console.log('Login attempt:', { email, password });
        window.location.href = 'login.html';
    });
});
