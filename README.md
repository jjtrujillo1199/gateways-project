# Gateways API — Prueba Técnica MET Group

API REST para gestión de pasarelas de pago (Gateways).  
Stack: **NestJS · TypeORM · SQLite (sql.js) · TypeScript · JWT**

---

## Requisitos previos

| Herramienta | Versión mínima | Instalación |
|-------------|---------------|-------------|
| Node.js | 18.x o superior | https://nodejs.org |
| npm | 9.x o superior | incluido con Node |

> No se requiere ningún servidor de base de datos. La persistencia usa **sql.js** (SQLite en JavaScript puro), el archivo `gateway.db` ya está incluido en el repositorio con 25 registros seed.

---

## Instalación y arranque

```bash
# 1. Clonar el repositorio
git clone <URL_REPO>
cd gateways-api

# 2. Instalar dependencias
npm install

# 3. Levantar en modo desarrollo (hot-reload)
npm run start:dev

# — o en modo producción —
npm run build
npm run start:prod
```

El servidor queda disponible en: **http://localhost:3000**

### Puerto personalizado
```bash
PORT=4000 npm run start:dev
```

---

## Base de datos

El archivo **`gateway.db`** está en la raíz del proyecto y se carga automáticamente.  
Contiene 25 gateways seed con sus métodos de pago asociados.

Para regenerar la base de datos desde cero:
```bash
npx ts-node seed.ts
```

---

## Credenciales de acceso

| Campo | Valor |
|-------|-------|
| username | `admin` |
| password | `admin` |

Obtener el JWT:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

Usar el token en peticiones protegidas:
```bash
curl http://localhost:3000/gateways \
  -H "Authorization: Bearer <access_token>"
```

---

## Endpoints

### Autenticación

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/auth/login` | ✗ | Obtener JWT |

### Gateways

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/gateways` | ✓ | Listar todos (soporta filtros) |
| GET | `/gateways/:id` | ✓ | Detalle por ID |
| POST | `/gateways` | ✓ | Crear gateway |
| PATCH | `/gateways/:id` | ✓ | Actualizar gateway |
| DELETE | `/gateways/:id` | ✓ | Eliminar gateway |

### Filtros disponibles en GET /gateways

```
GET /gateways?name=stripe
GET /gateways?status=ACTIVE          (ACTIVE | INACTIVE | MAINTENANCE)
GET /gateways?type=CREDIT_CARD       (CREDIT_CARD | BANK_TRANSFER | CRYPTO)
GET /gateways?name=pay&status=ACTIVE&type=BANK_TRANSFER
```

---

## Formato de respuesta (envelope estándar)

```json
{ "success": true,  "message": "Gateways retrieved successfully", "data": [...] }
{ "success": false, "message": "Gateway not found",               "data": null  }
```

---

## Ejemplo: Crear un gateway

```bash
curl -X POST http://localhost:3000/gateways \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Mi Pasarela",
    "type": "CREDIT_CARD",
    "status": "ACTIVE",
    "country": "CO",
    "commissionRate": 2.5,
    "paymentMethods": [
      { "name": "Visa",       "commissionRate": 1.5 },
      { "name": "Mastercard", "commissionRate": 2.0 }
    ]
  }'
```

---

## Estructura del proyecto

```
gateways-api/
├── src/
│   ├── auth/
│   │   ├── auth.constants.ts        # JWT_SECRET, JWT_EXPIRES_IN
│   │   ├── auth.controller.ts       # POST /auth/login
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts          # Lógica de login + firma JWT
│   │   ├── jwt-auth.guard.ts        # Guard que protege endpoints
│   │   ├── jwt.strategy.ts          # Passport JWT strategy
│   │   └── login.dto.ts
│   ├── gateways/
│   │   ├── dto/
│   │   │   ├── create-gateway.dto.ts
│   │   │   ├── create-payment-method.dto.ts
│   │   │   ├── filter-gateway.dto.ts
│   │   │   └── update-gateway.dto.ts
│   │   ├── entities/
│   │   │   ├── gateway.entity.ts          # @OneToMany cascade:true, eager:true
│   │   │   └── payment-method.entity.ts   # @ManyToOne onDelete:CASCADE
│   │   ├── gateway.repository.ts    # Extiende Repository<Gateway>
│   │   ├── gateways.controller.ts   # Solo request/response
│   │   ├── gateways.module.ts
│   │   └── gateways.service.ts      # Lógica de negocio
│   ├── common/
│   │   └── filters/
│   │       └── global-exception.filter.ts
│   ├── app.module.ts                # TypeORM sqljs config
│   └── main.ts                      # Bootstrap, ValidationPipe, CORS
├── gateway.db                       # SQLite con 25 registros seed ← NO en .gitignore
├── seed.ts                          # Script para regenerar gateway.db
└── README.md
```

---

## Decisiones de diseño

### PATCH — Estrategia de actualización de métodos de pago

**Decisión adoptada: reemplazo total (replace strategy).**

Cuando `PATCH /gateways/:id` recibe `paymentMethods` en el body, se eliminan todos los métodos existentes y se insertan los nuevos en la misma operación `save()` gracias a `cascade: true`. Si `paymentMethods` se omite del body, los métodos existentes **no se modifican**.

**Justificación:** La estrategia de diff requeriría IDs en cada método para identificar cuáles actualizar, eliminar o crear, añadiendo complejidad al cliente sin beneficio en este dominio. Con replace, el cliente siempre envía el estado completo deseado.

### Driver SQLite — sql.js vs sqlite3/better-sqlite3

Se usa `sql.js` (SQLite en JavaScript puro) porque los paquetes `sqlite3` y `better-sqlite3` requieren compilar extensiones nativas con `node-gyp`, lo que puede fallar según el entorno. `sql.js` es portable sin ninguna dependencia de sistema operativo. TypeORM lo soporta de forma nativa con `type: 'sqljs'` y `autoSave: true`.

### Autenticación

- Credenciales hardcodeadas en `auth.service.ts` según lo especificado en la prueba.
- JWT HS256 con expiración de 8 horas.
- Secret configurable vía variable de entorno `JWT_SECRET`.

### Validaciones

- `ValidationPipe` global con `errorHttpStatusCode: 422`.
- `GlobalExceptionFilter` convierte todos los errores (incluyendo arrays de mensajes de class-validator) al envelope estándar.

---

## Scripts disponibles

```bash
npm run start:dev     # Desarrollo con hot-reload
npm run start:prod    # Producción (requiere npm run build previo)
npm run build         # Compilar TypeScript → dist/
npm run lint          # ESLint
npx ts-node seed.ts   # Regenerar gateway.db con 25 registros seed
```
