# API Test para postulación

##  Instalación

A continuación se indica lo necesario para poner el API en funcionamiento.

Las versiones de paquetes indicadas son las usadas en el momento del desarrollo del API. Esta pudiera funcionar con otras versiones, pero no han sido probadas.

### Requerimientos

	- Git 2.17
	- Node.js 12.16.3 LTS
	- Npm 6.14.4

### Pasos

	1. Clonar este repositorio
>`git clone https://github.com/Benjalorc/postulacion-backend.git`

	2. Instalar dependencias
>`npm install`

	3. Iniciar servidor
>`node app.js`

El servidor ya estará iniciado y escuchando en el puerto 3000.

Si hubo problemas con la instalación de dependencias en el paso 2, pruebe a borrar la caché de npm y reintentar.

##  Endpoint

|Método|Url|Respuesta|
|----------------|-------------------------------|-----------------------------|
|GET|/media/:string|Array con las respuestas de cada API consultada (vacío si no hubo resultados)<br>__________<br> `[{id: number, nombre: string, origen: string}]` |