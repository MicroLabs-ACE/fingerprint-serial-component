const serialStatus = document.createElement("p");

if ("serial" in navigator) serialStatus.textContent = "Supports serial.";
else serialStatus.textContent = "Does not support serial.";

document.body.appendChild(serialStatus);
