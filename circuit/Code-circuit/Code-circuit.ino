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

int countTrueCommand;
int countTimeCommand; 
boolean found = false; 
int timestamp = 0;
char tmp[5], hum[5], moist[5], lum[5];
SoftwareSerial esp8266(RX,TX); 
  
void setup() {
  Serial.begin(9600);
  delay(10);
  dht.begin();
  esp8266.begin(115200);
  sendCommand("AT+RST",5,"OK");
  sendCommand("AT",5,"OK");
  sendCommand("AT+CWMODE=1",5,"OK");
  
  sendCommand("AT+CWJAP=\"Ionica\",\"ioana123\"",20,"OK");
}

void loop() {
  if (millis() - timestamp > 16000) {
     // String getData = "GET /update?api_key="+ API +"&field1="+getTemperatureValue()+"&field2="+getHumidityValue()+"&field3=" + getMoistureValue() + "&field4=" + getLuminosityValue();
     char getData[256] = "GET /update?api_key=RHI038IPL0EGGXB0&field1=";
     
     int t = getTemperatureValue();
     itoa(t, tmp, 10);
     strcat(getData,tmp);

     strcat(getData, "&field2=");
     int h = getHumidityValue();
     itoa(h, hum, 10);
     strcat(getData,hum);
     
     strcat(getData, "&field3=");
     int m = getMoistureValue();
     itoa(m, moist, 10);
     strcat(getData, moist);
     
     strcat(getData, "&field4=");
     int l = getLuminosityValue();
     itoa(l, lum, 10);
     strcat(getData,lum);

     sendCommand("AT+CIPMUX=1",5,"OK");
     sendCommand("AT+CIPSTART=0,\"TCP\",\"api.thingspeak.com\",80",15,"OK");

     sendCommand("AT+CIPSEND=0,91", 4, ">");
     esp8266.println(getData);
     countTrueCommand++;
     sendCommand("AT+CIPCLOSE=0",5,"OK");
     
     timestamp = millis(); // reset the timer
   }
    
}

int getLuminosityValue(){    
//    float out = float(analogRead(LIGHT)) * (VIN / float(1023)); // Conversion analog to voltage
//    float resistance = (R * (VIN - out))/out;                   // Conversion voltage to resistance
//    int lux=500/resistance;                                     // Conversion resitance to lux
    int l =  analogRead(LIGHT)/1023.00 * 100;
    Serial.print("Light(%) = ");
    Serial.print(l);
    Serial.println("");
    delay(50);
    return l; 
}

char* getMoistureValue(){
    int m =  ( 100 - ( (analogRead(MOISTURE)/1023.00) * 100 ) );
    Serial.print("Moisture(%) = ");
    Serial.print(m);
    Serial.println("");
    delay(50);
    return m;
}

char* getTemperatureValue(){
    Serial.print("Temperature: ");
    Serial.print(dht.readTemperature());
    Serial.println();
    int t = dht.readTemperature(); 
    return t;
}

char* getHumidityValue(){
    Serial.print("Humidity   : ");
    Serial.print(dht.readHumidity());
    Serial.println();
    int h = dht.readHumidity(); 
    return h;
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
