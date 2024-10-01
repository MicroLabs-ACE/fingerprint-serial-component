import { Commands } from "./commands.js";

const bufferSize = 16;
const fingerprintDataLength = 27;
let port;

// Event Listeners
document.getElementById("connect").addEventListener("click", async () => {
  try {
    const ports = await navigator.serial.getPorts();
    console.log(ports);
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 57600 });
    console.log("Connected to serial port.");
  } catch (error) {
    console.error(`Error: ${error}`);
  }
});

document
  .getElementById("verifyFingerprint")
  .addEventListener("click", async () => {
    await verifyFingerprint();
  });

document
  .getElementById("uploadToComputer")
  .addEventListener("click", async () => {
    await uploadToComputer();
  });

// Utility functions
function computeChecksum(byteArray) {
  const sum = byteArray.reduce((acc, curr) => acc + curr, 0);
  return [0x00, sum % 63];
}

async function writeToSerial(command) {
  try {
    const checksum = computeChecksum(command);
    const commandAndChecksum = [...command, ...checksum];
    const data = new Uint8Array(commandAndChecksum);

    const writer = port.writable.getWriter();
    await writer.write(data);
    console.log(`Sent: ${data}`);
    writer.releaseLock();
  } catch (error) {
    console.error(`Error writing to serial: ${error}`);
  }
}

async function readFromSerial() {
  try {
    const reader = port.readable.getReader();
    const buffer = new Uint8Array(bufferSize);
    const { value, done } = await reader.read(buffer);
    reader.releaseLock();
    if (done) {
      console.error("Error: End of stream reached.");
      return null;
    }
    return value;
  } catch (error) {
    console.error(`Error reading from serial: ${error}`);
    return null;
  }
}

// Fingerprint operations
async function captureFingerprint() {
  await writeToSerial(Commands.GEN_IMG);
  const result = await readFromSerial();

  const confirmationCode = result[9];
  switch (confirmationCode) {
    case 0:
      console.log("Captured fingerprint.");
      return true;
    case 2:
      console.log("No fingerprint detected.");
      return false;
    case 3:
      console.error("Error capturing fingerprint.");
      return false;
    default:
      console.error(`Unknown error: ${confirmationCode}`);
      return false;
  }
}

async function generateCharacterFile() {
  await writeToSerial(Commands.GEN_CHAR);
  const result = await readFromSerial();

  const confirmationCode = result[9];
  if (confirmationCode === 0) {
    console.log("Generated character file.");
    return true;
  } else {
    console.error(`Error generating character file: ${confirmationCode}`);
    return false;
  }
}

async function searchFingerprint() {
  await writeToSerial(Commands.SEARCH);
  const result = await readFromSerial();

  const confirmationCode = result[9];
  if (confirmationCode === 0) {
    const pageIdArray = result.slice(10, 12);
    return pageIdArray;
  } else if (confirmationCode === 9) {
    console.log("Fingerprint not matched.");
    return -1;
  } else {
    console.error(`Error receiving package: ${confirmationCode}`);
    return -2;
  }
}

async function verifyFingerprint() {
  const isCapturedFingerprint = await captureFingerprint();
  if (isCapturedFingerprint) {
    const isGeneratedCharacterFile = await generateCharacterFile();
    if (isGeneratedCharacterFile) {
      const searchFingerprintResult = await searchFingerprint();
      switch (searchFingerprintResult) {
        case -2:
          console.error("Error receiving package.");
          return false;
        case -1:
          console.log("Fingerprint not matched.");
          return false;
        default:
          console.log(`ID: ${searchFingerprintResult}`);
          return searchFingerprintResult;
      }
    }
  }
}

async function readFingerprintTemplate(pageIdArray) {
  console.log("Command Page ID Array:", Commands.LOAD_CHAR(pageIdArray));
  await writeToSerial(Commands.LOAD_CHAR(pageIdArray));
  const result = await readFromSerial();
  console.log(result);

  const confirmationCode = result[9];
  if (confirmationCode === 0) {
    console.log("Loaded fingerprint to buffer.");
    return true;
  } else {
    console.error(`Error loading fingerprint: ${confirmationCode}`);
    return false;
  }
}

async function uploadCharacterFile() {
  await writeToSerial(Commands.UP_CHAR);
  const result = await readFromSerial();
  console.log("UpChar Acknowledgement:", result);

  const confirmationCode = result[9];
  if (confirmationCode === 0) {
    let fingerprintData = [];
    for (let i = 0; i < fingerprintDataLength; i++) {
      const data = await readFromSerial();
      fingerprintData.push(...data);
    }

    console.log(`Transferred fingerprint data: ${fingerprintData}`);
    return fingerprintData;
  } else {
    console.error(`Error uploading fingerprint file: ${confirmationCode}`);
    return false;
  }
}

async function uploadToComputer() {
  const result = await verifyFingerprint();
  if (result) {
    const isRead = await readFingerprintTemplate(result);
    if (isRead) {
      const fingerprintData = await uploadCharacterFile();
      return fingerprintData;
    }
  } else {
    console.error("Fingerprint verification failed.");
  }
}

// async function emptyFingerprintLibrary() {
//   await writeToSerial(Commands.EMPTY);
//   const result = await readFromSerial();

//   const confirmationCode = result[9];
//   switch (confirmationCode) {
//     case 0:
//       console.log("Emptied fingerprint library.");
//       return true;
//     default:
//       console.error("Error in emptying fingerprint library.");
//       return false;
//   }
// }
