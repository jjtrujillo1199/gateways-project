# Proyecto Gateways - Angular + NestJS

Pasos para levantar el proyecto rápidamente, el detalle de cada proyecto se encuentra en su respetivo README que se encuentra en cada directorio.


---

## Requisitos previos
- Node.js 18 o superior
- Angular CLI 17 o superior
- NestJS CLI 10 o superior

---

## Instalación y arranque del Backend

```bash
# 1. Clonar el repositorio
git clone https://github.com/jjtrujillo1199/gateways-project.git
cd gateways-project/gateways-api

# 2. Instalar dependencias
npm install

# 3. Levantar en modo desarrollo (hot-reload)
npm run start:dev
```

## Instalación y arranque del Frontend
```bash
# 1. Con el repositorio ya clonado ingresar a
cd ../gateways-app

# 2. Instalar dependencias
npm install

# 3. Instalar librerías adicionales
npm install sweetalert2

# 4. Levantar en modo desarrollo (hot-reload)
ng serve
```