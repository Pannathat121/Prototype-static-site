function calculateBMI() {
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const result = document.getElementById("result");

    if (isNaN(height) || isNaN(weight)) {
        result.textContent = "กรุณาใส่ตัวเลขให้ครบ";
        return;
    }

    if (height <= 0 || weight <= 0) {
        result.textContent = "ค่าต้องมากกว่า 0";
        return;
    }

    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);

    let status = "";

    if (bmi < 18.5) {
        status = "ผอม";
    } else if (bmi < 25) {
        status = "ปกติ";
    } else if (bmi < 30) {
        status = "ท้วม";
    } else {
        status = "อ้วน";
    }

    result.textContent = `BMI = ${bmi.toFixed(2)} (${status})`;
}