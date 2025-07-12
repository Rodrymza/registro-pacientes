// app/public/js/script.js

document.addEventListener('DOMContentLoaded', () => {
    const agregarEstudioBtn = document.getElementById('agregarEstudioBtn');
    const estudiosAgregadosList = document.querySelector('#estudiosAgregados ul');
    const tipoEstudioSelected = document.getElementById('tipoEstudioSelect');
    const estudioSelected = document.getElementById('estudioSelect');
    const estudiosDataInput = document.getElementById('estudiosData');
    const pacienteEstudioForm = document.getElementById('pacienteEstudioForm');

    // Array para almacenar los estudios que se van agregando
    let estudiosAgregados = [];

    // Función para mostrar los estudios en la lista HTML
    const renderEstudiosList = () => {
        estudiosAgregadosList.innerHTML = ''; // Limpia la lista actual
        if (estudiosAgregados.length === 0) {
            estudiosAgregadosList.innerHTML = '<li class="list-group-item text-muted">No hay estudios agregados aún.</li>';
        } else {
            estudiosAgregados.forEach((estudio, index) => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                listItem.innerHTML = `
                    ${estudio.tipo}: <strong>${estudio.nombre}</strong>
                    <button type="button" class="btn btn-danger btn-sm" data-index="${index}">Eliminar</button>
                `;
                estudiosAgregadosList.appendChild(listItem);
            });
        }
    };

    // Evento al hacer clic en "Agregar Estudio"
    agregarEstudioBtn.addEventListener('click', () => {
        const tipoEstudio = tipoEstudioSelected.options[tipoEstudioSelected.selectedIndex].text;
        const estudioRealizado = estudioSelected.value;
        const estudioRealizadoText = estudioSelected.options[estudioSelected.selectedIndex].text;

        console.log('tipo estudio: ' + tipoEstudio)
        console.log('estudio: ' + estudioRealizado)

        // Validar que se haya seleccionado un estudio
        if (!estudioRealizado) {
            alert('Por favor, seleccione un estudio a agregar.');
            estudioSelected.focus();
            return;
        }

        // Crear el objeto del nuevo estudio
        const nuevoEstudio = {
            tipo: tipoEstudio,
            nombre: estudioRealizadoText,
            value: estudioRealizado // Guardamos el valor para el backend
        };

        estudiosAgregados.push(nuevoEstudio); // Agrega al array
        renderEstudiosList(); // Actualiza la lista visible

        // Opcional: Limpiar los campos de entrada para el próximo estudio
        estudioSelected.value = ''; // Limpia el select
    });

    // Evento para eliminar un estudio de la lista
    estudiosAgregadosList.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-danger')) {
            const indexToRemove = event.target.dataset.index;
            estudiosAgregados.splice(indexToRemove, 1); // Elimina del array
            renderEstudiosList(); // Actualiza la lista visible
        }
    });

    // Antes de enviar el formulario, guarda los estudios en el campo oculto
    pacienteEstudioForm.addEventListener('submit', (event) => {
        // Asegúrate de que el array de estudios no esté vacío si son obligatorios
        if (estudiosAgregados.length === 0) {
            alert('Debe agregar al menos un estudio para el paciente.');
            event.preventDefault(); // Evita que el formulario se envíe
            return;
        }
        // Convierte el array de objetos a una cadena JSON y guárdala en el input oculto
        estudiosDataInput.value = JSON.stringify(estudiosAgregados);
    });

    // Renderiza la lista inicialmente (por si se recarga la página o algo)
    renderEstudiosList();
});