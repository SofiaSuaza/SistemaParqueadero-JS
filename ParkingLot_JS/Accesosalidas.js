class Accesosalidas{
    constructor(id, movimiento, fechaHora, puerta, tiempoEstadia, vehiculo){
        this._id = id;
        this._movimiento = movimiento;
        this._fechaHora = fechaHora;
        this._puerta = puerta;
        this._tiempoEstadia = tiempoEstadia;
        this._vehiculo = vehiculo;
    }

    get getId(){
        return this._id;
    }
    get getMovimiento(){
        return this._movimiento;
    }
    get getFechaHora(){
        return this._fechaHora;
    }
    get getPuerta(){
        return this._puerta;
    }
    get getTiempoEstadia(){
        return this._tiempoEstadia;
    }
    get getVehiculo(){
        return this._vehiculo;
    }
    set setId(numero){
        this._id = numero;
    }
    set setMovimiento(texto){
        this._movimiento = texto;
    }
    set setFechaHora(datetime){
        this._fechaHora = datetime;
    }
    set setPuerta(texto){
        this._puerta = texto;
    }
    set setTiempoEstadia(numero){
        this._tiempoEstadia = numero;
    }
    set setVehiculo(numero){
        this._vehiculo = numero;
    }

}

export default Accesosalidas;