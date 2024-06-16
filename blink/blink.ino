void setup() {
  Serial.begin(9600);
}

void loop() {
  while (Serial.available() > 0) {
    byte inputData = Serial.read();
    byte outputData = inputData + 1;
    Serial.write(outputData);
  }
}