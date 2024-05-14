class request{

    constructor(type, indice, horloge){
        // REQ / ACK / REL / BSC / FINSC / MAJ

        // BSC = Besoin de secion critique
        // FINSC = fin de section critique
        // MAJ = mise a jour

        this.type = type; 
        this.indice = indice;
        this.horloge = horloge;
    }

    getType(){ return this.type}
    getIndice(){ return this.indice}
    getHorloge(){ return this.horloge}

}