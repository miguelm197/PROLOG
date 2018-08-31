let fs = require('fs');
var moment = require('moment');




var lecturas = [];



exports.getLecturas = function (req, res) {

  res.status(200).jsonp(lecturas);
}



exports.getLecturasLeidas = function (req, res) {
  let colLecturas = [];
  for (const lectura of lecturas) {
    if (lectura.readPlate) {
      colLecturas.push(lectura)
    }
  }
  res.status(200).jsonp(colLecturas);
}



exports.getLecturasNoLeidas = function (req, res) {
  let colLecturas = [];
  for (const lectura of lecturas) {
    if (!lectura.readPlate) {
      colLecturas.push(lectura)
    }
  }
  res.status(200).jsonp(colLecturas);
}



exports.getLecturaPorId = function (req, res) {
  let objLectura = new Object();
  let paramId = req.query.id;

  for (const lectura of lecturas) {
    if (lectura.id == paramId) {
      objLectura = lectura;
      break;
    }
  }
  res.status(200).jsonp(objLectura);
}



exports.getFiltrosPorLecturaId = function (req, res) {
  let colFiltros = [];
  let paramId = req.query.id;

  for (const lectura of lecturas) {
    if (lectura.id == paramId && lectura.filtros) {
      colFiltros = lectura.filtros;
      break;
    }
  }
  res.status(200).jsonp(colFiltros);
}



exports.getCantidadLecturasLeidas = function (req, res) {
  let colLecturas = [];
  for (const lectura of lecturas) {
    if (lectura.readPlate) {
      colLecturas.push(lectura)
    }
  }
  let cantLecturas = {
    "cantidadLecturas": colLecturas.length
  };
  res.status(200).jsonp(cantLecturas);
}

exports.getCantidadLecturasNoLeidas = function (req, res) {
  let colLecturas = [];
  for (const lectura of lecturas) {
    if (!lectura.readPlate) {
      colLecturas.push(lectura)
    }
  }
  let cantLecturas = {
    "cantidadLecturas": colLecturas.length
  };
  res.status(200).jsonp(cantLecturas);
}











exports.leerArchivo = function (req, res) {

  //El modulo 'fs' (File System) que provee Nodejs nos permite manejar los archivos
  var fs = require('fs')

  var path = req.files.archivo.path
  var newPath = 'logFile.txt'

  var is = fs.createReadStream(path)
  var os = fs.createWriteStream(newPath)

  is.pipe(os)

  is.on('end', function () {
    //eliminamos el archivo temporal
    fs.unlinkSync(path)
  })

  setTimeout(function () {
    lecturas = leerArchivo("./logFile.txt");
    res.status(200).jsonp(lecturas);

  }, 1000)
}

exports.leerArchivoInicio = function () {
  lecturas = leerArchivo("./logFile.txt");
}









