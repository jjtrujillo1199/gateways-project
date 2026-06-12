# 🚀 Proyecto Gateways - Angular SPA

## 📋 Descripción
Este proyecto es un **Frontend SPA en Angular (standalone)** que implementa un módulo de rutas con **lazy loading** para la gestión de *Gateways*.  
Incluye vistas de listado, detalle y formulario de creación/edición, con formularios reactivos, validaciones avanzadas y manejo de estado con **Signals**.

---

## Requisitos previos

| Herramienta | Versión mínima  |    Instalación     |
|-------------|-----------------|--------------------|
| Node.js     | 18.x o superior | https://nodejs.org |
| Angular CLI | 17 o superior   | incluido con Node  |

---

## Instalación y arranque

```bash
# 1. Clonar el repositorio
git clone <https://github.com/jjtrujillo1199/gateways-project.git>
cd gateways-app

# 2. Instalar dependencias
npm install

# 2. Instalar librerias adicionales
npm install sweetalert2

# 3. Levantar en modo desarrollo (hot-reload)
ng serve
```

## Arquitectura

El proyecto sigue la arquitectura standalone con lazy loading:

- Standalone components: todos los componentes usan standalone: true con sus propios imports.
- Lazy loading: las rutas del módulo gateway se cargan vía:

```bash
loadChildren(() => import('../gateway/gateway.routes'))
```

- Estado con Signals:
items, isLoading, filters como signal().
Derivados con computed().
HTTP con toSignal() o subscribe manual.

- Formularios reactivos:
FormGroup, FormControl, FormArray.
Validaciones inline y validator personalizado para nombres duplicados en métodos de pago.

- JwtInterceptor: implementado como HttpInterceptorFn, adjunta el token JWT en cada petición protegida.


## Vistas implementadas

### Login
- Formulario reactivo con validaciones.
- Manejo de errores con SweetAlert2
- Al iniciar sesión, se guarda el token JWT.

### Listado de Gateways
- Tabla con gateways desde la API.
- Filtros por nombre, estado y tipo.
- Mensaje de estado vacío cuando no hay resultados.
- Columna de acciones con icono para navegar al detalle.

### Detalle de Gateway
- Visualización de todos los campos del gateway.
- Listado de métodos de pago con nombre y tasa de comisión.
- Botón para navegar al formulario de edición.

### Formulario Crear/Editar
- Formulario reactivo con validaciones por campo.
- Mensajes de error inline bajo cada campo inválido.
- Submit que llama al endpoint con JWT en el header.
- Redirección al detalle o listado tras guardar.
- Sección de métodos de pago con FormArray:
    - Mínimo 1 y máximo 5 métodos.
    - Botón Agregar método deshabilitado al llegar a 5.
    - Validator personalizado para nombres duplicados.
    - Al editar, el FormArray se popula con métodos existentes

### Rutas principales

El proyecto define las siguientes rutas:
- /login => Vista de login
- /gateways => Listado de gateways (GatewayListComponent)
- /gateways/create => Formulario de creación (GatewayFormComponent)
- /gateways/:id => Detalle de gateway (GatewayDetailComponent)
- /gateways/:id/edit >= Formulario de edición (GatewayFormComponent)
