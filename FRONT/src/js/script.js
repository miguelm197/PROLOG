// var log = [];
// var lecturas = [];

// //PARAMETROS
// var paramDiferenciaCatacteres = 3;
// var paramSegundosDiferencia = 3;








// //Convierte fecha de String en Date
// function fechaDate(fecha, hora) {
//     var fechaStr = fecha.split("/");
//     var horaStr = hora.split(":")
//     var fechaDte = new Date("20" + fechaStr[2] + "-" + fechaStr[1] + "-" + fechaStr[0] + " " + horaStr[0] + ":" + horaStr[1] + ":" + horaStr[2] + "Z");
//     return fechaDte;
// }








// function levenshtein(a, b) {
//     if (a.length === 0) return b.length;
//     if (b.length === 0) return a.length;

//     var matrix = [];

//     // increment along the first column of each row
//     var i;
//     for (i = 0; i <= b.length; i++) {
//         matrix[i] = [i];
//     }

//     // increment each column in the first row
//     var j;
//     for (j = 0; j <= a.length; j++) {
//         matrix[0][j] = j;
//     }

//     // Fill in the rest of the matrix
//     for (i = 1; i <= b.length; i++) {
//         for (j = 1; j <= a.length; j++) {
//             if (b.charAt(i - 1) == a.charAt(j - 1)) {
//                 matrix[i][j] = matrix[i - 1][j - 1];
//             } else {
//                 matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
//                     Math.min(matrix[i][j - 1] + 1, // insertion
//                         matrix[i - 1][j] + 1)); // deletion
//             }
//         }
//     }

//     return matrix[b.length][a.length];
// }











// //retorna true si las lecturas corresponden a la misma matrícula
// function mismaMatricula(lectura1, lectura2) {

//     if (levenshtein(lectura1.matricula, lectura2.matricula) <= paramDiferenciaCatacteres
//         && (Date.parse(lectura1.fecha) - Date.parse(lectura2.fecha) <= paramSegundosDiferencia * 1000)) {
//         return true;
//     } else {
//         return false;
//     }

// }








// function ultimaLectura(lectura) {
//     var ultimaFecha = false;
//     var lecturaObj = false;

//     if (lectura.readPlate) {
//         var readP = lectura.readPlate[lectura.readPlate.length - 1];
//         if (readP.fecha > ultimaFecha) {
//             ultimaFecha = readP.fecha;
//             lecturaObj = readP;
//         }
//     }

//     if (lectura.filtros) {
//         var filtro = lectura.filtros[lectura.filtros.length - 1];
//         if (filtro.fecha > ultimaFecha) {
//             ultimaFecha = filtro.fecha;
//             lecturaObj = filtro;
//         }
//     }

//     return lecturaObj;
// }










// function mejorMatricula(lectura) {
//     var matriculas = [];

//     function distribuirMatricula(matricula) {

//         if (matriculas.length > 0) {
//             var guardado = false;
//             for (var i = 0; i < matriculas.length; i++) {
//                 var mat = matriculas[i].matricula;
//                 if (mat == matricula) {
//                     guardado = true;
//                     matriculas[i].cantidad++;
//                 }
//             }
//             if (!guardado) {
//                 matriculas.push({
//                     matricula: matricula,
//                     cantidad: 1
//                 });
//             }
//         } else {
//             matriculas.push({
//                 matricula: matricula,
//                 cantidad: 1
//             });
//         }
//     }


//     for (var i = 0; i < lectura.readPlate.length; i++) {
//         var mat = lectura.readPlate[i].matricula;
//         distribuirMatricula(mat);
//     }

//     for (var i = 0; i < lectura.filtros.length; i++) {
//         var mat = lectura.filtros[i].matricula;
//         distribuirMatricula(mat);
//     }
//     console.log(matriculas)

// }










// $.ajax({
//     url: "./files/VS_1_20180518220824.log",
//     // url: "./files/VS_1_20180525234233.log",
//     // url: "./files/VS_1_20180524103938.log",
//     dataType: "text",
//     success: function (textoLog) {
//         // console.log(textoLog);

//         var renglon = textoLog.split("\r\n");

//         for (var i = 0; i < renglon.length; i++) {

//             var dato = renglon[i].split(" : ");
//             var indiceAnterior = lecturas.length - 1;



//             //Matrículas leidas o filtradas


//             //LECTURAS VALIDAS
//             if (dato[1] == "INFO " && dato[2] == "OK" && dato[3] == "Read License Plate") {
//                 var lecturaObj = new Object();
//                 var fecha = dato[0].split(" ")[0];
//                 var hora = dato[0].split(" ")[1];
//                 var matricula = dato[4].split(" ")[0]
//                 var confidence = 0;
//                 var characterHeight = 0;
//                 var direction = dato[6].split("Direction: ")[1].split(" ,")[0];
//                 var format = dato[6].split(":")[1].split(",")[0].replace(" ", "");
//                 var camara = dato[7]

//                 //confidence
//                 if (dato[5].split(",").length > 1) {
//                     confidence = dato[5].split(",")[0] + "," + dato[5].split(",")[1];
//                 } else {
//                     confidence = dato[5].split(",")[0];
//                 }

//                 //characterHeight
//                 if (dato[6].split(",").length > 1) {
//                     characterHeight = dato[6].split(",")[0] + "," + dato[6].split(",")[1].replace(" ", "");
//                 } else {
//                     characterHeight = dato[6].split(",")[0].replace(" ", "");
//                 }

