// Variables globales
let tablasSeleccionadas = [];
let cantidadEjercicios = 10;
let ejercicios = [];
let ejercicioActual = 0;
let correctas = 0;
let incorrectas = 0;
let temporizador;
let tiempoRestante = 10;

// Al cargar la página
window.onload = function() {
    generarBotonesTablas();
};

function generarBotonesTablas() {
    const grid = document.getElementById('tablas-grid');
    for (let i = 2; i <= 13; i++) {
        const boton = document.createElement('button');
        boton.textContent = `Tabla del ${i}`;
        boton.className = 'boton';
        boton.onclick = function() { seleccionarTabla(i, this); };
        grid.appendChild(boton);
    }
}

function seleccionarTabla(numero, boton) {
    if (boton.classList.contains('boton-seleccionado')) {
        boton.classList.remove('boton-seleccionado');
        tablasSeleccionadas = tablasSeleccionadas.filter(t => t !== numero);
    } else {
        boton.classList.add('boton-seleccionado');
        tablasSeleccionadas.push(numero);
    }
    
    document.getElementById('btn-iniciar').disabled = tablasSeleccionadas.length === 0;
}

function seleccionarCantidad(cantidad) {
    cantidadEjercicios = cantidad;
    
    // Actualizar apariencia de botones
    document.querySelectorAll('[data-cantidad]').forEach(btn => {
        btn.classList.remove('boton-seleccionado');
    });
    event.target.classList.add('boton-seleccionado');
}

function mostrarConfiguracion() {
    document.getElementById('pantalla-bienvenida').classList.add('oculto');
    document.getElementById('pantalla-configuracion').classList.remove('oculto');
}

function iniciarEntrenamiento() {
    if (tablasSeleccionadas.length === 0) return;
    
    generarEjercicios();
    document.getElementById('pantalla-configuracion').classList.add('oculto');
    document.getElementById('pantalla-ejercicio').classList.remove('oculto');
    
    mostrarEjercicio();
}

function generarEjercicios() {
    ejercicios = [];
    for (let i = 0; i < cantidadEjercicios; i++) {
        const tabla = tablasSeleccionadas[Math.floor(Math.random() * tablasSeleccionadas.length)];
        const multiplicando = Math.floor(Math.random() * 10) + 1;
        const resultadoCorrecto = tabla * multiplicando;
        
        const ejercicio = {
            pregunta: `${tabla} × ${multiplicando} = ?`,
            respuestaCorrecta: resultadoCorrecto,
            opciones: generarOpciones(resultadoCorrecto)
        };
        
        ejercicios.push(ejercicio);
    }
}

function generarOpciones(respuestaCorrecta) {
    const opciones = [respuestaCorrecta];
    
    while (opciones.length < 4) {
        const variacion = Math.floor(Math.random() * 20) + 1;
        const nuevaOpcion = Math.random() > 0.5 ? 
            respuestaCorrecta + variacion : 
            Math.max(1, respuestaCorrecta - variacion);
        
        if (!opciones.includes(nuevaOpcion)) {
            opciones.push(nuevaOpcion);
        }
    }
    
    return opciones.sort(() => Math.random() - 0.5);
}

function mostrarEjercicio() {
    if (ejercicioActual >= ejercicios.length) {
        mostrarResultados();
        return;
    }
    
    const ejercicio = ejercicios[ejercicioActual];
    
    // Actualizar progreso
    const progreso = ((ejercicioActual + 1) / cantidadEjercicios) * 100;
    document.getElementById('progreso-barra').style.width = progreso + '%';
    document.getElementById('progreso-texto').textContent = `Ejercicio ${ejercicioActual + 1} de ${cantidadEjercicios}`;
    
    // Mostrar pregunta
    document.getElementById('pregunta').textContent = ejercicio.pregunta;
    
    // Mostrar opciones
    const contenedorOpciones = document.getElementById('opciones');
    contenedorOpciones.innerHTML = '';
    
    ejercicio.opciones.forEach(opcion => {
        const boton = document.createElement('div');
        boton.className = 'opcion';
        boton.textContent = opcion;
        boton.onclick = function() { seleccionarRespuesta(opcion, ejercicio.respuestaCorrecta); };
        contenedorOpciones.appendChild(boton);
    });
    
    // Iniciar temporizador
    tiempoRestante = 10;
    actualizarTemporizador();
}

function actualizarTemporizador() {
    document.getElementById('timer').textContent = tiempoRestante;
    
    if (tiempoRestante <= 3) {
        document.getElementById('timer').style.color = '#ef4444';
    } else if (tiempoRestante <= 5) {
        document.getElementById('timer').style.color = '#f59e0b';
    } else {
        document.getElementById('timer').style.color = 'white';
    }
    
    temporizador = setTimeout(function() {
        tiempoRestante--;
        if (tiempoRestante >= 0) {
            actualizarTemporizador();
        } else {
            tiempoAgotado();
        }
    }, 1000);
}

function seleccionarRespuesta(respuestaSeleccionada, respuestaCorrecta) {
    clearTimeout(temporizador);
    
    const opciones = document.querySelectorAll('.opcion');
    opciones.forEach(opcion => {
        opcion.onclick = null; // Desactivar clicks
        if (parseInt(opcion.textContent) === respuestaCorrecta) {
            opcion.classList.add('correcto');
        }
    });
    
    if (respuestaSeleccionada === respuestaCorrecta) {
        correctas++;
        event.target.classList.add('correcto');
    } else {
        incorrectas++;
        event.target.classList.add('incorrecto');
    }
    
    document.getElementById('correctas').textContent = correctas;
    document.getElementById('incorrectas').textContent = incorrectas;
    
    setTimeout(function() {
        ejercicioActual++;
        mostrarEjercicio();
    }, 1500);
}

function tiempoAgotado() {
    incorrectas++;
    document.getElementById('incorrectas').textContent = incorrectas;
    
    const opciones = document.querySelectorAll('.opcion');
    opciones.forEach(opcion => {
        opcion.onclick = null;
        if (parseInt(opcion.textContent) === ejercicios[ejercicioActual].respuestaCorrecta) {
            opcion.classList.add('correcto');
        }
    });
    
    setTimeout(function() {
        ejercicioActual++;
        mostrarEjercicio();
    }, 1500);
}

function mostrarResultados() {
    document.getElementById('pantalla-ejercicio').classList.add('oculto');
    document.getElementById('pantalla-resultados').classList.remove('oculto');
    
    const porcentaje = Math.round((correctas / cantidadEjercicios) * 100);
    
    document.getElementById('resultado-correctas').textContent = correctas;
    document.getElementById('resultado-incorrectas').textContent = incorrectas;
    document.getElementById('resultado-porcentaje').textContent = porcentaje;
}

function reiniciar() {
    // Resetear todo
    tablasSeleccionadas = [];
    ejercicioActual = 0;
    correctas = 0;
    incorrectas = 0;
    
    // Volver a la pantalla de bienvenida
    document.getElementById('pantalla-resultados').classList.add('oculto');
    document.getElementById('pantalla-bienvenida').classList.remove('oculto');
    
    // Limpiar selecciones
    document.querySelectorAll('.boton-seleccionado').forEach(btn => {
        btn.classList.remove('boton-seleccionado');
    });
    document.getElementById('btn-iniciar').disabled = true;
}