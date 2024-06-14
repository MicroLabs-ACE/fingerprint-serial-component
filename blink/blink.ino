const int bufferSize = 4;
byte buffer[bufferSize];
int index = 0;
int wait = 1000;

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
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
}
