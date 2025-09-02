class Incidencia{
    constructor(id, nombre){
        this._id = id;
        this._nombre = nombre;
    }
    get getId(){
        return this._id;
    }
    get getNombre(){
        return this._nombre;
    }
    set setId(numero){
        this._id = numero;
    }
    set setNombre(texto){
        this._nombre = texto;
    }
}

export default Incidencia;