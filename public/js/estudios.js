// public/js/estudios.js

document.addEventListener('DOMContentLoaded', () => {
    const tipoEstudioSelect = document.getElementById('tipoEstudioSelect');
    const estudioSelect = document.getElementById('estudioSelect');

    // --- Función para cargar los tipos de estudio ---
    async function cargarTiposEstudio() {
        try {
            const response = await fetch('/api/tipo-estudio');

            if (!response.ok) {
                throw new Error(`Error de al conectarse: ${response.status}`);
            }

            const tiposEstudio = await response.json(); // Convierte la respuesta a JSON

            // Limpia las opciones existentes
            tipoEstudioSelect.innerHTML = '<option value="">Selecciona un tipo</option>';

            // Agrega las nuevas opciones al select
            tiposEstudio.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.id_tipo_estudio; // El ID para usarlo en el backend
                option.textContent = tipo.descripcion; // La descripción para mostrar al usuario
                tipoEstudioSelect.appendChild(option);
            });

        } catch (error) {
            console.error('Error al cargar los tipos de estudio:', error);
            tipoEstudioSelect.innerHTML = '<option value="">Error al cargar</option>';
        }
    }

    // --- Función para cargar los estudios específicos según el tipo seleccionado ---
    async function cargarEstudiosPorTipo(tipoEstudioId) {
        // Deshabilita el select de estudios mientras se cargan
        estudioSelect.disabled = true;
        estudioSelect.innerHTML = '<option value="">Cargando estudios...</option>';

        if (!tipoEstudioId) {
            estudioSelect.innerHTML = '<option value="">Selecciona tipo</option>';
            return;
        }

        try {
            const response = await fetch(`/api/estudios/${tipoEstudioId}`);

            if (!response.ok) {
                throw new Error(`HTTP al obtener los estudios: ${response.status}`);
            }

            const estudios = await response.json();

            // Limpia y habilita el select
            estudioSelect.innerHTML = '<option value="">Selecciona un estudio</option>';
            estudioSelect.disabled = false;

            estudios.forEach(estudio => {
                const option = document.createElement('option');
                option.value = estudio.id_estudio; // El ID del estudio específico
                option.textContent = estudio.nombre_estudio; // La descripción del estudio (ej. "Radiografía de Tórax")
                estudioSelect.appendChild(option);
            });

        } catch (error) {
            console.error('Error al cargar los estudios específicos:', error);
            estudioSelect.innerHTML = '<option value="">Error al cargar</option>';
            estudioSelect.disabled = true;
        }
    }

    // Carga los tipos de estudio cuando la página se carga
    cargarTiposEstudio();

    // Escucha el cambio en el select de tipos de estudio
    tipoEstudioSelect.addEventListener('change', (event) => {
        const selectedTipoEstudioId = event.target.value;
        cargarEstudiosPorTipo(selectedTipoEstudioId);
    });
});