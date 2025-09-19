let participantes = [];
let puntos = [];

document.getElementById('agregar-participante').addEventListener('click', agregarParticipante);
document.getElementById('inicio').addEventListener('click', girarRuleta);
document.getElementById('finalizar').addEventListener('click', finalizarJuego);

function agregarParticipante() {
    const input = document.getElementById('input-nombre');
    const nombre = input.value.trim();
    if (nombre && participantes.length < 10) {
        participantes.push(nombre);
        puntos.push(0);
        input.value = '';
        actualizarUI();
    } else if (participantes.length >= 10) {
        alert('Máximo 10 participantes.');
    }
}

function actualizarUI() {
    const nombresContainer = document.getElementById('nombres-container');
    const puntosContainer = document.getElementById('puntos-container');
    const ruleta = document.getElementById('ruleta');

    nombresContainer.innerHTML = '';
    puntosContainer.innerHTML = '';
    const svg = ruleta.querySelector('svg');
    svg.innerHTML = '';

    participantes.forEach((nombre, index) => {
        // Mostrar nombres en lista
        const li = document.createElement('li');
        li.textContent = nombre;
        nombresContainer.appendChild(li);

        // Puntos
        const inputPunto = document.createElement('input');
        inputPunto.type = 'number';
        inputPunto.value = puntos[index];
        inputPunto.addEventListener('change', (e) => puntos[index] = parseInt(e.target.value) || 0);
        puntosContainer.appendChild(inputPunto);

        // Segmentos de ruleta
        const angulo = 360 / participantes.length;
        const anguloInicio = index * angulo;
        const anguloFin = (index + 1) * angulo;
        const x1 = 150 + 150 * Math.cos(anguloInicio * Math.PI / 180);
        const y1 = 150 + 150 * Math.sin(anguloInicio * Math.PI / 180);
        const x2 = 150 + 150 * Math.cos(anguloFin * Math.PI / 180);
        const y2 = 150 + 150 * Math.sin(anguloFin * Math.PI / 180);
        const largeArc = angulo > 180 ? 1 : 0;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M 150 150 L ${x1} ${y1} A 150 150 0 ${largeArc} 1 ${x2} ${y2} Z`);
        path.setAttribute('fill', `hsl(${index * angulo}, 80%, 60%)`);
        svg.appendChild(path);

        // Text
        const anguloMedio = (anguloInicio + anguloFin) / 2;
        const tx = 150 + 100 * Math.cos(anguloMedio * Math.PI / 180);
        const ty = 150 + 100 * Math.sin(anguloMedio * Math.PI / 180);
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('id', `text-${index}`);
        text.setAttribute('x', tx);
        text.setAttribute('y', ty);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '12');
        text.setAttribute('transform', `rotate(${anguloMedio}, ${tx}, ${ty})`);
        text.textContent = nombre;
        svg.appendChild(text);
    });
}

function girarRuleta() {
    if (participantes.length === 0) {
        alert('Agrega al menos un participante.');
        return;
    }

    const ruleta = document.getElementById('ruleta');
    const giros = Math.random() * 360 + 360 * 5; // Múltiples giros
    const duracion = 3000; // 3 segundos

    const flecha = document.getElementById('flecha');
    ruleta.style.transition = `transform ${duracion}ms ease-out`;
    ruleta.style.transform = `rotate(${giros}deg)`;
    flecha.classList.add('pulse');

    setTimeout(() => {
        const anguloFinal = giros % 360;
        const segmentoAngulo = 360 / participantes.length;
        const indiceGanador = Math.floor((360 - anguloFinal) / segmentoAngulo) % participantes.length;
        document.getElementById('resultado').innerHTML = `<h2>¡${participantes[indiceGanador]} ganó!</h2>`;
        flecha.classList.remove('pulse');
    }, duracion);
}

function finalizarJuego() {
    if (participantes.length === 0) {
        alert('No hay participantes.');
        return;
    }

    let maxPuntos = -1;
    let ganadores = [];

    participantes.forEach((nombre, index) => {
        if (puntos[index] > maxPuntos) {
            maxPuntos = puntos[index];
            ganadores = [nombre];
        } else if (puntos[index] === maxPuntos) {
            ganadores.push(nombre);
        }
    });

    const resultado = ganadores.length === 1 ? `El ganador es ${ganadores[0]} con ${maxPuntos} puntos.` : `Empate entre: ${ganadores.join(', ')} con ${maxPuntos} puntos.`;
    document.getElementById('resultado').textContent = resultado;
}

// Inicializar vacío
actualizarUI();