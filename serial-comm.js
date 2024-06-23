const os = require("os");
const { autoDetect } = require("@serialport/bindings-cpp");
const { SerialPort } = require("serialport");

const Binding = autoDetect();
Binding.list().then((devices) => {
  devices.forEach((device) => {
    console.log(device);
  });
});

const serialport = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 57600 });
const GET_RANDOM_CODE = [0xef, 0x01, 0xff, 0xff, 0xff, 0xff, ];
serialport.write({ data: GET_RANDOM_CODE, encoding: "hex" });
