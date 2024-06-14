const isSupportSerial = document.getElementById("is-support-serial");

if ("serial" in navigator) isSupportSerial.textContent = "Supported";
else isSupportSerial.textContent = "Not Supported";

async function connectSerial() {
  try {
    const port = await navigator.serial.requestPort();
  } catch (error) {
    console.log(error);
  }
}

const fingerprintSerialBtn = document.getElementById("fingerprint-serial");
fingerprintSerialBtn.addEventListener("click", connectSerial);
