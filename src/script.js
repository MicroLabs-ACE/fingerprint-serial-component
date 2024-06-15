let port;
let writer;
let reader;
let inputData;
let outputData;

document.getElementById("connect").addEventListener("click", async () => {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    writer = port.writable.getWriter();
    reader = port.readable.getReader();
    document.getElementById("status").textContent = "Connected to serial port!";
  } catch (error) {
    document.getElementById("status").textContent = `Error: ${error}`;
  }
});

document.getElementById("sendData").addEventListener("click", async () => {
  try {
    inputData = [0xef, 10];
    await writeToSerial(inputData);
    readFromSerial();
    console.log(outputData);
    document.getElementById("status").textContent = `Sent: ${inputData}`;
  } catch (error) {
    document.getElementById("status").textContent = `Error: ${error}`;
  }
});

async function writeToSerial(inputData) {
  const data = new Uint8Array(inputData);
  await writer.write(data);
}

async function readFromSerial() {
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      reader.releaseLock();
      break;
    }
    outputData = value;
  }
}
