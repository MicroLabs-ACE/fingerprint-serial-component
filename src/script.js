import { Commands } from "./commands.js";

let port;

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
  .getElementById("captureFingerprint")
  .addEventListener("click", async () => {
    try {
      await captureFingerprint();
    } catch (error) {
      document.getElementById("status").textContent = `Error: ${error}`;
    }
  });

document.getElementById("write").addEventListener("click", async () => {
  try {
    await writeToSerial(Commands.GET_RANDOM_CODE);
  } catch (error) {
    document.getElementById("status").textContent = `Error: ${error}`;
  }
});

document.getElementById("read").addEventListener("click", async () => {
  try {
    await readFromSerial();
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
  await writeToSerial(Commands.GET_RANDOM_CODE);
  await delay(3000);
  await readFromSerial();
}
