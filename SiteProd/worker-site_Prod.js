//Code du controller de Consomation

var obj = require("../request-obj.js");
var code = require("./Prod_Code.js");


const { parentPort, workerData } = require('worker_threads');

const express = require('express');
const app = express();

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
const SpaceCritique = workerData.SpaceCritique;

var subWorker = new code.ProdProg(hostname, startPort + indice);

// Data du worker
var hl = 0; // Heure locale
var debprod = 0;
var finprod = 0;
var ifincons = 0;
var table = workerData.Table;

// Data pour modéliser l'état du actuel du controller
var req_en_cours = false;
var sc_en_cours = false;


app.post('/token', (req, res) => { })


// RECEPTION D'UN REQ
app.post('/REQ', (req, res) => {
  const value = req.body;
  if (value.type == "REQ") {
    hl = maj_h(hl, value.horloge)
    hl = hl + 1;
    envoie_ack(value.indice)
    table[value.indice] = ["REQ", value.horloge];
  }
})

// RECEPTION D'UN ACK
app.post('/ACK', (req, res) => {
  const value = req.body;
  if (value.type == "ACK") {
    hl = maj_h(hl, value.horloge)
    hl = hl + 1;
    if (table[value.indice][0] != "ACK") {
      table[value.indice] = ["ACK", value.horloge]
    }
  }
})

// RECEPTION D'UN REL
app.post('/REL', (req, res) => {
  const value = req.body;
  hl = maj_h(hl, value.horloge)
  hl = hl + 1;
  table[value.indice] = ["REL", value.horloge];
  debprod = debprod + 1;
  finprod = finprod + 1;
})

// Liberation
app.post('/FINSC', (req, res) => {
  const value = req.body;


  if (req_en_cours && sc_en_cours) {
    console.log(`[Worker Prod ${indice}] Production`)
    finprod = finprod + 1;
    maj_ifinprod(finprod)
    sc_en_cours = false;
    hl = hl + 1
    diffuser("REL", hl, indice);
    table[indice] = ["REL", hl];
    req_en_cours = false
  }
})

// Mise a jour
app.post('/MAJ', (req, res) => {
  const value = req.body;
  if (value.type == "MAJ") {
    ifincons = value.horloge
  }
})


app.listen(HTTPport, () => { console.log(`Worker Site Production number ${indice} is running on http://${hostname}:${HTTPport}`) })

/**
 * Envoie ACK 
 *
 * @param {*} sendindice
 */
function envoie_ack(sendindice) {
  const token = new obj.request_obj("ACK", indice, hl, "")
  fetch(
    `http://${hostname}:${startPort + sendindice}/token`,
    {
      method: 'post',
      body: JSON.stringify(token),
      headers: { 'Content-Type': 'application/json' }
    }
  )
    .then((data) => { return data.json(); })
    .then((respons) => { console.log(`Prod aknowledge ${startPort + sendindice}`); })
}

/**
 * enoie mise à jour de ifinprod
 */
function maj_ifinprod() {
  const token = new obj.request_obj("MAJ", indice, finprod, "")
  fetch(
    `http://${hostname}:${startPort + table.length}/MAJ`,
    {
      method: 'post',
      body: JSON.stringify(token),
      headers: { 'Content-Type': 'application/json' }
    }
  )
    .then((data) => { return data.json() })
    .then((respons) => { console.log(`Producteur a just send to ${startPort + i} new value : ${msg} at ${hl} `); })
}


 
/**
 * Procédure permettant de diffuser à l’ensemble des autres contrôleurs un message msg (hl, i). Ce message est de type req ou rel. 
 *
 * @param {*} msg
 * @param {*} hl
 * @param {*} indice
 */
function diffuser(msg, hl, indice) { // A vérifier on envoie nottament a prod a voir si c'est gérer
  table[indice] = [msg, hl];
  const token = new obj.request_obj(msg, indice, hl, "")

  for (let i = 0; i < table.length; i++) {
    if (i != indice) {
      fetch(
        `http://${hostname}:${startPort + i}/${msg}`,
        {
          method: 'post',
          body: JSON.stringify(token),
          headers: { 'Content-Type': 'application/json' }
        }
      )
        .then((data) => { return data.json() })
        .then((respons) => { console.log(`Producteur a just send to ${startPort + i} new value : ${msg} at ${hl} `); })
    }
  }
}

/**
 * procédure permettant de mettre à jour l’horloge locale hl d’une date he reçue via une estampille
 *
 * @param {*} hl
 * @param {*} he
 * @returns {*}
 */
function maj_h(hl, he) {
  if (he > hl) return he;
  else return hl;
}

/**
 * renvoie l’identifiant du processus ayant la plus vielle date dans le tableau tab
 *
 * @param {*} tab
 * @returns {*}
 */
function plus_vieille_date(tab) { 
  let val = tab[0][1]
  let minElement = tab[0]

  table.forEach((element) => {
    if (element != table[0]) { // On compare pas avec CONS ? 
      if (element[1] < val) {
        val = element[1]
        minElement = element
      }
    }
  })

  return table.indexOf(minElement)
}


/**
 * requete aléatoire 
 */
function request_aleatoire() {
  if (!req_en_cours) {
    hl = hl + 1
    req_en_cours = true
    diffuser("REQ", hl, indice)
  }
}

/**
 * function départ 
 */
function start() {

  setTimeout(() => { request_aleatoire() }, 500)
  setTimeout(() => { start() }, 500)

  // SECTION CRITIQUE
  if (req_en_cours && !sc_en_cours && plus_vieille_date(table) == indice && debprod - ifincons < SpaceCritique) {
    req_en_cours = true;
    sc_en_cours = true;

    debprod = debprod + 1;
    subWorker.sectionCritique()
  }
}

start();