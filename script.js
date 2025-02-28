class Tabla {
  constructor(tablaElement) {
    this.tabla = tablaElement;
    this.editando = false;
    this.rowToEdit = null;
    this.formulario = new Formulario(); // Una sola instancia de Formulario
    this.init();
  }

  init() {
    this.tabla.addEventListener("click", (e) => this.seleccionarFila(e));
    document.getElementById("btSave").addEventListener("click", () => this.guardar());
    document.getElementById("btEdit").addEventListener("click", () => this.editar());
    document.getElementById("btDel").addEventListener("click", () => this.eliminar());
    document.getElementById("btDone").addEventListener("click", () => this.marcarComoRealizada());
    document.getElementById("find").addEventListener("click", () => this.filtrar());
    document.addEventListener("click", (e) => this.quitarSeleccionCuandoFueraDeTabla(e));
    document.getElementById("btErase").addEventListener("click", () => this.formulario.limpiarFormulario());
  }

  seleccionarFila(e) {
    const fila = e.target.closest("tr");
    if (!fila || fila.parentNode.tagName === "THEAD") return;

    document.querySelectorAll(".seleccionada").forEach(f => f.classList.remove("seleccionada"));
    fila.classList.add("seleccionada");
    this.rowToEdit = fila;
  }

  quitarSeleccionCuandoFueraDeTabla(e) {
    if (!this.tabla.contains(e.target)) {
      document.querySelectorAll(".seleccionada").forEach(f => f.classList.remove("seleccionada"));
      this.rowToEdit = null;
    }
  }

  editar() {
    if (this.rowToEdit) {
      this.formulario.cargarFormulario(this.rowToEdit); // Carga los datos de la fila seleccionada en los inputs
      this.editando = true; // Establecemos que estamos en modo de edición
    } else {
      alert("Selecciona una fila para editar.");
    }
  }

  guardar() {
    const datos = this.formulario.obtenerDatos(); // Obtiene los datos del formulario (inputs)

    // Validación
    if (!this.formulario.validar(datos)) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Si estamos editando, buscamos la fila con el ID
    if (this.editando) {
      this.actualizarFila(datos); // Actualiza la fila con los nuevos datos
    } else {
      this.agregarFila(datos); // Si no estamos en edición, agrega una nueva fila
    }

    this.formulario.limpiarFormulario(); // Limpia el formulario después de guardar
    this.editando = false; // Resetea el modo de edición
  }

  actualizarFila(datos) {
    // Busca la fila correspondiente por el ID (suponiendo que el ID está en la primera celda)
    const filaExistente = Array.from(this.tabla.rows).find(row => row.cells[0].textContent === datos.userId);

    if (filaExistente) {
      filaExistente.cells[1].textContent = datos.userName;
      filaExistente.cells[2].textContent = datos.userBd;
      filaExistente.cells[3].textContent = datos.userGc;
      filaExistente.cells[4].textContent = datos.userPhone;
      filaExistente.cells[5].textContent = datos.dtState;
      filaExistente.cells[6].textContent = datos.userQn;
      this.actualizarColorEstado(filaExistente.cells[5]);
      alert("Padrino actualizado con éxito.");
    } else {
      alert("No se encontró una fila con ese ID.");
    }
  }

  agregarFila(datos) {
    const existingRow = Array.from(this.tabla.rows).find(row => row.cells[0].textContent === datos.userId);

    if (existingRow) {
      alert("El padrino con ese ID ya existe.");
      return;
    }

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${datos.userId}</td>
      <td>${datos.userName}</td>
      <td>${datos.userBd}</td>
      <td>${datos.userGc}</td>
      <td>${datos.userPhone}</td>
      <td>${datos.dtState}</td>
      <td>${datos.userQn}</td>
    `;
    this.actualizarColorEstado(newRow.cells[5]);
    document.querySelector("#reportTb tbody").appendChild(newRow);
    alert("Padrino guardado con éxito.");
  }

  actualizarColorEstado(celdaEstado) {
    if (celdaEstado.textContent === "Realizada") {
      celdaEstado.style.backgroundColor = "rgb(41, 238, 41)";
    } else if (celdaEstado.textContent === "Pendiente") {
      celdaEstado.style.backgroundColor = "rgb(252, 247, 0)";
    }
  }

  eliminar() {
    if (this.rowToEdit) {
      const respuesta = confirm("¿Estás seguro de que deseas eliminar a este padrino?");
      if (respuesta === true) {
        this.rowToEdit.remove();
        alert("Padrino eliminado con éxito.");
        this.rowToEdit = null;
      }
    } else {
      alert("Selecciona una fila para eliminar.");
    }
  }

  marcarComoRealizada() {
    if (this.rowToEdit) {
      this.rowToEdit.cells[5].textContent = "Realizada";
      this.actualizarColorEstado(this.rowToEdit.cells[5]);
    } else {
      alert("Selecciona una fila para cambiar el estado.");
    }
  }

  filtrar() {
    const finder = document.getElementById("searchInput");

    const searchTerm = finder.value.toLowerCase();
    const rows = this.tabla.querySelectorAll("tbody tr");

    rows.forEach(row => {
      let rowText = Array.from(row.cells).map(cell => cell.textContent.toLowerCase()).join(" ");
      row.style.display = rowText.includes(searchTerm) ? "" : "none";
    });
  }
}

class Formulario {
  constructor() {
    this.form = document.querySelector("form");
  }

  obtenerDatos() {
    return {
      userId: document.getElementById("idNumber").value.trim(),
      userName: document.getElementById("name").value.trim(),
      userGc: document.getElementById("gchild").value.trim(),
      userPhone: document.getElementById("phone").value.trim(),
      userBd: document.getElementById("birth").value.trim(),
      userQn: document.getElementById("monto").value.trim(),
      dtState: document.getElementById("cbDonate").value
    };
  }

  validar(datos) {
    return datos.userId && datos.userName && datos.userGc && datos.userPhone && datos.userBd && datos.userQn && datos.dtState;
  }

  limpiarFormulario() {
    document.getElementById("idNumber").value = "";
    document.getElementById("name").value = "";
    document.getElementById("gchild").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("birth").value = "";
    document.getElementById("monto").value = "";
    document.getElementById("cbDonate").value = "Pendiente";
  }

  cargarFormulario(row) {
    document.getElementById("idNumber").value = row.cells[0].textContent;
    document.getElementById("name").value = row.cells[1].textContent;
    document.getElementById("birth").value = row.cells[2].textContent;
    document.getElementById("gchild").value = row.cells[3].textContent;
    document.getElementById("phone").value = row.cells[4].textContent;
    document.getElementById("cbDonate").value = row.cells[5].textContent;
    document.getElementById("monto").value = row.cells[6].textContent;
  }
}

// Inicializar la tabla
const tabla = new Tabla(document.getElementById("reportTb"));

