var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var mongoose = require("mongoose");

// var conS = "mongodb://root:toor@ds241025.mlab.com:41025/taskedbd?authSource=taskedbd";
var conS = "mongodb://localhost:27017/logs";

console.log("================================================\n");

mongoose.connect(
  conS,
  function(err, res) {
    if (err) throw err;
    console.log("Conectado a la Base de Datos");
    console.log("\n================================================");
  }
);

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

// Imports de Modelo y Controlador
var modeloLectura = require("./models/mdl_lectura")(app, mongoose);
var CtrlLectura = require("././controllers/lecturas");

// Ruteo
var router = express.Router();

router.get("/", function(req, res) {
  res.send("Que tal sabandijas!");
  // next();
});

router
  .route("/lecturas")
  .get(CtrlLectura.consultaLecturas)
  .post(CtrlLectura.agregarLectura);

router.route("/existenciaLectura")
    .get(CtrlLectura.existenciaLectura);




router.route("/log")
    .post(CtrlLectura.recibirLog);











// router.route('/tareas/:id')
//     // .get(CtrlTarea.findById)
//     .put(CtrlTarea.actualizarTarea)
//     .delete(CtrlTarea.eliminarTarea);

app.use(router);

// Start server
app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});
