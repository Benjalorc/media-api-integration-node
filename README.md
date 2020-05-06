# API Test para postulación


###  Endpoint

|Método|Url|Respuesta|
|----------------|-------------------------------|-----------------------------|
|GET|/media/:string|JSON con las respuestas de cada API consultada. <br>__________<br> `{	"itunes": {status: boolean, data: array, msg: string}, "tvmaze": {status: boolean, data: array, msg: string}, "crc": {status: boolean, data: array, msg: string}  }` |