// Variables globales
let nivelSeleccionado = '';
let cantidadEjercicios = 10;
let ejercicios = [];
let ejercicioActual = 0;
let correctas = 0;
let incorrectas = 0;
let tiempoInicio = null;
let temporizadorPrincipal = null;
let respuestaActual = '';

function mostrarConfiguracion() {
    document.getElementById('pantalla-bienvenida').classList.add('oculto');
    document.getElementById('pantalla-configuracion').classList.remove('oculto');
}

function seleccionarNivel(nivel) {
    nivelSeleccionado = nivel;
    
    // Actualizar apariencia de botones
    document.querySelectorAll('.boton').forEach(btn => {
        btn.style.background = '#f59e0b';
    });
    event.target.style.background = '#10b981';
    
    document.getElementById('btn-iniciar').disabled = false;
}

function seleccionarCantidad(cantidad) {
    cantidadEjercicios = cantidad;
    
    // Actualizar apariencia de botones
    document.querySelectorAll('.boton').forEach(btn => {
        if (btn.textContent.includes('Ejercicios') || btn.textContent === '10' || btn.textContent === '20' || btn.textContent === '30') {
            btn.style.background = '#f59e0b';
        }
    });
    event.target.style.background = '#10b981';
}

function iniciarEntrenamiento() {
    if (!nivelSeleccionado) return;
    
    ejercicioActual = 0;
    correctas = 0;
    incorrectas = 0;
    tiempoInicio = Date.now();
    
    generarEjercicios();
    
    document.getElementById('pantalla-configuracion').classList.add('oculto');
    document.getElementById('pantalla-ejercicio').classList.remove('oculto');
    
    // Iniciar temporizador principal
    temporizadorPrincipal = setInterval(actualizarTiempo, 1000);
    
    mostrarEjercicio();
}

function generarEjercicios() {
    ejercicios = [];
    
    for (let i = 0; i < (cantidadEjercicios === 'libre' ? 999 : cantidadEjercicios); i++) {
        let num1, num2;
        let nivel = nivelSeleccionado;
        
        if (nivel === 'mixto') {
            const niveles = ['2x1', '3x1', '4x1', '2x2', '3x2'];
            nivel = niveles[Math.floor(Math.random() * niveles.length)];
        }
        
        switch (nivel) {
            case '2x1':
                num1 = Math.floor(Math.random() * 90) + 10;
                num2 = Math.floor(Math.random() * 8) + 2;
                break;
            case '3x1':
                num1 = Math.floor(Math.random() * 900) + 100;
                num2 = Math.floor(Math.random() * 8) + 2;
                break;
            case '4x1':
                num1 = Math.floor(Math.random() * 9000) + 1000;
                num2 = Math.floor(Math.random() * 8) + 2;
                break;
            case '2x2':
                num1 = Math.floor(Math.random() * 90) + 10;
                num2 = Math.floor(Math.random() * 90) + 10;
                break;
            case '3x2':
                num1 = Math.floor(Math.random() * 900) + 100;
                num2 = Math.floor(Math.random() * 90) + 10;
                break;
        }
        
        ejercicios.push({
            num1: num1,
            num2: num2,
            respuestaCorrecta: num1 * num2,
            pregunta: `${num1} × ${num2} = ?`
        });
    }
}

function mostrarEjercicio() {
    if (cantidadEjercicios !== 'libre' && ejercicioActual >= cantidadEjercicios) {
        mostrarResultados();
        return;
    }
    
    const ejercicio = ejercicios[ejercicioActual];
    
    // Actualizar progreso
    if (cantidadEjercicios !== 'libre') {
        const progreso = ((ejercicioActual + 1) / cantidadEjercicios) * 100;
        document.getElementById('progreso-barra').style.width = progreso + '%';
        document.getElementById('progreso-texto').textContent = `Ejercicio ${ejercicioActual + 1} de ${cantidadEjercicios}`;
    } else {
        document.getElementById('progreso-barra').style.width = '100%';
        document.getElementById('progreso-texto').textContent = `Ejercicio ${ejercicioActual + 1}`;
    }
    
    // Mostrar pregunta
    document.getElementById('pregunta').textContent = ejercicio.pregunta;
    
    // Limpiar respuesta anterior
    respuestaActual = '';
    document.getElementById('respuesta-input').value = '';
    
    // Actualizar estadísticas
    document.getElementById('correctas').textContent = correctas;
    document.getElementById('incorrectas').textContent = incorrectas;
}

function agregarNumero(numero) {
    respuestaActual += numero;
    document.getElementById('respuesta-input').value = respuestaActual;
}

function borrarNumero() {
    respuestaActual = respuestaActual.slice(0, -1);
    document.getElementById('respuesta-input').value = respuestaActual;
}

function enviarRespuesta() {
    if (respuestaActual === '') return;
    
    const respuestaUsuario = parseInt(respuestaActual);
    const respuestaCorrecta = ejercicios[ejercicioActual].respuestaCorrecta;
    
    if (respuestaUsuario === respuestaCorrecta) {
        correctas++;
    } else {
        incorrectas++;
    }
    
    ejercicioActual++;
    
    // Continuar o terminar
    setTimeout(function() {
        if (cantidadEjercicios === 'libre') {
            // En modo libre, preguntar si continuar después de 10 ejercicios
            if (ejercicioActual % 10 === 0) {
                if (confirm(`Llevas ${ejercicioActual} ejercicios. ¿Quieres continuar?`)) {
                    mostrarEjercicio();
                } else {
                    mostrarResultados();
                }
            } else {
                mostrarEjercicio();
            }
        } else {
            mostrarEjercicio();
        }
    }, 500);
}

function actualizarTiempo() {
    const tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
    const minutos = Math.floor(tiempoTranscurrido / 60);
    const segundos = tiempoTranscurrido % 60;
    
    document.getElementById('tiempo').textContent = 
        `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')`;
}

function mostrarResultados() {
    clearInterval(temporizadorPrincipal);
    
    const tiempoTotal = Math.floor((Date.now() - tiempoInicio) / 1000);
    const minutos = Math.floor(tiempoTotal / 60);
    const segundos = tiempoTotal % 60;
    const totalRespondidas = correctas + incorrectas;
    const porcentaje = totalRespondidas > 0 ? Math.round((correctas / totalRespondidas) * 100) : 0;
    
    document.getElementById('pantalla-ejercicio').classList.add('oculto');
    document.getElementById('pantalla-resultados').classList.remove('oculto');
    
    document.getElementById('resultado-correctas').textContent = correctas;
    document.getElementById('resultado-incorrectas').textContent = incorrectas;
    document.getElementById('resultado-porcentaje').textContent = porcentaje;
    document.getElementById('resultado-tiempo').textContent = 
        `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

function reiniciar() {
    // Resetear todo
    nivelSeleccionado = '';
    ejercicioActual = 0;
    correctas = 0;
    incorrectas = 0;
    respuestaActual = '';
    
    // Limpiar temporizador
    if (temporizadorPrincipal) {
        clearInterval(temporizadorPrincipal);
    }
    
    // Volver a la pantalla de bienvenida
    document.getElementById('pantalla-resultados').classList.add('oculto');
    document.getElementById('pantalla-bienvenida').classList.remove('oculto');
    
    // Resetear UI
    document.getElementById('btn-iniciar').disabled = true;
    document.querySelectorAll('.boton').forEach(btn => {
        btn.style.background = '#f59e0b';
    });
}