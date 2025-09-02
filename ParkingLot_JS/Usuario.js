 import perfilUsuario from './Perfilusuario.js';

class Usuario {
    constructor(id, tipoDocumento, numeroDocumento, primerNombre, segundoNombre, primerApellido, segundoApellido, direccionCorreo, numeroCelular, fotoPerfil, estado, clave, perfilUsuario){
        this._id = id;
        this._tipoDocumento = tipoDocumento;
        this._numeroDocumento = numeroDocumento;
        this._primerNombre = primerNombre; 
        this._segundoNombre = segundoNombre;
        this._primerApellido = primerApellido;
        this._segundoApellido = segundoApellido;
        this._direccionCorreo = direccionCorreo;
        this._numeroCelular = numeroCelular;
        this._fotoPerfil = fotoPerfil;
        this._estado = estado;
        this._clave = clave;
        this._perfilUsuario = perfilUsuario;

    }
    get getId(){
        return this._id;
    }
    get getTipoDocumento(){
        return this._tipoDocumento;
    }
    get getNumeroDocumento(){
        return this._numeroDocumento;
    }
    get getPrimerNombre(){
        return this._primerNombre;
    }
    get getSegundoNombre(){
        return this._segundoNombre;
    }
    get getPrimerApellido(){
        return this._primerApellido;
    }
    get getSegundoApellido(){
        return this._segundoApellido;
    }
    get getDireccionCorreo(){
        return this._direccionCorreo;
    }
    get getNumeroCelular(){
        return this._numeroCelular;
    }
    get getFotoPerfil(){
        return this._fotoPerfil;
    }
    get getEstado(){
        return this._estado;
    }
    get getClave(){
        return this._clave;
    }
    get getPerfilUsuario(){
        return this._perfilUsuario;
    }
    set setId(numero){
        this._id = numero;
    }
    set setTipoDocumento(texto){
        this._tipoDocumento = texto;
    }
    set setNumeroDocumento(texto){
        this._numeroDocumento = texto;
    }
    set setPrimerNombre(texto){
        this._primerNombre = texto;
    }
    set setSegundoNombre(texto){
        this._segundoNombre = texto;
    }
    set setPrimerApellido(texto){
        this._primerApellido = texto;
    }
    set setSegundoApellido(texto){
        this._segundoApellido = texto;
    }
    set setDireccionCorreo(texto){
        this._direccionCorreo = texto;
    }
    set setNumeroCelular(texto){
        this._numeroCelular = texto;
    }
    set setFotoPerfil(texto){
        this._fotoPerfil = texto;
    }
    set setEstado(texto){
        this._estado = texto;
    }
    set setClave(texto){
        this._clave = texto;
    }
    set setPerfilUsuario(perfilUsuario){
        this._perfilUsuario = perfilUsuario;
    }

}

export default Usuario;