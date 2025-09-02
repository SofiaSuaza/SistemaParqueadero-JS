class Historialparqueo {
    constructor(celda, vehiculo, fechaHora) {
        this._celda = celda;
        this._vehiculo = vehiculo;
        this._fechaHora = fechaHora;    
    }
    get getCelda() {
        return this._celda;
    }
    get getVehiculo() {
        return this._vehiculo;
    }
    get getFechaHora() {
        return this._fechaHora;
    }
    set setCelda(numero) {
        this._celda = numero;
    }
    set setVehiculo(numero) {
        this._vehiculo = numero;
    }
    set setFechaHora(datetime) {
        this._fechaHora = datetime;
    }

}
export default Historialparqueo;