#include <SoftwareSerial.h>
#include "DHT.h"

#define RX 2
#define TX 3
#define DHTPIN 11
#define LIGHT A1
#define MOISTURE A0
#define DHTTYPE DHT11     
#define VIN 5   // photoresistor 5V power voltage
#define R 10000 // photoresistor ohm resistance value

DHT dht(DHTPIN, DHTTYPE);

String AP = "Ionica";                // ssid
String PASS = "ioana123";           // password
String API = "RHI038IPL0EGGXB0";   // Write API KEY
String HOST = "api.thingspeak.com";
String PORT = "80";

int countTrueCommand;
int countTimeCommand; 
boolean found = false; 

SoftwareSerial esp8266(RX,TX); 
  
void setup() {
  Serial.begin(9600);
  delay(10);
  dht.begin();
  esp8266.begin(115200);
  sendCommand("AT+RST",5,"OK");
  sendCommand("AT",5,"OK");
  sendCommand("AT+CWMODE=1",5,"OK");
  sendCommand("AT+CWJAP=\""+ AP +"\",\""+ PASS +"\"",20,"OK");
}

void loop() {
     String getData = "GET /update?api_key="+ API +"&field1="+getTemperatureValue()+"&field2="+getHumidityValue()+"&field3=" + getMoistureValue() + "&field4=" + getLuminosityValue();
     sendCommand("AT+CIPMUX=1",5,"OK");
     sendCommand("AT+CIPSTART=0,\"TCP\",\""+ HOST +"\","+ PORT,15,"OK");
     sendCommand("AT+CIPSEND=0," +String(getData.length()+4),4,">");
     esp8266.println(getData);
     delay(1500);
     countTrueCommand++;
     sendCommand("AT+CIPCLOSE=0",5,"OK");
     delay(16000);
}

String getLuminosityValue(){    
//    float out = float(analogRead(LIGHT)) * (VIN / float(1023)); // Conversion analog to voltage
//    float resistance = (R * (VIN - out))/out;                   // Conversion voltage to resistance
//    int lux=500/resistance;                                     // Conversion resitance to lux
    float l =  analogRead(LIGHT)/1023.00 * 100;
    Serial.print("Light(%) = ");
    Serial.print(l);
    Serial.println("");
    delay(50);
    return String(l); 
}

String getMoistureValue(){
    float m =  ( 100 - ( (analogRead(MOISTURE)/1023.00) * 100 ) );
    Serial.print("Moisture(%) = ");
    Serial.print(m);
    Serial.println("");
    delay(50);
    return String(m); 
}

String getTemperatureValue(){
    Serial.print("Temperature: ");
    Serial.print(dht.readTemperature());
    Serial.println();
    float t = dht.readTemperature(); 
    return String(t);
}

String getHumidityValue(){
    Serial.print("Humidity   : ");
    Serial.print(dht.readHumidity());
    Serial.println();
    float h = dht.readHumidity(); 
    return String(h);
}

void sendCommand(String command, int maxTime, char readReplay[]) {
    Serial.print(countTrueCommand);
    Serial.print(". at command => ");
    Serial.print(command);
    Serial.print(" ");
    while(countTimeCommand < (maxTime*1))
    {
      esp8266.println(command);       //Example: AT+RST
      if(esp8266.find(readReplay))    //Answer : OK
      {
        found = true;
        break;
      }
      countTimeCommand++;
    }
    if(found == true)
    {
      Serial.println("Success");
      countTrueCommand++;
      countTimeCommand = 0;
    }    
    if(found == false)
    {
      Serial.println("Fail");
      countTrueCommand = 0;
      countTimeCommand = 0;
    }
    found = false;
 }
