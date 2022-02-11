var Http = (function () {
    function Http() {
    }
    Http.get = function (url, callBack) {
        requestServer(url, "get", callBack);
    }
    Http.getBytes = function (url, callBack) {
        requestServer(url, "get", callBack, null, "arraybuffer");
    }
    Http.post = function (url, callBack, data) {
        requestServer(url, "post", callBack, data);
    }
    Http.postDownload = function (url, callBack, data) {
        requestServer(url, "post", callBack, data, "arraybuffer");
    }
    function requestServer(url, metodoHttp, callBack, data, tipoRpta) {
        var xhr = new XMLHttpRequest();
        xhr.open(metodoHttp, hdfRaiz.value + url);
        if (tipoRpta != null) xhr.responseType = tipoRpta;
        xhr.onreadystatechange = function () {
            if (xhr.status == 200 && xhr.readyState == 4) {
                if (tipoRpta != null) callBack(xhr.response);
                else callBack(xhr.responseText);
            }
        }
        if (data != null) xhr.send(data);
        else xhr.send();
    }
    return Http;
})();

var GUI = (function () {
    function GUI() {
    }
    GUI.Combo = function (cbo, lista, primerItem) {
        var html = "";
        if (primerItem != null) {
            html += "<option value=''>";
            html += primerItem;
            html += "</option>";
        }
        var nRegistros = lista.length;
        var campos = [];
        for (var i = 0; i < nRegistros; i++) {
            campos = lista[i].split("|");
            html += "<option value='";
            html += campos[0];
            html += "'>";
            html += campos[1];
            html += "</option>";
        }
        cbo.innerHTML = html;
    }

    GUI.Grilla = function (div, lista, id, botones, mensajeRegistros, indices, ayudas, tieneCheck, subtotales, registrosPagina, paginasBloque, tieneFiltros, tieneExportacion, tieneImprimir, tieneNuevoEditar, tieneEliminar) {
        var matriz = [];
        var nRegistros = lista.length;
        var nCampos;
        botones = (botones == null ? [] : botones);
        var nBotones = botones.length;
        var filaActual = null;
        var tipos = [];
        indices = (indices == null ? [] : indices);
        ayudas = (ayudas == null ? [] : ayudas);
        tieneCheck = (tieneCheck == null ? false : tieneCheck);
        subtotales = (subtotales == null ? [] : subtotales);
        registrosPagina = (registrosPagina == null ? 20 : registrosPagina);
        paginasBloque = (paginasBloque == null ? 10 : paginasBloque);
        tieneFiltros = (tieneFiltros == null ? true : tieneFiltros);
        tieneExportacion = (tieneExportacion == null ? true : tieneExportacion);
        tieneImprimir = (tieneImprimir == null ? true : tieneImprimir);
        tieneNuevoEditar = (tieneNuevoEditar = null ? false : tieneNuevoEditar);
        tieneEliminar = (tieneEliminar = null ? false : tieneEliminar);

        //Subtotales
        var totales = [];
        //Checks
        var idsChecks = [];
        var filasChecks = [];
        //Ordenacion
        var tipoOrden = 0; //0: ascendente, 1: descendente
        var colOrden = 0; //0: Primera Columna, 1: Segunda Columna
        //Paginacion Simple
        var indicePagina = 0;
        //Paginacion Por Bloques
        var indiceBloque = 0;
        iniciarGrilla();

        function filtrarMatriz() {
            indicePagina = 0;
            indiceBloque = 0;
            crearMatriz();
            mostrarMatriz();
        }

        function iniciarGrilla() {
            crearTabla();
            filtrarMatriz();
        }

        function crearTabla() {
            var html = "";
            html += "<div>";
            if (tieneFiltros) {
                html += "<button id='btnBorrarFiltro";
                html += id;
                html += "' class='BotonL'>Borrar Filtros</button>";
            }
            if (tieneExportacion) {
                html += "<button id='btnExportarTxt";
                html += id;
                html += "' class='BotonL'>Exp Txt</button>";
                html += "<button id='btnExportarXlsx";
                html += id;
                html += "' class='BotonL'>Exp Xlsx</button>";
                html += "<button id='btnExportarDocx";
                html += id;
                html += "' class='BotonL'>Exp Docx</button>";
                html += "<button id='btnExportarPdf";
                html += id;
                html += "' class='BotonL'>Exp Pdf</button>";
            }
            if (tieneImprimir) {
                html += "<button id='btnImprimir";
                html += id;
                html += "' class='BotonL'>Imprimir</button>";
            }
            html += "</div>";
            html += "<div class='Mensaje'>";
            html += "<span>";
            html += mensajeRegistros;
            html += "</span>&nbsp;";
            html += "<span id='spnTotal";
            html += id;
            html += "'></span>";
            html += "</div>";
            html += "<table>";
            var cabeceras = lista[0].split("|");
            var anchos = lista[1].split("|");
            tipos = lista[2].split("|");
            nCampos = cabeceras.length;
            html += "<thead>";
            html += "<tr class='FilaCabecera ";
            html += id;
            html += "'>";
            if (tieneCheck) {
                html += "<th style='width:30px'>";
                html += "<input id='chkCabecera ";
                html += id;
                html += "' type='checkbox'/>";
                html += "</th>";
            }
            for (var j = 0; j < nCampos; j++) {
                html += "<th style='width:";
                html += (+anchos[j]);
                html += "px'>";
                html += "<span class='Enlace ";
                html += id;
                html += "' data-orden='";
                html += j;
                html += "'>";
                html += cabeceras[j];
                html += "</span>";
                html += "&nbsp;";
                html += "<span></span>";
                if (tieneFiltros) {
                    html += "<br/>";
                    if (indices.length > 0 && indices.indexOf(j) > -1) {
                        html += "<select class='Cabecera Combo ";
                        html += id;
                        html += "'></select>";
                    }
                    else {
                        html += "<input type='text' class='Cabecera Texto ";
                        html += id;
                        html += "'/>";
                    }
                }
                html += "</th>";
            }
            if (nBotones > 0) {
                for (var j = 0; j < nBotones; j++) {
                    html += "<th style='width:100px'>";
                    html += botones[j].cabecera;
                    html += "</th>";
                }
            }
            if (tieneNuevoEditar) {
                html += "<th style='width:50px'>";
                html += "<img id='btnNuevo";
                html += id;
                html += "' src='";
                html += hdfRaiz.value;
                html += "Images/Nuevo.png' class='Icono Centro NoImprimir' title='Nuevo'/>";
                html += "</th>";
            }
            if (tieneEliminar) {
                html += "<th style='width:50px'>";
                html += "<img id='btnEliminar";
                html += id;
                html += "' src='";
                html += hdfRaiz.value;
                html += "Images/Eliminar.png' class='Icono Centro NoImprimir' title='Eliminar Todo'/>";
                html += "</th>";
            }
            html += "</tr>";
            html += "</thead>";
            html += "<tbody id='tbData";
            html += id;
            html += "'>";
            html += "</tbody>";
            html += "<tfoot>";
            if (subtotales.length > 0) {
                var nCols = (tieneCheck ? nCampos + 1 : nCampos);
                var n = (tieneCheck ? 1 : 0);
                html += "<tr class='FilaCabecera'>";
                var ccs = 0;
                for (var j = 0; j < nCols; j++) {
                    html += "<th class='Derecha'";
                    if (subtotales.indexOf(j - n) > -1) {
                        html += " id='total";
                        html += id;
                        html += subtotales[ccs];
                        html += "'";
                        ccs++;
                    }
                    html + ">";
                    if (subtotales.indexOf(j - n) > -1) {
                        html += "0";
                    }
                    html += "</th>";
                }
                if (tieneNuevoEditar) html += "<th></th>";
                if (tieneEliminar) html += "<th></th>";
                html += "</tr>";
            }
            var nCols = (tieneCheck ? nCampos + 1 : nCampos);
            nCols = (tieneNuevoEditar ? nCols + 1 : nCols);
            nCols = (tieneEliminar ? nCols + 1 : nCols);
            html += "<tr>";
            html += "<td id='tdPagina";
            html += id;
            html += "' colspan='";
            html += nCols;
            html += "' class='Centro'>";
            html += "</td>";
            html += "</tr>";
            html += "</tfoot>";
            html += "</table>"
            div.innerHTML = html;
            if (indices.length > 0) llenarCombos();
            configurarOrden();
        }

        function llenarCombos() {
            var combos = document.getElementsByClassName("Cabecera Combo " + id);
            var nCombos = combos.length;
            for (var j = 0; j < nCombos; j++) {
                GUI.Combo(combos[j], ayudas[j], "Todos");
            }
        }

        function crearMatriz() {
            matriz = [];
            var campos = [];
            var fila = [];
            var esNumero = false;
            var esFecha = false;
            if (subtotales.length > 0) {
                totales = [];
                var nSubtotales = subtotales.length;
                for (var j = 0; j < nSubtotales; j++) {
                    totales.push(0);
                }
            }
            if (lista.length > 3 && lista[3] != "") {
                var cabeceras = document.getElementsByClassName("Cabecera " + id);
                var nCabeceras = cabeceras.length;
                var valores = [];
                for (var j = 0; j < nCabeceras; j++) {
                    if (cabeceras[j].className.indexOf("Texto") > -1) {
                        valores.push(cabeceras[j].value.toLowerCase());
                    }
                    else {
                        valores.push(cabeceras[j].options[cabeceras[j].selectedIndex].text);
                    }
                }
                var exito = false;
                var ccs = 0;
                for (var i = 3; i < nRegistros; i++) {
                    campos = lista[i].split("|");
                    exito = true;
                    for (var j = 0; j < nCabeceras; j++) {
                        if (cabeceras[j].className.indexOf("Texto") > -1) {
                            exito = (valores[j] == "" || campos[j].toString().toLowerCase().indexOf(valores[j]) > -1);
                        }
                        else {
                            exito = (valores[j] == "Todos" || campos[j] == valores[j]);
                        }
                        if (!exito) break;
                    }
                    ccs = 0;
                    if (exito) {
                        fila = [];
                        for (var j = 0; j < nCampos; j++) {
                            esNumero = (tipos[j].indexOf("Int") > -1 || tipos[j].indexOf("Decimal") > -1);
                            esFecha = (tipos[j].indexOf("DateTime") > -1);
                            if (esNumero) {
                                fila.push(campos[j] * 1);
                            }
                            else if (esFecha) {
                                fila.push(crearFecha(campos[j]));
                            }
                            else {
                                fila.push(campos[j]);
                            }
                            if (subtotales.length > 0 && subtotales.indexOf(j) > -1) {
                                valor = fila[j];
                                totales[ccs] += valor;
                                ccs++;
                            }
                        }
                        matriz.push(fila);
                    }
                }
            }
        }

        function crearFecha(strFecha) {
            var fechas = strFecha.split(" ");
            var fecha = fechas[0].split("/");
            var hms = fechas[1].split(":");
            var ampm = fechas[2];

            var dia = fecha[0] * 1;
            var mes = +fecha[1] - 1;
            var anio = Number(fecha[2]);
            var hora = hms[0] * 1;
            if (ampm == "PM") hora = hora + 12;
            var min = hms[1] * 1;
            var seg = hms[2] * 1;
            
            var fechaDMY = new Date(anio, mes, dia, hora, min, seg);
            return fechaDMY;
        }

        function mostrarMatriz() {
            var html = "";
            var nRegMatriz = matriz.length;
            var esNumero = false;
            var esFecha = false;
            var esDecimal = false;
            var existeIdCheck = false;
            var inicio = indicePagina * registrosPagina;
            var fin = inicio + registrosPagina;
            for (var i = inicio; i < fin; i++) {
                if (i < nRegMatriz) {
                    html += "<tr class='FilaDatos ";
                    html += id;
                    html += "'>";
                    if (tieneCheck) {
                        existeIdCheck = (idsChecks.indexOf(matriz[i][0]) > -1);
                        html += "<td>";
                        html += "<input type='checkbox' class='Check ";
                        html += id;
                        html += "' ";
                        if (existeIdCheck) {
                            html += "checked='checked'";
                        }
                        html += "/>";
                        html += "</td>";
                    }
                    for (var j = 0; j < nCampos; j++) {
                        html += "<td class='";
                        esNumero = (tipos[j].indexOf("Int") > -1 || tipos[j].indexOf("Decimal") > -1);
                        esFecha = (tipos[j].indexOf("DateTime") > -1);
                        esDecimal = (tipos[j].indexOf("Decimal") > -1);
                        if (esNumero) {
                            html += "Derecha";
                        }
                        else if (esFecha) {
                            html += "Centro";
                        }
                        else {
                            html += "Izquierda";
                        }
                        html += "'>";
                        if (esDecimal) html += matriz[i][j].toFixed(2);
                        else if (esFecha) html += mostrarFechaDMY(matriz[i][j]);
                        else html += matriz[i][j];
                        html += "</td>";
                    }
                    if (nBotones > 0) {
                        for (var j = 0; j < nBotones; j++) {
                            html += "<td>";
                            html += "<button class='BotonGrilla ";
                            html += id;
                            html += "'>";
                            html += botones[j].texto;
                            html += "</button>";
                            html += "</td>";
                        }
                    }
                    if (tieneNuevoEditar) {
                        html += "<td class='Centro'>";
                        html += "<img src='";
                        html += hdfRaiz.value;
                        html += "Images/Editar.png' class='Icono Centro Editar NoImprimir ";
                        html += id;
                        html += "' title='Editar'/>";
                        html += "</td>";
                    }
                    if (tieneEliminar) {
                        html += "<td class='Centro'>";
                        html += "<img src='";
                        html += hdfRaiz.value;
                        html += "Images/Eliminar.png' class='Icono Centro Eliminar NoImprimir ";
                        html += id;
                        html += "'/>";
                        html += "</td>";
                    }
                    html += "</tr>";
                }
                else break;
            }
            var tbData = document.getElementById("tbData" + id);
            if (tbData != null) tbData.innerHTML = html;
            var spTotal = document.getElementById("spnTotal" + id);
            if (spTotal != null) spTotal.innerHTML = matriz.length;
            if (nBotones > 0) configurarBotones();
            if (subtotales.length > 0) {
                var nSubtotales = subtotales.length;
                var tipo;
                var esDecimal;
                for (var j = 0; j < nSubtotales; j++) {
                    var celdaSubtotal = document.getElementById("total" + id + subtotales[j]);
                    if (celdaSubtotal != null) {
                        tipo = tipos[subtotales[j]];
                        esDecimal = (tipo.indexOf("Decimal") > -1);
                        if (esDecimal) celdaSubtotal.innerText = totales[j].toFixed(2);
                        else celdaSubtotal.innerText = totales[j];
                    }
                }
            }
            configurarEventos();
            configurarPaginacion();
        }

        function mostrarFechaDMY(fecha) {
            var anio = fecha.getFullYear();
            var mes = fecha.getMonth() + 1;
            mes = (mes<10 ? "0" + mes.toString() : mes.toString());
            var dia = fecha.getDate();
            dia = (dia < 10 ? "0" + dia.toString() : dia.toString());
            var hora = fecha.getHours();
            var ampm = "AM";
            if (hora > 12) {
                hora -= 12;
                ampm = "PM";
            }
            var min = fecha.getMinutes();
            var seg = fecha.getSeconds();
            var strFecha = dia + "/" + mes + "/" + anio + " " + hora + ":" + min + ":" + seg + " " + ampm;
            return strFecha;
        }

        function configurarBotones() {
            var btns = document.getElementsByClassName("BotonGrilla " + id);
            var nBtns = btns.length;
            for (var j = 0; j < nBtns; j++) {
                btns[j].onclick = function () {
                    var n = (tieneCheck ? 1 : 0);
                    var fila = this.parentNode.parentNode;
                    var idRegistro = fila.childNodes[n].innerText;
                    seleccionarBoton(id, idRegistro, this.innerText);
                }
            }
        }

        function configurarEventos() {
            var filas = document.getElementsByClassName("FilaDatos " + id);
            var nFilas = filas.length;
            for (var i = 0; i < nFilas; i++) {
                filas[i].onclick = function () {
                    var n = (tieneCheck ? 1 : 0);
                    var idRegistro = this.childNodes[n].innerText;
                    if (filaActual != null) {
                        filaActual.className = "FilaDatos " + id;
                    }
                    this.className = "FilaSeleccionada " + id;
                    filaActual = this;
                    seleccionarFila(id, idRegistro, this);
                }
            }

            var cabeceras = document.getElementsByClassName("Cabecera " + id);
            var nCabeceras = cabeceras.length;
            for (var j = 0; j < nCabeceras; j++) {
                if (cabeceras[j].className.indexOf("Texto") > -1) {
                    cabeceras[j].onkeyup = function (event) {
                        filtrarMatriz();
                    }
                }
                else {
                    cabeceras[j].onchange = function (event) {
                        filtrarMatriz();
                    }
                }
            }

            var btnBorrarFiltro = document.getElementById("btnBorrarFiltro" + id);
            if (btnBorrarFiltro != null) {
                btnBorrarFiltro.onclick = function () {
                    var cabeceras = document.getElementsByClassName("Cabecera " + id);
                    var nCabeceras = cabeceras.length;
                    for (var j = 0; j < nCabeceras; j++) {
                        cabeceras[j].value = "";
                    }
                    filtrarMatriz();
                }
            }

            var btnExportarTxt = document.getElementById("btnExportarTxt" + id);
            if (btnExportarTxt != null) {
                btnExportarTxt.onclick = function () {
                    var data = obtenerData("\r\n", ",");
                    FileSystem.download(data, id + ".txt");
                }
            }

            var btnExportarXlsx = document.getElementById("btnExportarXlsx" + id);
            if (btnExportarXlsx != null) {
                btnExportarXlsx.onclick = function () {
                    var archivo = id + ".xlsx";
                    var data = obtenerData("¬", "|", true);
                    var frm = new FormData();
                    frm.append("Data", data);
                    Http.postDownload("Exportacion/Exportar?archivo=" + archivo, function (rpta) {
                        FileSystem.download(rpta, archivo);
                    }, frm);
                }
            }

            var btnExportarDocx = document.getElementById("btnExportarDocx" + id);
            if (btnExportarDocx != null) {
                btnExportarDocx.onclick = function () {
                    var archivo = id + ".docx";
                    var data = obtenerData("¬", "|", true);
                    var frm = new FormData();
                    frm.append("Data", data);
                    Http.postDownload("Exportacion/Exportar?archivo=" + archivo, function (rpta) {
                        FileSystem.download(rpta, archivo);
                    }, frm);
                }
            }

            var btnExportarPdf = document.getElementById("btnExportarPdf" + id);
            if (btnExportarPdf != null) {
                btnExportarPdf.onclick = function () {
                    var archivo = id + ".pdf";
                    var data = obtenerData("¬", "|", true);
                    var frm = new FormData();
                    frm.append("Data", data);
                    Http.postDownload("Exportacion/Exportar?archivo=" + archivo, function (rpta) {
                        FileSystem.download(rpta, archivo);
                    }, frm);
                }
            }

            var btnImprimir = document.getElementById("btnImprimir" + id);
            if (btnImprimir != null) {
                btnImprimir.onclick = function () {
                    var html = "<table style='width:100%'>";
                    var nRegistros = matriz.length;
                    var cabeceras = lista[0].split("|");
                    var nCabeceras = cabeceras.length;
                    var anchos = lista[1].split("|");
                    html += "<thead>";
                    html += "<tr>";
                    for (var j = 0; j < nCabeceras; j++) {
                        html += "<th style='width:";
                        html += anchos[j];
                        html += "px' style='background-color:lightgray;'>";
                        html += cabeceras[j];
                        html += "</th>";
                    }
                    html += "</tr>";
                    html += "</thead>";
                    html += "<tbody>";
                    for (var i = 0; i < nRegistros; i++) {
                        html += "<tr>";
                        for (var j = 0; j < nCabeceras; j++) {
                            html += "<td>";
                            esFecha = (tipos[j].indexOf("DateTime") > -1);
                            if (esFecha) html += mostrarFechaDMY(matriz[i][j]);
                            else html += matriz[i][j];
                            html += "</td>";
                        }
                        html += "</tr>";
                    }
                    html += "</tbody>";
                    html += "</table>";
                    Impresion.imprimirTabla(html);
                }
            }

            var btnNuevo = document.getElementById("btnNuevo" + id);
            if (btnNuevo != null) {
                btnNuevo.onclick = function () {
                    nuevoRegistro(id);
                }
            }

            var btnsEditar = document.getElementsByClassName("Icono Centro Editar " + id);
            if (btnsEditar != null) {
                var nBtnsEditar = btnsEditar.length;
                for (var j = 0; j < nBtnsEditar; j++) {
                    btnsEditar[j].onclick = function () {
                        var fila = this.parentNode.parentNode;
                        var n = 0;
                        if (tieneCheck) n = 1;
                        var cod = fila.childNodes[n].innerText;
                        editarRegistro(id, cod, this);
                    }
                }
            }

            var btnsEliminar = document.getElementsByClassName("Icono Centro Eliminar " + id);
            if (btnsEliminar != null) {
                var nBtnsEliminar = btnsEliminar.length;
                for (var j = 0; j < nBtnsEliminar; j++) {
                    btnsEliminar[j].onclick = function () {
                        var fila = this.parentNode.parentNode;
                        var n = 0;
                        if (tieneCheck) n = 1;
                        var cod = fila.childNodes[n].innerText;
                        eliminarRegistro(id, cod, fila);
                    }
                }
            }

            if (tieneCheck) {
                var checks = document.getElementsByClassName("Check " + id);
                var nChecks = checks.length;
                var fila;
                var seleccionado;
                var esNumero = (tipos[0].indexOf("Int") > -1 || tipos[0].indexOf("Decimal") > -1);
                var pos;
                for (var i = 0; i < nChecks; i++) {
                    checks[i].onchange = function () {
                        seleccionado = this.checked;
                        fila = this.parentNode.parentNode;
                        cod = fila.childNodes[1].innerText;
                        if (esNumero) cod = +cod;
                        if (seleccionado) {
                            idsChecks.push(cod);
                            filasChecks.push(buscarCodigo(cod));
                        }
                        else {
                            pos = idsChecks.indexOf(cod);
                            if (pos > -1) {
                                idsChecks.splice(pos, 1);
                                filasChecks.splice(pos, 1);
                            }
                        }
                    }
                }

                var chkCabecera = document.getElementById("chkCabecera " + id);
                if (chkCabecera != null) {
                    chkCabecera.onchange = function () {
                        var seleccionado = this.checked;
                        if (!seleccionado) {
                            idsChecks = [];
                            filasChecks = [];
                        }
                        var fila;
                        var cod;
                        var esNumero = (tipos[0].indexOf("Int") > -1 || tipos[0].indexOf("Decimal") > -1);
                        for (var i = 0; i < nChecks; i++) {
                            checks[i].checked = seleccionado;
                            if (seleccionado) {
                                fila = checks[i].parentNode.parentNode;
                                cod = fila.childNodes[1].innerText;
                                if (esNumero) cod = +cod;
                                idsChecks.push(cod);
                                filasChecks.push(buscarCodigo(cod));
                            }
                        }
                    }
                }
            }
        }

        function obtenerData(sepRegistros, sepCampos, tieneCabeceras) {
            var data = "";
            tieneCabeceras = (tieneCabeceras == null ? false : tieneCabeceras);
            var cabeceras = lista[0].split("|");
            var nCabeceras = cabeceras.length;
            var anchos = lista[1].split("|");
            data += cabeceras.join(sepCampos);
            data += sepRegistros;
            if (tieneCabeceras) {
                data += anchos.join(sepCampos);
                data += sepRegistros;
                data += tipos.join(sepCampos);
                data += sepRegistros;
            }
            var nRegistros = matriz.length;
            for (var i = 0; i < nRegistros; i++) {
                //data += matriz[i].join(sepCampos);
                for (var j = 0; j < nCabeceras; j++) {
                    esFecha = (tipos[j].indexOf("DateTime") > -1);
                    if (esFecha) data += mostrarFechaDMY(matriz[i][j]);
                    else data += matriz[i][j];
                    if (j < nCabeceras - 1) data += sepCampos;
                }
                if (i < nRegistros - 1) data += sepRegistros;
            }
            return data;
        }

        function configurarOrden() {
            var enlaces = document.getElementsByClassName("Enlace " + id);
            var nEnlaces = enlaces.length;
            for (var j = 0; j < nEnlaces; j++) {
                enlaces[j].onclick = function () {
                    ordenarColumna(this);
                }
            }
        }

        function ordenarColumna(span) {
            var orden = span.getAttribute("data-orden");
            colOrden = orden * 1;
            var spnSimbolo = span.nextSibling.nextSibling;
            var simbolo = spnSimbolo.innerHTML;
            borrarSimbolosOrdenacion();
            if (simbolo == "") {
                tipoOrden = 0;
                spnSimbolo.innerHTML = "▲";
                matriz.sort(ordenarMatriz);
            }
            else {
                if (simbolo == "▲") {
                    tipoOrden = 1;
                    spnSimbolo.innerHTML = "▼";
                }
                else {
                    tipoOrden = 0;
                    spnSimbolo.innerHTML = "▲";
                }
                matriz.reverse();
            }
            mostrarMatriz();
        }

        function borrarSimbolosOrdenacion() {
            var enlaces = document.getElementsByClassName("Enlace " + id);
            var nEnlaces = enlaces.length;
            for (var j = 0; j < nEnlaces; j++) {
                enlaces[j].nextSibling.nextSibling.innerHTML="";
            }
        }

        function configurarPaginacion() {
            var nRegistros = matriz.length;
            var totalPaginas = Math.floor(nRegistros / registrosPagina);
            if (nRegistros % registrosPagina > 0) totalPaginas++;
            var html = "";
            if (totalPaginas > 1) {
                var totalRegistros = matriz.length;
                var registrosBloque = registrosPagina * paginasBloque;
                var totalBloques = Math.floor(totalRegistros / registrosBloque);
                if (totalRegistros % registrosBloque > 0) totalBloques++;
                if (indiceBloque > 0) {
                    html += "<button class='Pag ";
                    html += id;
                    html += " Pagina' data-pag='-1'>";
                    html += "<<";
                    html += "</button>";
                    html += "<button class='Pag ";
                    html += id;
                    html += " Pagina' data-pag='-2'>";
                    html += "<";
                    html += "</button>";
                }
                var inicio = indiceBloque * paginasBloque;
                var fin = inicio + paginasBloque;
                for (var j = inicio; j < fin; j++) {
                    if (j < totalPaginas) {
                        html += "<button class='Pag ";
                        html += id;
                        html += " ";
                        if (indicePagina == j) html += "PaginaSeleccionada";
                        else html += "Pagina";
                        html += "' data-pag='";
                        html += j;
                        html += "'>";
                        html += (j + 1);
                        html += "</button>";
                    }
                    else break;
                }
                if (indiceBloque < (totalBloques-1)) {
                    html += "<button class='Pag ";
                    html += id;
                    html += " Pagina' data-pag='-3'>";
                    html += ">";
                    html += "</button>";
                    html += "<button class='Pag ";
                    html += id;
                    html += " Pagina' data-pag='-4'>";
                    html += ">>";
                    html += "</button>";
                }
                html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                html += "<select id='cboPagina";
                html += id;
                html += "'>";
                for (var j = 0; j < totalPaginas; j++) {
                    html += "<option value='";
                    html += j;
                    html += "'";
                    if (indicePagina == j) html += " selected";
                    html += ">";
                    html += (j + 1);
                    html += "</option>";
                }
                html += "</select>";
            }
            var tdPagina = document.getElementById("tdPagina" + id);
            if (tdPagina != null) {
                tdPagina.innerHTML = html;
                configurarEventosPagina();
            }
        }

        function configurarEventosPagina() {
            var paginas = document.getElementsByClassName("Pag " + id);
            var nPaginas = paginas.length;
            for (var j = 0; j < nPaginas; j++) {
                paginas[j].onclick = function () {
                    paginar(+this.getAttribute("data-pag"));
                }
            }

            var cboPagina = document.getElementById("cboPagina" + id);
            if (cboPagina != null) {
                cboPagina.onchange = function () {
                    paginar(this.value);
                }
            }
        }

        function paginar(indice) {
            if (indice > -1) {
                indicePagina = indice;
                indiceBloque = Math.floor(indicePagina / paginasBloque);
            }
            else {
                var totalRegistros = matriz.length;
                var registrosBloque = registrosPagina * paginasBloque;
                var totalBloques = Math.floor(totalRegistros / registrosBloque);
                if (totalRegistros % registrosBloque > 0) totalBloques++;
                switch (indice) {
                    case -1: //Primer Bloque
                        indiceBloque = 0;
                        indicePagina = 0;
                        break;
                    case -2: //Bloque Anterior
                        indiceBloque--;
                        indicePagina = indiceBloque * paginasBloque;
                        break;
                    case -3: //Bloque Siguiente
                        indiceBloque++;
                        indicePagina = indiceBloque * paginasBloque;
                        break;
                    case -4: //Ultimo Bloque
                        indiceBloque = (totalBloques - 1);
                        indicePagina = indiceBloque * paginasBloque;
                        break;
                }
            }
            mostrarMatriz();
        }

        this.ObtenerMatriz = function() {
            return matriz;
        }

        this.ObtenerCheckIds = function () {
            var esNumero = (tipos[0].indexOf("Int") > -1 || tipos[0].indexOf("Decimal") > -1);
            if (esNumero) idsChecks.sort(ordenarVector);
            else idsChecks.sort();
            return idsChecks;
        }

        this.ObtenerCheckFilas = function () {
            var esNumero = (tipos[0].indexOf("Int") > -1 || tipos[0].indexOf("Decimal") > -1);
            if (esNumero) filasChecks.sort(ordenarMatrizAscCod);
            else filasChecks.sort();
            var data = [];
            var nFilasChecks = filasChecks.length;
            for (var i = 0; i < nFilasChecks; i++) {
                data.push(filasChecks[i].join("|"));
            }
            return data.join("¬");
        }

        function ordenarVector(x, y) {
            return (x > y ? 1 : -1);
        }

        function ordenarMatrizAscCod(x, y) {
            var idX = x[0];
            var idY = y[0];
            return (idX > idY ? 1 : -1);
        }

        function ordenarMatriz(x, y) {
            var rpta = 0;
            var idX = x[colOrden];
            var idY = y[colOrden];
            if (tipoOrden == 0) rpta = (idX > idY ? 1 : -1);
            else rpta = (idX < idY ? 1 : -1);
            return rpta;
        }

        function buscarCodigo(id) {
            var fila = [];
            var nRegistros = matriz.length;
            if (nRegistros > 0) {
                var nCampos = matriz[0].length;
                for (var i = 0; i < nRegistros; i++) {
                    if (matriz[i][0] == id) {
                        for (var j = 0; j < nCampos; j++) {
                            fila.push(matriz[i][j])
                        }
                        break;
                    }
                }
            }
            return fila;
        }
    }

    GUI.TextList = function (div, lista, idTextList, ancho) {
        var idText = idTextList;
        var ancho = (ancho == null ? 300 : ancho);
        var html = "<input id='txtBusqueda";
        this.IdLista = "";

        html += idTextList;
        html += "' style='width:";
        html += ancho;
        html += "px'/>";
        html += "<div style='display:none;background-Color:white;overflow-y:auto;height:200px; width:";
        html += ancho;
        html += "px'>";
        html += "<ul id='ulTextList";
        html += idTextList;
        html += "'>";
        html += "</ul>";
        html += "</div>";
        div.innerHTML = html;

        var txtBusqueda = document.getElementById("txtBusqueda" + idTextList);
        if (txtBusqueda != null) {
            txtBusqueda.onkeyup = function (event) {
                var ulTextList = document.getElementById("ulTextList" + idTextList);
                ulTextList.parentNode.style.display = "block";
                var nRegistros = lista.length;
                var campos = [];
                var valor = txtBusqueda.value.toLowerCase();
                var data = "";
                for (var i = 0; i < nRegistros; i++) {
                    campos = lista[i].split("|");
                    if (valor == "" || (valor != "" && campos[1].toLowerCase().startsWith(valor))) {
                        data += "<li data-id='";
                        data += campos[0];
                        data += "' class='";
                        data += idTextList;
                        data += " lista' style='cursor:pointer'>";
                        data += campos[1];
                        data += "</li>";
                    }
                }

                if (ulTextList != null) {
                    ulTextList.innerHTML = data;
                    var lis = document.getElementsByClassName(idTextList + " lista");
                    var nlis = lis.length;
                    for (var i = 0; i < nlis; i++) {
                        lis[i].onclick = function () {
                            txtBusqueda.value = this.innerText;
                            txtBusqueda.setAttribute("data-id", this.getAttribute("data-id"));
                            ulTextList.parentNode.style.display = "none";
                        }
                    }
                }
            }
        }

        function obtenerIdBusqueda() {
            var txtBusqueda = document.getElementById("txtBusqueda" + idText);
            if (txtBusqueda != null) {
                return txtBusqueda.getAttribute("data-id");
            }
        }

        this.IdLista = obtenerIdBusqueda;
    }

    GUI.ObtenerDatos = function (claseGrab) {
        var data = "";
        if (claseGrab == null) claseGrab = "G";
        var controles = document.getElementsByClassName(claseGrab);
        var nControles = controles.length;

        for (var i = 0; i < nControles; i++) {
            data += controles[i].value;
            if (i < nControles - 1) data += "|";
        }
        return (data);
    }

    GUI.LimpiarDatos = function (claseBorrar) {
        if (claseBorrar == null) claseBorrar = "R";
        var controles = document.getElementsByClassName(claseBorrar);
        var nControles = controles.length;
        for (var i = 0; i < nControles; i++) {
            controles[i].value = "";
            controles[i].style.borderColor = "";
        }
    }

    GUI.MostrarDatos = function (claseMostrar, valoresMostrar) {
        if (claseMostrar == null) claseMostrar = "G";
        var controles = document.getElementsByClassName(claseMostrar);
        var nControles = controles.length;
        for (var i = 0; i < nControles; i++) {
            if (i < valoresMostrar.length) {
                controles[i].value = valoresMostrar[i];
            }
        }
    }

    GUI.Tree2 = function (div, listaCabecera, listaDetalle) {
        var nCabeceras = listaCabecera.length;
        var nDetalles = listaDetalle.length;
        var cabeceraCampos = listaCabecera[0].split("|");
        var cabeceraAnchos = listaCabecera[1].split("|");
        var nCaberaCampos = cabeceraCampos.length;
        var campos = [];
        var pos = 3;

        var html = "";
        html += "<table style='width:100%'>";
        html += "<tr class='FilaCabecera'>";
        for (var j = 0; j < nCaberaCampos; j++) {
            html += "<th style='width:";
            html += cabeceraAnchos[j];
            html += "px'>";
            if (j == 0) {
                html += "<div>";
                html += "<span id='spnCab' class='CabExpandir NoImprimir' class='Centrado'>+</span>";
                html += "<span>";
                html += cabeceraCampos[j];
                html += "</span>";
                html += "</div>";
            }
            else html += cabeceraCampos[j];
            html += "</th>";
        }
        html += "</tr>";
        for (var i = 3; i < nCabeceras; i++) {
            campos = listaCabecera[i].split("|");
            html += "<tr class='FilaDatos'>";
            for (var j = 0; j < nCaberaCampos; j++) {
                html += "<td>";
                if (j == 0) {
                    html += "<div>";
                    html += "<span class='Expandible Centrado NoImprimir' data-id='";
                    html += campos[0];
                    html += "'>+</span>";
                    html += "<span>";
                    html += campos[j];
                    html += "</span>";
                    html += "</div>";
                }
                else html += campos[j];
                html += "</td>";
            }
            html += "</tr>";
            html += "<tr style='display:none' id='tr";
            html += campos[0];
            html += "'>";
            html += "<td>&nbsp;</td>";
            html += "<td colspan='";
            html += nCaberaCampos - 1;
            html += "'>";
            html += crearTablaDetalle(campos[0]);
            html += "</td>";
            html += "</tr>";
        }
        html += "</table>";
        div.innerHTML = html;
        configurarExpandirColapsar();

        function crearTablaDetalle(idCabecera) {
            var html = "";
            var detalleCampos = listaDetalle[0].split("|");
            var detalleAnchos = listaDetalle[1].split("|");
            var detalleTipos = listaDetalle[2].split("|");
            var nDetalleCampos = detalleCampos.length - 1;
            var posCampo = nDetalleCampos;
            html += "<table style='width:100%'>";
            html += "<tr class='FilaCabecera'>";
            for (var j = 0; j < nDetalleCampos; j++) {
                html += "<th style='width:";
                html += detalleAnchos[j];
                html += "px'>";
                html += detalleCampos[j];
                html += "</th>";
            }
            html += "</tr>";
            var campos = [];
            var tipo = "";
            for (var i = pos; i < nDetalles; i++) {
                campos = listaDetalle[i].split("|");
                if (campos[posCampo] == idCabecera) {
                    html += "<tr class='FilaDatos'>";
                    for (var j = 0; j < nDetalleCampos; j++) {
                        tipo = detalleTipos[j];
                        html += "<td";
                        if (tipo.startsWith("Int") || tipo.startsWith("Decimal")) {
                            html += " class='Derecha'";
                        }
                        html += ">";
                        html += campos[j];
                        html += "</td>";
                    }
                    html += "</tr>";
                }
                else {
                    pos = i;
                    break;
                }
            }
            html += "</table>";
            return html;
        }

        function configurarExpandirColapsar() {
            var spans = document.getElementsByClassName("Expandible");
            var nSpans = spans.length;
            for (var i = 0; i < nSpans; i++) {
                spans[i].onclick = function () {
                    var id = this.getAttribute("data-id");
                    var tr = document.getElementById("tr" + id);
                    if (this.innerText == "+") {
                        tr.style.display = "table-row";
                        this.innerText = "-";
                    }
                    else {
                        tr.style.display = "none";
                        this.innerText = "+";
                    }
                }
            }

            var spnCab = document.getElementById("spnCab");
            if (spnCab != null) {
                spnCab.onclick = function () {
                    for (var i = 0; i < nSpans; i++) {
                        var id = spans[i].getAttribute("data-id");
                        var tr = document.getElementById("tr" + id);
                        if (this.innerText == "+") {
                            spans[i].innerText = "-";
                            tr.style.display = "table-row";
                        }
                        else {
                            spans[i].innerText = "+";
                            tr.style.display = "none";
                        }
                    }
                    if (this.innerText == "+") {
                        this.innerText = "-";
                    }
                    else {
                        this.innerText = "+";
                    }
                }
            }
        }
    }

    GUI.Tree3 = function (div, listaCabecera, listaDetalle, listaSubdetalle) {
        var nCabeceras = listaCabecera.length;
        var nDetalles = listaDetalle.length;
        var nSubdetalles = listaSubdetalle.length;

        var cabeceraCampos = listaCabecera[0].split("|");
        var cabeceraAnchos = listaCabecera[1].split("|");
        var nCaberaCampos = cabeceraCampos.length;
        var campos = [];
        var posDetalle = 3;
        var posSubdetalle = 3;

        var html = "";
        html += "<table style='width:100%'>";
        html += "<tr class='FilaCabecera'>";
        for (var j = 0; j < nCaberaCampos; j++) {
            html += "<th style='width:";
            html += cabeceraAnchos[j];
            html += "px'>";
            if (j == 0) {
                html += "<div>";
                html += "<span id='spnCab' class='Expandible NoImprimir' class='Centrado'>+</span>";
                html += "<span>";
                html += cabeceraCampos[j];
                html += "</span>";
                html += "</div>";
            }
            else html += cabeceraCampos[j];
            html += "</th>";
        }
        html += "</tr>";
        for (var i = 3; i < nCabeceras; i++) {
            campos = listaCabecera[i].split("|");
            html += "<tr class='FilaDatos'>";
            for (var j = 0; j < nCaberaCampos; j++) {
                html += "<td>";
                if (j == 0) {
                    html += "<div>";
                    html += "<span class='FilaExpandir Expandible Centrado NoImprimir' data-id='";
                    html += campos[0];
                    html += "'>+</span>";
                    html += "<span>";
                    html += campos[j];
                    html += "</span>";
                    html += "</div>";
                }
                else html += campos[j];
                html += "</td>";
            }
            html += "</tr>";
            html += "<tr style='display:none' id='tr";
            html += campos[0];
            html += "'>";
            html += "<td>&nbsp;</td>";
            html += "<td colspan='";
            html += nCaberaCampos - 1;
            html += "'>";
            html += crearTablaDetalle(campos[0]);
            html += "</td>";
            html += "</tr>";
        }
        html += "</table>";
        div.innerHTML = html;
        configurarExpandirColapsar();

        function crearTablaDetalle(idCabecera) {
            var html = "";
            var detalleCampos = listaDetalle[0].split("|");
            var detalleAnchos = listaDetalle[1].split("|");
            var detalleTipos = listaDetalle[2].split("|");
            var nDetalleCampos = detalleCampos.length - 1;
            var posCampo = nDetalleCampos;
            html += "<table style='width:100%'>";
            html += "<tr class='FilaCabecera'>";
            for (var j = 0; j < nDetalleCampos; j++) {
                html += "<th style='width:";
                html += detalleAnchos[j];
                html += "px'>";
                if (j == 0) {
                    html += "<div>";
                    html += "<span id='spnCab";
                    html += idCabecera;
                    html += "' class='CabExpandir Expandible NoImprimir Centrado' data-id='";
                    html += idCabecera;
                    html += "'>+</span>";
                    html += "<span>";
                    html += detalleCampos[j];
                    html += "</span>";
                    html += "</div>";
                }
                else html += detalleCampos[j];
                html += "</th>";
            }
            html += "</tr>";
            var campos = [];
            var tipo = "";
            for (var i = posDetalle; i < nDetalles; i++) {
                campos = listaDetalle[i].split("|");
                if (campos[posCampo] == idCabecera) {
                    html += "<tr class='FilaDatos'>";
                    for (var j = 0; j < nDetalleCampos; j++) {
                        tipo = detalleTipos[j];
                        html += "<td";
                        if (tipo.startsWith("Int") || tipo.startsWith("Decimal")) {
                            html += " class='Derecha'";
                        }
                        html += ">";
                        if (j == 0) {
                            html += "<div>";
                            html += "<span class='Expandible Centrado NoImprimir FilaExpandir";
                            html += idCabecera;
                            html += "' data-id='";
                            html += campos[0];
                            html += "'>+</span>";
                            html += "<span>";
                            html += campos[j];
                            html += "</span>";
                            html += "</div>";
                        }
                        else html += campos[j];
                        html += "</td>";
                    }
                    html += "</tr>";
                    html += "<tr style='display:none' id='tr";
                    html += campos[0];
                    html += "'>";
                    html += "<td>&nbsp;</td>";
                    html += "<td colspan='";
                    html += nDetalleCampos - 1;
                    html += "'>";
                    html += crearTablaSubdetalle(campos[0]);
                    html += "</td>";
                    html += "</tr>";
                }
                else {
                    posDetalle = i;
                    break;
                }
            }
            html += "</table>";
            return html;
        }

        function crearTablaSubdetalle(idDetalle) {
            var html = "";
            var subdetalleCampos = listaSubdetalle[0].split("|");
            var subdetalleAnchos = listaSubdetalle[1].split("|");
            var subdetalleTipos = listaSubdetalle[2].split("|");
            var nSubdetalleCampos = subdetalleCampos.length - 1;
            var posCampo = nSubdetalleCampos;
            html += "<table style='width:100%'>";
            html += "<tr class='FilaCabecera'>";
            for (var j = 0; j < nSubdetalleCampos; j++) {
                html += "<th style='width:";
                html += subdetalleAnchos[j];
                html += "px'>";
                html += subdetalleCampos[j];
                html += "</th>";
            }
            html += "</tr>";
            var campos = [];
            var tipo = "";
            for (var i = posSubdetalle; i < nSubdetalles; i++) {
                campos = listaSubdetalle[i].split("|");
                if (campos[posCampo] == idDetalle) {
                    html += "<tr class='FilaDatos'>";
                    for (var j = 0; j < nSubdetalleCampos; j++) {
                        tipo = subdetalleTipos[j];
                        html += "<td";
                        if (tipo.startsWith("Int") || tipo.startsWith("Decimal")) {
                            html += " class='Derecha'";
                        }
                        html += ">";
                        html += campos[j];
                        html += "</td>";
                    }
                    html += "</tr>";
                }
                else {
                    posSubdetalle = i;
                    break;
                }
            }
            html += "</table>";
            return html;
        }

        function expandirFilas(clase) {
            var spans = document.getElementsByClassName(clase);
            var nSpans = spans.length;
            for (var i = 0; i < nSpans; i++) {
                spans[i].onclick = function () {
                    var id = this.getAttribute("data-id");
                    var tr = document.getElementById("tr" + id);
                    if (this.innerText == "+") {
                        tr.style.display = "table-row";
                        this.innerText = "-";
                    }
                    else {
                        tr.style.display = "none";
                        this.innerText = "+";
                    }
                }
            }
        }

        function expandirCabecera(clase, idCabecera) {
            var spans = document.getElementsByClassName(clase);
            var nSpans = spans.length;
            var spnCab = document.getElementById(idCabecera);
            if (spnCab != null) {
                spnCab.onclick = function () {
                    for (var i = 0; i < nSpans; i++) {
                        var id = spans[i].getAttribute("data-id");
                        var tr = document.getElementById("tr" + id);
                        if (this.innerText == "+") {
                            spans[i].innerText = "-";
                            tr.style.display = "table-row";
                        }
                        else {
                            spans[i].innerText = "+";
                            tr.style.display = "none";
                        }
                    }
                    if (this.innerText == "+") {
                        this.innerText = "-";
                    }
                    else {
                        this.innerText = "+";
                    }
                }
            }
        }

        function configurarExpandirColapsar() {
            expandirCabecera("FilaExpandir", "spnCab");
            expandirFilas("FilaExpandir");

            var cabs = document.getElementsByClassName("CabExpandir");
            var ncabs = cabs.length;
            for (var i = 0; i < ncabs; i++) {
                var id = cabs[i].getAttribute("data-id");
                expandirCabecera("FilaExpandir" + id, cabs[i].id);
                expandirFilas("FilaExpandir" + id);
            }
        }
    }

    GUI.TreeView = function(div, lista, raiz, check) {
        check = (check == null ? false : check);
        var html = "<ul id='ulMenu' style='cursor:pointer'>";
        html += "<li>";
        if (check) html += "<input type='checkbox' class='check'/>";
        html += raiz;
        html += "<ul>";
        var nregistros = lista.length;
        var campos = [];
        for (var i = 0; i < nregistros; i++) {
            campos = lista[i].split("|");
            if (campos[3] == "0") {
                html += "<li data-id='";
                html += campos[0];
                html += "' data-accion='";
                html += campos[2];
                html += "'>";
                if (check) html += "<input type='checkbox' class='check'/>";
                html += campos[1];
                html += crearSubmenu(lista, campos[0], check);
                html += "</li>";
            }
        }
        html += "</ul>";
        html += "</li>";
        html += "</ul>";
        div.innerHTML = html;
        configurarTreeViewChecks(check);

        function crearSubmenu(lista, idPadre, check) {
            check = (check == null ? false : check);
            var html = "<ul>";
            var nregistros = lista.length;
            var campos = [];
            for (var i = 0; i < nregistros; i++) {
                campos = lista[i].split("|");
                if (campos[3] == idPadre) {
                    html += "<li data-id='";
                    html += campos[0];
                    html += "' data-accion='";
                    html += campos[2];
                    html += "'>";
                    if (check) html += "<input type='checkbox' class='check'/>";
                    html += campos[1];
                    html += crearSubmenu(lista, campos[0], check);
                    html += "</li>";
                }
            }
            html += "</ul>";
            return html;
        }

        function configurarTreeViewChecks(check) {
            var ulMenu = document.getElementById("ulMenu");
            ulMenu.onclick = function (event) {
                var liMenu = event.target;
                if (liMenu.childNodes.length > 1) {
                    var ulSubMenu = liMenu.childNodes[check ? 2 : 1];
                    if (ulSubMenu.hasChildNodes()) {
                        if (ulSubMenu.style.display == "" || ulSubMenu.style.display == "block") {
                            ulSubMenu.style.display = "none";
                        }
                        else {
                            ulSubMenu.style.display = "block";
                        }
                    }
                    else {
                        var opcion = liMenu.innerText;
                        var accion = liMenu.getAttribute("data-accion");
                        seleccionarNodoTreeView(liMenu, opcion, accion);
                    }
                }
            }

            var checks = document.getElementsByClassName("check");
            var nchecks = checks.length;
            for (var i = 0; i < nchecks; i++) {
                var check = checks[i];
                check.onclick = function () {
                    seleccionarCheckTreeView(this);
                }
            }
        }

        function seleccionarCheckTreeView(chkPadre) {
            var seleccion = chkPadre.checked;
            var liPadre = chkPadre.parentNode;
            var ulPadre = liPadre.childNodes[2];
            if (ulPadre.hasChildNodes()) {
                var nHijos = ulPadre.childNodes.length;
                var liHijos = ulPadre.childNodes;
                var liHijo;
                var chkHijo;
                for (var i = 0; i < nHijos; i++) {
                    liHijo = liHijos[i];
                    chkHijo = liHijo.firstChild;
                    chkHijo.checked = seleccion;
                    seleccionarCheckTreeView(chkHijo);
                }
            }
        }

        function obtenerChecksSeleccionados() {
            var checks = document.getElementsByClassName("check");
            var nchecks = checks.length;
            var check;
            var data = "";
            for (var i = 0; i < nchecks; i++) {
                check = checks[i];
                if (check.checked) {
                    var id = check.parentNode.getAttribute("data-id");
                    if (id != null) {
                        data += id;
                        data += "-";
                        data += check.nextSibling.textContent;
                        data += "|";
                    }
                }
            }
            if (data.length > 0) data = data.substr(0, data.length - 1);
            return data;
        }

        this.obtenerChecksSeleccionados = obtenerChecksSeleccionados;
    }

    return GUI;
})();

