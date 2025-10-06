# 🚀 Frontend – Inventory Manager

Aplicación Next.js 15 + React 19 + TypeScript para la gestión de inventarios y productos.
Este frontend se comunica con los microservicios de Products e Inventory, desplegados con Spring Boot y Docker.

# 🧩 Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 15 | Framework React para renderizado híbrido (SSR/SSG) |
| **React** | 19 | Biblioteca principal para la interfaz de usuario |
| **TypeScript** | - | Tipado estático para desarrollo más robusto |
| **TailwindCSS** | 4 | Framework de CSS para estilos rápidos y modernos |
| **Axios** | - | Cliente HTTP para conexión con APIs y microservicios |
| **React Query** | - | Manejo de datos asíncronos y sistema de caché |
| **Zustand** | - | Gestión de estado global simple y eficiente |
| **React Hook Form** | - | Manejo de formularios y validaciones |
| **Jest** + **Testing Library** | - | Suite de pruebas unitarias e integrales |
| **Storybook** | - | Documentación y visualización de componentes UI |


## ⚙️ Configuración del entorno

Crea un archivo .env.local en la raíz del proyecto con las siguientes variables:
```bash
# API Configuration
NEXT_PUBLIC_PRODUCTS_BASE_URL=http://localhost:8080
NEXT_PUBLIC_INVENTORY_BASE_URL=http://localhost:8082
NEXT_PUBLIC_PRODUCTS_API_KEY=ab1a0aedc33841c286c108ff65ac501e=
NEXT_PUBLIC_INVENTORY_API_KEY=c434f40f252d43e59a67451a5664188b=

# App Configuration
NEXT_PUBLIC_APP_NAME=Inventory Manager
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🏗️ Instalación y ejecución
1️⃣ Instalar dependencias
```bash
npm install
```

2️⃣ Ejecutar en modo desarrollo
```bash
npm run dev
```

La aplicación se abrirá en 👉 http://localhost:3000

## 🧠 Estructura del proyecto
``` bash
frontend/
├── components/         # Componentes reutilizables de UI
├── hooks/              # Hooks personalizados
├── pages/              # Rutas de Next.js (SSR/SSG)
├── public/             # Archivos estáticos (logos, íconos)
├── services/           # Configuración de Axios y llamadas a API
├── store/              # Manejo de estado global con Zustand
├── styles/             # Estilos globales y Tailwind
├── tests/              # Pruebas unitarias
├── .env.local          # Variables de entorno (no se sube al repo)
└── package.json
```

## 🌐 Comunicación con el backend
El frontend se comunica con:
Products Service → http://localhost:8080/api/products

Inventory Service → http://localhost:8082/api/inventory

Ambas peticiones incluyen una cabecera X-API-KEY para autenticación interna:
```bash
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PRODUCTS_BASE_URL,
  headers: {
    "X-API-KEY": process.env.NEXT_PUBLIC_PRODUCTS_API_KEY,
  },
});
```

## Autor
Victor Alfonso Vargas Diaz
