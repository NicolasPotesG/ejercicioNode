const http = require("http");
const fs = require("fs");
const url = require("url");
const axios = require("axios");

const URL_CLIENTES = "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";
const URL_PROVEEDORES = "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";

const renderizar = (ruta, callback) => {
    fs.readFile("./index.html", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let pageContent = data.toString();
            let textReplacement = "";
            let URL = "";

            if (ruta == "Clientes") {
                URL = URL_CLIENTES;
            } else {
                URL = URL_PROVEEDORES;
            }

            axios.get(URL).then((response) => {
                response.data.forEach((individuo) => {
                    textReplacement += `<tr>
                    <td>${ruta == "Clientes" ? individuo.idCliente : individuo.idproveedor}</td>
                    <td>${ruta == "Clientes" ? individuo.NombreCompania : individuo.nombrecompania}</td>
                    <td>${ruta == "Clientes" ? individuo.NombreContacto : individuo.nombrecontacto}</td>
                    </tr>`;
                });
            }).then(() => {
                pageContent = pageContent.replace(
                    "{{contenido}}",
                    textReplacement
                );

                pageContent = pageContent.replace(
                    "{{list_1}}",
                    ruta
                );

                pageContent = pageContent.replace(
                    "{{list_2}}",
                    ruta
                );

                callback(pageContent);
            });

        }
    });
};

http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;

    if (pathname == "/clientes") {
        //clientes
        renderizar("Clientes", (data) => {
            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            res.end(data.toString());
        })

    } else if (pathname == "/proveedores") {
        //proveedores
        renderizar("Proveedores", (data) => {
            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            res.end(data.toString());
        })
    }
}).listen(8081);