# Bonnier news
## Design
app.js - Server is configured and APIs are defined here.
processor.js - getAllFeeds method is defined here, to process the request and get the latest top 10 news.
 
test/
    processorTest.js
        
## Requirements
- Node v12.18.2
- npm v6.14.5

## Common setup
### Clone the repo and install the dependencies.

### Open command prompt and execute the below commands
git clone https://github.com/Yashaswi-Gowda/bonnier-news.git
cd bnu-developer-assessment

### Install the node dependencies:
npm install

### Test Requirements
chai v4.2.0
mocha v8.1.3
sinon v9.1.0

### Run the testcases:
npm test

### Start the server:
node app.js

Express HTTP service is running at port 3000, and /news API is availble.
Test the service by sending HTTP GET request http://localhost:3000/news

#### For example:
http://localhost:3000/news

#### Gives the output:

  {
    "title": "Onlinehandel ger Mulberry nytt hopp",
    "link": "https://www.hd.se/2020-10-05/onlinehandel-ger-mulberry-nytt-hopp"
  },
  {
    "title": "Alternativa julen inställd i Oslo",
    "link": "https://www.hd.se/2020-10-05/alternativa-julen-installd-i-oslo"
  },
  {
    "title": "Avloppsvatten visar ökade virusmängder",
    "link": "https://www.hd.se/2020-10-05/avloppsvatten-visar-okade-virusmangder"
  },
  {
    "title": "Majoritet positiva till att lagstifta om företags ansvar för mänskliga rättigheter",
    "link": "https://www.dn.se/ekonomi/majoritet-positiva-till-att-lagstifta-om-foretags-ansvar-for-manskliga-rattigheter/"
  },
  {
    "title": "Musikaliskt teateräventyr i Förslövs bygdegård",
    "link": "https://www.hd.se/2020-10-05/musikaliskt-teateraventyr-i-forslovs-bygdegard"
  },
  {
    "title": "Båstad stöttar barn- och ungdomsföreningar",
    "link": "https://www.hd.se/2020-10-05/bastad-ger-fortsatt-coronastod-till-barn-och"
  },
  {
    "title": "Vem var Seved och Rolf?",
    "link": "https://www.sydsvenskan.se/2020-10-05/vem-var-seved-och-rolf"
  },
  {
    "title": "För många fel i Sydsvenskan",
    "link": "https://www.sydsvenskan.se/2020-10-05/for-manga-fel-i-tryck"
  },
  {
    "title": "Även Gigovic och Ceesay till U21-landslaget",
    "link": "https://www.hd.se/2020-10-05/aven-gigovic-och-ceesay-till-u21-landslaget"
  },
  {
    "title": "EU-bas i coronakarantän",
    "link": "https://www.hd.se/2020-10-05/eu-bas-i-coronakarantan"
  }
]
