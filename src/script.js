import { Commands } from "./commands.js";

let port;

const CAPTURE_FINGERPRINT_DELAY = 3000;
const GENERATE_CHARACTER_FILE_DELAY = 3000;
const FINGERPRINT_SEARCH_DELAY = 3000;

// Document
document.getElementById("connect").addEventListener("click", async () => {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 57600 });
    document.getElementById("status").textContent = "Connected to serial port!";
  } catch (error) {
    document.getElementById("status").textContent = `Error: ${error}`;
  }
});

document
  .getElementById("verifyFingerprint")
  .addEventListener("click", async () => {
    try {
      await verifyFingerprint();
    } catch (error) {
      document.getElementById("status").textContent = `Error: ${error}`;
    }
  });

// Functions
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function computeChecksum(byteArray) {
  let sum = 0;
  for (let i = 0; i < byteArray.length; i++) sum += byteArray[i];
  return sum % 63;
}

async function writeToSerial(command) {
  const checkSum = await computeChecksum(command);
  const commandAndChecksum = [...command, checkSum];
  const data = new Uint8Array(commandAndChecksum);

  const writer = port.writable.getWriter();
  await writer.write(data);
  console.log(`Sent: ${data}`);
  writer.releaseLock();
}

async function readFromSerial() {
  const reader = port.readable.getReader();
  try {
    const { value, done } = await reader.read();
    reader.releaseLock();
    if (value) console.log(`Received: ${value}`);

    return value;
  } catch (error) {
    console.error(error);
  }
}

async function captureFingerprint() {
  while (true) {
    await writeToSerial(Commands.GEN_IMG);
    await delay(CAPTURE_FINGERPRINT_DELAY);
    const result = await readFromSerial();

    const confirmationCode = result.slice(9, 10);
    switch (confirmationCode) {
      case 0: // fingerprint collection success
        return true;
      case 1: // error receiving package
      case 2: // can't detect finger
      case 3: // failed to collect finger
      default:
        return false;
    }
  }
}

async function generateCharacterFile() {
  await writeToSerial(Commands.GEN_CHAR);
  await delay(GENERATE_CHARACTER_FILE_DELAY);
  const result = await readFromSerial();

  const confirmationCode = result.slice(9, 10);
  switch (confirmationCode) {
    case 0: // generate character file success
      return true;
    case 1: // error receiving package
    case 6: // failed to generate character file due to disorderly fingerprint image
    case 7: // failed to generate character file due to lack of character in fingerprint image
    case 21: // failed to generate character file due to invalid primary image
    default:
      return false;
  }
}

async function searchFingerprint() {
  await writeToSerial(Commands.SEARCH);
  await delay(FINGERPRINT_SEARCH_DELAY);
  const result = await readFromSerial();

  const confirmationCode = result.slice(9, 10);
  switch (confirmationCode) {
    case 0: // found matching fingerprint
      const pageIDArray = result.slice(10, 12);
      const pageID = pageIDArray[0] * 256 + pageIDArray[1];
      return pageID;
    case 9: // no fingerprint matched
      return -1;
    case 1: // error receiving package
    default:
      return -2;
  }
}

async function verifyFingerprint() {
  for (let c = 0; c < 10; c++) {
    console.log(`Count: ${c}`);
    const isCaptureFingerprint = await captureFingerprint();
    if (isCaptureFingerprint) {
      const isGenerateCharacterFile = await generateCharacterFile();
      if (isGenerateCharacterFile) {
        const searchFingerprintResult = await searchFingerprint();
        switch (searchFingerprint) {
          case -2:
            console.log("Error receiving package.");
            break;
          case -1:
            console.log("Fingerprint not matched.");
            break;
          default:
            console.log(searchFingerprintResult);
            break;
        }
      }
    }
  }
}