var Validacion = (function () {
    function Validacion() {
    }
    Validacion.ValidarRequeridos = function (claseReq, span) {
        if (claseReq == null) claseReq = "R";
        if (span == null) span = spnMensaje
        var controles = document.getElementsByClassName(claseReq);
        var nControles = controles.length;
        var c = 0;
        for (var i = 0; i < nControles; i++) {
            if (controles[i].value == "") {
                controles[i].style.borderColor = "red";
                c++;
            }
            else {
                controles[i].style.borderColor = "";
            }
        }
        if (c > 0) span.innerHTML = "Los campos en Borde Rojo son Requeridos";
        else span.innerHTML = "";
        return(c == 0);
    }
    Validacion.ValidarNumeros = function (claseNum, span) {
        if (claseNum == null) claseNum = "N";
        if (span == null) span = spnMensaje
        var controles = document.getElementsByClassName(claseNum);
        var nControles = controles.length;
        var c = 0;
        for (var i = 0; i < nControles; i++) {
            if (isNaN(controles[i].value)) {
                controles[i].style.borderColor = "blue";
                c++;
            }
            else {
                controles[i].style.borderColor = "";
            }
        }
        if (c > 0) span.innerHTML = "Los campos en Borde Azul son Numeros";
        else span.innerHTML = "";
        return (c == 0);
    }
    Validacion.ValidarNumerosEnLinea = function (claseNum) {
        if (claseNum == null) claseNum = "N";
        var controles = document.getElementsByClassName(claseNum);
        var nControles = controles.length;
        for (var i = 0; i < nControles; i++) {
            controles[i].onkeyup = function (event) {
                var keycode = ('which' in event ? event.which : event.keycode);
                var esValido = ((keycode > 47 && keycode < 58) || (keycode > 95 && keycode < 106) || keycode == 8 || keycode == 37 || keycode == 39 || keycode == 110 || keycode == 188 || keycode == 190);
                if (!esValido) this.value = this.value.removeCharAt(this.selectionStart);
            }

            controles[i].onpaste = function (event) {
                event.preventDefault();
            }
        }
    }
    String.prototype.removeCharAt = function (i) {
        var tmp = this.split('');
        tmp.splice(i - 1, 1);
        return tmp.join('');
    }
    Validacion.ValidarDatos = function (claseReq, claseNum, span) {
        var valido = Validacion.ValidarRequeridos(claseReq, span);
        if (valido) {
            valido = Validacion.ValidarNumeros(claseNum, span);
        }
        return valido;
    }
    return Validacion;
})();

