window.onload = function () {
    var canvasAncho = canvas.width;
    var canvasAlto = canvas.height;
    var contexto = canvas.getContext("2d");
    var c = 0;
    var n = 0;
    limpiarDibujo();

    canvas.onclick = function () {
        c++;
        contexto.fillStyle = txtColor.value;
        n = (+txtGrosor.value);
        if (c == 2) c = 0;
    }

    canvas.onmousemove = function (event) {
        if (c == 1) {
            var x = event.layerX;
            var y = event.layerY;
            contexto.fillRect(x - (n/2), y - (n/2), n, n);
        }
    }

    btnLimpiarDibujo.onclick = function () {
        limpiarDibujo();
    }

    function limpiarDibujo() {
        contexto.fillStyle = "white";
        contexto.fillRect(0, 0, canvasAncho, canvasAlto);
    }

    btnCambiarFondo.onclick = function () {
        fupFondo.click();
    }

    fupFondo.onchange = function () {
        var file = this.files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            var img = new Image(canvasAncho, canvasAlto);
            img.src = reader.result;
            img.onload = function () {
                contexto.drawImage(img, 0, 0, canvasAncho, canvasAlto);
            }
        }
        reader.readAsDataURL(file);
    }

    btnGrabarCliente.onclick = function () {
        var link = document.createElement("a");
        var src = canvas.toDataURL();
        link.href = src;
        link.download = txtUsuario.value + ".jpg";
        link.click();
    }

    btnGrabarServidor.onclick = function () {
        var src = canvas.toDataURL();
        var base64 = src.replace("data:image/png;base64,", "");
        var buffer = base64ToArrayBuffer(base64);
        var nombre = txtUsuario.value + ".jpg";
        var objFecha = document.getElementById("fecha");
        var nro = objFecha.value;

        Http.post("Grafico/grabarBytes?nombre=" + nombre, function (rpta) {
            if (rpta) {
                alert(rpta);
            }
        }, buffer);
    }

    function base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
}