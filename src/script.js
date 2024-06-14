let port;
let writer;
let reader;

document.getElementById("connect").addEventListener("click", async () => {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    writer = port.writable.getWriter();
    reader = port.readable.getReader();

    document.getElementById("status").textContent = "Connected to serial port!";
    readFromSerial();
  } catch (error) {
    document.getElementById("status").textContent = `Error: ${error}`;
  }
});

document.getElementById("sendData").addEventListener("click", async () => {
  const inputData = document.getElementById("inputData").value;
  const data = new TextEncoder().encode(inputData + "\n");
  await writer.write(data);
  document.getElementById("status").textContent = `Sent: ${inputData}`;
});

async function readFromSerial() {
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      reader.releaseLock();
      break;
    }

    const receivedText = new TextDecoder().decode(value);
    document.getElementById("status").textContent = `Received: ${receivedText}`;
  }
}
