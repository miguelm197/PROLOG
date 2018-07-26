var mongoose = require("mongoose");
require("./../models/mdl_lectura.js");

var SCH_Lectura = mongoose.model("mdl_lectura");

//GET - Retorna todas las lecturas de la Base de Datos
exports.consultaLecturas = function(req, res) {
  SCH_Lectura.find(function(err, lecturas) {
    console.log(err);
    console.log(lecturas);
    if (err) res.send(500, err.message);
    console.log("GET /lecturas");
    res.status(200).jsonp(lecturas);
  });
};







//POST - Recibida de archivo logs
exports.recibirLog = function(req, res) {
    console.log("Reibir texto de log")
  var log = new SCH_Lectura(req.body);
  console.log(log);
};






//POST - Agrega una nueva lectura en la Base de Datos
exports.agregarLectura = function(req, res) {
    var data = req.body;
    data.lecturas.forEach(element => {
        var lectura = new SCH_Lectura(element);
        var matricula = lectura.matricula;
        var fecha = lectura.fecha;

    SCH_Lectura.find({ matricula, fecha }, function(err, lec) {
        if (err) res.send(500, err.message);

        if (lec.length == 0) {
            console.log("GET No se encuentra la lectura de la matrícula: " + matricula + " --  " + fecha);
            lectura.save(function(err, tarea) {
                if (err) return res.send(500, err.message);
                console.log("POST Se agregó una lectura nueva - Matrícula: " + lectura.matricula);
            });
        } else {
            console.log("GET Ya se encuentra la lectura de la matrícula: " + matricula);
        }
    });




     
    });
    // for (let index = 0; index < lecturas.lecturas.length; index++) {
    //     const element = array[index];
    //     lectura = new SCH_Lectura(element);
    //     lectura.save(function(err, tarea) {
    //         if (err) return res.send(500, err.message);
    //         console.log("POST Se agregó una lectura nueva - Matrícula: " + lectura.matricula);
    //         console.log(lectura.filtros)
    //     });
    // }
 
    res.status(200).jsonp("OK");


};







//GET - Consulta si existe la lectura en base a la matricula y la fecha
exports.existenciaLectura = function(req, res) {
  var matricula = req.query.matricula;
  var fecha = req.query.fecha;

  SCH_Lectura.find({ matricula, fecha }, function(err, lec) {
    if (err) res.send(500, err.message);

    if (lec.length == 0) {
      console.log(
        "GET No se encuentra la lectura de la matrícula: " + matricula
      );
      res.status(200).jsonp("true");
    } else {
      console.log(
        "GET Ya se encuentra la lectura de la matrícula: " + matricula
      );
      res.status(200).jsonp("false");
    }
  });
};

// //PUT - Actualizar una tarea en la Base de Datos
// exports.actualizarTarea = function (req, res) {
//     SCH_Tarea.findById(req.params.id, function (err, tarea) {
//         tarea.usuario = req.body.usuario,
//         tarea.contenido = req.body.contenido,
//         tarea.hecho = req.body.hecho,

//             tarea.save(function (err) {
//                 if (err) return res.send(500, err.message);
//                 console.log('PUT Se modificó una tarea');

//                 res.status(200).jsonp(tarea);
//             });
//     });
// };

// //DELETE - Eliminar una tarea de la Base de Datos
// exports.eliminarTarea = function (req, res) {
//     SCH_Tarea.findById(req.params.id, function (err, tarea) {
//         tarea.remove(function (err) {
//             if (err) return res.send(500, err.message);

//             console.log('DELETE Se eliminó una tarea');

//             res.status(200);
//         })
//     });
// };
