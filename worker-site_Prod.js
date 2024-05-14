const { parentPort, workerData } = require('worker_threads')

const express = require('express');
const { Console } = require('console');
const app = express()
app.use(express.json());   
app.use(express.urlencoded({ extended: true })); 

// Connexion Data
const HTTPport = workerData.HTTPport; 
const HTTPchildPort = workerData.HTTPchildPort; 

const indice = workerData.id; // Indice du producteur
const hl = 0; // Heure locale
const he = 0; // Heure Externe
const debprod = 0;
const finprod = 0;
const ifincons = 0;

const table = workerData.Table;

const req_en_cours = false;
const sc_en_cours = false;


app.post('/token', (req, res) => {

  const value = req.body.request_obj;
  
  // RECEPTION D'UN REQ
  if(value.getType() == "REQ"){ 
    maj_h(hl, value.getHorloge())
    hl += 1
    envoie_ack(value.getIndice())
    // Envoie ACK ! TO DO 
    table[value.getIndice()] = ["REQ", this.he];
  }

  // RECEPTION D'UN ACK
  else if(value.getType() == "ACK"){ 
    maj_h(hl, value.getHorloge())

    if( tab[value.getIndice()][0] != "ACK"){
      table[value.getIndice()] = ["ACK", this.he]
    }
  }

  // RECEPTION D'UN REL
  else if(value.getType() == "REL"){ 
    maj_h(hl, value.getHorloge())
    table[value.getIndice()] = ["REL", this.he];
    debprod += 1;
    finprod += 1;
  } 
  
   // ACQUISITION
  else if ( !req_en_cours && value.getType() == "BSC"){
    this.hl +=1;
    req_en_cours = true;
    diffuser("REQ", this.hl,this.indice);
    table[i] = ["REQ", this.hl]
  }
  
  // SECTION CRITIQUE
  else if( req_en_cours && !sc_en_cours && plus_vieille_date(table) == i && debprod - ifincons < n ){ 
      debprod += 1;
      // prod[i] debut_sc
      sc_en_cours = true;
  }
  
  // Liberation
  else if( req_en_cours && sc_en_cours && value.getType() == "FINSC" ){ 
    finprod += 1;
    // C !! maje(finprod),
    sc_en_cours = false;
    hl += 1
    diffuser("REL", this.hl,this.indice);
    table[i] = ["REL", hl];
    req_en_cours = false
  }
  
  // Mise a jour
  else if( value.getType()=="MAJ" ){
    maj_h(this.hl, value.getHorloge())
  }
})

app.get('/', (req, res) => {
})



app.listen(HTTPport, () => {
    console.log(`Worker Site number ${id} is running on http://${hostname}:${HTTPport}`)
  })
  
  
function envoie_ack(indice){
  const token = new request_obj("ACK",this.indice, hl, "")

  fetch(
    `http://${this.hostname}:${this.startPort+indice}/token`,
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
    console.log(`Prod aknowledge ${this.startPort+indice}`);
  })
 }


/* procédure permettant de diffuser à l’ensemble des autres contrôleurs un message msg (hl, i). Ce message est de type req ou rel. */
 function diffuser(msg, hl, indice ){ // A vérifier on envoie nottament a prod a voir si c'est gérer

  const token = new request_obj(msg,indice, hl, "")

  for( let i =0; i < table.length; i++ ){
     if( i != indice){
      fetch(
        `http://${this.hostname}:${this.startPort+i}/token`,
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
        console.log(`Producteur a just send to ${this.startPort+i} new value : ${msg} at ${hl} `);
      })
     }
  }


 }

/* procédure permettant de mettre à jour l’horloge locale hl d’une date he reçue via une estampille */
function maj_h(hl ,he){
  console.log(`Update of horloge ${this.indice} hl : ${hl} / he : ${he} `);
  if ( he > this.hl) this.hl = he;
}

/* renvoie l’identifiant du processus ayant la plus vielle date dans le tableau tab */
function plus_vieille_date(tab){ // A vérifier
  let val = tab[0][1]
  let minElement = tab[0]

  tab.foreach((element) =>{
    if(element[1] < val){
      val = element[1]
      minElement = element
    }

  return tab.getIndice(minElement)

  })


}

function start(){
  
  setTimeout( start() , 10000 );
}


/*

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
