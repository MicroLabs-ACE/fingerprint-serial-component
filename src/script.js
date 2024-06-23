import { Commands } from "./commands.js";

const BUFFER_SIZE = 12;

let port;

// Document
document.getElementById("connect").addEventListener("click", async () => {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 57600, bufferSize: BUFFER_SIZE });
    document.getElementById("status").textContent = "Connected to serial port!";
  } catch (error) {
    document.getElementById("status").textContent = `Error: ${error}`;
  }
});

document.getElementById("writeGRC").addEventListener("click", async () => {
  await writeToSerial(Commands.GET_RANDOM_CODE);
});

document.getElementById("readGRC").addEventListener("click", async () => {
  await readFromSerial();
});

// document
//   .getElementById("generateRandomCode")
//   .addEventListener("click", async () => {
//     await generateRandomCode();
//   });

// document
//   .getElementById("captureFingerprint")
//   .addEventListener("click", async () => {
//     await captureFingerprint();
//   });

// document
//   .getElementById("generateCharacterFile")
//   .addEventListener("click", async () => {
//     await generateCharacterFile();
//   });

// document
//   .getElementById("verifyFingerprint")
//   .addEventListener("click", async () => {
//     await verifyFingerprint();
//   });

// Functions
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
  async function readIntoBuffer(reader, buffer) {
    let offset = 0;
    while (offset < buffer.byteLength) {
      const { value, done } = await reader.read(new Uint8Array(buffer, offset));
      if (done) break;
      buffer = value.buffer;
      offset += value.byteLength;
    }

    return buffer;
  }

  const reader = port.readable.getReader({ mode: "byob" });
  let buffer = new ArrayBuffer(BUFFER_SIZE);
  buffer = await readIntoBuffer(reader, buffer);
  console.log(buffer);
}

// async function readFromSerial() {
//   const reader = port.readable.getReader();
//   try {
//     const { value, done } = await reader.read();
//     console.log("Got here.");
//     console.log(`Received: ${value}`);
//     reader.releaseLock();
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function generateRandomCode() {
//   await writeToSerial(Commands.GET_RANDOM_CODE);
//   await readFromSerial();
// }

// async function captureFingerprint() {
//   await writeToSerial(Commands.GEN_IMG);
//   await readFromSerial();

//   const confirmationCode = result.slice(9, 10);
//   switch (confirmationCode) {
//     case 0: // fingerprint collection success
//       console.log("Captured fingerprint.");
//       return true;
//     case 1: // error receiving package
//       console.log("Error when receiving package.");
//       return false;
//     case 2: // can't detect finger
//       console.log("No fingerprint detected.");
//       return false;
//     case 3: // failed to collect finger
//       console.log("Error when capturing fingerprint.");
//       return false;
//     default:
//       console.log("Unknown error.");
//       return false;
//   }
// }

// async function generateCharacterFile() {
//   await writeToSerial(Commands.GEN_CHAR);
//   await readFromSerial();

//   const confirmationCode = result.slice(9, 10);
//   switch (confirmationCode) {
//     case 0: // generate character file success
//       console.log("Generated character file.");
//       return true;
//     case 1: // error receiving package
//     case 6: // failed to generate character file due to disorderly fingerprint image
//     case 7: // failed to generate character file due to lack of character in fingerprint image
//     case 21: // failed to generate character file due to invalid primary image
//     default:
//       console.log("Error when generating character file.");
//       return false;
//   }
// }

// async function searchFingerprint() {
//   await writeToSerial(Commands.SEARCH);
//   await readFromSerial();

//   const confirmationCode = result.slice(9, 10);
//   switch (confirmationCode) {
//     case 0: // found matching fingerprint
//       const pageIDArray = result.slice(10, 12);
//       const pageID = pageIDArray[0] * 256 + pageIDArray[1];
//       return pageID;
//     case 9: // no fingerprint matched
//       return -1;
//     case 1: // error receiving package
//     default:
//       return -2;
//   }
// }

// async function verifyFingerprint() {
//   const isCaptureFingerprint = await captureFingerprint();
//   if (isCaptureFingerprint) {
//     const isGenerateCharacterFile = await generateCharacterFile();
//     if (isGenerateCharacterFile) {
//       const searchFingerprintResult = await searchFingerprint();
//       switch (searchFingerprint) {
//         case -2:
//           console.log("Error receiving package.");
//           break;
//         case -1:
//           console.log("Fingerprint not matched.");
//           break;
//         default:
//           console.log(`ID: ${searchFingerprintResult}`);
//           break;
//       }
//     }
//   }
// }
