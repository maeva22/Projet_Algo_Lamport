//Code du controller de Consomation
require("./request-obj.js")

const { parentPort, workerData } = require('worker_threads')

const express = require('express')
const app = express()
app.use(express.json());   
app.use(express.urlencoded({ extended: true })); 

// Data du worker
const debcons = 0;
const fincons = 0;
const ifinprod = 0;

const req_en_cours = false;
const sc_en_cours = false;


app.post('/token', (req, res) => {
  // ACQUISITION
  if( !req_en_cours ){ // and cons besoni_sc verif avec la request )
    req_en_cours = true;
  }

  // SECTION CRITIQUE
  if( req_en_cours && ! sc_en_cours && debcons-ifinprod < 0){
    debcons += 1;
    Msg_dbt_sc();
    sc_en_cours = true;
  }


  // LIBERATION

  if( req_en_cours && sc_en_cours ){ //&& cons ? fin_sc())
    fincons += 1;
    K = 1;
    while ( k < n+1){
      // asynch producteur P[K] !! màj (fincons);
      k +=1;
    }
    sc_en_cours = false;
    req_en_cours = false;

    // Launch liberation
    Msg_Rel();

    // Launche request in Aleatory time
    setTimeout(()=>{request_aleatoire()}, Math.floor(Math.random()*10000))
  }

  // RECEPTION DE IFINPROD
  // Màj ifinprod

  if ( /* recois requête type  REQ */ false){
    //Envoies ACk
  }

})

 
// Function worker Controller
app.get('/', (req, res) => {})




app.listen(HTTPport, () => {})






function request_aleatoire(){
  if(!req_en_cours){

    // send REQ !!! 

  }
}
 

function Msg_dbt_sc(){
  // TO DO ! 

  // Prévien qu'on utilise SC ! 

}

function Msg_Rel(){

}

/*
async function start(){
        await cruise();
        await start()
}
async function tokenReceived(token){
  switch(status){
    case 'demandeur':
      console.log(`${id} :token received while 'demandeur' : begins crossing`);
      status = 'dedans';
      await cross(token);
      await sendToken(token)
      status = 'dehors';
      break;
    case 'dedans':
      console.log(`token received while "dedans" : cant be`);
      break;
    case 'dehors':
      console.log(`${id} :token received while 'dehors' : just pass it`);
      await sendToken(token);
      break;
    default:
      console.log('unknown state');
  }

}
async function cross(){
    const deb = new Date();
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
          resolve();
          const end = new Date();
          console.log(`${workerData.id} has crossed between ${deb.getHours()}:${deb.getMinutes()}:${deb.getSeconds()}:${deb.getMilliseconds()} and ${end.getHours()}:${end.getMinutes()}:${end.getSeconds()}:${end.getMilliseconds()}`)
        }, 
        Math.floor(Math.random()*10000)
      )
    })
}  
async function cruise(){
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
          resolve();
          console.log(`\t \t ${workerData.id} has arrived to the crossing`)
          status = 'demandeur';
        }, 
        Math.floor(Math.random()*5000)
      )
    })
  
}  
async function sendToken(token){
    const response = await fetch(
        `http://${hostname}:${HTTPchildPort}/token`,
        {
            method: 'post',
            body: JSON.stringify(token),
            headers: {'Content-Type': 'application/json'}
        }
    );
    const data = await response.json();
    console.log(`${id} (${HTTPport}) has just send a token to ${HTTPchildPort} `)
}
*/

start();
