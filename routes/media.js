var express = require('express');
var router = express.Router();
var parser = require('xml2json');
const request = require('request');

router.get('/media/:param', (req, res, next)=> {

	let data = req.params.param.replace(/\s/g, '+');

	let consultas = [
		{
			origen: "itunes",
			tipo: "json",
			urls: [
				"https://itunes.apple.com/search?entity=song&term=",
				"https://itunes.apple.com/search?entity=movie&term=",
				"https://itunes.apple.com/search?entity=ebook&term=",
			],
			match: "trackName",
			respuestas: []
		},
		{
			origen: "tvmaze",
			tipo: "json",
			urls: [
				"http://api.tvmaze.com/search/shows?q="
			],
			match: "name",
			respuestas: []
		},
		{
			origen: "crc",
			tipo: "xml",
			urls: [
				{
					ruta: "http://www.crcind.com/csp/samples/SOAP.Demo.cls?soap_method=QueryByName&name=",
					obj: ['SOAP-ENV:Envelope','SOAP-ENV:Body','QueryByNameResponse','QueryByNameResult','diffgr:diffgram','QueryByName_DataSet','QueryByName']
				}
			],
			match: "Name",
			respuestas: []
		}
	];

	let i = 0, j = 0;
	consultas.forEach((consulta)=>{
		consulta.urls.forEach((url)=>{

			j++;

			getRest(url.ruta || url, data).then((cadena)=>{

				i++;

				if(cadena.status){

					let data, json;
					if(consulta.tipo === "xml"){
						data = parseXmlData(cadena.data, url.obj);
					}
					else{
						json = JSON.parse(cadena.data);
						data = json.results || json;
						if(data[0] && data[0].show) data = data.map((el)=>{return {...el.show, score: el.score} });
					}
					cadena.data = data.map((el)=>{return {id: ( el.trackId || el.id || parseInt(el.ID)), name: el[consulta.match], origen: consulta.origen}});
				}

				consulta.respuestas = [...consulta.respuestas, ...(cadena.data)];

				if(i === j){
					let extracto = consultas.map((el)=>{return el.respuestas});
					let arreglo = mixAndSort(extracto);
					res.send(arreglo);
				}

			});

		});
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

function parseXmlData(xml, paths) {
	let json = JSON.parse(parser.toJson(xml));
	paths.forEach((path)=> json = json[path] );
	return json || [];
}

function mixAndSort(arreglo){

	let arr = [];
	arreglo.forEach((el)=> arr.push(...el));

	return arr.sort((a, b)=> {
	  if (a.name > b.name) return 1;
	  if (a.name < b.name) return -1;
	  return 0;
	});
}

module.exports = router;