//                 lecturaObj["fecha"] = fechaDate(fecha, hora);
//                 lecturaObj["matricula"] = matricula;
//                 lecturaObj["confidence"] = confidence;
//                 lecturaObj["characterHeight"] = characterHeight;
//                 lecturaObj["direction"] = direction;
//                 lecturaObj["format"] = format;
//                 lecturaObj["camara"] = camara;

//                 if (lecturas.length == 0) {
//                     lecturas.push({
//                         matricula: matricula,
//                         readPlate: [lecturaObj]
//                     })
//                 } else {
//                     var lecturaAnt = ultimaLectura(lecturas[indiceAnterior]);
//                     if (mismaMatricula(lecturaObj, lecturaAnt)) {

//                         if (lecturas[indiceAnterior].readPlate) {
//                             lecturas[indiceAnterior]["readPlate"].push(lecturaObj);
//                         } else {
//                             lecturas[indiceAnterior]["readPlate"] = [lecturaObj];
//                         }

//                     } else {
//                         lecturas.push({
//                             matricula: matricula,
//                             readPlate: [lecturaObj]
//                         })
//                     }

//                 }
//             }



//             //LECTURAS FILTRADAS
//             if (dato[1] == "WARN " && dato[2] == "WARNING 2" && dato[3].indexOf("Cam:") != -1) {
//                 var filtroObj = new Object();
//                 var fecha = dato[0].split(" ")[0];
//                 var hora = dato[0].split(" ")[1];
//                 var matricula = dato[4].split(" ")[0]
//                 var filtro = dato[5].split(".")[0].replace(" not passed", "")
//                 var valor = dato[5].split(".")[1].indexOf("Value:") != -1 ? dato[5].split(".")[1].split("Value:")[1].replace(" ", "") : false

//                 filtroObj["fecha"] = fechaDate(fecha, hora);
//                 filtroObj["matricula"] = matricula;
//                 filtroObj["filtro"] = filtro;
//                 filtroObj["valor"] = valor;



//                 if (lecturas.length == 0) {
//                     lecturas.push({
//                         matricula: matricula,
//                         filtros: [filtroObj]
//                     })
//                 } else {
//                     var lecturaAnt = ultimaLectura(lecturas[indiceAnterior]);
//                     if (mismaMatricula(filtroObj, lecturaAnt)) {
//                         if (lecturas[indiceAnterior].filtros) {
//                             lecturas[indiceAnterior].filtros.push(filtroObj);
//                         } else {
//                             lecturas[indiceAnterior]["filtros"] = [filtroObj]
//                         }
//                     } else {
//                         lecturas.push({
//                             matricula: matricula,
//                             filtros: [filtroObj]
//                         })
//                     }
//                 }
//             }



//             //LECTURAS ENVIADAS
//             if (dato[1] == "WARN " && dato[2] == "WARNING 3: SEND EVENT READ PLATE") {
//                 var sendObj = new Object();

//                 var fecha = dato[0].split(" ")[0];
//                 var hora = dato[0].split(" ")[1];
//                 var matricula = dato[3].replace(" ", "")

//                 sendObj["fecha"] = fechaDate(fecha, hora);
//                 sendObj["matricula"] = matricula;

//                 var lecturaAnt = ultimaLectura(lecturas[indiceAnterior]);

//                 if (mismaMatricula(sendObj, lecturaAnt)) {
//                     var indiceUltimoReadPlate = lecturas[indiceAnterior].readPlate.length - 1;
//                     if (lecturas[indiceAnterior].readPlate) {
//                         lecturas[indiceAnterior].readPlate[indiceUltimoReadPlate]["send"] = sendObj;
//                     } else {
//                         console.log("----------------------------------------------------------")
//                         console.log("error, no puede haber un SEND sin almenos un READ PLATE antes")
//                         console.log(sendObj)
//                         console.log("----------------------------------------------------------")

//                     }
//                 } else {
//                     lecturas.push({
//                         matricula: matricula,
//                         filtros: [filtroObj]
//                     })
//                 }

//             }


//         }

//         console.log("/// lecturas ---------------------------------------------------")
//         console.log(lecturas)
//         console.log("----------------------------------------------------------------")






//         //SELECCIONA LA MEJOR MATRICULA DEL CONJUNTO
//         for (var i = 0; i < lecturas.length; i++) {
//             var lectura = lecturas[i];




//             var arrMatriculas = [];
//             function distribuirMatricula(matricula) {
//                 if (arrMatriculas.length > 0) {
//                     var guardado = false;
//                     for (var i = 0; i < arrMatriculas.length; i++) {
//                         var mat = arrMatriculas[i].matricula;
//                         if (mat == matricula) {
//                             guardado = true;
//                             arrMatriculas[i].cantidad++;
//                         }
//                     }
//                     if (!guardado) {
//                         arrMatriculas.push({
//                             matricula: matricula,
//                             cantidad: 1
//                         });
//                     }
//                 } else {
//                     arrMatriculas.push({
//                         matricula: matricula,
//                         cantidad: 1
//                     });
//                 }
//             }



//             if (lectura.filtros) {
//                 for (var j = 0; j < lectura.filtros.length; j++) {
//                     var mat = lectura.filtros[j].matricula;
//                     distribuirMatricula(mat);
//                 }
//             }

//             if (lectura.readPlate) {
//                 for (var j = 0; j < lectura.readPlate.length; j++) {
//                     var mat = lectura.readPlate[j].matricula;
//                     distribuirMatricula(mat);
//                 }
//             }



//             var indice = 0;
//             for (var j = 0; j < arrMatriculas.length; j++) {
//                 if (arrMatriculas[j].cantidad >= arrMatriculas[indice].cantidad) {
//                     indice = j;
//                 }
//             }

//             lecturas[i].matricula = arrMatriculas[indice].matricula;

//         }






//     }
// });
