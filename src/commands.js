const HEADER_AND_ADDR = [0xef, 0x01, 0xff, 0xff, 0xff, 0xff];
export const Commands = {
  GET_RANDOM_CODE: [
    ...HEADER_AND_ADDR,
    0x01, // Package Identifier
    0x00, // Package Length
    0x03, // Package Length,
    0x14, // Instruction Code
  ],
};
