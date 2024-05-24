/**
 * Classe d'une requête  
 *
 * @class request_obj
 * @typedef {request_obj}
 */
class request_obj {

     /**
     * Creation d'une requête  
     *
     * @constructor
     * @param {*} type
     * @param {*} indice
     * @param {*} horloge
     * @param {*} info
     */
    constructor(type, indice, horloge, info = null) {
        // REQ / ACK / REL / FINSC / MAJ
        // FINSC = fin de section critique
        // MAJ = mise a jour

        this.type = type;
        this.indice = indice; 
        this.horloge = horloge;
        this.info = info; // Précision si on maj fincons, ifinprod ...
    }

    /**
     * Avoir le type de notre requete (REQ / ACK / REL / FINSC / MAJ)
     *
     * @returns {*}
     */
    getType() { return this.type }

    /**
     * Avoir l'indice de la requête 
     *
     * @returns {*}
     */
    getIndice() { return this.indice }

    /**
     * Avoir l'horloge communiqué dans nnotre requête 
     *
     * @returns {*}
     */
    getHorloge() { return this.horloge }

    /**
     * Avoir des informations passé dans notre requête 
     *
     * @returns {*}
     */
    getInfo() { return this.info }

}

module.exports.request_obj = request_obj;