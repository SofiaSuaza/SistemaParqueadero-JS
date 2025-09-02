import Usuario from '../Usuario.js';
import Vehiculo from '../Vehiculo.js';
import Pico_placa from '../Picoplaca.js';
import readline from 'readline';

class ControlVehiculo {
    constructor() {
        this.usuarios = [];
        this.vehiculos = [];
        this.restriccionesPicoPlaca = [];
        this.usuarioActual = null;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        this.inicializarUsuariosPrueba();
    }

    inicializarUsuariosPrueba() {
        const admin = new Usuario(1, 'C.C', '987654321', 'Sofia', '', 'Suaza', 'Guzmán', 'sofiasuaza@gmail.com', '3156789012', 'admin_foto.jpg', 'Activo', 'admin123', 'administrador');
        const operador = new Usuario(2, 'T.I', '456789123', 'Maria', 'Alejandra', 'Torres', 'Vega', 'mariatorres@gmail.com', '3201234567', 'operador_foto.jpg', 'Activo', 'oper456', 'operador');
        const cliente = new Usuario(3, 'C.C', '789123456', 'Luis', 'Fernando', 'Castro', 'Morales', 'luiscastro@gmail.com', '3187654321', 'usuario_foto.jpg', 'Activo', '', 'cliente');
        
        this.usuarios.push(admin, operador, cliente);
    }

