import vehiculo from '../Vehiculo.js';
import pico_placa from '../Picoplaca.js';
import acceso_salidas from '../Accesosalidas.js';
import historial_parqueo from '../Historialparqueo.js';
import Usuario from '../Usuario.js';
import celda from '../Celda.js';
import readline from 'readline';

class ControlAccesoSalidas {
    constructor() {
        this.vehiculosRegistrados = new Map();
        this.usuariosRegistrados = new Map();
        this.celdasParqueadero = new Map();
        this.vehiculosEnParqueadero = new Map();
        this.registrosAccesoSalida = [];
        this.historialParqueo = [];
        this.restriccionesPicoPlaca = new Map();
        this.contadorIds = { acceso: 1, vehiculo: 1, usuario: 4, celda: 1 };
        
        this.inicializarRestricciones();
        this.inicializrCeldas();
        this.ianicializarUsuarios();
        
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    inicializarUsuarios() {
        const usuarios = [
            new Usuario(1, 'C.C', '987654321', 'Sofia', '', 'Suaza', 'Guzmán', 'sofiasuaza@gmail.com', '3156789012', 'admin_foto.jpg', 'Activo', 'admin123', 'administrador'),
            new Usuario(2, 'T.I', '456789123', 'Maria', 'Alejandra', 'Torres', 'Vega', 'mariatorres@gmail.com', '3201234567', 'operador_foto.jpg', 'Activo', 'oper456', 'residente'),
            new Usuario(3, 'C.C', '789123456', 'Luis', 'Fernando', 'Castro', 'Morales', 'luiscastro@gmail.com', '3187654321', 'usuario_foto.jpg', 'Activo', '', 'visitante')
        ];
        usuarios.forEach(u => this.usuariosRegistrados.set(u.getId, u));
        console.log('✅ 3 usuarios cargados');
    }

    inicializarCeldas() {
        console.log('🔧 Verificando importación de celda...');
        console.log('Tipo de celda:', typeof celda);
        console.log('celda:', celda);
        
        for (let i = 1; i <= 20; i++) {
            try {
                const celdaAuto = new celda(`A${i}`, 'automovil', 'libre');
                if (!celdaAuto._estado) celdaAuto._estado = 'libre';
                this.celdasParqueadero.set(`A${i}`, celdaAuto);
            } catch (error) {
                const celdaManual = {
                    _id: `A${i}`, _tipo: 'automovil', _estado: 'libre',
                    getid: `A${i}`, gettipo: 'automovil', getestado: 'libre'
                };
                this.celdasParqueadero.set(`A${i}`, celdaManual);
            }
        }
        
        for (let i = 1; i <= 10; i++) {
            try {
                const celdaMoto = new celda(`M${i}`, 'motocicleta', 'libre');
                if (!celdaMoto._estado) celdaMoto._estado = 'libre';
                this.celdasParqueadero.set(`M${i}`, celdaMoto);
            } catch (error) {
                const celdaManual = {
                    _id: `M${i}`, _tipo: 'motocicleta', _estado: 'libre',
                    getid: `M${i}`, gettipo: 'motocicleta', getestado: 'libre'
                };
                this.celdasParqueadero.set(`M${i}`, celdaManual);
            }
        }
        
        console.log('🅿️ Celdas inicializadas: 20 para automóviles (A1-A20), 10 para motocicletas (M1-M10)');
    }

    inicializarRestricciones() {
        const restricciones = [
            new pico_placa(1, 'automovil', [1, 2], 'lunes'),
            new pico_placa(2, 'automovil', [3, 4], 'martes'),
            new pico_placa(3, 'automovil', [5, 6], 'miercoles'),
            new pico_placa(4, 'automovil', [7, 8], 'jueves'),
            new pico_placa(5, 'automovil', [9, 0], 'viernes'),
            new pico_placa(6, 'motocicleta', [1, 2], 'lunes'),
            new pico_placa(7, 'motocicleta', [3, 4], 'martes'),
            new pico_placa(8, 'motocicleta', [5, 6], 'miercoles'),
            new pico_placa(9, 'motocicleta', [7, 8], 'jueves'),
            new pico_placa(10, 'motocicleta', [9, 0], 'viernes')
        ];

        restricciones.forEach(restriccion => {
            const key = `${restriccion.gettipo_vehiculo}-${restriccion.getdia}`;
            this.restriccionesPicoPlaca.set(key, restriccion.getnumero);
        });
    }

    async registrarUsuario() {
        console.log('\n=== REGISTRO USUARIO ===');
        
        try {
            const tipoDoc = await this.pregunta('Tipo documento: ');
            const numeroDoc = await this.pregunta('Número: ');
            
            if (Array.from(this.usuariosRegistrados.values()).find(u => u.getNumero_documento === numeroDoc)) {
                console.log('❌ Usuario ya existe');
                return null;
            }
            
            const nombre = await this.pregunta('Nombre: ');
            const apellido = await this.pregunta('Apellido: ');
            const email = await this.pregunta('Email: ');
            const celular = await this.pregunta('Celular: ');
            const clave = await this.pregunta('Contraseña: ');
            const perfil = await this.pregunta('Perfil: ');
            
            const usuario = new Usuario(
                this.contadorIds.usuario++, tipoDoc, numeroDoc, nombre, '', apellido, '',
                email, celular, null, 'Activo', clave, perfil
            );
            
            this.usuariosRegistrados.set(usuario.getId, usuario);
            console.log(`✅ Usuario ID: ${usuario.getId}`);
            return usuario;
            
        } catch (error) {
            console.log('❌ Error:', error.message);
            return null;
        }
    }

    buscarCeldaLibre(tipoVehiculo) {
        const prefijo = tipoVehiculo.toLowerCase() === 'automovil' ? 'A' : 'M';
        for (let [id, celdaObj] of this.celdasParqueadero) {
            if (id.startsWith(prefijo) && (celdaObj.getestado === 'libre' || celdaObj._estado === 'libre')) {
                return celdaObj;
            }
        }
        return null;
    }

    liberarCelda(idCelda) {
        const celdaObj = this.celdasParqueadero.get(idCelda);
        if (celdaObj) celdaObj._estado = 'libre';
    }

    ocuparCelda(idCelda) {
        const celdaObj = this.celdasParqueadero.get(idCelda);
        if (celdaObj) celdaObj._estado = 'ocupado';
    }

    buscarUsuario(idUsuario) {
        return this.usuariosRegistrados.get(parseInt(idUsuario));
    }

    verificarPicoPlaca(placa, tipoVehiculo, fecha) {
        const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        const dia = diasSemana[fecha.getDay()];
        const ultimoDigito = parseInt(placa.slice(-1));
        const key = `${tipoVehiculo.toLowerCase()}-${dia}`;
        const numerosRestringidos = this.restriccionesPicoPlaca.get(key);
        return !numerosRestringidos || !numerosRestringidos.includes(ultimoDigito);
    }

    async registrarEntrada() {
        console.log('\n=== ENTRADA ===');
        
        try {
            const puerta = await this.pregunta('Puerta: ');
            const placa = await this.pregunta('Placa: ');
            const fechaHora = new Date();
            
            if (this.vehiculosEnParqueadero.has(placa.toUpperCase())) {
                console.log('❌ Vehículo ya está adentro');
                return;
            }
            
            let vehiculoObj, usuarioObj;
            
            if (this.vehiculosRegistrados.has(placa.toUpperCase())) {
                vehiculoObj = this.vehiculosRegistrados.get(placa.toUpperCase());
                usuarioObj = this.usuariosRegistrados.get(vehiculoObj.getUsuario_id);
            } else {
                const tipo = await this.pregunta('Tipo (automovil/motocicleta): ');
                
                if (!this.verificarPicoPlaca(placa, tipo, fechaHora)) {
                    console.log(`❌ PICO Y PLACA - Dígito ${placa.slice(-1)} restringido`);
                    return;
                }
                
                const marca = await this.pregunta('Marca: ');
                const modelo = await this.pregunta('Modelo: ');
                const color = await this.pregunta('Color: ');
                const idUsuario = await this.pregunta('ID usuario (0=nuevo): ');
                
                if (idUsuario === '0') {
                    usuarioObj = await this.registrarUsuario();
                    if (!usuarioObj) return;
                } else {
                    usuarioObj = this.buscarUsuario(idUsuario);
                    if (!usuarioObj) {
                        const crear = await this.pregunta('¿Crear usuario? (s/n): ');
                        if (crear.toLowerCase() === 's') {
                            usuarioObj = await this.registrarUsuario();
                            if (!usuarioObj) return;
                        } else return;
                    }
                }
                
                vehiculoObj = new vehiculo(
                    this.contadorIds.vehiculo++, placa.toUpperCase(),
                    color, marca, modelo, tipo, usuarioObj.getId
                );
                
                this.vehiculosRegistrados.set(placa.toUpperCase(), vehiculoObj);
            }
            
            if (!this.verificarPicoPlaca(vehiculoObj.getPlaca, vehiculoObj.getTipo, fechaHora)) {
                console.log(`❌ PICO Y PLACA - Dígito ${vehiculoObj.getPlaca.slice(-1)} restringido`);
                return;
            }
            
            const celda = this.buscarCeldaLibre(vehiculoObj.getTipo);
            if (!celda) {
                console.log('❌ Sin celdas libres');
                return;
            }
            
            this.ocuparCelda(celda.getid);
            
            const registro = new acceso_salidas(
                this.contadorIds.acceso++, 'ENTRADA', fechaHora, puerta, null, vehiculoObj
            );
            
            this.registrosAccesoSalida.push(registro);
            this.vehiculosEnParqueadero.set(placa.toUpperCase(), {
                registroAcceso: registro,
                fechaEntrada: fechaHora,
                celdaAsignada: celda.getid
            });
            
            console.log('✅ ENTRADA REGISTRADA');
            console.log(`${vehiculoObj.getPlaca} | ${usuarioObj.getPrimer_nombre} ${usuarioObj.getPrimer_apellido} | Celda: ${celda.getid}`);
            
        } catch (error) {
            console.log('❌ Error:', error.message);
        }
    }

    async registrarSalida() {
        console.log('\n=== SALIDA ===');
        
        try {
            const puerta = await this.pregunta('Puerta: ');
            const placa = await this.pregunta('Placa: ');
            const fechaHora = new Date();
            
            if (!this.vehiculosEnParqueadero.has(placa.toUpperCase())) {
                console.log('❌ Vehículo no está en parqueadero');
                return;
            }
            
            const datos = this.vehiculosEnParqueadero.get(placa.toUpperCase());
            const vehiculoObj = datos.registroAcceso.getVehiculo;
            const usuarioObj = this.usuariosRegistrados.get(vehiculoObj.getUsuario_id);
            
            const tiempoEstadia = fechaHora - datos.fechaEntrada;
            const horas = Math.floor(tiempoEstadia / (1000 * 60 * 60));
            const minutos = Math.floor((tiempoEstadia % (1000 * 60 * 60)) / (1000 * 60));
            
            const registroSalida = new acceso_salidas(
                this.contadorIds.acceso++, 'SALIDA', fechaHora, puerta, tiempoEstadia, vehiculoObj
            );
            
            this.registrosAccesoSalida.push(registroSalida);
            
            const historialReg = new historial_parqueo(
                datos.celdaAsignada, vehiculoObj, datos.fechaEntrada
            );
            
            this.historialParqueo.push(historialReg);
            this.liberarCelda(datos.celdaAsignada);
            this.vehiculosEnParqueadero.delete(placa.toUpperCase());
            
            console.log('✅ SALIDA REGISTRADA');
            console.log(`${vehiculoObj.getPlaca} | ${usuarioObj.getPrimer_nombre} ${usuarioObj.getPrimer_apellido} | ${horas}h ${minutos}m`);
            
        } catch (error) {
            console.log('❌ Error:', error.message);
        }
    }

    consultarVehiculosEnParqueadero() {
        console.log('\n=== VEHÍCULOS ADENTRO ===');
        
        if (this.vehiculosEnParqueadero.size === 0) {
            console.log('Parqueadero vacío');
            return;
        }
        
        this.vehiculosEnParqueadero.forEach((datos, placa) => {
            const vehiculo = datos.registroAcceso.getVehiculo;
            const usuario = this.usuariosRegistrados.get(vehiculo.getUsuario_id);
            const tiempo = new Date() - datos.fechaEntrada;
            const h = Math.floor(tiempo / (1000 * 60 * 60));
            const m = Math.floor((tiempo % (1000 * 60 * 60)) / (1000 * 60));
            
            console.log(`${vehiculo.getPlaca} | ${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}`);
            console.log(`${vehiculo.getMarca} ${vehiculo.getModelo} | Celda: ${datos.celdaAsignada} | ${h}h ${m}m`);
        });
    }

    consultarHistorialAccesos() {
        console.log('\n=== HISTORIAL ACCESOS ===');
        
        if (this.registrosAccesoSalida.length === 0) {
            console.log('Sin registros');
            return;
        }
        
        this.registrosAccesoSalida.forEach((reg) => {
            const vehiculo = reg.getVehiculo;
            const usuario = this.usuariosRegistrados.get(vehiculo.getUsuario_id);
            
            console.log(`${reg.getMovimiento} | ${vehiculo.getPlaca} | ${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}`);
            console.log(`${reg.getFecha_hora.toLocaleString()} | Puerta: ${reg.getPuerta}`);
            
            if (reg.getTiempo_estadia) {
                const h = Math.floor(reg.getTiempo_estadia / (1000 * 60 * 60));
                const m = Math.floor((reg.getTiempo_estadia % (1000 * 60 * 60)) / (1000 * 60));
                console.log(`Estadía: ${h}h ${m}m`);
            }
        });
    }

    consultarEstadoCeldas() {
        console.log('\n=== ESTADO CELDAS ===');
        
        console.log('AUTOMÓVILES:');
        let libresA = 0, ocupadasA = 0;
        for (let i = 1; i <= 20; i++) {
            const celda = this.celdasParqueadero.get(`A${i}`);
            const estado = (celda.getestado || celda._estado) === 'libre' ? '🟢' : '🔴';
            process.stdout.write(`${estado}A${i} `);
            if ((celda.getestado || celda._estado) === 'libre') libresA++; else ocupadasA++;
            if (i % 10 === 0) console.log('');
        }
        
        console.log('MOTOCICLETAS:');
        let libresM = 0, ocupadasM = 0;
        for (let i = 1; i <= 10; i++) {
            const celda = this.celdasParqueadero.get(`M${i}`);
            const estado = (celda.getestado || celda._estado) === 'libre' ? '🟢' : '🔴';
            process.stdout.write(`${estado}M${i} `);
            if ((celda.getestado || celda._estado) === 'libre') libresM++; else ocupadasM++;
        }
        console.log(`\nLibres: ${libresA + libresM} | Ocupadas: ${ocupadasA + ocupadasM}`);
    }

    consultarHistorialParqueo() {
        console.log('\n=== HISTORIAL PARQUEO ===');
        
        if (this.historialParqueo.length === 0) {
            console.log('Sin registros');
            return;
        }
        
        this.historialParqueo.forEach((reg, i) => {
            const vehiculo = reg.getvehiculo;
            const usuario = this.usuariosRegistrados.get(vehiculo.getUsuario_id);
            console.log(`${i + 1}. ${vehiculo.getPlaca} | ${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido} | Celda: ${reg.getcelda}`);
        });
    }

    listarUsuarios() {
        console.log('\n=== USUARIOS ===');
        
        this.usuariosRegistrados.forEach((user) => {
            console.log(`ID: ${user.getId} | ${user.getPrimer_nombre} ${user.getPrimer_apellido}`);
            console.log(`${user.getTipo_documento} ${user.getNumero_documento} | ${user.getPerfil_usuario} | ${user.getNumero_celular}`);
        });
    }

    pregunta(texto) {
        return new Promise((resolve) => {
            this.rl.question(texto, (respuesta) => {
                resolve(respuesta.trim());
            });
        });
    }

    async mostrarMenu() {
        while (true) {
            console.log('\n' + '='.repeat(50));
            console.log('    SISTEMA DE CONTROL DE ACCESOS Y SALIDAS');
            console.log('='.repeat(50));
            console.log('1. Registrar entrada de vehículo');
            console.log('2. Registrar salida de vehículo');
            console.log('3. Registrar nuevo usuario');
            console.log('4. Consultar vehículos en parqueadero');
            console.log('5. Consultar historial de accesos y salidas');
            console.log('6. Consultar historial de parqueo');
            console.log('7. Consultar estado de celdas');
            console.log('8. Listar usuarios registrados');
            console.log('9. Salir');
            console.log('='.repeat(50));
            
            const opcion = await this.pregunta('Seleccione una opción: ');
            
            switch (opcion) {
                case '1': await this.registrarEntrada(); break;
                case '2': await this.registrarSalida(); break;
                case '3': await this.registrarUsuario(); break;
                case '4': this.consultarVehiculosEnParqueadero(); break;
                case '5': this.consultarHistorialAccesos(); break;
                case '6': this.consultarHistorialParqueo(); break;
                case '7': this.consultarEstadoCeldas(); break;
                case '8': this.listarUsuarios(); break;
                case '9': 
                    console.log('¡Gracias por usar el sistema!');
                    this.rl.close();
                    return;
                default: console.log('❌ Opción inválida');
            }
        }
    }

    async iniciar() {
        console.log('🚗 Iniciando Sistema de Control de Accesos y Salidas...');
        console.log('📋 Restricciones de Pico y Placa configuradas.');
        console.log('👥 Sistema de usuarios integrado.');
        console.log('📊 Historial de parqueo disponible.');
        await this.mostrarMenu();
    }
}

const sistema = new ControlAccesoSalidas();
sistema.iniciar().catch(console.error);