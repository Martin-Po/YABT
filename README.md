# YABT — Yet Another Budget Tracker

YABT es un sistema de gestión financiera personal diseñado con un enfoque estricto en consistencia de datos, alta disponibilidad y patrones arquitectónicos de grado de producción. El objetivo principal es resolver el tracking de gastos diarios, financiamientos en cuotas y automatización de servicios recurrentes sin delegar la integridad lógica a soluciones low-code o bases de datos no relacionales.

## 🚀 Características Principales (En Desarrollo)
* **Consistencia Transaccional:** Arquitectura de partida doble implícita mediante conciliación automática de ítems parciales ("Ajustes de cuenta").
* **Gestión de Financiación Separada:** Entidades aisladas para el ciclo de vida de Planes en Cuotas (finitos) y Servicios Recurrentes (indefinidos).
* **Análisis de Impacto Inflacionario:** Registro segregado de valor real vs. valor financiado (`total_efectivo`) para métricas de desvío financiero.

## 🛠️ Stack Tecnológico
* **Frontend:** React (SPA), Gestión de estado optimizada y UI scannable.
* **Backend:** Node.js con TypeScript, arquitectura limpia y ruteo estructurado.
* **Persistencia:** PostgreSQL (Esquema relacional estricto, Tipado basado en ENUMs nativos y Soft Deletes).
* **Procesamiento Asincrónico:** Redis + BullMQ para la orquestación de workers en segundo plano (generación automatizada de alertas y vencimientos).
* **Infraestructura:** Docker & Docker Compose para la unificación de entornos de desarrollo y producción en VPS Linux.

## 📈 Estrategia de Ramas
Este repositorio replica el workflow de un equipo de desarrollo de alta performance:
* `main`: Entorno de producción. Código 100% estable.
* `develop`: Entorno de integración.
* `feature/*`: Ramas de desarrollo técnico aisladas, integradas exclusivamente mediante Pull Requests revisados.