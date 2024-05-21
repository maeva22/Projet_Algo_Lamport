// Code du worker
var obj = require("../request-obj.js");

const { randomInt } = require("crypto");

class ProdProg {

    constructor(hostname,sitePort) {
        this.hostname = hostname;
        this.sitePort = sitePort;
     }

    async sectionCritique(){

        setTimeout(() => { this.end() }, 500)//randomInt(500)*2)
      
    }

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


module.exports.ProdProg = ProdProg;