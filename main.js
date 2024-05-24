const { Worker, workerData } = require('worker_threads');
const os = require('os');
const { table, Console } = require('console');
const hostname = "localhost";//os.hostname();
const SpaceCritique = 4

/**
 * Classe Worker 
 *
 * @class myWorker
 * @typedef {myWorker}
 */
class myWorker {

  /**
   * Construteur d'un worker
   *
   * @constructor
   * @param {{ id: any; hostname: any; HTTPport: any; HTTPchildPort: any; Table: any; startPort: any; numberOfWorkers: any; }} param0
   * @param {*} param0.id
   * @param {*} param0.hostname
   * @param {*} param0.HTTPport
   * @param {*} param0.HTTPchildPort
   * @param {*} param0.Table
   * @param {*} param0.startPort
   * @param {*} param0.numberOfWorkers
   */
  constructor({ id, hostname, HTTPport, HTTPchildPort, Table, startPort,numberOfWorkers }) {
    this.id = id;
    this.hostname = hostname;
    this.HTTPport = HTTPport;
    this.HTTPchildPort = HTTPchildPort;
    this.Table = Table;
    this.startPort = startPort
    this.worker = undefined;
    this.numberofprocessus = numberOfWorkers;
    this.SpaceCritique = SpaceCritique;

  }

  /**
   * Permet de départager les ports pour les producteurs et les consommateurs 
   *
   * @async
   * @returns {new Promise}
   */
  async init() {
    if (this.HTTPport == this.startPort+this.numberofprocessus-1)
      this.dir = `${__dirname}/SiteCons/worker-site_Cons.js`
    else
      this.dir = `${__dirname}/SiteProd/worker-site_Prod.js`

    this.worker = new Worker(this.dir, { workerData: { id: this.id, hostname: this.hostname, HTTPport: this.HTTPport, HTTPchildPort: this.HTTPchildPort, consom: this.consom, Table: this.Table, startPort: this.startPort, numberofprocessus : this.numberofprocessus, SpaceCritique : this.SpaceCritique} });

    return new Promise((resolve, reject) => {
      this.worker.on('online',
        async () => {
          resolve(`worker ${this.id} is online`);
        })
    })
  }
}

/**
 * Classe permettant de créer une liste de Worker
 *
 * @class ArrayofWorkersCons
 * @typedef {ArrayofWorkersCons}
 * @extends {Array}
 */
class ArrayofWorkersCons extends Array {
  constructor({ numberOfWorkers, hostname, startPort }) {
    super()
    this.numberOfWorkers = numberOfWorkers
    this.hostname = hostname;
    this.startPort = startPort;

    let HTTPport = this.startPort;
    let HTTPchildPort = this.startPort;

    let Table = []
    let t = 0;
    while (t < numberOfWorkers-1) {
      Table.push(["REL", 0]);
      t += 1;
    }
    // Création des Producteur
    for (let id = 0; id < this.numberOfWorkers; id++) {
      HTTPport = this.startPort + id;
      if (id == this.numberOfWorkers - 1) {
        HTTPchildPort = this.startPort;
      } else {
        HTTPchildPort = HTTPport + 1;
      }
      let conso = (id == this.numberOfWorkerss)
      const theWorker = new myWorker({ id, hostname, HTTPport, HTTPchildPort, Table, startPort,numberOfWorkers })
      this.push(theWorker);

    }
  }

  /**
   * Lancement 
   *
   * @async
   * @returns {*}
   */
  async init() { // A vérifier
    const sitesPromises = new Array();
    this.forEach((site) => { sitesPromises.push(site.init()) })
    Promise.all(sitesPromises).then(() => {
      setTimeout(() => { this.launch() }, 1000)
    })
    //setTimeout(()=>{this.harakiri()}, 100000);
  }

  /**
   * Harakiri 
   */
  harakiri() {
    Console.log("+++++++++++++++++++ HARAKIRI +++++++++++++++++++")
    this.forEach((site) => { site.worker.terminate() });
  }
  /**
   * lancement 
   *
   * @async
   * @returns {*}
   */
  async launch() {
    const token = {
      type: 'token',
      payload: {
        cpt: 0
      }
    }

    fetch(
      `http://${this.hostname}:${this.startPort}/token`,
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
        console.log(`main has just send a token to ${this.startPort}`);
      })

  }
}

/**
 * Création de 10 workers 
 * 
 * numberOfWorkers : nombre de worker créer au total
 *
 * @type {ArrayofWorkersCons}
 */
const ArrayofWorkers = new ArrayofWorkersCons({ numberOfWorkers: 10, hostname, startPort: 3000 });
ArrayofWorkers.init().then(() => { console.log(`Array of Workers a été lancer`) })