    pregunta(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    async autenticarUsuario() {
        console.log('\n=== CONTROL VEHICULOS ===');
        console.log('Iniciar sesión:');
        
        const email = await this.pregunta('Email: ');
        const clave = await this.pregunta('Contraseña: ');
        
        const usuario = this.usuarios.find(u => 
            u.getDireccion_correo === email && u.getClave === clave
        );
        
        if (usuario) {
            this.usuarioActual = usuario;
            console.log(`\nBienvenido ${usuario.getPrimer_nombre}!`);
            console.log(`Rol: ${usuario.getPerfil_usuario}`);
            return true;
        } else {
            console.log('\nCredenciales incorrectas.');
            return false;
        }
    }

    async mostrarMenu() {
        console.log('\n=== MENÚ VEHÍCULOS ===');
        console.log('1. Crear vehículo');
        console.log('2. Actualizar vehículo');
        console.log('3. Asignar vehículo');
        console.log('4. Crear restricción P&P');
        console.log('5. Ver vehículos');
        console.log('6. Ver restricciones');
        console.log('7. Verificar restricción');
        console.log('8. Salir');
        
        const opcion = await this.pregunta('\nOpción: ');
        return opcion;
    }

    // REQ-CAR-1: Crear vehículo
    async crearVehiculo() {
        if (!this.puedeCrearVehiculo()) {
            console.log('\nSin permisos para crear vehículos.');
            return;
        }

        console.log('\n=== CREAR VEHÍCULO ===');
        
        const placa = await this.pregunta('Placa: ');
        const color = await this.pregunta('Color: ');
        const marca = await this.pregunta('Marca: ');
        const modelo = await this.pregunta('Modelo: ');
        const tipo = await this.pregunta('Tipo (automóvil/motocicleta): ');
        
        const placaExiste = this.vehiculos.some(v => v.getPlaca === placa);
        if (placaExiste) {
            console.log('\nError: Placa ya existe.');
            return;
        }

        const nuevoId = this.vehiculos.length + 1;
        const nuevoVehiculo = new Vehiculo(nuevoId, placa, color, modelo, marca, tipo, null);
        
        this.vehiculos.push(nuevoVehiculo);
        console.log(`\nVehículo creado: ${placa} - ${marca} ${modelo}`);
    }

    // REQ-CAR-2: Actualizar vehículo
    async actualizarVehiculo() {
        if (!this.esAdministrador()) {
            console.log('\nSolo administradores pueden actualizar.');
            return;
        }

        if (this.vehiculos.length === 0) {
            console.log('\nNo hay vehículos.');
            return;
        }

        console.log('\n=== ACTUALIZAR VEHÍCULO ===');
        this.mostrarVehiculos();
        
        const id = parseInt(await this.pregunta('ID del vehículo: '));
        const vehiculo = this.vehiculos.find(v => v.getId === id);
        
        if (!vehiculo) {
            console.log('\nVehículo no encontrado.');
            return;
        }

        console.log(`\nActual: ${vehiculo.getPlaca} - ${vehiculo.getMarca} ${vehiculo.getModelo}`);
        console.log(`Color: ${vehiculo.getColor} | Tipo: ${vehiculo.getTipo}`);

        const nuevaPlaca = await this.pregunta('Nueva placa (Enter = mantener): ');
        const nuevoColor = await this.pregunta('Nuevo color (Enter = mantener): ');
        const nuevaMarca = await this.pregunta('Nueva marca (Enter = mantener): ');
        const nuevoModelo = await this.pregunta('Nuevo modelo (Enter = mantener): ');
        const nuevoTipo = await this.pregunta('Nuevo tipo (Enter = mantener): ');

        if (nuevaPlaca) vehiculo.setPlaca = nuevaPlaca;
        if (nuevoColor) vehiculo.setColor = nuevoColor;
        if (nuevaMarca) vehiculo.setMarca = nuevaMarca;
        if (nuevoModelo) vehiculo.setModelo = nuevoModelo;
        if (nuevoTipo) vehiculo.setTipo = nuevoTipo;

        console.log('\nVehículo actualizado!');
    }

    // REQ-CAR-3: Asignar vehículo
    async asignarVehiculoUsuario() {
        if (!this.esAdministrador()) {
            console.log('\nSolo administradores pueden asignar.');
            return;
        }

        if (this.vehiculos.length === 0) {
            console.log('\nNo hay vehículos.');
            return;
        }

        console.log('\n=== ASIGNAR VEHÍCULO ===');
        
        console.log('\nVehículos:');
        this.vehiculos.forEach(v => {
            const usuario = v.getUsuario ? this.usuarios.find(u => u.getId === v.getUsuario) : null;
            const asignado = usuario ? `(${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido})` : '(Sin asignar)';
            console.log(`${v.getId}. ${v.getPlaca} - ${v.getMarca} ${asignado}`);
        });

        const vehiculoId = parseInt(await this.pregunta('\nID del vehículo: '));
        const vehiculo = this.vehiculos.find(v => v.getId === vehiculoId);
        
        if (!vehiculo) {
            console.log('\nVehículo no encontrado.');
            return;
        }

        console.log('\nUsuarios:');
        this.usuarios.forEach(u => {
            if (u.getPerfil_usuario !== 'administrador') {
                console.log(`${u.getId}. ${u.getPrimer_nombre} ${u.getPrimer_apellido} - ${u.getDireccion_correo}`);
            }
        });

        const usuarioId = parseInt(await this.pregunta('\nID del usuario (0 = desasignar): '));
        
        if (usuarioId === 0) {
            vehiculo.setUsuario = null;
            console.log('\nVehículo desasignado.');
        } else {
            const usuario = this.usuarios.find(u => u.getId === usuarioId);
            if (!usuario) {
                console.log('\nUsuario no encontrado.');
                return;
            }
            
            vehiculo.setUsuario = usuarioId;
            console.log(`\nAsignado a ${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}.`);
        }
    }

    // REQ-CAR-4: Crear restricción pico y placa
    async crearRestriccionPicoPlaca() {
        if (!this.puedeCrearVehiculo()) {
            console.log('\nSin permisos para crear restricciones.');
            return;
        }

        console.log('\n=== CREAR RESTRICCIÓN P&P ===');
        console.log('Tipos: automóvil, motocicleta');
        console.log('Días: lunes a domingo');
        
        const tipoVehiculo = await this.pregunta('Tipo de vehículo: ');
        const numero = await this.pregunta('Último dígito (0-9): ');
        const dia = await this.pregunta('Día de restricción: ');

        if (isNaN(numero) || numero < 0 || numero > 9) {
            console.log('\nError: Debe ser un dígito 0-9.');
            return;
        }

        const restriccionExiste = this.restriccionesPicoPlaca.some(r => 
            r.getTipo_vehiculo === tipoVehiculo.toLowerCase() && 
            r.getNumrto == numero && 
            r.getDia === dia.toLowerCase()
        );

        if (restriccionExiste) {
            console.log('\nError: Restricción ya existe.');
            return;
        }

        const nuevaRestriccion = new Pico_placa(
            this.restriccionesPicoPlaca.length + 1,
            tipoVehiculo.toLowerCase(),
            parseInt(numero),
            dia.toLowerCase()
        );

        this.restriccionesPicoPlaca.push(nuevaRestriccion);
        console.log(`\nRestricción creada: ${tipoVehiculo} dígito ${numero} los ${dia}`);
    }

    async verificarRestriccionVehiculo() {
        if (this.vehiculos.length === 0) {
            console.log('\nNo hay vehículos.');
            return;
        }

        console.log('\n=== VERIFICAR RESTRICCIÓN ===');
        
        const placa = await this.pregunta('Placa del vehículo: ');
        const dia = await this.pregunta('Día a verificar: ');

        const vehiculo = this.vehiculos.find(v => v.getPlaca === placa);
        if (!vehiculo) {
            console.log('\nVehículo no encontrado.');
            return;
        }

        const ultimoDigito = parseInt(placa.slice(-1));
        if (isNaN(ultimoDigito)) {
            console.log('\nError: No se puede determinar el dígito.');
            return;
        }

        const restriccion = this.restriccionesPicoPlaca.find(r => 
            r.getTipo_vehiculo === vehiculo.getTipo.toLowerCase() && 
            r.getNumrto === ultimoDigito && 
            r.getDia === dia.toLowerCase()
        );

        if (restriccion) {
            console.log(`\n🚫 RESTRICCIÓN ACTIVA`);
            console.log(`${placa} NO puede circular el ${dia}`);
            console.log(`Tipo: ${vehiculo.getTipo} | Dígito: ${ultimoDigito}`);
        } else {
            console.log(`\n✅ SIN RESTRICCIÓN`);
            console.log(`${placa} SÍ puede circular el ${dia}`);
        }
    }

    mostrarVehiculos() {
        if (this.vehiculos.length === 0) {
            console.log('\nNo hay vehículos.');
            return;
        }

        console.log('\n=== VEHÍCULOS ===');
        this.vehiculos.forEach(v => {
            const usuario = v.getUsuario ? this.usuarios.find(u => u.getId === v.getUsuario) : null;
            const asignado = usuario ? `${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}` : 'Sin asignar';
            
            console.log(`${v.getId}. ${v.getPlaca} - ${v.getMarca} ${v.getModelo}`);
            console.log(`   Color: ${v.getColor} | Tipo: ${v.getTipo}`);
            console.log(`   Asignado: ${asignado}\n`);
        });
    }

    mostrarRestricciones() {
        if (this.restriccionesPicoPlaca.length === 0) {
            console.log('\nNo hay restricciones.');
            return;
        }

        console.log('\n=== RESTRICCIONES P&P ===');
        this.restriccionesPicoPlaca.forEach(r => {
            console.log(`${r.getId}. ${r.getTipo_vehiculo} dígito ${r.getNumrto} los ${r.getDia}`);
        });
    }

    puedeCrearVehiculo() {
        return this.usuarioActual && 
               (this.usuarioActual.getPerfil_usuario === 'administrador' || 
                this.usuarioActual.getPerfil_usuario === 'operador');
    }

    esAdministrador() {
        return this.usuarioActual && this.usuarioActual.getPerfil_usuario === 'administrador';
    }

    async ejecutar() {
        let autenticado = false;
        
        while (!autenticado) {
            autenticado = await this.autenticarUsuario();
        }

        let continuar = true;
        while (continuar) {
            const opcion = await this.mostrarMenu();
            
            switch (opcion) {
                case '1':
                    await this.crearVehiculo();
                    break;
                case '2':
                    await this.actualizarVehiculo();
                    break;
                case '3':
                    await this.asignarVehiculoUsuario();
                    break;
                case '4':
                    await this.crearRestriccionPicoPlaca();
                    break;
                case '5':
                    this.mostrarVehiculos();
                    break;
                case '6':
                    this.mostrarRestricciones();
                    break;
                case '7':
                    await this.verificarRestriccionVehiculo();
                    break;
                case '8':
                    console.log('\n¡Hasta luego!');
                    continuar = false;
                    break;
                default:
                    console.log('\nOpción inválida.');
            }
            
            if (continuar) {
                await this.pregunta('\nPresione Enter...');
            }
        }
        
        this.rl.close();
    }
}

// Ejecutar el sistema
const controlVehiculo = new ControlVehiculo();
controlVehiculo.ejecutar().catch(console.error);