const HEADER_AND_ADDR = [
  0xef, // Header
  0x01, // Header
  0xff, // Address
  0xff, // Address
  0xff, // Address
  0xff, // Address
];

export const Commands = {
  GEN_CHAR: [
    ...HEADER_AND_ADDR,
    0x01, // Package Identifier
    0x00, // Package Length
    0x04, // Package Length
    0x02, // Instruction Code
    0x01, // BufferID
  ],

  GEN_IMG: [
    ...HEADER_AND_ADDR,
    0x01, // Package Identifier
    0x00, // Package Length
    0x03, // Package Length
    0x01, // Instruction Code
  ],

  // GET_RANDOM_CODE: [
  //   ...HEADER_AND_ADDR,
  //   0x01, // Package Identifier
  //   0x00, // Package Length
  //   0x03, // Package Length
  //   0x14, // Instruction Code
  // ],

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
    0x2b, // Page Number
  ],
};
