// Claves para storage
const LS_KEY = 'tareas_app';
const SS_KEY = 'tareas_filtro';

// Inicializar tareas desde LocalStorage
let tareas = JSON.parse(localStorage.getItem(LS_KEY) || '[]');

const tareaInput = document.getElementById('tareaInput');
const agregarBtn = document.getElementById('agregarBtn');
const filtroSelect = document.getElementById('filtro');
const listaTareas = document.getElementById('listaTareas');

// Restaurar filtro desde SessionStorage si existe
const filtroGuardado = sessionStorage.getItem(SS_KEY) || 'todas';
filtroSelect.value = filtroGuardado;

function guardarTareas() {
    localStorage.setItem(LS_KEY, JSON.stringify(tareas));
}

function agregarTarea() {
    const texto = tareaInput.value.trim();
    if (!texto) return;
    const nueva = { texto, completada: false, id: Date.now() };
    tareas.push(nueva);
    guardarTareas();
    tareaInput.value = '';
    mostrarTareas();
}

function cambiarEstado(id) {
    tareas = tareas.map(t => t.id === id ? {...t, completada: !t.completada} : t);
    guardarTareas();
    mostrarTareas();
}

function eliminarTarea(id) {
    tareas = tareas.filter(t => t.id !== id);
    guardarTareas();
    mostrarTareas();
}

function filtrarTareas() {
    const valor = filtroSelect.value;
    sessionStorage.setItem(SS_KEY, valor);
    mostrarTareas();
}

function mostrarTareas() {
    const filtro = sessionStorage.getItem(SS_KEY) || 'todas';
    listaTareas.innerHTML = '';
    const filtradas = tareas.filter(t => {
    if (filtro === 'todas') return true;
    if (filtro === 'completadas') return t.completada;
    if (filtro === 'pendientes') return !t.completada;
    });

    if (filtradas.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No hay tareas';
    listaTareas.appendChild(li);
    return;
    }

    filtradas.forEach(t => {
    const li = document.createElement('li');
    li.className = t.completada ? 'completed' : '';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = t.completada;
    checkbox.addEventListener('change', () => cambiarEstado(t.id));

    const span = document.createElement('span');
    span.className = 'texto';
    span.textContent = t.texto;

    const acciones = document.createElement('div');
    acciones.className = 'acciones';

    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'small';
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.addEventListener('click', () => eliminarTarea(t.id));

    acciones.appendChild(btnEliminar);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(acciones);
    listaTareas.appendChild(li);
    });
}

// Eventos
agregarBtn.addEventListener('click', agregarTarea);
tareaInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') agregarTarea(); });
filtroSelect.addEventListener('change', filtrarTareas);

// Mostrar tareas al cargar
mostrarTareas();