class Celda {
    constructor(id, tipo, estado){
        this._id = id;
        this._tipo = tipo;
        this._estado = estado;

    }
    get getId(){
        return this._id;
    }
    get getTipo(){
        return this._tipo;
    }
    get getEstado(){
        return this._estado;
    }
    set setId(numero){
        this._id = numero;
    }
    set setTipo(texto){
        this._tipo = texto;
    }
    set setEstado(texto){
        this._estado = texto;
    }
}

export default Celda;