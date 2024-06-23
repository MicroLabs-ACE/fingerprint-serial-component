const os = require("os");
const { Buffer } = require("node:buffer");

const { autoDetect } = require("@serialport/bindings-cpp");
const { SerialPort } = require("serialport");

const { Commands } = require("./commands");

// const Binding = autoDetect();
// Binding.list().then((devices) => {
//   devices.forEach((device) => {
//     console.log(device);
//   });
// });

const serialport = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 57600 });
const writeResult = serialport.write(
  Buffer.from(Commands.GET_RANDOM_CODE),
  "hex"
);
serialport.drain();

console.log(writeResult);
