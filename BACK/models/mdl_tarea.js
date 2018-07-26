exports = module.exports = function (app, mongoose) {

    var esquemaTarea = new mongoose.Schema({
        usuario:   { type: String },
        contenido: { type: String },
        hecho:     { type: Boolean },
    });

    mongoose.model('mdl_Tarea', esquemaTarea, 'tareas');
    //                 /              |            \
    //                /               |             \
    //      Nombre de referencia      |              |
    //                      esquema exportado        |
    //                                       documento de la bd


    



};