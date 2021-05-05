#include <Arduino.h>
#include "BluetoothSerial.h"

BluetoothSerial SerialBT;
boolean flag = false;
int pinRed = A19;//26;
int pinBlue = A5;//33;
int pinGreen = A4;//32;

void setup() {
  //pinMode(21, pinGreen);
  //pinMode(22, pinBlue);
  //pinMode(23, pinRed);
  ledcSetup(0,12800,8); 
  ledcSetup(1,12800,8); 
  ledcSetup(2,12800,8); 
  ledcAttachPin(pinRed,0);
  ledcAttachPin(pinBlue,1);
  ledcAttachPin(pinGreen,2);

  SerialBT.begin("ESP32");
  Serial.begin(115200);

  ledcWrite(0,1024);
  ledcWrite(1,1024);
  ledcWrite(2,1024);
}

void loop() {
  //digitalWrite(22,flag);

  if (SerialBT.available()) {
    ledcWrite(2,0);
    String msg = SerialBT.readStringUntil(';');
    Serial.println(msg);
    SerialBT.println(msg);
    int comma = msg.indexOf(',');
    int order = msg.substring(0,comma).toInt();
    int command = msg.substring(comma+1).toInt();
    ledcWrite(order,command);
  }
}