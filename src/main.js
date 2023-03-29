// Declaración de variables
var partidos = [{
        nombre: "PP",
        color: "#1D84CE",
        votos: 0,
        porcentaje: 0,
        diputados: 0
    },
    {
        nombre: "PSOE",
        color: "#E30713",
        votos: 0,
        porcentaje: 0,
        diputados: 0
    }
]

let numeroTurno = 0;
let totalEscaños = 350;

// Declaración de preguntas y opciones
let preguntas = [{
        pregunta: "¿Cuál es la mejor forma de invertir en educación?",
        opciones: ["Aumentar el presupuesto", "Mejorar la calidad de la enseñanza", "Contratar más profesores", "Reducir el número de estudiantes por aula"],
        respuesta: 1
    },
    {
        pregunta: "¿Cuál es la mejor forma de mejorar la sanidad pública?",
        opciones: ["Aumentar el número de médicos y enfermeras", "Mejorar la infraestructura hospitalaria", "Reducción de los costos de los tratamientos", "Mejorar la atención primaria"],
        respuesta: 0
    },
    {
        pregunta: "¿Cuál es la mejor forma de mejorar la economía?",
        opciones: ["Fomentar la creación de empresas", "Establecer políticas fiscales más favorables", "Aumentar el salario mínimo", "Reducir la deuda pública"],
        respuesta: 0
    },
    {
        pregunta: "¿Cuál es la mejor forma de mejorar la seguridad ciudadana?",
        opciones: ["Incrementar la presencia policial en las calles", "Establecer medidas más severas para delitos violentos", "Mejorar la iluminación en espacios públicos", "Incentivar la prevención del delito"],
        respuesta: 3
    }
];

function iniciarSpain() {
    limpiar()
    // Primer turno
    document.getElementById("body").innerHTML = '<section id="pregunta"></section>'
    turno(preguntas[numeroTurno]);
    numeroTurno++
}

//Reinicia el contador de turnos y vuelve a empezar el juego
function ReiniciarJuego() {
    limpiar()
    numeroTurno = 0;
    crearInicio()
}

function crearInicio() {
    document.getElementById('body').innerHTML = '<img onclick="iniciarSpain()" width="400" height="400" src="./img/Spain.png" id="spain" alt="España" />';
}

// Limpia el html
function limpiar() {
    // Obtener el elemento del div
    const divElement = document.getElementById('body');

    // Eliminar todos los elementos dentro del div
    while (divElement.firstChild) {
        divElement.removeChild(divElement.firstChild);
    }
}

// Función para mostrar las opciones de texto y actualizar los votos
function turno(pregunta) {
    let opcionesHTML = `<div id="opciones"> ${pregunta.pregunta}<br>`;
    for (let i = 0; i < pregunta.opciones.length; i++) {
        opcionesHTML += "<label><input type='radio' name='opcion' value='" + i + "'>" + pregunta.opciones[i] + "</label><br>";
    }
    opcionesHTML += '<button onclick="actualizarVotos(' + numeroTurno + ')">Continuar</button></div>';

    //let opcion = prompt(pregunta.pregunta + "\n" + opcionesHTML);
    document.getElementById("pregunta").innerHTML = opcionesHTML;
}

