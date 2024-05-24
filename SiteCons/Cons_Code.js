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
        /** 
         * Des améliorations de codes peuvent être appliqués ici 
        */
    }

    /**
     * Envoie la fin de la section critique
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
              console.log(`Fin de section critique`);
            })
      }
    }    


module.exports.ConsProg = ConsProg;