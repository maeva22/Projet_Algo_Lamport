// Code du worker
var obj = require("../request-obj.js");
const { randomInt } = require("crypto");

/**
 * Classe d'un producteur 
 *
 * @class ProdProg
 * @typedef {ProdProg}
 */
class ProdProg {

    /**
     * Creation d'un producteur 
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
        setTimeout(() => { this.end() }, 500)//randomInt(500)*2)
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
              console.log(`Fin de section critique `);
            })
      }
    }    


module.exports.ProdProg = ProdProg;