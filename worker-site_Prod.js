const { parentPort, workerData } = require('worker_threads')

const express = require('express')
const app = express()
app.use(express.json());   
app.use(express.urlencoded({ extended: true })); 


const hl = 0; // Heure locale
const he = 0; // Heure Externe
const debprod = 0;
const finprod = 0;
const ifincons = 0;

const table = []

const req_en_cours = false;
const sc_en_cours = false;

const t = 0;
while( t<m){
  table.push( [rel, 0]);
  t+=1;
}



app.post('/token', (req, res) => {

  // RECEPTION D'UN MESSAGE DE TYPE REQ
  const value = req.body.request_obj;
  
  if(value.getType() == "REQ"){ // RECEPTION D'UN REQ
    maj_h(hl, value.getHorloge())
    hl += 1
    // Envoie ACK ! TO DO 
    table[value.getIndice()] = ["REQ", this.he];
  }
  else if(value.getType() == "ACK"){ // RECEPTION D'UN ACK
    maj_h(hl, value.getHorloge())

    if( tab[value.getIndice()][0] != "ACK"){
      table[value.getIndice()] = ["ACK", this.he]
    }
  }
  else if(value.getType() == "REL"){ // RECEPTION D'UN REL
    maj_h(hl, value.getHorloge())
    table[value.getIndice()] = ["REL", this.he];
    debprod += 1;
    finprod += 1;
  } else if ( !req_en_cours && value.getType() == "BSC")
  res.send('Hello World!')
})

app.get('/', (req, res) => {
})







 
app.listen(HTTPport, () => {
    console.log(`Worker Site number ${id} is running on http://${hostname}:${HTTPport}`)
  })
  
  
  /* procédure permettant de diffuser à l’ensemble des autres contrôleurs un message msg (hl, i). Ce message est de type req ou rel. */
  function diffuser(msg, hl, i ){

  }

  /* procédure permettant de mettre à jour l’horloge locale hl d’une date he reçue via une estampille */
  function maj_h(hl ,he){

  }

  /* renvoie l’identifiant du processus ayant la plus vielle date dans le tableau tab */
  function plus_vieille_date(tab){

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
