const tabla = document.getElementById("reportTb");

// Agregar evento a cada fila de la tabla
tabla.addEventListener("click", (e) => {
    const fila = e.target.closest("tr"); // Detectar la fila clickeada
    if (!fila || fila.parentNode.tagName === "THEAD") return; // Ignorar encabezados

    // Quitar la selección previa
    document.querySelectorAll(".seleccionada").forEach(f => f.classList.remove("seleccionada"));
    
    // Marcar la fila actual como seleccionada
    fila.classList.add("seleccionada");
});

document.addEventListener("click", (e) => {
    // Verificar si el clic fue fuera de la tabla
    if (!tabla.contains(e.target)) {
        // Quitar la selección de cualquier fila si se hace clic fuera
        document.querySelectorAll(".seleccionada").forEach(f => f.classList.remove("seleccionada"));
    }
});

// Obtener el botón y la tabla
const boton = document.getElementById("btDone");

// Agregar un evento de click al botón
boton.addEventListener("click", () => {
    // Obtener la fila seleccionada
    const filaSeleccionada = document.querySelector(".seleccionada");

    if (filaSeleccionada) {
        // Obtener la celda específica (en este caso, la columna 5)
        const celda = filaSeleccionada.cells[5]; // Cambia '5' por el índice de la columna que quieres modificar

        // Cambiar el color de fondo de la celda
        celda.style.backgroundColor = "rgb(41, 238, 41)"; // Cambia el color de fondo a amarillo

        // Cambiar el contenido o estado de la celda
        celda.textContent = "Realizada"; // Cambia el texto de la celda
    } else {
        alert("Selecciona una fila para modificar.");
    }
});
document.getElementById("find").addEventListener("click", function () {
    const filtro = document.getElementById("searchInput").value.toLowerCase();
    const filas = document.querySelectorAll("#reportTb tbody tr");

    filas.forEach(fila => {
        const columnas = fila.querySelectorAll("td");
        let rowMatches = false;

        columnas.forEach(columna => {
            if (columna.textContent.toLowerCase().includes(filtro)) {
                rowMatches = true;
            }
        });

        fila.style.display = rowMatches ? "" : "none";
    });
});


