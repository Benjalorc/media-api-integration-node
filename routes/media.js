var express = require('express');
var router = express.Router();
var parser = require('xml2json');
const request = require('request');

router.get('/media/:param', (req, res, next)=> {

	let data = req.params.param;
	let respuesta = {
		itunes: null,
		tvmaze: null,
		crc: null
	};
	getRest("http://api.tvmaze.com/search/shows?q=", data).then((cadena)=>{
		if(cadena.status) cadena.data = JSON.parse(cadena.data);
		respuesta.tvmaze = cadena;
		if(!isEmpty(respuesta)) res.send(respuesta);
	});
	getRest("https://itunes.apple.com/search?term=", data).then((cadena)=>{
		if(cadena.status) cadena.data = JSON.parse(cadena.data);
		respuesta.itunes = cadena;
		if(!isEmpty(respuesta)) res.send(respuesta);
	});
	getRest("http://www.crcind.com/csp/samples/SOAP.Demo.cls?soap_method=QueryByName&name=", data).then((xml)=>{
		if(xml.status){
			let json = JSON.parse(parser.toJson(xml.data));
			xml.data = json["SOAP-ENV:Envelope"]["SOAP-ENV:Body"].QueryByNameResponse.QueryByNameResult["diffgr:diffgram"].QueryByName_DataSet.QueryByName;
		}
		respuesta.crc = xml;
		if(!isEmpty(respuesta)) res.send(respuesta);
	});

});

function getRest(base, param) {

	return new Promise((resolve, reject)=>{

		let ruta = base+param;

		request.get(ruta, (err, res, body) => {
			if (err) {
				resolve({status: false, data: null, msg: "No se pudo completar la búsqueda"});
				return;
			}
			resolve({status: true, data: res.body, msg: "Búsqueda completada"});
		});
	});
}

function isEmpty(obj){

	let empty = false;
	for(let prop in obj){
		if(obj[prop] === null){
			empty = true; break;
		}
	}
	return empty;
}
module.exports = router;