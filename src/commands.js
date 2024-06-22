const HEADER_AND_ADDR = [
  0xef, // Header
  0x01, // Header
  0xff, // Address
  0xff, // Address
  0xff, // Address
  0xff, // Address
];

export const Commands = {
  GET_RANDOM_CODE: [
    ...HEADER_AND_ADDR,
    0x01, // Package Identifier
    0x00, // Package Length
    0x03, // Package Length
    0x14, // Instruction Code
  ],

  GEN_IMG: [
    ...HEADER_AND_ADDR,
    0x01, // Package Identifier
    0x00, // Package Length
    0x03, // Package Length
    0x01, // Instruction Code
  ],

  GEN_CHAR: [
    ...HEADER_AND_ADDR,
    0x01, // Package Identifier
    0x00, // Package Length
    0x03, // Package Length
    0x02, // Instruction Code
    0x01, // BufferID
  ],

  SEARCH: [
    ...HEADER_AND_ADDR,
    0x01, // Package Identifier
    0x00, // Package Length
    0x08, // Package Length
    0x04, // Instruction Code
    0x01, // BufferID
    0x00, // Start Page
    0x00, // Start Page
    0x01, // Page Number
    0x2c, // Page Number
  ],
};