var FileSystem = (function () {
    function FileSystem() {
    }
    FileSystem.getMime = function (archivo) {
        var mime = "";
        var campos = archivo.split(".");
        var extension = campos[campos.length - 1].toLowerCase();
        switch (extension) {
            case "txt":
                mime = "text/plain";
                break;
            case "csv":
                mime = "text/csv";
                break;
            case "json":
                mime = "application/json";
                break;
            case "xlsx":
                mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                break;
            case "docx":
                mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                break;
            case "pdf":
                mime = "application/pdf";
                break;
            default:
                mime = "application/octet-stream";
                break;
        }
        return mime;
    }
    FileSystem.download = function (data, archivo) {
        var mime = FileSystem.getMime(archivo);
        var blob = new Blob([data], { "type": mime });
        var link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = archivo;
        link.click();
    }
    return FileSystem;
})();

var Impresion = (function () {
    function Impresion() {
    }
    Impresion.imprimirTabla = function (tabla) {
        var ventana = window.frames["print_frame"];
        if (ventana != null) {
            var pagina = document.body;
            ventana.document.body.innerHTML = "";
            ventana.document.body.innerHTML = tabla;
            ventana.focus();
            ventana.print();
            ventana.close();
            document.body = pagina;
        }
    }
    Impresion.imprimirDiv = function (div) {
        var ventana = window.frames["print_frame"];
        if (ventana != null) {
            var pagina = document.body;
            mostrarControles(false);
            ventana.document.body.innerHTML = "";
            guardarValores(div);
            ventana.document.body.innerHTML = div.outerHTML;
            divVentana = ventana.document.getElementById(div.id);
            if (divVentana != null) recuperarValores(divVentana);
            ventana.focus();
            ventana.print();
            ventana.close();
            mostrarControles(true);
            document.body = pagina;
        }
    }

    function guardarValores(div) {
        if (div.hasChildNodes()) {
            var controles = div.childNodes;
            var ncontroles = controles.length;
            var control;
            for (var i = 0; i < ncontroles; i++) {
                control = controles[i];
                if (control.tagName == "INPUT" && control.type == "text") {
                    control.setAttribute("value", control.value);
                }
                guardarValores(control);
            }
        }
    }

    function recuperarValores(div) {
        if (div.hasChildNodes()) {
            var controles = div.childNodes;
            var ncontroles = controles.length;
            var control;
            for (var i = 0; i < ncontroles; i++) {
                control = controles[i];
                if (control.tagName == "INPUT" && control.type == "text") {
                    control.value = control.getAttribute("value");
                }
                recuperarValores(control);
            }
        }
    }

    function mostrarControles(visible) {
        var controles = document.getElementsByClassName("NoImprimir");
        var ncontroles = controles.length;
        var estilo = (visible ? "block" : "none");
        for (var j = 0; j < ncontroles; j++) {
            controles[j].style.display = estilo;
        }
    }
    return Impresion;
})();

