const os = require("os");

const { autoDetect } = require("@serialport/bindings-cpp");
const { SerialPort } = require("serialport");

const { Commands } = require("./commands");

// const Binding = autoDetect();
// Binding.list().then((devices) => {
//   devices.forEach((device) => {
//     console.log(device);
//   });
// });

const serialport = new SerialPort(
  { path: "/dev/ttyUSB0", baudRate: 57600 },
  (err) => {
    if (err) return console.error("Error opening port:", err.message);
    console.log(`Port opened.`);
    console.log(`Write: ${writeToSerial(Commands.GET_RANDOM_CODE)}`);
    console.log(`Read: ${readFromSerial()}`);
    serialport.close();
  }
);

function computeChecksum(byteArray) {
  let sum = 0;
  for (let i = 0; i < byteArray.length; i++) sum += byteArray[i];
  return [0x00, sum % 63];
}

function writeToSerial(command) {
  const checksum = computeChecksum(command);
  const commandAndChecksum = [...command, ...checksum];
  console.log(commandAndChecksum.length);
  const inputData = new Uint8Array(commandAndChecksum);
  const result = serialport.write(inputData);

  return result;
}

function readFromSerial() {
  const outputData = serialport.read(12);
  return outputData;
}
