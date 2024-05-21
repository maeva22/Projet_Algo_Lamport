//Code du controller de Consomation
var obj = require("../request-obj.js");
var code = require("./Cons_Code.js");

const { parentPort, workerData } = require('worker_threads')

const express = require('express')
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { randomInt } = require("crypto");

// Connexion Data
const indice = workerData.id; // Indice du producteur
const HTTPport = workerData.HTTPport;
const HTTPchildPort = workerData.HTTPchildPort;
const hostname = workerData.hostname;
const startPort = workerData.startPort;

// Lien vers les autres
const numberofprocessus = workerData.numberofprocessus;
const SpaceCritique = workerData.SpaceCritique

var subWorker = new code.ConsProg(hostname, startPort + indice)

// Data du worker
var debcons = 0;
var fincons = 0;
var ifinprod = 0;

// Data pour modéliser l'état du actuel du controller
var req_en_cours = false;
var sc_en_cours = false;

// ACQUISITION a voir si on l'utilise ! ! ! !  !! 
app.post('/ACQ', (req, res) => {
  const value = req.body;
  if (!req_en_cours) {
    req_en_cours = true;
  }
})

/* LIBERATION */
app.post('/FINSC', (req, res) => {
  const value = req.body;
  if (req_en_cours && sc_en_cours) {
    fincons = fincons + 1;
    console.log(`[Worker Cons ${indice}] : Consumption ifinprod :${ifinprod} / fin :${fincons} /  debcons : ${debcons} /  debcons - ifinprod : ${  debcons - ifinprod} `)

    send_maj(fincons, "fincons")
    sc_en_cours = false;
    req_en_cours = false;
  }
})

/* MAJ */
app.post('/MAJ', (req, res) => { ifinprod = req.body.horloge; })


app.listen(HTTPport, () => { console.log(`Worker Site Consomation number ${indice} is running on http://${hostname}:${HTTPport}`) })


async function send_maj(newval, info) {

  const token = new obj.request_obj("MAJ", indice, newval, info)

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
        .then((data) => { return data.json() })
        .then((respons) => { console.log(`Consomateur a just send to ${startPort + i} new value : ${info} at ${newval} `); })
    }
  }
}


function request_aleatoire() { if (!req_en_cours) { req_en_cours = true } }



function Msg_dbt_sc() {
  // TO DO ! 
  //console.log(`[Worker Cons ${indice}] : Section Critique `)

  // Controle ( worker ) envoie au consomateur ( intérieur du site )

  sendFINC()
  // Prévien qu'on utilise SC ! 

}

function start() {
  setTimeout(() => { start() }, 500)
  setTimeout(() => { request_aleatoire() }, 500)

  // SECTION CRITIQUE
  if (req_en_cours && !sc_en_cours && debcons - ifinprod < 0) {
    debcons = debcons + 1
    //Msg_dbt_sc()
    subWorker.sectionCritique()
    sc_en_cours = true
  }


}


start();