var Popup = (function () {
    function Popup() {
    }
    Popup.CrearPopup = function (popup){
        var html = "";
        var nregistros = popup.length;
        var campos = [];
        var tipoControl = "";
        if (ayudas == null) ayudas = [];
        for (var i = 1; i < nregistros; i++) {
            campos = popup[i].split("|");
            tipoControl = campos[1].substr(0, 3);
            html += "<div class='Fila'>";
            html += "<div class='Ancho20'>";
            html += campos[0];
            html += "</div>";
            html += "<div class='Ancho80'>";
            switch (tipoControl) {
                case "txt":
                    html += "<input type='text' id='";
                    html += campos[1];
                    html += "' style = 'width:";
                    html += campos[2];
                    html += "px' class='";
                    html += campos[3];
                    html += "'/>"
                    break;
                case "cbo":
                    html += "<select id='";
                    html += campos[1];
                    html += "' style = 'width:";
                    html += campos[2];
                    html += "px' class='";
                    html += campos[3];
                    html += "'></select>"
            }
            html += "</div>";
            html += "</div>";
        }
        divPopup.innerHTML = html;
    }

    Popup.Resize = function (popup, ancho, alto) {
        popup.style.width = ancho + "%";
        popup.style.height = alto + "%";
        popup.style.left = ((100 - ancho) / 2) + "%";
        popup.style.top = ((100 - alto) / 2) + "%";
    }

    Popup.ConfigurarArrastre = function(divPopupContainer, divPopupWindow, divBarra) {
        divBarra.draggable = true;
        divBarra.ondragstart = function (event) {
            var ancho = getComputedStyle(divPopupWindow, null).getPropertyValue("left");
            var alto = getComputedStyle(divPopupWindow, null).getPropertyValue("top");
            var a = Math.floor(ancho.replace("px", ""));
            var b = Math.floor(alto.replace("px", ""));
            var x = (event.clientX > a ? event.clientX - a : a - event.clientX);
            var y = (event.clientY > b ? event.clientY - b : b - event.clientY);
            var punto = x + "," + y;
            event.dataTransfer.setData("text", punto);
        }
        divBarra.ondragover = function (event) {
            event.preventDefault();
        }
        divPopupContainer.ondragover = function (event) {
            event.preventDefault();
        }
        divPopupContainer.ondrop = function (event) {
            event.preventDefault();
            var x1 = event.clientX;
            var y1 = event.clientY;
            var puntoInicial = event.dataTransfer.getData("text");
            var punto = puntoInicial.split(",");
            var x2 = punto[0] * 1;
            var y2 = punto[1] * 1;
            divPopupWindow.style.left = (x1 - x2) + "px";
            divPopupWindow.style.top = (y1 - y2) + "px";
        }
    }
    return Popup;
})();

