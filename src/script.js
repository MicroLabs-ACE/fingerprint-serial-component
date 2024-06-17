let port;
const Commands = {
  GET_RANDOM_CODE: [
    0xef, 0x01, 0xff, 0xff, 0xff, 0xff, 0x01, 0x00, 0x03, 0x14, 0x00, 0x18,
  ],
};

document.getElementById("connect").addEventListener("click", async () => {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 57600 });
    document.getElementById("status").textContent = "Connected to serial port!";
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

async function writeToSerial(command) {
  const writer = port.writable.getWriter();
  const data = new Uint8Array(command);
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
  } catch (error) {
    console.error(error);
  }
}
