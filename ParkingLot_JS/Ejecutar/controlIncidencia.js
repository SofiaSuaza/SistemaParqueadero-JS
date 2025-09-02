
import vehiculo from '../Vehiculo.js';
import reporte_incidencia from '../Reporteincidencia.js';
import historial_parqueo from '../Historialparqueo.js';
import readline from 'readline';

class ControladorIncidencias {
    constructor() {
        this.incidencias = [];
        this.vehiculos = [];
        this.tiposIncidencia = ['Rayón', 'Choque', 'Atropellamiento', 'Golpe contra muro'];
        this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        this.inicializarVehiculos();
    }

    inicializarVehiculos() {
        this.vehiculos = [
            new vehiculo(1, 'ABC123', 'Rojo', 'Toyota', 'Corolla', 'Sedán', 101),
            new vehiculo(2, 'XYZ789', 'Azul', 'Chevrolet', 'Spark', 'Compacto', 102),
            new vehiculo(3, 'DEF456', 'Blanco', 'Renault', 'Logan', 'Sedán', 103),
            new vehiculo(4, 'GHI321', 'Negro', 'Mazda', 'CX-5', 'SUV', 104)
        ];
    }

    generarCodigo() {
        return `INC-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    }

    buscarVehiculo(placa) {
        return this.vehiculos.find(v => v.getPlaca.toLowerCase() === placa.toLowerCase());
    }

    mostrarVehiculo(v) {
        console.log(`${v.getPlaca} | ${v.getMarca} ${v.getModelo} | ${v.getColor} | ID: ${v.getUsuario_id}`);
    }

    listarVehiculos() {
        console.log('\n🚗 VEHÍCULOS:');
        this.vehiculos.forEach((v, i) => console.log(`${i + 1}. ${v.getPlaca} - ${v.getMarca} ${v.getModelo} (${v.getColor})`));
    }

    async registrarVehiculo() {
        const placa = await this.p('Placa: ');
        if (this.buscarVehiculo(placa)) {
            console.log('❌ Ya existe');
            return;
        }
        
        const color = await this.p('Color: ');
        const marca = await this.p('Marca: ');
        const modelo = await this.p('Modelo: ');
        const tipo = await this.p('Tipo: ');
        const userId = await this.p('ID usuario: ');
        
        const v = new vehiculo(this.vehiculos.length + 1, placa.toUpperCase(), color, marca, modelo, tipo, parseInt(userId));
        this.vehiculos.push(v);
        console.log('✅ Vehículo registrado');
        this.mostrarVehiculo(v);
    }

    async registrarIncidencia() {
        console.log('\n📝 NUEVA INCIDENCIA');
        
        try {
            this.listarVehiculos();
            const placa = await this.p('Placa afectada: ');
            const vehiculoAfectado = this.buscarVehiculo(placa);
            
            if (!vehiculoAfectado) {
                console.log('❌ Vehículo no encontrado');
                return;
            }

            console.log('\n✅ Vehículo:');
            this.mostrarVehiculo(vehiculoAfectado);
            
            console.log('\nTipos:');
            this.tiposIncidencia.forEach((tipo, i) => console.log(`${i + 1}. ${tipo}`));
            
            const tipoNum = await this.p('Tipo (1-4): ');
            const tipoIndex = parseInt(tipoNum) - 1;
            
            if (tipoIndex < 0 || tipoIndex >= this.tiposIncidencia.length) {
                console.log('❌ Tipo inválido');
                return;
            }
            
            const descripcion = await this.p('Descripción: ');
            const fechaHora = new Date();
            
            const reporte = new reporte_incidencia(vehiculoAfectado, this.tiposIncidencia[tipoIndex], fechaHora);
            
            const incidencia = {
                codigo: this.generarCodigo(),
                reporte: reporte,
                descripcion: descripcion || 'Sin descripción',
                fecha: fechaHora.toLocaleDateString('es-CO'),
                hora: fechaHora.toLocaleTimeString('es-CO')
            };
            
            this.incidencias.push(incidencia);
            console.log(`✅ Incidencia ${incidencia.codigo} registrada`);
            
        } catch (error) {
            console.log('❌ Error:', error.message);
        }
    }

    mostrarDetalle(inc) {
        console.log(`Código: ${inc.codigo} | ${inc.fecha} ${inc.hora}`);
        console.log(`Tipo: ${inc.reporte._incidencia} | ${inc.descripcion}`);
        this.mostrarVehiculo(inc.reporte._vehiculo);
    }

    verIncidencias() {
        console.log('\n📋 INCIDENCIAS');
        if (!this.incidencias.length) {
            console.log('Sin registros');
            return;
        }
        this.incidencias.forEach((inc, i) => {
            console.log(`\n${i + 1}.`);
            this.mostrarDetalle(inc);
        });
    }

    async buscarCodigo() {
        const codigo = await this.p('Código: ');
        const inc = this.incidencias.find(i => i.codigo.toLowerCase() === codigo.toLowerCase());
        
        if (inc) {
            console.log('\n✅ Encontrada:');
            this.mostrarDetalle(inc);
        } else {
            console.log('❌ No encontrada');
        }
    }

    async filtrarTipo() {
        console.log('\nTipos:');
        this.tiposIncidencia.forEach((tipo, i) => console.log(`${i + 1}. ${tipo}`));
        
        const tipoNum = await this.p('Tipo (1-4): ');
        const tipoIndex = parseInt(tipoNum) - 1;
        
        if (tipoIndex < 0 || tipoIndex >= this.tiposIncidencia.length) {
            console.log('❌ Tipo inválido');
            return;
        }
        
        const filtradas = this.incidencias.filter(inc => inc.reporte._incidencia === this.tiposIncidencia[tipoIndex]);
        
        console.log(`\n📊 TIPO: ${this.tiposIncidencia[tipoIndex]}`);
        if (!filtradas.length) {
            console.log('Sin registros de este tipo');
        } else {
            filtradas.forEach((inc, i) => {
                console.log(`\n${i + 1}.`);
                this.mostrarDetalle(inc);
            });
        }
    }

    mostrarEstadisticas() {
        console.log('\n📊 ESTADÍSTICAS');
        
        if (!this.incidencias.length) {
            console.log('Sin datos');
            return;
        }

        console.log(`Total incidencias: ${this.incidencias.length}`);
        console.log(`Total vehículos: ${this.vehiculos.length}`);
        
        console.log('\nPor tipo:');
        this.tiposIncidencia.forEach(tipo => {
            const cant = this.incidencias.filter(inc => inc.reporte._incidencia === tipo).length;
            const pct = ((cant / this.incidencias.length) * 100).toFixed(1);
            console.log(`${tipo}: ${cant} (${pct}%)`);
        });

        const porFecha = {};
        this.incidencias.forEach(inc => porFecha[inc.fecha] = (porFecha[inc.fecha] || 0) + 1);
        
        console.log('\nPor fecha:');
        Object.entries(porFecha).forEach(([fecha, cant]) => console.log(`${fecha}: ${cant}`));

        const porVehiculo = {};
        this.incidencias.forEach(inc => {
            const placa = inc.reporte._vehiculo.getPlaca;
            porVehiculo[placa] = (porVehiculo[placa] || 0) + 1;
        });

        console.log('\nMás afectados:');
        Object.entries(porVehiculo)
            .sort(([,a], [,b]) => b - a)
            .forEach(([placa, cant]) => console.log(`${placa}: ${cant}`));
    }

    verVehiculos() {
        console.log('\n🚗 VEHÍCULOS');
        if (!this.vehiculos.length) {
            console.log('Sin vehículos');
            return;
        }
        this.vehiculos.forEach((v, i) => {
            console.log(`${i + 1}. ID: ${v.getId}`);
            this.mostrarVehiculo(v);
        });
    }

    p(texto) {
        return new Promise(resolve => this.rl.question(texto, respuesta => resolve(respuesta.trim())));
    }

    mostrarMenu() {
        console.log('\n' + '='.repeat(40));
        console.log('  CONTROL DE INCIDENCIAS');
        console.log('='.repeat(40));
        console.log('1. Nueva incidencia');
        console.log('2. Ver incidencias');
        console.log('3. Buscar por código');
        console.log('4. Filtrar por tipo');
        console.log('5. Estadísticas');
        console.log('6. Ver vehículos');
        console.log('7. Nuevo vehículo');
        console.log('0. Salir');
        console.log('='.repeat(40));
    }

    async ejecutarMenu() {
        return new Promise((resolve) => {
            this.mostrarMenu();
            this.rl.question('Opción: ', async (opcion) => {
                switch(opcion) {
                    case '1': await this.registrarIncidencia(); break;
                    case '2': this.verIncidencias(); break;
                    case '3': await this.buscarCodigo(); break;
                    case '4': await this.filtrarTipo(); break;
                    case '5': this.mostrarEstadisticas(); break;
                    case '6': this.verVehiculos(); break;
                    case '7': await this.registrarVehiculo(); break;
                    case '0':
                        console.log('👋 Hasta pronto');
                        this.rl.close();
                        resolve();
                        return;
                    default: console.log('❌ Opción inválida');
                }
                
                this.rl.question('\nEnter para continuar...', () => {
                    this.ejecutarMenu().then(resolve);
                });
            });
        });
    }

    async iniciar() {
        console.log('🚗 Iniciando Sistema de Control de Incidencias...');
        console.log('Parqueadero - Gestión de Incidencias v2.0');
        console.log(`📊 ${this.vehiculos.length} vehículos registrados`);
        await this.ejecutarMenu();
    }
}

const controlador = new ControladorIncidencias();

process.on('SIGINT', () => {
    console.log('\n👋 Cerrando sistema...');
    controlador.rl.close();
    process.exit(0);
});

controlador.iniciar().catch(console.error);

export default ControladorIncidencias;