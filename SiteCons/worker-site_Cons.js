//Code du controller de Consomation
var obj = require("../request-obj.js");

const { parentPort, workerData } = require('worker_threads')

const express = require('express')
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion Data
const indice = workerData.id; // Indice du producteur
const HTTPport = workerData.HTTPport;
const HTTPchildPort = workerData.HTTPchildPort;
const hostname = workerData.hostname;
const startPort = workerData.startPort;
const numberofprocessus = workerData.numberofprocessus;

const SpaceCritique = workerData.SpaceCritique


// Data du worker
var debcons = 0;
var fincons = 0;
var ifinprod = 0;

var req_en_cours = false;
var sc_en_cours = false;


app.post('/ACQ', (req, res) => {
  const value = req.body;
    console.log(`Verif :  ${res} `)
    // ACQUISITION
    if (!req_en_cours && value.type == "BSC") {
      req_en_cours = true;
    }
})

app.post('/SC', (req, res) => {
  const value = req.body;
    // SECTION CRITIQUE
    if (req_en_cours && !sc_en_cours && debcons - ifinprod < 0) {
      debcons += 1;
      Msg_dbt_sc();
      sc_en_cours = true;
    }
})

app.post('/FINSC', (req, res) => {
  const value = req.body;
    // LIBERATION


/* LIBERATION */

    if (req_en_cours && sc_en_cours ) {
      fincons = fincons +  1;
      send_maj(fincons, "fincons")
      sc_en_cours = false;
      req_en_cours = false;

      // Launch liberation
      // Msg_Rel(); vérifier si c'est bien a mettre ici ! 
      // Launche request in Aleatory time
      // SetTimeout(()=>{request_aleatoire()}, Math.floor(Math.random()*10000))
    }
})

app.post('/MAJ', (req, res) => {
  const value = req.body;
    // RECEPTION DE IFINPROD
      ifinprod = value.horloge;
    })

// Function worker Controller
app.get('/', (req, res) => { })




app.listen(HTTPport, () => {
  console.log(`Worker Site Consomation number ${indice} is running on http://${hostname}:${HTTPport}`)
})


async function send_maj(newval, info) { // a vérifier

  const token = new obj.request_obj("MAJ", -1, newval, info)

  for (let i = 0; i < numberofprocessus; i++) {
    if (i != indice) {
      fetch(
        `http://${hostname}:${startPort + i}/MAJ`,
        {
          method: 'post',
          body: JSON.stringify(token),
          headers: { 'Content-Type': 'application/json' }
        }
      )
        .then((data) => {
          return data.json()
        })
        .then((respons) => {
          console.log(`Consomateur a just send to ${startPort + i} new value : ${info} at ${newval} `);
        })
    }
  }
}


function request_aleatoire() {

  if (!req_en_cours) {
    //console.log(`Consomateur ${indice} : request_aleatoire `)
    req_en_cours = true
    // send REQ !!! 

  }
}

function sendFINC() { // A vérifier on envoie nottament a prod a voir si c'est gérer
  const token = new obj.request_obj("FINSC", "", "", "")
    fetch(
        `http://${hostname}:${startPort + indice}/FINSC`,
        {
          method: 'post',
          body: JSON.stringify(token),
          headers: { 'Content-Type': 'application/json' }
        }
      )
        .then((data) => {
          return data.json()
        })
        .then((respons) => {
          console.log(`Producteur a just send to ${startPort + i} new value : ${msg} at ${hl} `);
        })
    }
     


function Msg_dbt_sc() {
  // TO DO ! 
  console.log(`[Worker Cons ${indice}] : Launching Section Critique `)

  // Controle ( worker ) envoie au consomateur ( intérieur du site )

  sendFINC()
  // Prévien qu'on utilise SC ! 

}

function Msg_Rel() {

}

function start() {
  setTimeout(() => { start() }, 500)
  setTimeout(() => { request_aleatoire() }, 500)

    // SECTION CRITIQUE
    if (req_en_cours && !sc_en_cours && debcons - ifinprod < SpaceCritique) {
      console.log(`[Worker Cons ${indice}] : Launching Section Critique `)
      debcons = debcons + 1 
      Msg_dbt_sc()
      sc_en_cours = true
    }


}


start();
