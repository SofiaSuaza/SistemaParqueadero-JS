class Perfilusuario {
    constructor(id, perfil){
        this._id = id;
        this._perfil = perfil;
    }
    get getId(){
        return this._id;
    }
    get getPerfil(){
        return this._perfil;
    }
    set setId(numero){
        this._id = numero;
    }
    set setPerfil(texto){
        this._perfil = texto;
    }
}

export default Perfilusuario;

