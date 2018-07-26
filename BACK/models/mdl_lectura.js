exports = module.exports = function(app, mongoose) {
    
  var esquemaLectura = new mongoose.Schema({
      matricula:              String,
      fecha:                  Object,
      filtros:[{
          matricula:          String,
          fecha:              Object,
          filtro:             String,
          valor:              String
      }],
      readPlate:[{
          matricula:          String,
          fecha:              Object,
          confidence:         String,
          camara:             String,
          direction:          String,
          format:             String,
          characterHeight:    String,
          send:               Object
      }]

  });

  mongoose.model("mdl_lectura", esquemaLectura, "lecturas");
};