var Speech = (function () {
    function Speech() {
    }
    Speech.Recognition = function() {
        if ('webkitSpeechRecognition' in window) {
            var recognizing = false;
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = false;
            iniciarReconocimiento();

            recognition.onresult = function (event) {
                var palabras = event.results[event.results.length - 1][0].transcript.trim();
                var palabra = palabras.split(" ");
                var comando = "";
                if (palabra.length > 0) {
                    comando = palabra[0];
                    var spnComando = document.getElementById("spnComando");
                    if (spnComando != null) spnComando.innerHTML = palabras;
                }
                ultimoComando = comando;
                ejecutarComandoVoz(palabras, comando);
            };

            recognition.onstart = function () {
                //alert("Iniciando Reconocimiento");
                recognizing = true;
            };

            recognition.onend = function () {
                //alert("Finalizando Reconocimiento");
                recognizing = false;
            };

            recognition.onerror = function (event) {
                alert(event.error);
            };

            function iniciarReconocimiento() {
                if (recognizing) {
                    recognition.stop();
                    return;
                }
                recognition.lang = "es-PE";
                recognition.start();
            }
        }
    }
    Speech.Synthesis = function(texto) {
        speechSynthesis.speak(new SpeechSynthesisUtterance(texto));
    }
    return Speech;
})();

