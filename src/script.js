const isSupportSerial = document.getElementById("is-support-serial");

if ("serial" in navigator) isSupportSerial.textContent = "Supported";
else isSupportSerial.textContent = "Not Supported";

async function connectSerial() {
  const port = await navigator.serial.requestPort();
}

const fingerprintSerialBtn = document.getElementById("fingerprint-serial");
fingerprintSerialBtn.addEventListener("click", connectSerial);
