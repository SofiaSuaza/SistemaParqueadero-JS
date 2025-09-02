import Usuario from "../Usuario.js";
import PerfilUsuario from "../Perfilusuario.js";
import readline from "readline";

// REQ-USR-1: Solo 3 perfiles de usuario
const perfilUsuario1 = new PerfilUsuario(1, 'Administrador');
const perfilUsuario2 = new PerfilUsuario(2, 'Operador');
const perfilUsuario3 = new PerfilUsuario(3, 'Usuario');

// Usuarios del sistema
const usuario1 = new Usuario(1, 'C.C', '987654321', 'Sofia', '', 'Suaza', 'Guzmán', 'sofiasuaza@gmail.com', '3156789012', 'admin_foto.jpg', 'Activo', 'admin123', perfilUsuario1);
const usuario2 = new Usuario(2, 'T.I', '456789123', 'Maria', 'Alejandra', 'Torres', 'Vega', 'mariatorres@gmail.com', '3201234567', 'operador_foto.jpg', 'Activo', 'oper456', perfilUsuario2);
const usuario3 = new Usuario(3, 'C.C', '789123456', 'Luis', 'Fernando', 'Castro', 'Morales', 'luiscastro@gmail.com', '3187654321', 'usuario_foto.jpg', 'Activo', '', perfilUsuario3);

console.log("*".repeat(50));
console.log("🚗 SISTEMA DE GESTIÓN DE PARQUEADERO INTELIGENTE");
console.log("*".repeat(50));

const perfiles = [perfilUsuario1, perfilUsuario2, perfilUsuario3];
const usuarios = [usuario1, usuario2, usuario3];
let nextId = usuarios.length + 1;
let usuarioLogueado = null;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función auxiliar para validaciones comunes
const validaciones = {
    esNumerico: (valor) => /^[0-9]+$/.test(valor),
    esEmailValido: (email) => email.includes("@") && email.includes("."),
    esPlacaValida: (placa) => /^[A-Z]{3}[0-9]{3}$/.test(placa)
};

