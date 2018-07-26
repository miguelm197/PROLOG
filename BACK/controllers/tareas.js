var mongoose = require('mongoose');
require('../models/mdl_tarea.js');


var SCH_Tarea = mongoose.model('mdl_Tarea');




//GET - Retorna todas las Tareas de la Base de Datos
exports.consultaTareas = function (req, res) {
    console.log("llegoo")
    // console.log(res)
    console.log("=============================================")
    // console.log(req)
    SCH_Tarea.find(function (err, tareas) {
        console.log(err);
        console.log("==================================");
        console.log(tareas);
        if (err) res.send(500, err.message);
        console.log('GET /tareas');
        res.status(200).jsonp(tareas);
    });
};


//POST - Agrega una nueva tarea en la Base de Datos
exports.agregarTarea = function (req, res) {
    console.log('POST');
    console.log(req.body);

    var tarea = new SCH_Tarea({
        usuario: req.body.usuario,
        contenido: req.body.contenido,
        hecho: req.body.hecho,
    });

    tarea.save(function (err, tarea) {
        if (err) return res.send(500, err.message);
        console.log('POST Se agregó una tarea nueva');

        res.status(200).jsonp(tarea);
    });
};



//PUT - Actualizar una tarea en la Base de Datos
exports.actualizarTarea = function (req, res) {
    SCH_Tarea.findById(req.params.id, function (err, tarea) {
        tarea.usuario = req.body.usuario,
        tarea.contenido = req.body.contenido,
        tarea.hecho = req.body.hecho,

            tarea.save(function (err) {
                if (err) return res.send(500, err.message);
                console.log('PUT Se modificó una tarea');

                res.status(200).jsonp(tarea);
            });
    });
};



//DELETE - Eliminar una tarea de la Base de Datos
exports.eliminarTarea = function (req, res) {
    SCH_Tarea.findById(req.params.id, function (err, tarea) {
        tarea.remove(function (err) {
            if (err) return res.send(500, err.message);

            console.log('DELETE Se eliminó una tarea');

            res.status(200);
        })
    });
};
