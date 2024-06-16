let port;

document.getElementById("connect").addEventListener("click", async () => {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    document.getElementById("status").textContent = "Connected to serial port!";
  } catch (error) {
    document.getElementById("status").textContent = `Error: ${error}`;
  }
});

document.getElementById("sendData").addEventListener("click", async () => {
  try {
    await sendData();
  } catch (error) {
    document.getElementById("status").textContent = `Error: ${error}`;
  }
});

async function sendData() {
  const writer = port.writable.getWriter();
  const data = new Uint8Array([100]);
  await writer.write(data);

  while (port.readable) {
    const reader = port.readable.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) console.log(value);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
