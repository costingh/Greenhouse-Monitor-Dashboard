<p align="center" style="margin-bottom: 0px !important;">
  <img width="200" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Arduino_Logo.svg/2560px-Arduino_Logo.svg.png" alt="Proiect Arduino Uno R3" align="center">
  <h1 align="center" style="color: blue">Sera Inteligenta</h1>
</p>

## Continut

- [Introducere](#introducere)
- [Alegerea Componentelor](#alegerea-componentelor)
  - [Placa Arduino](#placa-arduino)
    - [Modul conectare WiFi](#modul-conectare-wifi)
    - [Senzori](#senzori)
- [Asamblarea Componentelor](#asamblarea-componentelor)
- [Descriere Server](#descriere-server)
  - [Pornire server](#pornire-server)
  - [Realizare comunicare](#realizare-comunicare)
  - [Prezentare Interfata](#prezentare-interfata)
- [Librarii Folosite](#librarii-folosite)
  - [Librarii Arduino](#librarii-arduino)
  - [Librarii Server](#librarii-server)
- [Mediu dezvoltare](#mediu-dezvoltare)
- [Bibliografie](#bibliografie)

## Introducere

Acest proiect are la baza ideea de supraveghere a unei sere realizand diverse masuratori a unor parametri ce sunt afisate intr-o interfata vizuala pentru utilizatori. Masuratorile consta in calculul temperaturii aerului, umiditatii din aer, umiditatii solului, precum si a cantitatii de lumina din sera.

## Alegerea Componentelor

### Placa Arduino

Deoarece am folosit mai multi senzori, dar aveam nevoie si de conectare la o retea de WiFi, am ales totusi o placa [Arduino Uno R3](https://cleste.ro/placa-de-dezvoltare-compatibila-arduino-uno-r3-mini-usb-atmega328p-ch340g.html) (care oferea mai multi pini analogici decat o placa de tipul Wemos D1 R2 WiFi, care avea integrat un modul ESP8266 facilitand conectarea la WiFi, dar oferea un singur pin analogic ce trebuia multiplexat).

### Modul conectare WiFi

Placa Arduino a fost conectata la o retea de internet folosind un modul [ESP8266-01](https://cleste.ro/modul-esp8266-serial-port.html).

### Senzori

Pentru efectuarea masuratorilor am folosit urmatorii senzori:

- [DHT11](https://cleste.ro/senzor-temperatura-si-umiditate-dht11.html) - pentru masurarea temperaturii si umiditatii aerului
- [Modul Senzor Umiditate Sol](https://cleste.ro/modul-cu-senzor-umiditate-sol.html) - pentru masurarea umiditatii solului
- [Modul Senzor Intensitate Luminoasa](https://cleste.ro/modul-senzor-lumina-intensitate-luminoasa.html) - pentru masurarea cantitatii de lumina din sera

## Asamblarea Componentelor

- Pentru conectarea modulului ESP8266 la placa arduino am folosit un [adaptor esp-01](https://cleste.ro/adaptor-esp-01.html), ce suorta o tensiune de intrare de 4.5-5.5V. In lipsa acestuia, modulul nu ar fi putut fi conectat direct la 5V, necesitand 3.3v, dar era necesar un curent mai mare decat cel oferit de pinul de 3.3v de pe placa Arduino atunci cand se realiza conectarea la WiFI, facand-o instabila. Comunicarea dintre arduino si ESP-8266 se face folosind firmware-ul Ai-Thinker regasit pe placa ESP8266 si actualizat, care trimite mai departe datele provenite de la Arduino (valorile senzorilor) catre un server thingspeak.
- Senzorul DHT11, este conectat la 5v (suporta intre 3.3V si 5V), oferind iesire digitala
- Senzorul de umiditate sol ofera si el la randul lui o iesire digitala, dar aceasta are valoarea 0 sau 1, asa ca am ales sa citesc iesirea analogica a acestuia. Cu cat umiditatea creste, valoarea analogica a iesirii scade. Si acesta este conectat la 5V.
- Senzorul de intensitate luminoasa oferea doar o iesire digitala (0 sau 1), asa ca pentru a citi iesirea analogica, am conectat direct fotorezistorul acestuia la arduino.
  ![alt text](https://github.com/costingh/proiect-smp/blob/main/circuit/schema.png?raw=true)
  ![alt text](https://github.com/costingh/proiect-smp/blob/main/circuit/hardware-config.jpg?raw=true)

## Descriere Server

Serverul este realizat folosind JavaScript (React.js pentru partea de frontend si Node.js pentru backend). Acesta afiseaza sub forma de grafice (folosind libraria [Chart.js](https://www.chartjs.org/) valorile senzorilor. Acestea sunt actualizate periodic, la un interval fix de secunde (polling).

### Pornire Server

Server-ul se gaseste live pe heroku, accesand link-ul: [Demo Server](https://arduino-server-esp.herokuapp.com/)

Alternativ, acesta poate fi pornit si local:

1. `git clone https://github.com/costingh/proiect-smp.git`
2. `cd server` and run `npm install`
3. `cd server/client` and run `npm install`
4. In directorul `/server` se ruleaza `nodemon index.js`, iar serverul va porni pe portul 8000 daca este liber
5. In directorul `/server/client` se ruleaza `npm start`, iar serverul va porni pe portul 3000 daca este liber
6. Se acceseaza intr-un browser `localhost:3000/`
7. Se conecteaza placa Arduino print intermediul cablului USB

### Realizare comunicare

Placa Arduino citeste valorie senzorilor (asupra carora face diverse prelucrari) pe care le trimite catre un server [thingspeak](thingspeak.com/), de unde vor fi preluate si de serverul nostru.

```cpp
#include <SoftwareSerial.h>

#define RX 2
#define TX 3

String AP = "ssid";
String PASS = "password";
String API = "WRITE-API-KEY";
String HOST = "api.thingspeak.com";
String PORT = "80";

SoftwareSerial esp8266(RX,TX);

void setup() {
  Serial.begin(9600);
  delay(10);
  esp8266.begin(115200);
  sendCommand("AT+RST",5,"OK"); // incercare resetare modul ESP pentru cel mult 5ms in care trebuie primit raspunsul 'OK'
  sendCommand("AT+CWMODE=1",5,"OK"); 	// Setare mod Wi-Fi (Station/SoftAP/Station+SoftAP)
  sendCommand("AT+CWJAP=\""+ AP +"\",\""+ PASS +"\"",20,"OK"); // Conectare la retea
}

void loop() {
     String getData = "GET /update?api_key=&field1=23&field2=44&field3=21&field4=44"; // constuire url
     sendCommand("AT+CIPMUX=1",5,"OK"); // setare "multi connection mode" - pana la 5 conexiuni TCP simuktan (default "single connection mode" - o singura conexiune TCP la un moment dat)
     sendCommand("AT+CIPSTART=0,\"TCP\",\""+ HOST +"\","+ PORT,15,"OK"); // pornire conexiune TCP cu ID = 0
     sendCommand("AT+CIPSEND=0," +String(getData.length()+4),4,">"); // trimitere data la conexiunea cu ID = 0
     esp8266.println(getData);
     sendCommand("AT+CIPCLOSE=0",5,"OK"); //Inchiderea conexiunii TCP cu ID = 0
     delay(16000);
}
```

### Prezentare Interfata

Interfata consta in mai multe grafice:

- Primul grafic (stanga, sus) afiseaza temperatura la diverse intervale orare
- Graficele din dreapta sa afiseaza media procentelor umiditatii din aer, sol, si a luminii (indicand si un interval in care aceste valori ar trebui sa se regaseasca)
- Graficul din stanga, jos, afiseaza temperatura curenta precum si maximul atins, respectiv minimul
- Graficele din dreapta, jos afiseaza procentele umiditatii din aer, sol, si a luminii la anumite intervale orare
  ![alt text](https://github.com/costingh/proiect-smp/blob/main/server/demo.png?raw=true)

## Librarii Folosite

### Librarii Arduino

Pentru partea de comunicare dintre Arduino si modulul ESP8266, am folosit libraria [SoftwareSerial](https://www.arduino.cc/en/Reference/softwareSerial). Pe partea hardware, pinii RX, respectiv TX ai modulului WiFi sunt conectati la pinii digitali 3, 2 ai placii de dezvoltare Arduino: `SoftwareSerial esp8266(RX,TX); `

### Librarii Server

Pentru server am folosit libraria Axios, pentru a facilita partea de trimitere a requesturilor, precum si ChartJS, pentru a afisa valorile senzorilor intr-o forma cat mai interactiv.

## Mediu dezvoltare

Ca medii de dezvoltare am folosit [Arduino IDE](https://www.arduino.cc/en/software), pentru programarea placutei Arduino, iar pentru crearea serverului am folosit [Visual Studio Code](https://code.visualstudio.com/). Pentru realizarea schemei circuitului am folosit [Fritzing](https://fritzing.org/).

## Bibliografie

- https://docs.arduino.cc/
- https://arduino.stackexchange.com/
- https://stackoverflow.com/
- https://randomnerdtutorials.com/esp8266-pinout-reference-gpios/
- https://www.arduino.cc/reference/en/libraries/dht-sensor-library/
- https://www.allaboutcircuits.com/projects/update-the-firmware-in-your-esp8266-wi-fi-module/
