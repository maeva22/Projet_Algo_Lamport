class request{

    constructor(type, indice, horloge){
        // REQ / ACK / REL / BSC

        // BSC = Besoin de secion critique

        this.type = type; 
        this.indice = indice;
        this.horloge = horloge;
    }

    getType(){ return this.type}
    getIndice(){ return this.indice}
    getHorloge(){ return this.horloge}

}