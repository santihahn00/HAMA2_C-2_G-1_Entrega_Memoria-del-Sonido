// ==========================================================================
// 🕹️ INTERACCIONES Y LÓGICA DE CONTROL (index.js)
// ==========================================================================

const formatosData = {
    cinta: { nombre: 'Cinta', clase: 'espacio-cinta', img: 'imagen/cinta.png' },
    vinilo: { nombre: 'Vinilo', clase: 'espacio-vinilo', img: 'imagen/vinilo.png' },
    cassette: { nombre: 'Cassette', clase: 'espacio-cassette', img: 'imagen/cassette.png' },
    digital: { nombre: 'Digital', clase: 'espacio-digital', img: 'imagen/digital.png' }
};

const formatosVisitados = { cinta: false, vinilo: false, cassette: false, digital: false };
let laComparacionEstaLiberada = false;

const pTitulo = document.getElementById('pantalla-titulo');
const pExplicacion = document.getElementById('pantalla-explicacion');
const pHub = document.getElementById('pantalla-hub');
const pEspacio = document.getElementById('pantalla-espacio');
const pFinal = document.getElementById('pantalla-final');
const audioInicial = document.getElementById('audio-cassette-inicial');
const tarjetaIncognita = document.getElementById('tarjeta-incognita');

// --- 1) APARICIÓN DEL TÍTULO EN 1 SEGUNDO ---
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const tituloH1 = document.getElementById('btn-comenzar');
        if (tituloH1) tituloH1.style.opacity = '1';
    }, 1000); // Modificado a 1 segundo exacto
});

// Click para comenzar la experiencia
document.getElementById('btn-comenzar').addEventListener('click', () => {
    audioInicial.play().catch(e => console.log("Audio en espera interactiva"));
    pTitulo.classList.remove('activa');
    setTimeout(() => {
        pExplicacion.classList.add('activa');
        iniciarAnimacionImagenes(); 
    }, 1000);
});

// --- 2) SECCIÓN DE TEXTO: MÁS IMÁGENES FLOTANTES ---
function iniciarAnimacionImagenes() {
    const contenedorMosaico = document.getElementById('mosaico-flotante');
    if (!contenedorMosaico) return;

    // Lista ampliada de elementos para que aparezcan bastantes más imágenes en pantalla
    const fuentesImagenes = [
        'imagen/cinta.png', 'imagen/vinilo.png', 'imagen/cassette.png', 'imagen/digital.png',
        'imagen/cinta.png', 'imagen/vinilo.png', 'imagen/cassette.png', 'imagen/digital.png',
        'imagen/ambiente1.jpg', 'imagen/ambiente2.jpg', 'imagen/ambiente3.jpg'
    ];

    fuentesImagenes.forEach((src) => {
        const img = document.createElement('img');
        img.className = 'img-flotante';
        img.src = src;
        
        reubicarImagenAbajo(img);
        // Distribución vertical aleatoria para que vayan subiendo escalonadas
        img.yPos = window.innerHeight + (Math.random() * window.innerHeight * 1.5);
        contenedorMosaico.appendChild(img);

        const velocidad = 0.4 + Math.random() * 0.7;

        function animarCesta() {
            img.yPos -= velocidad;
            img.style.top = img.yPos + 'px';

            // Al desaparecer arriba, vuelven a salir desde abajo indefinidamente
            if (img.yPos < -100) {
                reubicarImagenAbajo(img);
            }
            requestAnimationFrame(animarCesta);
        }
        requestAnimationFrame(animarCesta);
    });
}

function reubicarImagenAbajo(elementoImg) {
    const xAleatorio = Math.random() * (window.innerWidth - 100);
    elementoImg.style.left = xAleatorio + 'px';
    elementoImg.yPos = window.innerHeight + 20;
    elementoImg.style.top = elementoImg.yPos + 'px';
}

// Avanzar desde la explicación al HUB
pExplicacion.addEventListener('click', () => {
    pExplicacion.classList.remove('activa');
    setTimeout(() => {
        pHub.classList.add('activa');
    }, 1000);
});

// Clicks en formatos del Hub
document.querySelectorAll('.tarjeta-formato:not(.tarjeta-misterio)').forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
        const formatoId = tarjeta.getAttribute('data-formato');
        entrarAEspacio(formatoId);
    });
});

// --- 3) MANEJO DE LAS PANTALLAS CONCEPTUALES ---
function entrarAEspacio(id) {
    formatosVisitados[id] = true; 
    
    pHub.classList.remove('activa');
    pEspacio.classList.remove('activa');

    pEspacio.className = 'pantalla';
    pEspacio.classList.add(formatosData[id].clase);
    
    pEspacio.innerHTML = `
        <button class="btn-volver-hub-desde-espacio" id="btn-cerrar-espacio">← Volver al Menú</button>
        <div class="contenido-espacio">
            <h2>${formatosData[id].nombre}</h2>
            <div class="mini-navegacion" id="contenedor-mini-nav"></div>
        </div>
    `;

    document.getElementById('btn-cerrar-espacio').addEventListener('click', () => {
        pEspacio.classList.remove('activa');
        setTimeout(() => {
            pHub.classList.add('activa');
        }, 800);
    });

    const miniNavContenedor = document.getElementById('contenedor-mini-nav');

    Object.keys(formatosData).forEach(key => {
        if (key !== id) {
            const item = formatosData[key];
            const miniCard = document.createElement('div');
            miniCard.className = 'mini-tarjeta';
            miniCard.innerHTML = `
                <div class="mini-caja-img"><img src="${item.img}" alt="${item.nombre}"></div>
                <h4>${item.nombre}</h4>
            `;
            miniCard.addEventListener('click', (e) => {
                e.stopPropagation();
                entrarAEspacio(key);
            });
            miniNavContenedor.appendChild(miniCard);
        }
    });

    comprobarProgresoFormatos();

    setTimeout(() => {
        pEspacio.classList.add('activa');
    }, 200);
}

function comprobarProgresoFormatos() {
    const todosVisitados = Object.values(formatosVisitados).every(v => v === true);
    if (todosVisitados) {
        laComparacionEstaLiberada = true;
        if (tarjetaIncognita) {
            tarjetaIncognita.classList.remove('oculto');
        }
    }
}

// --- 4) PANTALLA FINAL COMPARATIVA ---
tarjetaIncognita.addEventListener('click', () => {
    pHub.classList.remove('activa');
    audioInicial.pause();
    setTimeout(() => {
        pFinal.classList.add('activa');
    }, 1000);
});

document.getElementById('btn-regresar-a-hub').addEventListener('click', () => {
    pFinal.classList.remove('activa');
    audioInicial.play().catch(e => console.log(e));
    setTimeout(() => {
        pHub.classList.add('activa');
    }, 1000);
});

// --- 5) REPRODUCCIÓN HOVER EN LOS CUADRANTES DE VIDEO/AUDIO ---
document.querySelectorAll('.cuadrante-interactivo').forEach(cuadrante => {
    const videoElement = cuadrante.querySelector('video');
    const idAudio = cuadrante.getAttribute('data-audio');
    const audioElement = document.getElementById(idAudio);

    cuadrante.addEventListener('mouseenter', () => {
        if (audioElement) {
            audioElement.currentTime = 0;
            audioElement.play().catch(() => {});
        }
        if (videoElement) {
            videoElement.currentTime = 0;
            videoElement.play().catch(() => {});
        }
    });

    cuadrante.addEventListener('mouseleave', () => {
        if (audioElement) {
            audioElement.pause();
        }
        if (videoElement) {
            videoElement.pause();
        }
    });
});