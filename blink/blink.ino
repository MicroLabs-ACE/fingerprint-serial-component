const int bufferSize = 4;
byte buffer[bufferSize];
int index = 0;
int wait = 1000;
byte output[] = {
  0x00,
  0x01,
  0x02,
  0x03,
  0x04,
  0x05,
  0x06,
  0x07,
  0x08,
  0x09,
  0x0A,
  0x0B,
  0x0C,
  0x0D,
  0x0E,
  0x0F,
};
int outputIndex = 0;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  while (Serial.available() > 0) {
    byte receivedByte = Serial.read();
    if (index < bufferSize - 1) buffer[index++] = receivedByte;
    if (receivedByte == '\n') {
      buffer[index] = '\0';
      processData(buffer, index);
      index = 0;
    }
  }

  digitalWrite(LED_BUILTIN, HIGH);
  delay(wait);
  digitalWrite(LED_BUILTIN, LOW);
  delay(wait);
}

void processData(byte* data, int length) {
  String result = "";
  for (int i = 0; i < length; i++) result += (char)data[i];
  wait = result.toInt() * 1000;
  Serial.println(output[outputIndex]);
  outputIndex++;
}
