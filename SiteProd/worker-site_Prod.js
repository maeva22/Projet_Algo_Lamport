
var obj = require("../request-obj.js");
const { parentPort, workerData } = require('worker_threads')

const express = require('express');
const { Console } = require('console');
const { randomInt } = require("crypto");
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion Data
const indice = workerData.id; // Indice du producteur
const HTTPport = workerData.HTTPport;
const HTTPchildPort = workerData.HTTPchildPort;
const hostname = workerData.hostname;
const startPort = workerData.startPort;

const numberofprocessus = workerData.numberofprocessus
const SpaceCritique = workerData.SpaceCritique

var hl = 0; // Heure locale

var debprod = 0;
var finprod = 0;
var ifincons = 0;

var table = workerData.Table;

var req_en_cours = false;
var sc_en_cours = false;


app.post('/token', (req, res) => {

  const value = req.body;
  if (typeof value != "undefined") { // Ici pour ne pas déclencher nos fonction au premier lancement  

    // RECEPTION D'UN REQ
    if (value.type == "REQ") {
      //console.log(`Worker Prod ${indice} : received REQ from ${value.indice}`)
      hl = maj_h(hl, value.horloge)
      // hl += 1 On le fait dans maj ! 
      envoie_ack(value.indice)
      // Envoie ACK ! TO DO 
      table[value.indice] = ["REQ", value.horloge];
    }

    // RECEPTION D'UN ACK
    if (value.type == "ACK") {
      hl = maj_h(hl, value.horloge)
      console.log(`Worker Production ${indice} : Akncoledgue : ${value.indice}`)

      if (table[value.indice][0] != "ACK") {
        table[value.indice] = ["ACK", value.horloge]
      }
    }

    // RECEPTION D'UN REL
    if (value.type == "REL") {
      hl = maj_h(hl, value.horloge)
      table[value.indice] = ["REL", value.horloge];
      debprod = debprod + 1;
      finprod = finprod + 1;
    }

    // ACQUISITION doubt
    if (!req_en_cours && value.type == "BSC") {
      hl = hl + 1;
      req_en_cours = true;
      diffuser("REQ", hl, indice);
      table[i] = ["REQ", hl]
    }


    tps1 = req_en_cours
    tps2 = !sc_en_cours
    tps3 = plus_vieille_date(table)
    tps4 = plus_vieille_date(table) == indice
    tps5 = debprod - ifincons < SpaceCritique
    tps6 = req_en_cours && !sc_en_cours && plus_vieille_date(table) == indice && debprod - ifincons < SpaceCritique

    // SECTION CRITIQUE
    if (req_en_cours && !sc_en_cours && plus_vieille_date(table) == indice && debprod - ifincons < SpaceCritique) {
      debprod = debprod + 1;
      sc_en_cours = true;

      call_sc();

    }

    // Liberation
    if (req_en_cours && sc_en_cours && value.type == "FINSC" && value.indice == indice) {
      console.log(`Liberation of :  ${indice}`)
      finprod = finprod + 1;
      // C !! maje(finprod),
      sc_en_cours = false;
      hl = hl + 1
      diffuser("REL", hl, indice);
      table[value.indice] = ["REL", hl];
      req_en_cours = false
      
    }

    // Mise a jour
    if (value.type == "MAJ") {
      hl = maj_h(hl, value.horloge)
    }

  }
})

app.get('/', (req, res) => {
})



app.listen(HTTPport, () => {
  console.log(`Worker Site Production number ${indice} is running on http://${hostname}:${HTTPport}`)
})


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
    .then((data) => {
      return data.json()
    })
    .then((respons) => {
      console.log(`Prod aknowledge ${startPort + sendindice}`);
    })
}

// requête sur notre site pour lancer lc 
async function call_sc(){
  // simulation par affichage de msg 
  setTimeout(() => { 
    console.log(`Execution de la section critique : ${indice}`)
    diffuser("FINSC" , hl , indice)
  }, 1500)

}

/* procédure permettant de diffuser à l’ensemble des autres contrôleurs un message msg (hl, i). Ce message est de type req ou rel. */
function diffuser(msg, hl, indice) { // A vérifier on envoie nottament a prod a voir si c'est gérer
  table[indice] = [msg, hl];
  const token = new obj.request_obj(msg, indice, hl, "")

  for (let i = 0; i < table.length; i++) {
      fetch(
        `http://${hostname}:${startPort + i}/token`,
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


}

/* procédure permettant de mettre à jour l’horloge locale hl d’une date he reçue via une estampille */
function maj_h(hl, he) {
  //console.log(`Update of horloge ${indice} hl : ${hl} / he : ${he} `);
  if (he > hl) hl = he + 1;
  else hl = hl + 1;

  return hl;
}

/* renvoie l’identifiant du processus ayant la plus vielle date dans le tableau tab */
function plus_vieille_date(tab) { // A vérifier
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
  tps = table.indexOf(minElement)
  return table.indexOf(minElement)
}


function request_aleatoire() {

  if (!req_en_cours) {
    console.log(`Prod  ${indice} : send request_aleatoire  `)
    // send REQ !!! 
    hl = hl + 1
    req_en_cours = true
    diffuser("REQ", hl, indice)

  }
}

function start() {
  setTimeout(() => { start() }, 500)
  setTimeout(() => { request_aleatoire() }, 500)
}



start();
