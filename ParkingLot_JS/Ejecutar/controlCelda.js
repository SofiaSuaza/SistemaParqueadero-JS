import Usuario from '../Usuario.js';
import Vehiculo from '../Vehiculo.js';
import Celda from '../Celda.js';
import readline from 'readline';

class ControlCelda {
    constructor() {
        this.usuarios = [];
        this.vehiculos = [];
        this.celdas = [];
        this.ocupacionCeldas = new Map();
        this.usuarioActual = null;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });
        
        this.inicializarDatosPrueba();
    }

    inicializarDatosPrueba() {
        // Usuarios del sistema
        const admin = new Usuario(
            1, 'C.C', '987654321', 'Sofia', '', 'Suaza', 'Guzmán', 
            'sofiasuaza@gmail.com', '3156789012', 'admin_foto.jpg', 'Activo', 
            'admin123', 'administrador'
        );
        
        const operador = new Usuario(
            2, 'T.I', '456789123', 'Maria', 'Alejandra', 'Torres', 'Vega',
            'mariatorres@gmail.com', '3201234567', 'operador_foto.jpg', 'Activo',
            'oper456', 'operador'
        );
        
        const cliente = new Usuario(
            3, 'C.C', '789123456', 'Luis', 'Fernando', 'Castro', 'Morales',
            'luiscastro@gmail.com', '3187654321', 'usuario_foto.jpg', 'Activo',
            '', 'cliente'
        );

        const cliente2 = new Usuario(
            4, 'C.C', '111222333', 'Ana', 'Lucia', 'Ramirez', 'Mendoza',
            'analucram@gmail.com', '3008765432', 'cliente2_foto.jpg', 'Activo',
            '', 'cliente'
        );
        
        this.usuarios.push(admin, operador, cliente, cliente2);

        // Vehículos de prueba
        const vehiculo1 = new Vehiculo(1, 'BCA456', 'Negro', '2022', 'Mazda', 'automóvil', 3);
        const vehiculo2 = new Vehiculo(2, 'YXW123', 'Verde', '2021', 'Yamaha', 'motocicleta', 4);
        const vehiculo3 = new Vehiculo(3, 'GHI789', 'Plateado', '2023', 'Hyundai', 'automóvil', null);
        
        this.vehiculos.push(vehiculo1, vehiculo2, vehiculo3);

        // Generar celdas por zonas
        this.generarCeldasParqueadero();
        
        // Asignar algunas celdas ocupadas
        this.asignarEjemplosOcupacion();
    }

    generarCeldasParqueadero() {
        const zonas = ['Norte', 'Sur', 'Este'];
        const niveles = [1, 2, 3];
        let celdaId = 1;
        
        zonas.forEach(zona => {
            niveles.forEach(nivel => {
                // 12 espacios para autos por zona/nivel
                for (let i = 1; i <= 12; i++) {
                    const codigo = `${zona.charAt(0)}${nivel}-A${i.toString().padStart(2, '0')}`;
                    const celda = new Celda(celdaId++, 'automóvil', 'disponible');
                    celda.setCodigo = codigo;
                    celda.setArea = zona;
                    celda.setPiso = nivel;
                    this.celdas.push(celda);
                }
                
                // 6 espacios para motos por zona/nivel
                for (let i = 1; i <= 6; i++) {
                    const codigo = `${zona.charAt(0)}${nivel}-M${i.toString().padStart(2, '0')}`;
                    const celda = new Celda(celdaId++, 'motocicleta', 'disponible');
                    celda.setCodigo = codigo;
                    celda.setArea = zona;
                    celda.setPiso = nivel;
                    this.celdas.push(celda);
                }
            });
        });
    }

    asignarEjemplosOcupacion() {
        this.ocuparCeldaDemo('N1-A01', 'BCA456');
        this.ocuparCeldaDemo('S2-M01', 'YXW123');
    }

    ocuparCeldaDemo(codigoCelda, placaVehiculo) {
        const celda = this.celdas.find(c => c.getCodigo === codigoCelda);
        const vehiculo = this.vehiculos.find(v => v.getPlaca === placaVehiculo);
        
        if (celda && vehiculo) {
            celda.setEstado = 'ocupado';
            this.ocupacionCeldas.set(celda.getId, vehiculo.getId);
        }
    }

    pregunta(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    async autenticarUsuario() {
        console.log('\n' + '*'.repeat(55));
        console.log('    SISTEMA INTELIGENTE DE CELDAS DE PARQUEADERO');
        console.log('*'.repeat(55));
        console.log('Acceso requerido para continuar:');
        
        const email = await this.pregunta('Email corporativo: ');
        const clave = await this.pregunta('Contraseña de acceso: ');
        
        const usuario = this.usuarios.find(u => 
            u.getDireccion_correo === email && u.getClave === clave
        );
        
        if (usuario) {
            this.usuarioActual = usuario;
            console.log(`\nAcceso concedido para ${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}`);
            console.log(`Nivel de acceso: ${usuario.getPerfil_usuario.toUpperCase()}`);
            return true;
        } else {
            console.log('\nCredenciales incorrectas. Reintente el acceso.');
            return false;
        }
    }

    async mostrarMenu() {
        console.log('\n' + '='.repeat(50));
        console.log('         PANEL DE CONTROL DE CELDAS');
        console.log('='.repeat(50));
        console.log('1. Mostrar celdas por zona');
        console.log('2. Mostrar celdas por nivel');
        console.log('3. Consultar espacios libres');
        console.log('4. Consultar espacios ocupados');
        console.log('5. Mi panel personal de vehículos');
        console.log('6. Gestionar ocupación de celda');
        console.log('7. Localizar celda específica');
        console.log('8. Dashboard de estadísticas');
        console.log('9. Finalizar sesión');
        
        const opcion = await this.pregunta('\nSeleccione opción: ');
        return opcion;
    }

    // REQ-CLD-01: Visualizar por zona
    async mostrarCeldasPorZona() {
        console.log('\n' + '-'.repeat(45));
        console.log('           DISTRIBUCIÓN POR ZONA');
        console.log('-'.repeat(45));
        
        const zonas = [...new Set(this.celdas.map(c => c.getArea))];
        
        for (const zona of zonas) {
            console.log(`\n>>> ZONA ${zona.toUpperCase()} <<<`);
            const celdasZona = this.celdas.filter(c => c.getArea === zona);
            
            const niveles = [...new Set(celdasZona.map(c => c.getPiso))];
            
            niveles.forEach(nivel => {
                console.log(`  Nivel ${nivel}:`);
                const celdasNivel = celdasZona.filter(c => c.getPiso === nivel);
                
                const autos = celdasNivel.filter(c => c.getTipo === 'automóvil');
                const motos = celdasNivel.filter(c => c.getTipo === 'motocicleta');
                
                this.mostrarEspaciosPorCategoria('    Automóviles', autos);
                this.mostrarEspaciosPorCategoria('    Motocicletas', motos);
            });
        }
    }

    async mostrarCeldasPorNivel() {
        console.log('\n' + '-'.repeat(45));
        console.log('           DISTRIBUCIÓN POR NIVEL');
        console.log('-'.repeat(45));
        
        const niveles = [...new Set(this.celdas.map(c => c.getPiso))].sort();
        
        for (const nivel of niveles) {
            console.log(`\n>>> NIVEL ${nivel} <<<`);
            const celdasNivel = this.celdas.filter(c => c.getPiso === nivel);
            
            const zonas = [...new Set(celdasNivel.map(c => c.getArea))];
            
            zonas.forEach(zona => {
                console.log(`  Zona ${zona}:`);
                const celdasZona = celdasNivel.filter(c => c.getArea === zona);
                
                const autos = celdasZona.filter(c => c.getTipo === 'automóvil');
                const motos = celdasZona.filter(c => c.getTipo === 'motocicleta');
                
                this.mostrarEspaciosPorCategoria('    Automóviles', autos);
                this.mostrarEspaciosPorCategoria('    Motocicletas', motos);
            });
        }
    }

    mostrarEspaciosPorCategoria(titulo, celdas) {
        if (celdas.length === 0) return;
        
        console.log(`${titulo}:`);
        celdas.forEach(celda => {
            const vehiculo = this.obtenerVehiculoAsignado(celda);
            const infoVehiculo = vehiculo ? ` [${vehiculo.getPlaca} - ${vehiculo.getMarca}]` : '';
            const indicador = celda.getEstado === 'ocupado' ? '🚗' : '⭕';
            
            console.log(`      ${indicador} ${celda.getCodigo} - ${celda.getEstado.toUpperCase()}${infoVehiculo}`);
        });
    }

    // REQ-CLD-02: Espacios disponibles y ocupados
    consultarEspaciosLibres() {
        console.log('\n' + '-'.repeat(40));
        console.log('         ESPACIOS DISPONIBLES');
        console.log('-'.repeat(40));
        
        const espaciosLibres = this.celdas.filter(c => c.getEstado === 'disponible');
        
        if (espaciosLibres.length === 0) {
            console.log('Parqueadero completamente lleno en este momento.');
            return;
        }

        const autosLibres = espaciosLibres.filter(c => c.getTipo === 'automóvil');
        const motosLibres = espaciosLibres.filter(c => c.getTipo === 'motocicleta');
        
        console.log(`\nEspacios para AUTOMÓVILES: ${autosLibres.length} disponibles`);
        autosLibres.forEach(celda => {
            console.log(`  ✅ ${celda.getCodigo} - Zona ${celda.getArea}, Nivel ${celda.getPiso}`);
        });
        
        console.log(`\nEspacios para MOTOCICLETAS: ${motosLibres.length} disponibles`);
        motosLibres.forEach(celda => {
            console.log(`  ✅ ${celda.getCodigo} - Zona ${celda.getArea}, Nivel ${celda.getPiso}`);
        });
    }

    consultarEspaciosOcupados() {
        console.log('\n' + '-'.repeat(40));
        console.log('         ESPACIOS OCUPADOS');
        console.log('-'.repeat(40));
        
        const espaciosOcupados = this.celdas.filter(c => c.getEstado === 'ocupado');
        
        if (espaciosOcupados.length === 0) {
            console.log('Todos los espacios están disponibles actualmente.');
            return;
        }

        espaciosOcupados.forEach(celda => {
            const vehiculo = this.obtenerVehiculoAsignado(celda);
            const usuario = vehiculo ? this.usuarios.find(u => u.getId === vehiculo.getUsuario) : null;
            const propietario = usuario ? `${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}` : 'No identificado';
            
            console.log(`🚗 ${celda.getCodigo} - Zona ${celda.getArea}, Nivel ${celda.getPiso}`);
            console.log(`   Categoría: ${celda.getTipo}`);
            if (vehiculo) {
                console.log(`   Vehículo: ${vehiculo.getPlaca} - ${vehiculo.getMarca} ${vehiculo.getModelo}`);
                console.log(`   Conductor: ${propietario}`);
            }
            console.log('   ---');
        });
    }

    // REQ-CLD-02: Panel personal
    mostrarPanelPersonal() {
        if (this.usuarioActual.getPerfil_usuario === 'administrador' || 
            this.usuarioActual.getPerfil_usuario === 'operador') {
            console.log('\nEsta sección es exclusiva para usuarios finales. Staff administrativo tiene acceso completo.');
            return;
        }

        console.log('\n' + '-'.repeat(45));
        console.log('           MI PANEL PERSONAL');
        console.log('-'.repeat(45));
        
        const misVehiculos = this.vehiculos.filter(v => v.getUsuario === this.usuarioActual.getId);
        
        if (misVehiculos.length === 0) {
            console.log('No tiene vehículos registrados en el sistema.');
            return;
        }

        misVehiculos.forEach(vehiculo => {
            console.log(`\nVehículo registrado: ${vehiculo.getPlaca} - ${vehiculo.getMarca} ${vehiculo.getModelo}`);
            console.log(`Especificaciones: ${vehiculo.getTipo}, Color ${vehiculo.getColor}`);
            
            const celdaAsignada = this.celdas.find(c => {
                const vehiculoEnCelda = this.obtenerVehiculoAsignado(c);
                return vehiculoEnCelda && vehiculoEnCelda.getId === vehiculo.getId;
            });
            
            if (celdaAsignada) {
                console.log(`🚗 Ubicación actual: ${celdaAsignada.getCodigo} - Zona ${celdaAsignada.getArea}, Nivel ${celdaAsignada.getPiso}`);
            } else {
                console.log('✅ Vehículo fuera del parqueadero');
            }
            console.log('   ---');
        });
    }

    // REQ-CLD-03: Gestionar ocupación
    async gestionarOcupacionCelda() {
        if (!this.tienePermisosGestion()) {
            console.log('\nAcceso denegado. Solo personal autorizado puede gestionar celdas.');
            return;
        }

        console.log('\n' + '-'.repeat(45));
        console.log('         GESTIÓN DE OCUPACIÓN');
        console.log('-'.repeat(45));
        
        const codigo = await this.pregunta('Código de celda a gestionar: ');
        const celda = this.celdas.find(c => c.getCodigo === codigo);
        
        if (!celda) {
            console.log('\nCelda no localizada en el sistema.');
            return;
        }

        console.log(`\nCelda localizada: ${celda.getCodigo}`);
        console.log(`Estado: ${celda.getEstado}`);
        console.log(`Tipo de vehículo: ${celda.getTipo}`);
        console.log(`Ubicación: Zona ${celda.getArea}, Nivel ${celda.getPiso}`);

        if (celda.getEstado === 'disponible') {
            await this.procesarOcupacion(celda);
        } else {
            await this.procesarLiberacion(celda);
        }
    }

    async procesarOcupacion(celda) {
        console.log('\n--- PROCESO DE OCUPACIÓN ---');
        
        const vehiculosDisponibles = this.vehiculos.filter(v => {
            const tipoCoincide = (celda.getTipo === 'automóvil' && v.getTipo === 'automóvil') ||
                               (celda.getTipo === 'motocicleta' && v.getTipo === 'motocicleta');
            
            const noEstaOcupando = !this.celdas.some(c => {
                const vehiculoEnCelda = this.obtenerVehiculoAsignado(c);
                return vehiculoEnCelda && vehiculoEnCelda.getId === v.getId;
            });
            
            return tipoCoincide && noEstaOcupando;
        });

        if (vehiculosDisponibles.length === 0) {
            console.log(`Sin vehículos tipo "${celda.getTipo}" disponibles para asignar.`);
            return;
        }

        console.log('\nVehículos disponibles para asignación:');
        vehiculosDisponibles.forEach(v => {
            const usuario = this.usuarios.find(u => u.getId === v.getUsuario);
            const conductor = usuario ? `${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}` : 'Sin asignar';
            console.log(`${v.getId}. ${v.getPlaca} - ${v.getMarca} ${v.getModelo} [${conductor}]`);
        });

        const vehiculoId = parseInt(await this.pregunta('\nID del vehículo a asignar: '));
        const vehiculo = vehiculosDisponibles.find(v => v.getId === vehiculoId);
        
        if (!vehiculo) {
            console.log('\nID de vehículo inválido.');
            return;
        }

        celda.setEstado = 'ocupado';
        this.ocupacionCeldas.set(celda.getId, vehiculo.getId);
        
        console.log(`\n✅ Celda ${celda.getCodigo} asignada exitosamente al vehículo ${vehiculo.getPlaca}.`);
    }

    async procesarLiberacion(celda) {
        console.log('\n--- PROCESO DE LIBERACIÓN ---');
        
        const vehiculo = this.obtenerVehiculoAsignado(celda);
        if (vehiculo) {
            const usuario = this.usuarios.find(u => u.getId === vehiculo.getUsuario);
            const conductor = usuario ? `${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}` : 'Sin identificar';
            
            console.log(`Vehículo actual: ${vehiculo.getPlaca} - ${vehiculo.getMarca} ${vehiculo.getModelo}`);
            console.log(`Conductor: ${conductor}`);
        }

        const confirmacion = await this.pregunta('\n¿Confirmar liberación de celda? (s/n): ');
        
        if (confirmacion.toLowerCase() === 's' || confirmacion.toLowerCase() === 'si') {
            celda.setEstado = 'disponible';
            this.ocupacionCeldas.delete(celda.getId);
            
            console.log(`\n✅ Celda ${celda.getCodigo} liberada correctamente.`);
        } else {
            console.log('\nOperación cancelada por el usuario.');
        }
    }

    async localizarCeldaEspecifica() {
        console.log('\n' + '-'.repeat(40));
        console.log('         LOCALIZAR CELDA');
        console.log('-'.repeat(40));
        
        const codigo = await this.pregunta('Código de celda a localizar: ');
        const celda = this.celdas.find(c => c.getCodigo === codigo);
        
        if (!celda) {
            console.log('\nCelda no encontrada en el sistema.');
            return;
        }

        console.log(`\n--- INFORMACIÓN DETALLADA ---`);
        console.log(`Código: ${celda.getCodigo}`);
        console.log(`Tipo permitido: ${celda.getTipo}`);
        console.log(`Estado actual: ${celda.getEstado}`);
        console.log(`Ubicación: Zona ${celda.getArea}, Nivel ${celda.getPiso}`);
        
        if (celda.getEstado === 'ocupado') {
            const vehiculo = this.obtenerVehiculoAsignado(celda);
            if (vehiculo) {
                const usuario = this.usuarios.find(u => u.getId === vehiculo.getUsuario);
                const conductor = usuario ? `${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}` : 'Sin identificar';
                
                console.log(`\nDetalles del vehículo ocupando:`);
                console.log(`  Placa: ${vehiculo.getPlaca}`);
                console.log(`  Marca/Modelo: ${vehiculo.getMarca} ${vehiculo.getModelo}`);
                console.log(`  Color: ${vehiculo.getColor}`);
                console.log(`  Conductor: ${conductor}`);
            }
        }
    }

    mostrarDashboardEstadisticas() {
        console.log('\n' + '='.repeat(50));
        console.log('              DASHBOARD ESTADÍSTICAS');
        console.log('='.repeat(50));
        
        const totalCeldas = this.celdas.length;
        const ocupadas = this.celdas.filter(c => c.getEstado === 'ocupado').length;
        const disponibles = this.celdas.filter(c => c.getEstado === 'disponible').length;
        
        const espaciosAuto = this.celdas.filter(c => c.getTipo === 'automóvil');
        const espaciosMoto = this.celdas.filter(c => c.getTipo === 'motocicleta');
        
        const autosOcupados = espaciosAuto.filter(c => c.getEstado === 'ocupado').length;
        const motosOcupadas = espaciosMoto.filter(c => c.getEstado === 'ocupado').length;
        
        console.log(`Capacidad total: ${totalCeldas} espacios`);
        console.log(`Ocupación actual: ${ocupadas} espacios (${((ocupadas/totalCeldas)*100).toFixed(1)}%)`);
        console.log(`Disponibilidad: ${disponibles} espacios (${((disponibles/totalCeldas)*100).toFixed(1)}%)`);
        
        console.log(`\nDistribución por categoría:`);
        console.log(`  Automóviles: ${espaciosAuto.length} espacios [${autosOcupados} ocupados, ${espaciosAuto.length - autosOcupados} libres]`);
        console.log(`  Motocicletas: ${espaciosMoto.length} espacios [${motosOcupadas} ocupadas, ${espaciosMoto.length - motosOcupadas} libres]`);
        
        console.log(`\nOcupación por zona:`);
        const zonas = [...new Set(this.celdas.map(c => c.getArea))];
        zonas.forEach(zona => {
            const celdasZona = this.celdas.filter(c => c.getArea === zona);
            const ocupadasZona = celdasZona.filter(c => c.getEstado === 'ocupado').length;
            console.log(`  Zona ${zona}: ${celdasZona.length} espacios [${ocupadasZona} ocupados]`);
        });
    }

    obtenerVehiculoAsignado(celda) {
        const vehiculoId = this.ocupacionCeldas.get(celda.getId);
        return vehiculoId ? this.vehiculos.find(v => v.getId === vehiculoId) : null;
    }

    tienePermisosGestion() {
        return this.usuarioActual && 
               (this.usuarioActual.getPerfil_usuario === 'administrador' || 
                this.usuarioActual.getPerfil_usuario === 'operador');
    }

    async ejecutar() {
        let sesionActiva = false;
        
        while (!sesionActiva) {
            sesionActiva = await this.autenticarUsuario();
        }

        let continuar = true;
        while (continuar) {
            const opcion = await this.mostrarMenu();
            
            switch (opcion) {
                case '1':
                    await this.mostrarCeldasPorZona();
                    break;
                case '2':
                    await this.mostrarCeldasPorNivel();
                    break;
                case '3':
                    this.consultarEspaciosLibres();
                    break;
                case '4':
                    this.consultarEspaciosOcupados();
                    break;
                case '5':
                    this.mostrarPanelPersonal();
                    break;
                case '6':
                    await this.gestionarOcupacionCelda();
                    break;
                case '7':
                    await this.localizarCeldaEspecifica();
                    break;
                case '8':
                    this.mostrarDashboardEstadisticas();
                    break;
                case '9':
                    console.log('\nSesión finalizada. Sistema desconectado.');
                    continuar = false;
                    break;
                default:
                    console.log('\nOpción inválida. Seleccione una opción válida del menú.');
            }
            
            if (continuar) {
                await this.pregunta('\nPresione Enter para regresar al menú...');
            }
        }
        
        this.rl.close();
    }
}

// Extensiones para la clase Celda
Celda.prototype.getCodigo = function() {
    return this._codigo;
};

Celda.prototype.setCodigo = function(codigo) {
    this._codigo = codigo;
};

Celda.prototype.getArea = function() {
    return this._area;
};

Celda.prototype.setArea = function(area) {
    this._area = area;
};

Celda.prototype.getPiso = function() {
    return this._piso;
};

Celda.prototype.setPiso = function(piso) {
    this._piso = piso;
};

// Inicializar el sistema
const controlCelda = new ControlCelda();
controlCelda.ejecutar().catch(console.error);