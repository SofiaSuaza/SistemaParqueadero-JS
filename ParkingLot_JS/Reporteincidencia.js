class Reporteincidencia {
    constructor(vehiculo, incidencia, fechaHora){
        this._vehiculo = vehiculo;
        this._incidencia = incidencia;
        this._fechaHora = fechaHora;
    }


    get getVehiculo(){
        return this._vehiculo;
    }
    get getIncidencia(){
        return this._incidencia;
    }
    get getFechaHora(){
        return this._fechaHora;
    }
    set setVehiculo(numero){
        this._vehiculo = numero;
    }
    set setIncidencia(numero){
        this._incidencia = numero;
    }
    set setFechaHora(datetime){
        this._fechaHora = datetime;
    }
}

export default Reporteincidencia;