function leerArchivo(path) {
  lecturas = [];
  //PARAMETROS
  var paramDiferenciaCatacteres = 3;
  var paramSegundosDiferencia = 4;

  let textoLog = fs.readFileSync(path, 'utf-8');



  // ########################################
  //         FUNCIONES DE LECTURAS
  // ########################################



  function parseFecha(fecha) {
    var string = fecha.format("DD/MM/YYYY");
    return string;
  }

  function parseHora(fecha) {
    var string = fecha.format("HH:mm:ss.SSS");
    return string;
  }

  //Convierte fecha de String en Date
  function fechaDate(fecha, hora) {
    var fechaStr = fecha.split("/");
    var horaStr = hora.split(":");
    var fechaDte = new Date("20" + fechaStr[2] + "-" + fechaStr[1] + "-" + fechaStr[0] + " " + horaStr[0] + ":" + horaStr[1] + ":" + horaStr[2] + "Z");
    return moment.utc(fechaDte);
  }

  function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) == a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            Math.min(
              matrix[i][j - 1] + 1, // insertion
              matrix[i - 1][j] + 1
            )
          ); // deletion
        }
      }
    }

    return matrix[b.length][a.length];
  }


  //retorna true si las lecturas corresponden a la misma matrícula
  function mismaMatricula(lectura1, lectura2) {
    if (levenshtein(lectura1.matricula, lectura2.matricula) <= paramDiferenciaCatacteres &&
      Date.parse(lectura1.fecha) - Date.parse(lectura2.fecha) <= paramSegundosDiferencia * 1000) {
      return true;
    } else {
      return false;
    }
  }

  //Busca en los últimos 3 resultados si existe la misma matrícula
  function matriculaReciente(lectura) {
    if (lectura) {
      var imax = lecturas.length - 1;
      var imin = imax > 3 ? imax - 3 : 0;
      var matricula = lectura.matricula;
      var fecha = lectura.fecha;

      for (var i = imax; i >= imin; i--) {
        var matriculaMuestra = lecturas[i].matricula;
        var fechaMuestra = ultimaLectura(lecturas[i]);
        var diferenciaSegundos = fecha.diff(fechaMuestra.fecha, "seconds");
        ////console.log("=============")
        //console.log("Diferencia de segundos entre la última lectura registrada de " + matriculaMuestra + " y la nueva " + matricula + ": " + diferenciaSegundos)
        //console.log("=============")
        if (diferenciaSegundos <= paramSegundosDiferencia) {
          var lectura1 = {
            matricula: matriculaMuestra,
            fecha: fechaMuestra.fecha
          };
          var lectura2 = {
            matricula: matricula,
            fecha: fecha
          };
          var igualMatricula = mismaMatricula(lectura1, lectura2);
          if (igualMatricula) {
            return i + 1;
          }
        }
      }
      return false;
    }
  }

  function ultimaLectura(lectura) {
    var ultimaFecha = false;
    var lecturaObj = false;

    if (lectura.readPlate) {
      var readP = lectura.readPlate[lectura.readPlate.length - 1];
      if (readP.fecha > ultimaFecha) {
        ultimaFecha = readP.fecha;
        lecturaObj = readP;
      }
    }

    if (lectura.filtros) {
      var filtro = lectura.filtros[lectura.filtros.length - 1];
      if (filtro.fecha > ultimaFecha) {
        ultimaFecha = filtro.fecha;
        lecturaObj = filtro;
      }
    }

    return lecturaObj;
  }








  // ########################################

  var renglon = textoLog.split("\r\n");

  for (var i = 0; i < renglon.length; i++) {
    var dato = renglon[i].split(" : ");
    var indiceAnterior = lecturas.length - 1;



    //LECTURAS VALIDAS
    if (
      dato[1] == "INFO " && dato[2] == "OK" && dato[3] == "Read License Plate"
    ) {
      var lecturaObj = new Object();
      var fecha = dato[0].split(" ")[0];
      var hora = dato[0].split(" ")[1];
      var matricula = dato[4].split(" ")[0];
      var confidence = 0;
      var characterHeight = 0;
      var direction = dato[6].split("Direction: ")[1].split(" ,")[0];
      var format = dato[6].split(":")[1].split(",")[0].replace(" ", "");
      var camara = dato[7];

      //confidence
      if (dato[5].split(",").length > 1) {
        confidence = dato[5].split(",")[0] + "," + dato[5].split(",")[1];
      } else {
        confidence = dato[5].split(",")[0];
      }

      //characterHeight
      if (dato[6].split(",").length > 1) {
        characterHeight = dato[6].split(",")[0] + "," + dato[6].split(",")[1].replace(" ", "");
      } else {
        characterHeight = dato[6].split(",")[0].replace(" ", "");
      }

      lecturaObj["fecha"] = fechaDate(fecha, hora);
      lecturaObj["matricula"] = matricula;
      lecturaObj["confidence"] = confidence;
      lecturaObj["characterHeight"] = characterHeight;
      lecturaObj["direction"] = direction;
      lecturaObj["format"] = format;
      lecturaObj["camara"] = camara;

      if (lecturas.length == 0) {
        lecturas.push({
          matricula: matricula,
          fecha: lecturaObj.fecha,
          readPlate: [lecturaObj]
        });
      } else {
        var indice = matriculaReciente(lecturaObj);

        if (indice != false) {
          if (lecturas[indiceAnterior].readPlate) {
            lecturas[indiceAnterior]["readPlate"].push(lecturaObj);
          } else {
            lecturas[indiceAnterior]["readPlate"] = [lecturaObj];
          }
        } else {
          lecturas.push({
            matricula: matricula,
            fecha: lecturaObj.fecha,
            readPlate: [lecturaObj]
          });
        }
      }
    }

    //LECTURAS FILTRADAS
    if (
      dato[1] == "WARN " && dato[2] == "WARNING 2" && dato[3].indexOf("Cam:") != -1
    ) {
      var fecha = dato[0].split(" ")[0];
      var hora = dato[0].split(" ")[1];
      var matricula = dato[4].split(" ")[0];
      var filtro = dato[5].indexOf("Value:") != -1 ? dato[5].split("Value:")[0].replace(" not passed", "") : dato[5].replace(" not passed", "");
      var valor = dato[5].indexOf("Value:") != -1 ? dato[5].split("Value:")[1].replace(" ", "") : false;

      var filtroObj = {
        fecha: fechaDate(fecha, hora),
        matricula: matricula,
        filtro: filtro,
        valor: valor
      };


      if (lecturas.length > 0) {
        var indice = matriculaReciente(filtroObj);

        if (indice != false) {
          if (lecturas[indice - 1].filtros) {
            lecturas[indice - 1].filtros.push(filtroObj);
          } else {
            lecturas[indice - 1]["filtros"] = [filtroObj];
          }
        } else {
          var lec = {
            matricula: matricula,
            fecha: filtroObj.fecha,
            filtros: [filtroObj]
          };
          lecturas.push(lec);
        }
      } else {
        lecturas.push({
          matricula: matricula,
          fecha: filtroObj.fecha,
          filtros: [filtroObj]
        });
      }
    }

    //LECTURAS ENVIADAS
    if (dato[1] == "WARN " && dato[2] == "WARNING 3: SEND EVENT READ PLATE") {
      var sendObj = new Object();

      var fecha = dato[0].split(" ")[0];
      var hora = dato[0].split(" ")[1];
      var matricula = dato[3].replace(" ", "");

      sendObj["fecha"] = fechaDate(fecha, hora);
      sendObj["matricula"] = matricula;

      var lecturaAnt = ultimaLectura(lecturas[indiceAnterior]);

      if (mismaMatricula(sendObj, lecturaAnt)) {
        var indiceUltimoReadPlate =
          lecturas[indiceAnterior].readPlate.length - 1;
        if (lecturas[indiceAnterior].readPlate) {
          lecturas[indiceAnterior].readPlate[indiceUltimoReadPlate]["send"] = sendObj;
        } else {
          //console.log("----------------------------------------------------------")
          //console.log("error, no puede haber un SEND sin almenos un READ PLATE antes")
          //console.log(sendObj)
          //console.log("----------------------------------------------------------")
        }
      } else {
        lecturas.push({
          matricula: matricula,
          fecha: filtroObj.fecha,
          filtros: [filtroObj]
        });
      }
    }
  }

  //SELECCIONA LA MEJOR MATRICULA DEL CONJUNTO
  for (var i = 0; i < lecturas.length; i++) {
    var lectura = lecturas[i];

    var arrMatriculas = [];

    function distribuirMatricula(matricula) {
      if (arrMatriculas.length > 0) {
        var guardado = false;
        for (var i = 0; i < arrMatriculas.length; i++) {
          var mat = arrMatriculas[i].matricula;
          if (mat == matricula) {
            guardado = true;
            arrMatriculas[i].cantidad++;
          }
        }
        if (!guardado) {
          arrMatriculas.push({
            matricula: matricula,
            cantidad: 1
          });
        }
      } else {
        arrMatriculas.push({
          matricula: matricula,
          cantidad: 1
        });
      }
    }

    if (lectura.filtros) {
      for (var j = 0; j < lectura.filtros.length; j++) {
        var mat = lectura.filtros[j].matricula;
        distribuirMatricula(mat);
      }
    }

    if (lectura.readPlate) {
      for (var j = 0; j < lectura.readPlate.length; j++) {
        var mat = lectura.readPlate[j].matricula;
        distribuirMatricula(mat);
      }
    }

    var indice = 0;
    for (var j = 0; j < arrMatriculas.length; j++) {
      if (arrMatriculas[j].cantidad >= arrMatriculas[indice].cantidad) {
        indice = j;
      }
    }

    lecturas[i].matricula = arrMatriculas[indice].matricula;
    lecturas[i].id = i;
  }




  return lecturas
}