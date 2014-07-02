void setup() {
  Serial1.begin(115200);
  pinMode(11, OUTPUT);
  digitalWrite(11, LOW);
}

void loop() {
  if(!Serial1.available()) return;
  digitalWrite(11, HIGH);
  byte tmp = Serial1.read();
  Serial1.write(tmp);
  digitalWrite(11, LOW);
}
