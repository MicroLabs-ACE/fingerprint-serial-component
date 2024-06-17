void setup() {
  Serial.begin(9600);
}

void loop() {
  while (Serial.available() > 0) {
    byte inputData = Serial.read();
    for (int i = 1; i <= 5; i++) {
      byte outputData = inputData + i;
      Serial.write(outputData);
    }
  }
}