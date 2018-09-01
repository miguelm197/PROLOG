var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");




console.log("================================================\n");


//ESTO PERMITE RECIBIR PETICIONES FUERA DE ESTE DOMINIO
function perimitirCrossDomain(req, res, next) {
  //en vez de * se puede definir SÓLO los orígenes que permitimos
  res.header("Access-Control-Allow-Origin", "*");
  //metodos http permitidos para CORS
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
}

// Middlewares
app.use(perimitirCrossDomain);
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride());

var multipart = require('connect-multiparty')
app.use(multipart())

// Imports de Controlador
var CtrlLectura = require("././controllers/lecturas");

// Ruteo
var router = express.Router();

router.get("/", function (req, res) {
  res.send("Que tal sabandijas!");
  // next();
});




router.route("/upload")
.post(CtrlLectura.leerArchivo)

router.route("/getLecturas")
.get(CtrlLectura.getLecturas)

router.route("/getLecturasLeidas")
.get(CtrlLectura.getLecturasLeidas)

router.route("/getLecturasNoLeidas")
.get(CtrlLectura.getLecturasNoLeidas)

router.route("/getLecturaPorId")
.get(CtrlLectura.getLecturaPorId)

router.route("/getFiltrosPorLecturaId")
.get(CtrlLectura.getFiltrosPorLecturaId)

router.route("/getCantidadLecturasLeidas")
.get(CtrlLectura.getCantidadLecturasLeidas)

router.route("/getCantidadLecturasNoLeidas")
.get(CtrlLectura.getCantidadLecturasNoLeidas)

router.route("/getCantidadDeLecturasPorDia")
.get(CtrlLectura.getCantidadDeLecturasPorDia)

router.route("/getFechaInicioFinLecturas")
.get(CtrlLectura.getFechaInicioFinLecturas)









app.use(router);

// Start server
app.listen(3000, function () {
  CtrlLectura.leerArchivoInicio();
  console.log("Node server running on http://localhost:3000");
});