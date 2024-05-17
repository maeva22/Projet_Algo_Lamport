//Code du controller de Consomation
require( "../request-obj.js")

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

// Data du worker
var debcons = 0;
var fincons = 0;
var ifinprod = 0;

var req_en_cours = false;
var sc_en_cours = false;

var table = workerData.Table;


app.post('/token', (req, res) => {

  const value = req.body.request_obj;

  if (typeof value != "undefined") { // Ici pour ne pas déclencher nos fonction au premier lancement 
    
    console.log(`Verif :  ${res} `)
  
    // ACQUISITION
    if( !req_en_cours && value.type=="BSC" ){
      req_en_cours = true;
    }
  
    // SECTION CRITIQUE
    if( req_en_cours && ! sc_en_cours && debcons-ifinprod < 0){
      debcons += 1;
      Msg_dbt_sc();
      sc_en_cours = true;
    }
  
  
    // LIBERATION
  
    if( req_en_cours && sc_en_cours && value.type=="FINSC" ){ 
      fincons += 1;
      K = 1;
      while ( k < n+1){
        send_maj(fincons,"fincons")
        k +=1;
      }
      sc_en_cours = false;
      req_en_cours = false;
  
      // Launch liberation
      // Msg_Rel(); vérifier si c'est bien a mettre ici ! 
      // Launche request in Aleatory time
      // SetTimeout(()=>{request_aleatoire()}, Math.floor(Math.random()*10000))
    }
    // RECEPTION DE IFINPROD
    if ( value.type=="MAJ" && value.info == "ifinprod"){
      ifinprod = value.horloge;
    }
  
    if ( /* recois requête type  REQ */ false){
      //Envoies ACk
    }

  }else{ // premier lancement ! 

  }
 

})

 
// Function worker Controller
app.get('/', (req, res) => {})




app.listen(HTTPport, () => {
  console.log(`Worker Site Consomation number ${indice} is running on http://${hostname}:${HTTPport}`)
})


async function send_maj(newval, info){ // a vérifier

  const token = new request_obj("MAJ",-1, newval, info)

  for( let i =0; i < table.length; i++ ){
     if( i != indice){
      fetch(
        `http://${hostname}:${startPort+i}/token`,
        {
            method: 'post',
            body: JSON.stringify(token),
            headers: {'Content-Type': 'application/json'}
        }
      )
      .then((data)=>{
        return data.json()
      })
      .then((respons)=>{
        console.log(`Consomateur a just send to ${startPort+i} new value : ${info} at ${newval} `);
      })
     }
  }
}


function request_aleatoire(){

  if(!req_en_cours){
    console.log(`Consomateur ${indice} : request_aleatoire `)
    req_en_cours = true
    // send REQ !!! 

  }
}
 

function Msg_dbt_sc(){
  // TO DO ! 
 
  // Controle ( worker ) envoie au consomateur ( intérieur du site )


  // Prévien qu'on utilise SC ! 

}

function Msg_Rel(){

}

function start(){
  setTimeout(()=>{start()},500)
  setTimeout(()=>{request_aleatoire()},500) 

  
}


start();