function actualizarVotos(npregunta) {

    var pregunta = preguntas[npregunta]

    var opciones = document.getElementsByName('opcion');
    var opcion;
    for (var i = 0; i < opciones.length; i++) {
        if (opciones[i].checked) {
            opcion = opciones[i].value;
        }
    }

    //var opcion = document.getElementById('opciones').value;

    // Actualizar los votos según la opción elegida
    if (opcion !== null) {
        let opcionInt = parseInt(opcion);
        if (!isNaN(opcionInt) && opcionInt >= 0 && opcionInt < pregunta.opciones.length) {
            switch (opcionInt) {
                case 0:
                    partidos[0].votos += 10;
                    partidos[1].votos += 5;
                    break;
                case 1:
                    partidos[0].votos += 5;
                    partidos[1].votos += 10;
                    break;
                case 2:
                    partidos[0].votos += 15;
                    partidos[1].votos += 10;
                    break;
                case 3:
                    partidos[0].votos += 5;
                    partidos[1].votos += 5;
                    break;
            }
        }
    } else {
        alert("Debe seleccionar una opción");
        return;
    }

    switch (numeroTurno) {
        case 1:
            // Segundo turno
            turno(preguntas[numeroTurno]);
            break;
        case 2:
            // Tercer turno
            turno(preguntas[numeroTurno]);
            break;
        case 3:
            // Turno Final
            calcularDiputados(partidos, totalEscaños)
            limpiar()
            var tabla = crearTabla()
            document.getElementById("body").innerHTML = tabla
            document.getElementById("body").innerHTML += '<svg width="400" height="400"></svg>'
            digrama()
            //alert("El partido 1 ha obtenido " + partidos[0].votos + " votos y " + partidos[0].diputados + " escaños.\nEl partido 2 ha obtenido " + partidos[1].votos + " votos y " + partidos[1].diputados + " escaños.")

    }
    numeroTurno++
}

function crearTabla() {
    var tablaResultados = `<h1>Diagrama de los resultados</h1><br>
    <table>
    <thead>
    <tr>
    <th>Color</th>
    <th>Partido</th>
    <th>Votos</th>
    <th>Porcentaje</th>
    </tr>
    </thead>
    <tbody>`
    for (var i = 0; i < partidos.length; i++) {
        tablaResultados += `<tr>
        <td style="background-color:${partidos[i].color};"></td>
        <td>${partidos[i].nombre}</td>
        <td>${partidos[i].votos}</td>
        <td>${partidos[i].porcentaje}%</td>
        </tr>`
    }
    tablaResultados += `</tbody>
    </table><br><button onclick="ReiniciarJuego()">Jugar de Nuevo</button>`
    return tablaResultados
}

function calcularDiputados(partidos, escaños) {
    // Convertir a números enteros los escaños
    escaños = parseInt(escaños);

    partidos.sort(function (a, b) {
        return b.votos - a.votos;
    });

    // Inicializar un objeto para almacenar el número de diputados
    //var diputados = {};

    // Repartir los escaños a los partidos según la ley D'Hondt
    for (var i = 0; i < partidos.length && escaños > 0; i++) {
        var partido = partidos[i];
        var votos = partido.votos;
        var diputadosAsignados = 0;

        for (var j = 1; j <= escaños; j++) {
            var cociente = votos / j;

            if (cociente < 1) {
                break;
            }

            diputadosAsignados = j;
        }

        partido.diputados = diputadosAsignados;
        escaños -= diputadosAsignados;
        calcularPorcentaje(partido)
    }
}

function calcularPorcentaje(partido) {
    partido.porcentaje = (Math.round(partido.diputados * 100) / totalEscaños).toFixed(2);
}

function digrama() {
    // Definir los datos
    const data = [{
            name: partidos[0].nombre,
            value: partidos[0].porcentaje,
            seats: partidos[0].diputados
        },
        {
            name: partidos[1].nombre,
            value: partidos[1].porcentaje,
            seats: partidos[1].diputados
        }
    ];

    // Definir los colores para cada sección
    const colors = [partidos[0].color, partidos[1].color];

    // Definir el radio del diagrama
    const radius = Math.min(200, 200) / 2;

    // Seleccionar el elemento SVG
    const svg = d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + 200 + "," + 200 + ")");

    // Crear el arco para cada sección
    const arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    // Crear el arco para la sección seleccionada
    const arcSelected = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

    // Crear la función de generación de datos
    const pie = d3.pie()
        .sort(null)
        .value(d => d.value);

    // Crear los arcos para cada sección
    const arcs = pie(data);

    // Añadir los arcos al SVG
    svg.selectAll("path")
        .data(arcs)
        .enter().append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => colors[i])
        .on("click", function (event, d) {
            // Al hacer clic en una sección, resaltarla
            d3.selectAll("path")
                .attr("d", arc)
                .attr("opacity", 1);
            d3.select(this)
                .attr("d", arcSelected)
                .attr("opacity", 0.8);
        })
        .append("title")
        .text(d => `${d.data.name}: ${d.data.seats} escaños (${d.data.value}%)`);
}