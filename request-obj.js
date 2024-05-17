class request_obj{

    constructor(type, indice, horloge, info = null){
        // REQ / ACK / REL / BSC / FINSC / MAJ

        // BSC = Besoin de secion critique
        // FINSC = fin de section critique
        // MAJ = mise a jour

        this.type = type; 
        this.indice = indice; // -1 si l'éméteur n'est pas retenue
        this.horloge = horloge;
        this.info = info; // Précision si on maj fincons, ifinprod ...
    }

    getType(){ return this.type}
    getIndice(){ return this.indice}
    getHorloge(){ return this.horloge}
    getInfo(){ return this.info}

}

module.exports.request_obj = request_obj;