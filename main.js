const { Worker, workerData } = require('worker_threads');
const os = require('os');
const hostname = os.hostname();


class myWorker{
  constructor({id,hostname,HTTPport,HTTPchildPort}){
    this.id = id;
    this.hostname = hostname;
    this.HTTPport = HTTPport;
    this.HTTPchildPort = HTTPchildPort;
    this.worker = undefined;
  }
  async init(){
    this.worker =  new Worker( `${__dirname}/worker-site.js`, {workerData: {id:this.id,  hostname:this.hostname, HTTPport:this.HTTPport, HTTPchildPort:this.HTTPchildPort}} );
    
    return new Promise((resolve,reject)=>{
      this.worker.on('online', 
        async () => { 
         resolve(`worker ${this.id} is online`);
        })
    })
  }
}

class ArrayofWorkersCons extends Array{
  constructor({numberOfWorkers,hostname, startPort}){
    super()
    this.numberOfWorkers = numberOfWorkers
    super();
    this.numberOfWorkers = numberOfWorkers;
    this.hostname = hostname;
    this.startPort = startPort;

    let HTTPport = this.startPort;
    let HTTPchildPort = this.startPort;

    let Table = []
    let t = 0;
    while( t<m){
     Table.push( [rel, 0]);
     t+=1;
    }

    for(let id=0;  id<this.numberOfWorkers ; id++){
      HTTPport = this.startPort + id;
      if(id == this.numberOfWorkers-1){
        HTTPchildPort = this.startPort;
      }else{
        HTTPchildPort = HTTPport+1;
      }
  
     

      const theWorker = new myWorker({id,HTTPport,HTTPchildPort, Table})
      this.push(theWorker);

    }
  }
  async init(){ // A vérifier
    const sitesPromises = new Array();
    this.forEach((site)=>{sitesPromises.push(site.init())})
    Promise.all(sitesPromises).then(()=>{this.launch()})
    setTimeout(()=>{this.harakiri()}, 100000);
  }

  harakiri(){
    this.forEach((site)=>{site.worker.terminate()});
  }
  async launch(){
    const token = {
      type:'token',
      payload:{
        cpt:0
      }
    }

    fetch(
      `http://${this.hostname}:${this.startPort}/token`,
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
      console.log(`main has just send a token to ${this.startPort}`);
    })

  }
}
/*
class RingOfWorkers extends Array {
  constructor({numberOfWorkers, hostname, startPort}) {
      super();
      this.numberOfWorkers = numberOfWorkers;
      this.hostname = hostname;
      this.startPort = startPort;

      let HTTPport = this.startPort;
      let HTTPchildPort = this.startPort;
      for(let id=0;  id<this.numberOfWorkers ; id++){
        HTTPport = this.startPort + id;
        if(id == this.numberOfWorkers-1){
          HTTPchildPort = this.startPort;
        }else{
          HTTPchildPort = HTTPport+1;
        }
        let conso = (id == this.numberOfWorkerss)
        const theWorker = new myWorker({id,hostname:this.hostname,HTTPport,HTTPchildPort,conso,buffer})
        this.push(theWorker);

      }
  }


  async init(){
    const sitesPromises = new Array();
    this.forEach((site)=>{sitesPromises.push(site.init())})
    Promise.all(sitesPromises).then(()=>{this.launch()})
    setTimeout(()=>{this.harakiri()}, 100000);
  }

  harakiri(){
    this.forEach((site)=>{site.worker.terminate()});
  }

  
  async launch(){
    const token = {
      type:'token',
      payload:{
        cpt:0
      }
    }

    fetch(
      `http://${this.hostname}:${this.startPort}/token`,
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
      console.log(`main has just send a token to ${this.startPort}`);
    })

  }



}*/


const myRingOfWorkers = new ArrayofWorkersCons({numberOfWorkers:5,hostname, startPort:3000});
ArrayofWorkersCons.init().then(()=>{console.log(`done`)})


