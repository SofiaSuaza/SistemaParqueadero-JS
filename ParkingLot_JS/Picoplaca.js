class Picoplaca{
    constructor(id, tipoVehiculo, numero, dia){
        this._id = id;
        this._tipoVehiculo = tipoVehiculo;
        this._numero = numero;
        this._dia = dia;
    }

    get getId(){
        return this._id;
    }
    get getTipoVehiculo(){
        return this._tipoVehiculo;
    }
    get getNumero(){
        return this._numero;
    }
    get getDia(){
        return this._dia;
    }
    set setId(numero){
        this._id = numero;
    }
    set setTipoVehiculo(texto){
        this._tipoVehiculo = texto;
    }
    set setNumero(texto){
        this._numero = texto;
    }
    set setDia(texto){
        this._dia = texto;
    }
}

export default Picoplaca;