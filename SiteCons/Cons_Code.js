// Code du worker
var obj = require("../request-obj.js");
const { randomInt } = require("crypto");

/**
 * Classe du Consommateur 
 *
 * @class ConsProg
 * @typedef {ConsProg}
 */
class ConsProg {

    /**
     * Creation d'un consommateur 
     *
     * @constructor
     * @param {*} hostname
     * @param {*} sitePort
     */
    constructor(hostname,sitePort) {
        this.hostname = hostname;
        this.sitePort = sitePort;
     }

    /**
     * Section Critique 
     *
     * @async
     * @returns {*}
     */
    async sectionCritique(){
        setTimeout(() => { this.end() }, randomInt(1))
    }

    /**
     * Envoie la fin de la section critique au Producteur ??
     */
    end(){
        const token = new obj.request_obj("FINSC", "", "", "")
        fetch(
            `http://${this.hostname}:${this.sitePort}/FINSC`,
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


module.exports.ConsProg = ConsProg;