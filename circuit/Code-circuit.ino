#include <ESP8266WiFi.h>
#include "DHT.h"

#define DHTPIN D6     // what digital pin we're connected to
#define LIGHT A1      // luminosity sensor
#define MOISTURE D7   // soil moisture

#define DHTTYPE DHT11  

// Wi-Fi Settings
const char* ssid = "Ionica"; 
const char* password = "ioana123"; 

DHT dht(DHTPIN, DHTTYPE);

WiFiClient client;

// ThingSpeak Settings
const int channelID = 1714134;
String writeAPIKey = "RHI038IPL0EGGXB0"; 
const char* server = "api.thingspeak.com";
const int postingInterval = 600 * 1000; // post data every x seconds

void setup() {
  dht.begin();   
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void loop() {  
  if (client.connect(server, 80)) {
    float h = dht.readHumidity(); // air humidity
    float t = dht.readTemperature(); // air temperature
    int l = analogRead(LIGHT);      // luminosity
    // int m = ( 100 - ( (digitalRead(MOISTURE)/1023.00) * 100 ) ); // moisture as percentage
    int m = digitalRead(MOISTURE);

    // Construct API request body
    String body = "&field1=";
           body += String(t);
           body += "&field2=";
           body += String(h);
           body += "&field3=";
           body += String(l);
           body += "&field4=";
           body += String(m);
           
    client.println("POST /update HTTP/1.1");
    client.println("Host: api.thingspeak.com");
    client.println("User-Agent: ESP8266 (nothans)/1.0");
    client.println("Connection: close");
    client.println("X-THINGSPEAKAPIKEY: " + writeAPIKey);
    client.println("Content-Type: application/x-www-form-urlencoded");
    client.println("Content-Length: " + String(body.length()));
    client.println("");
    client.print(body);
  }
  client.stop();


  // wait and then post again
  delay(postingInterval);
}
