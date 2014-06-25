void setup() {
  Serial1.begin(115200);
  Serial1.read();
  pinMode(11, OUTPUT);
}

void loop() {
  if(Serial1.available()) {
    digitalWrite(11, HIGH);
    byte tmp = Serial1.read();
    Serial1.write(tmp);
    delay(500);
    digitalWrite(11, LOW);
    delay(500);
  }
}
