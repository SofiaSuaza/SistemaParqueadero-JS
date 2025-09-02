# Parking Lot System

Este documento describe los requerimientos funcionales del sistema **Parking Lot**, el cual tiene como propósito gestionar de manera eficiente los procesos relacionados con el acceso, permanencia y control de vehículos dentro de un parqueadero. El sistema contempla la administración de usuarios, vehículos, accesos, incidencias, celdas de parqueo y generación de reportes.

---

## Autora
**Sofía Suaza**

---

## Video Explicativo
La explicación detallada de este sistema puede visualizarse en el siguiente enlace:  
[Ver video en YouTube](https://youtu.be/Sm5RZ-TJyeg?si=g_kPaNQHQOT3XhGD)

---

## Requerimientos del Sistema

### 1. Requerimientos de Usuario
- **REQ-USR-1:** El sistema debe contar con tres perfiles de usuario en su configuración inicial: **Administrador, Operador y Usuario**.  
- **REQ-USR-2:** Únicamente el Administrador y los Operadores podrán crear nuevos usuarios, registrando los siguientes datos: tipo y número de documento (obligatorios), nombre completo (obligatorio), correo electrónico (obligatorio), número de celular (obligatorio), fotografía (opcional), tipo de usuario. El sistema generará un **código único autoincremental** que identificará al usuario.  
- **REQ-USR-3:** Solo el Administrador podrá actualizar el estado de un usuario de **activo** a **inactivo**.  
- **REQ-USR-4:** Cada usuario podrá actualizar sus propios datos personales; al hacerlo se notificará al Administrador.  
- **REQ-USR-5:** El Administrador tendrá la facultad de actualizar los datos de cualquier usuario.  
- **REQ-USR-6:** El Administrador y los Operadores podrán asignar un vehículo a un usuario.  
- **REQ-USR-7:** El acceso al sistema para Administradores y Operadores se realizará mediante número de documento y contraseña.  
- **REQ-USR-8:** Los Usuarios podrán acceder al sistema únicamente con su número de documento.  

### 2. Requerimientos de Vehículo
- **REQ-CAR-1:** El Administrador o los Operadores podrán registrar un vehículo, incluyendo: **placa, color, marca y modelo**.  
- **REQ-CAR-2:** Solo el Administrador podrá actualizar la información de los vehículos registrados.  
- **REQ-CAR-3:** Únicamente el Administrador podrá reasignar un vehículo a un usuario diferente.  
- **REQ-CAR-4:** El Administrador o los Operadores podrán configurar una tabla de **restricciones de placas por día (pico y placa)**.  

### 3. Requerimientos de Accesos y Salidas
- **REQ-INEX-1:** El Administrador o los Operadores podrán registrar la entrada de un vehículo en cualquiera de los accesos, registrando: puerta de acceso, placa, fecha y hora de ingreso.  
- **REQ-INEX-2:** El Administrador o los Operadores podrán registrar la salida de un vehículo en cualquiera de los accesos, registrando: puerta de acceso, placa, fecha y hora de salida.  
- **REQ-INEX-3:** El sistema iniciará un conteo de tiempo al ingreso de un vehículo y lo finalizará al registrar la salida. El tiempo transcurrido deberá quedar registrado.  
- **REQ-INEX-4:** El sistema debe impedir el ingreso de vehículos cuya placa incumpla las restricciones establecidas (pico y placa).  

### 4. Requerimientos de Incidencias
- **REQ-INCD-1:** El sistema permitirá registrar incidencias ocurridas en el parqueadero, tales como: rayones, choques, atropellamientos, golpes contra muros. Cada incidencia tendrá un **código único autogenerado**, junto con los datos del vehículo afectado, fecha, hora y tipo de incidencia.  

### 5. Requerimientos de Celdas de Parqueo
- **REQ-CLD-01:** El Administrador, los Operadores y los Usuarios podrán visualizar todas las celdas de parqueo disponibles u ocupadas, organizadas por área, piso o nivel. Cada celda contará con: **estado (ocupada/disponible), código único, tipo de celda (moto o carro) y área asignada**.  
- **REQ-CLD-02:** Los Usuarios podrán visualizar las celdas disponibles y ocupadas mediante su cuenta en una interfaz individual.  
- **REQ-CLD-03:** El sistema permitirá actualizar el estado de las celdas (ocupada/disponible) en cualquier momento, asociando un vehículo cuando la celda esté ocupada.  

### 6. Requerimientos de Reporte y Consulta
- **REQ-REP-01:** Solo el Administrador podrá consultar y generar listados de todos los usuarios registrados con sus datos completos.  
- **REQ-REP-02:** Solo el Administrador podrá consultar y generar listados de todos los vehículos registrados junto con el usuario propietario.  
- **REQ-REP-03:** Solo el Administrador podrá listar todas las entradas al parqueadero con su respectiva fecha, hora y vehículo.  
- **REQ-REP-04:** Solo el Administrador podrá listar todas las salidas del parqueadero con su respectiva fecha, hora y vehículo.  
- **REQ-REP-05:** Solo el Administrador podrá listar todas las incidencias registradas en el parqueadero.  
- **REQ-REP-06:** Solo el Administrador podrá listar el total de vehículos restringidos por pico y placa en un día determinado.  
- **REQ-REP-07:** Solo el Administrador podrá listar el total de celdas ocupadas en un día determinado.  
- **REQ-REP-08:** Solo el Administrador podrá listar las celdas más utilizadas en un periodo de tiempo específico.  
- **REQ-REP-09:** Solo el Administrador podrá listar los vehículos que más usan el parqueadero.  
- **REQ-REP-10:** Solo el Administrador podrá listar las horas y días en los que el parqueadero alcanza mayor ocupación.  

---

