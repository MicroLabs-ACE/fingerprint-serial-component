int waitInt = 1000;

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  if (Serial.available() > 0) {
    String waitStr = Serial.readStringUntil('\n');
    waitInt = waitStr.toInt() * 1000;
  }

  digitalWrite(LED_BUILTIN, HIGH);
  delay(waitInt);
  digitalWrite(LED_BUILTIN, LOW);
  delay(waitInt);
}