function crearUsuario() {
    if (!usuarioLogueado) {
        console.log("⛔ Acceso denegado. Debe autenticarse primero.");
        return mostrarMenu();
    }
    
    if (!["Administrador", "Operador"].includes(usuarioLogueado.getPerfil_usuario.getPerfil)) {
        console.log("🚫 Permisos insuficientes. Solo Admin y Operadores pueden registrar usuarios.");
        return mostrarMenu();
    }

    console.log("\n" + "─".repeat(45));
    console.log("🆕 REGISTRO DE NUEVO USUARIO");
    console.log("─".repeat(45));
    
    console.log("📄 Documentos válidos: C.C, T.I, C.E");
    rl.question("Tipo de documento: ", (tipoDoc) => {
        if (!tipoDoc.trim()) {
            console.log("⚠️ Tipo de documento requerido.");
            return mostrarMenu();
        }

        rl.question("Número de documento: ", (numDoc) => {
            if (!numDoc.trim() || !validaciones.esNumerico(numDoc)) {
                console.log("⚠️ Ingrese un número de documento válido.");
                return mostrarMenu();
            }

            if (usuarios.find(u => u.getNumero_documento === numDoc)) {
                console.log("❌ Documento ya registrado en el sistema.");
                return mostrarMenu();
            }

            rl.question("Primer nombre: ", (primerNombre) => {
                if (!primerNombre.trim()) {
                    console.log("⚠️ Primer nombre es obligatorio.");
                    return mostrarMenu();
                }

                rl.question("Segundo nombre (opcional): ", (segundoNombre) => {
                    rl.question("Primer apellido: ", (primerApellido) => {
                        if (!primerApellido.trim()) {
                            console.log("⚠️ Primer apellido es obligatorio.");
                            return mostrarMenu();
                        }

                        rl.question("Segundo apellido (opcional): ", (segundoApellido) => {
                            rl.question("Email corporativo: ", (correo) => {
                                if (!correo.trim() || !validaciones.esEmailValido(correo)) {
                                    console.log("⚠️ Email válido requerido.");
                                    return mostrarMenu();
                                }

                                rl.question("Celular: ", (celular) => {
                                    if (!celular.trim() || !validaciones.esNumerico(celular)) {
                                        console.log("⚠️ Número de celular válido requerido.");
                                        return mostrarMenu();
                                    }

                                    rl.question("Foto de perfil (opcional): ", (foto) => {
                                        console.log("\n🎯 Roles disponibles:");
                                        console.log("1. Administrador  2. Operador  3. Usuario");
                                        
                                        rl.question("Seleccione rol (1-3): ", (opcion) => {
                                            if (!["1", "2", "3"].includes(opcion)) {
                                                console.log("❌ Opción inválida.");
                                                return mostrarMenu();
                                            }

                                            const perfil = perfiles.find(p => p.getId == parseInt(opcion));
                                            
                                            if (opcion === "1" || opcion === "2") {
                                                rl.question("Contraseña de acceso (min 6 caracteres): ", (clave) => {
                                                    if (!clave || clave.length < 6) {
                                                        console.log("⚠️ Contraseña debe tener mínimo 6 caracteres.");
                                                        return mostrarMenu();
                                                    }

                                                    const nuevoUsuario = new Usuario(nextId++, tipoDoc.trim(), numDoc.trim(), 
                                                        primerNombre.trim(), segundoNombre.trim() || "", primerApellido.trim(), 
                                                        segundoApellido.trim() || "", correo.trim(), celular.trim(), 
                                                        foto.trim() || "", "Activo", clave, perfil);
                                                    
                                                    usuarios.push(nuevoUsuario);
                                                    console.log("\n🎉 Usuario " + perfil.getPerfil + " registrado exitosamente!");
                                                    console.log("🔢 ID: " + nuevoUsuario.getId + " | 👤 " + nuevoUsuario.getPrimer_nombre + " " + nuevoUsuario.getPrimer_apellido);
                                                    mostrarMenu();
                                                });
                                            } else {
                                                const nuevoUsuario = new Usuario(nextId++, tipoDoc.trim(), numDoc.trim(), 
                                                    primerNombre.trim(), segundoNombre.trim() || "", primerApellido.trim(), 
                                                    segundoApellido.trim() || "", correo.trim(), celular.trim(), 
                                                    foto.trim() || "", "Activo", "", perfil);
                                                
                                                usuarios.push(nuevoUsuario);
                                                console.log("\n🎉 Usuario registrado correctamente!");
                                                console.log("🔢 ID: " + nuevoUsuario.getId + " | 👤 " + nuevoUsuario.getPrimer_nombre + " " + nuevoUsuario.getPrimer_apellido);
                                                mostrarMenu();
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function cambiarEstadoUsuario() {
    if (!usuarioLogueado || usuarioLogueado.getPerfil_usuario.getPerfil !== "Administrador") {
        console.log("🚫 Solo el Administrador puede gestionar estados de usuario.");
        return mostrarMenu();
    }

    console.log("\n" + "─".repeat(40));
    console.log("🔄 GESTIÓN DE ESTADO DE USUARIO");
    console.log("─".repeat(40));
    
    rl.question("Documento del usuario a modificar: ", (numDoc) => {
        if (!numDoc.trim() || !validaciones.esNumerico(numDoc)) {
            console.log("⚠️ Documento válido requerido.");
            return mostrarMenu();
        }

        const usuario = usuarios.find(u => u.getNumero_documento === numDoc.trim());
        if (!usuario) {
            console.log("❌ Usuario no localizado.");
            return mostrarMenu();
        }

        console.log("👤 " + usuario.getPrimer_nombre + " " + usuario.getPrimer_apellido + " | Estado: " + usuario.getEstado);

        if (usuario.getEstado === "Activo") {
            usuario.setEstado = "Inactivo";
            console.log("🔒 Usuario desactivado exitosamente");
        } else {
            console.log("ℹ️ Usuario ya está inactivo.");
        }
        
        mostrarMenu();
    });
}

function actualizarMisDatos() {
    if (!usuarioLogueado) {
        console.log("⛔ Debe autenticarse para modificar datos.");
        return mostrarMenu();
    }

    console.log("\n" + "─".repeat(45));
    console.log("✏️ ACTUALIZACIÓN DE DATOS PERSONALES");
    console.log("─".repeat(45));
    console.log("👤 " + usuarioLogueado.getPrimer_nombre + " " + usuarioLogueado.getPrimer_apellido);
    console.log("💡 Nuevo valor o Enter para mantener actual\n");
    
    rl.question("Primer nombre (" + usuarioLogueado.getPrimer_nombre + "): ", (primerNombre) => {
        rl.question("Segundo nombre (" + usuarioLogueado.getSegundo_nombre + "): ", (segundoNombre) => {
            rl.question("Primer apellido (" + usuarioLogueado.getPrimer_apellido + "): ", (primerApellido) => {
                rl.question("Segundo apellido (" + usuarioLogueado.getSegundo_apellido + "): ", (segundoApellido) => {
                    rl.question("Email (" + usuarioLogueado.getDireccion_correo + "): ", (correo) => {
                        rl.question("Celular (" + usuarioLogueado.getNumero_celular + "): ", (celular) => {
                            
                            let cambios = [];
                            
                            if (primerNombre.trim()) { usuarioLogueado.setPrimer_nombre = primerNombre.trim(); cambios.push("Primer nombre"); }
                            if (segundoNombre.trim()) { usuarioLogueado.setSegundo_nombre = segundoNombre.trim(); cambios.push("Segundo nombre"); }
                            if (primerApellido.trim()) { usuarioLogueado.setPrimer_apellido = primerApellido.trim(); cambios.push("Primer apellido"); }
                            if (segundoApellido.trim()) { usuarioLogueado.setSegundo_apellido = segundoApellido.trim(); cambios.push("Segundo apellido"); }
                            if (correo.trim() && validaciones.esEmailValido(correo)) { usuarioLogueado.setDireccion_correo = correo.trim(); cambios.push("Email"); }
                            if (celular.trim() && validaciones.esNumerico(celular)) { usuarioLogueado.setNumero_celular = celular.trim(); cambios.push("Celular"); }

                            if (cambios.length > 0) {
                                console.log("\n✨ Datos actualizados: " + cambios.join(", "));
                                console.log("📨 Notificación enviada al administrador");
                            } else {
                                console.log("ℹ️ Sin cambios realizados");
                            }
                            
                            mostrarMenu();
                        });
                    });
                });
            });
        });
    });
}

function actualizarDatosUsuario() {
    if (!usuarioLogueado || usuarioLogueado.getPerfil_usuario.getPerfil !== "Administrador") {
        console.log("🚫 Solo el Administrador puede modificar datos de usuarios.");
        return mostrarMenu();
    }

    console.log("\n" + "─".repeat(40));
    console.log("🛠️ MODIFICAR DATOS DE USUARIO");
    console.log("─".repeat(40));
    
    rl.question("Documento del usuario: ", (numDoc) => {
        const usuario = usuarios.find(u => u.getNumero_documento === numDoc.trim());
        if (!usuario) {
            console.log("❌ Usuario no encontrado.");
            return mostrarMenu();
        }

        console.log("\n✏️ Editando: " + usuario.getPrimer_nombre + " " + usuario.getPrimer_apellido);
        
        rl.question("Primer nombre (" + usuario.getPrimer_nombre + "): ", (nombre) => {
            rl.question("Email (" + usuario.getDireccion_correo + "): ", (correo) => {
                rl.question("Celular (" + usuario.getNumero_celular + "): ", (celular) => {
                    
                    let cambios = [];
                    if (nombre.trim()) { usuario.setPrimer_nombre = nombre.trim(); cambios.push("Nombre"); }
                    if (correo.trim() && validaciones.esEmailValido(correo)) { usuario.setDireccion_correo = correo.trim(); cambios.push("Email"); }
                    if (celular.trim() && validaciones.esNumerico(celular)) { usuario.setNumero_celular = celular.trim(); cambios.push("Celular"); }

                    console.log(cambios.length > 0 ? "\n✨ Cambios aplicados: " + cambios.join(", ") : "ℹ️ Sin modificaciones");
                    mostrarMenu();
                });
            });
        });
    });
}

function asignarVehiculo() {
    if (!usuarioLogueado || !["Administrador", "Operador"].includes(usuarioLogueado.getPerfil_usuario.getPerfil)) {
        console.log("🚫 Solo Admin y Operadores pueden asignar vehículos.");
        return mostrarMenu();
    }

    console.log("\n" + "─".repeat(40));
    console.log("🚗 ASIGNACIÓN DE VEHÍCULO");
    console.log("─".repeat(40));
    
    rl.question("Documento del usuario: ", (numDoc) => {
        const usuario = usuarios.find(u => u.getNumero_documento === numDoc.trim());
        if (!usuario) {
            console.log("❌ Usuario no localizado.");
            return mostrarMenu();
        }

        console.log("👤 " + usuario.getPrimer_nombre + " " + usuario.getPrimer_apellido);
        
        rl.question("Placa del vehículo (ej: ABC123): ", (placa) => {
            const placaUpper = placa.trim().toUpperCase();
            if (!validaciones.esPlacaValida(placaUpper)) {
                console.log("❌ Formato de placa inválido (debe ser ABC123).");
                return mostrarMenu();
            }
            
            usuario.vehiculo = placaUpper;
            console.log("🎯 Vehículo " + placaUpper + " asignado a " + usuario.getPrimer_nombre + " " + usuario.getPrimer_apellido);
            mostrarMenu();
        });
    });
}

function loginAdminOperador() {
    console.log("\n" + "─".repeat(40));
    console.log("🔐 ACCESO ADMINISTRATIVO");
    console.log("─".repeat(40));
    
    rl.question("Documento: ", (numDoc) => {
        if (!numDoc.trim() || !validaciones.esNumerico(numDoc)) {
            console.log("⚠️ Documento válido requerido.");
            return mostrarMenu();
        }

        rl.question("Contraseña: ", (clave) => {
            const usuario = usuarios.find(u => 
                u.getNumero_documento === numDoc.trim() && 
                u.getClave === clave &&
                u.getEstado === "Activo"
            );
            
            if (!usuario || !["Administrador", "Operador"].includes(usuario.getPerfil_usuario.getPerfil)) {
                console.log("❌ Credenciales inválidas o sin permisos administrativos.");
                return mostrarMenu();
            }
            
            usuarioLogueado = usuario;
            console.log("\n🎊 Bienvenido " + usuario.getPrimer_nombre + " " + usuario.getPrimer_apellido);
            console.log("🏆 Rol: " + usuario.getPerfil_usuario.getPerfil + " | ID: " + usuario.getId);
            mostrarMenu();
        });
    });
}

function loginUsuario() {
    console.log("\n" + "─".repeat(40));
    console.log("🚪 ACCESO DE USUARIO");
    console.log("─".repeat(40));
    
    rl.question("Número de documento: ", (numDoc) => {
        if (!numDoc.trim() || !validaciones.esNumerico(numDoc)) {
            console.log("⚠️ Documento válido requerido.");
            return mostrarMenu();
        }

        const usuario = usuarios.find(u => 
            u.getNumero_documento === numDoc.trim() && 
            u.getEstado === "Activo"
        );
        
        if (!usuario) {
            console.log("❌ Usuario no encontrado o cuenta suspendida.");
            return mostrarMenu();
        }
        
        usuarioLogueado = usuario;
        console.log("\n🎊 Hola " + usuario.getPrimer_nombre + " " + usuario.getPrimer_apellido);
        console.log("🏷️ Perfil: " + usuario.getPerfil_usuario.getPerfil + " | ID: " + usuario.getId);
        mostrarMenu();
    });
}

function cerrarSesion() {
    if (usuarioLogueado) {
        console.log("👋 Sesión finalizada. Hasta pronto " + usuarioLogueado.getPrimer_nombre + "!");
        usuarioLogueado = null;
    } else {
        console.log("ℹ️ No hay sesión activa");
    }
    mostrarMenu();
}

function verUsuarios() {
    if (!usuarioLogueado) {
        console.log("⛔ Debe autenticarse para ver esta información.");
        return mostrarMenu();
    }

    console.log("\n" + "=".repeat(70));
    console.log("                    📊 REGISTRO DE USUARIOS");
    console.log("=".repeat(70));
    console.log("ID | Documento | Nombre | Estado | Perfil | Vehículo");
    console.log("-".repeat(70));
    
    usuarios.forEach(u => {
        const vehiculo = u.vehiculo || "No asignado";
        console.log(u.getId + " | " + u.getNumero_documento + " | " + u.getPrimer_nombre + " " + u.getPrimer_apellido + " | " + u.getEstado + " | " + u.getPerfil_usuario.getPerfil + " | " + vehiculo);
    });
    
    mostrarMenu();
}

function mostrarMenu() {
    console.log("\n" + "=".repeat(65));
    console.log("            🚗 SISTEMA DE GESTIÓN DE PARQUEADERO");
    console.log("=".repeat(65));
    
    if (usuarioLogueado) {
        console.log("🟢 Sesión: " + usuarioLogueado.getPrimer_nombre + " " + usuarioLogueado.getPrimer_apellido + " (" + usuarioLogueado.getPerfil_usuario.getPerfil + ")");
    } else {
        console.log("🔴 Sin sesión - Autentíquese para acceder a funciones");
    }
    
    console.log("\n📋 OPCIONES:");
    console.log("1️⃣  Registrar usuario (Admin/Operador)");
    console.log("2️⃣  Cambiar estado usuario (Admin)");
    console.log("3️⃣  Actualizar mis datos (Usuario logueado)");
    console.log("4️⃣  Modificar datos usuario (Admin)");
    console.log("5️⃣  Asignar vehículo (Admin/Operador)");
    console.log("6️⃣  Login Admin/Operador");
    console.log("7️⃣  Login Usuario");
    console.log("8️⃣  Ver usuarios (Usuario logueado)");
    console.log("9️⃣  Cerrar sesión");
    console.log("0️⃣  Salir");

    rl.question("\n🎯 Opción (0-9): ", (opcion) => {
        const opciones = {
            "1": crearUsuario,
            "2": cambiarEstadoUsuario,
            "3": actualizarMisDatos,
            "4": actualizarDatosUsuario,
            "5": asignarVehiculo,
            "6": loginAdminOperador,
            "7": loginUsuario,
            "8": verUsuarios,
            "9": cerrarSesion,
            "0": () => {
                console.log("👋 ¡Gracias por usar el Sistema de Parqueadero!");
                console.log("🔚 Finalizando aplicación...");
                rl.close();
            }
        };

        if (opciones[opcion.trim()]) {
            opciones[opcion.trim()]();
        } else {
            console.log("❌ Opción inválida. Seleccione 0-9.");
            mostrarMenu();
        }
    });
}

console.log("🚀 Iniciando Sistema de Parqueadero...");
console.log("🔑 Usuarios de prueba:");
console.log("   👨‍💼 Admin: documento 987654321, contraseña: admin123");
console.log("   👷‍♂️ Operador: documento 456789123, contraseña: oper456");
console.log("   👤 Usuario: documento 789123456 (sin contraseña)");
console.log("\n✅ Sistema listo para operar!");
mostrarMenu();