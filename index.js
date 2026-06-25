// ==========================================================================
// 🕹️ INTERACCIONES Y LÓGICA DE CONTROL (index.js) - FINAL ESTABILIZADO
// ==========================================================================

const formatosData = {
    cinta: { nombre: 'Cinta', clase: 'espacio-cinta', img: 'imagen/cinta.png' },
    vinilo: { nombre: 'Vinilo', clase: 'espacio-vinilo', img: 'imagen/vinilo.png' },
    cassette: { nombre: 'Cassette', clase: 'espacio-cassette', img: 'imagen/cassette.png' },
    digital: { nombre: 'Digital', clase: 'espacio-digital', img: 'imagen/digital.png' }
};

const formatosVisitados = { cinta: false, vinilo: false, cassette: false, digital: false };
let laComparacionEstaLiberada = false;
let audioAmbienteEspacio = null; 
let idAnimacionDigital = null;   
let audioInfoActivo = null;

const pTitulo = document.getElementById('pantalla-titulo');
const pExplicacion = document.getElementById('pantalla-explicacion');
const pHub = document.getElementById('pantalla-hub');
const pEspacio = document.getElementById('pantalla-espacio');
const pFinal = document.getElementById('pantalla-final');
const audioInicial = document.getElementById('audio-cassette-inicial');
const tarjetaIncognita = document.getElementById('tarjeta-incognita');

// --- 1) INICIALIZACIÓN ---
window.addEventListener('DOMContentLoaded', () => {
        const btnComenzar = document.getElementById('btn-comenzar');
        if (btnComenzar) btnComenzar.style.opacity = '1';
});

document.getElementById('btn-comenzar').addEventListener('click', () => {
    if(audioInicial) audioInicial.play().catch(e => console.log("Audio esperando interacción."));
    pTitulo.classList.remove('activa');
    setTimeout(() => {
        pExplicacion.classList.add('activa');
        iniciarAnimacionImagenes(); 
    }, 1000);
});

// --- 2) ANIMACIONES FLOTANTES ---
function iniciarAnimacionImagenes() {
    const contenedorMosaico = document.getElementById('mosaico-flotante');
    if (!contenedorMosaico) return;

    const fuentesImagenes = [
        'imagen/cinta.png',
        'imagen/vinilo.png',
        'imagen/cassette.png',
        'imagen/digital.png'
    ];

    const cantidad = 24; // 👈 MÁS IMÁGENES (subí a 30 si querés más caos)

    for (let i = 0; i < cantidad; i++) {

        const src = fuentesImagenes[Math.floor(Math.random() * fuentesImagenes.length)];

        const img = document.createElement('img');
        img.className = 'img-flotante';
        img.src = src;
img.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
        // tamaño variable (da más riqueza visual)
        const scale = 0.6 + Math.random() * 1.2;
        img.style.width = (120 * scale) + 'px';

        reubicarImagenAbajo(img);

        img.yPos = window.innerHeight + Math.random() * 600;

        contenedorMosaico.appendChild(img);

        const velocidad = 0.2 + Math.random() * 0.9;

        function animar() {
            img.yPos -= velocidad;
            img.style.top = img.yPos + 'px';

            if (img.yPos < -150) {
                reubicarImagenAbajo(img);
            }

            requestAnimationFrame(animar);
        }

        requestAnimationFrame(animar);
    }
}

function reubicarImagenAbajo(el) {
    el.style.left = Math.random() * (window.innerWidth - 100) + 'px';
    el.yPos = window.innerHeight + 20;
}

pExplicacion.addEventListener('click', () => {
    pExplicacion.classList.remove('activa');
    setTimeout(() => pHub.classList.add('activa'), 1000);
});

document.querySelectorAll('.tarjeta-formato:not(.tarjeta-misterio)').forEach(tarjeta => {
    tarjeta.addEventListener('click', () => entrarAEspacio(tarjeta.getAttribute('data-formato')));
});

// --- 3) ESPACIOS CONCEPTUALES ---
function entrarAEspacio(id) {
    formatosVisitados[id] = true;
    if (audioInfoActivo) {
        audioInfoActivo.pause();
        audioInfoActivo = null;
    } 
    if (audioInicial) audioInicial.pause();
    
    pHub.classList.remove('activa');
    pEspacio.className = 'pantalla ' + formatosData[id].clase;
    pEspacio.style.color = "#f5f1ea";

    const contenedorDinamico = document.getElementById('contenedor-dinamico-espacio');
    if (idAnimacionDigital) cancelAnimationFrame(idAnimacionDigital);
    if (audioAmbienteEspacio) audioAmbienteEspacio.pause();
    // ==================================================================
    // ASIGNACIÓN MAGNÉTICA, MECÁNICA Y DIGITAL DE CONTENIDOS
    // ==================================================================
    
if (id === 'cinta') {

    audioAmbienteEspacio = document.getElementById('fondoCinta');
    if (audioAmbienteEspacio) {
        audioAmbienteEspacio.volume = 0.3;
        audioAmbienteEspacio.currentTime = 0;
        audioAmbienteEspacio.play().catch(() => {});
    }

    // ======================================================
    // 🧹 LIMPIEZA TOTAL DE EFECTOS
    // ======================================================

        if (idAnimacionDigital) {
            cancelAnimationFrame(idAnimacionDigital);
            idAnimacionDigital = null;
        }

        if (intervaloCinta) {
            clearInterval(intervaloCinta);
            intervaloCinta = null;
        }

        if (intervaloBobina) {
            clearInterval(intervaloBobina);
            intervaloBobina = null;
        }

        if (intervaloCintaPelicula) {
            clearInterval(intervaloCintaPelicula);
            intervaloCintaPelicula = null;
        }
    // ======================================================
    // 🎞️ ACTIVAR ESPACIO
    // ======================================================

    pEspacio.classList.add('espacio-cinta');

    // ======================================================
    // 🚀 ACTIVAR EFECTOS
    // ======================================================

    iniciarEmisorCintaBobina();
    iniciarEmisorCintaPelícula();

    // ======================================================
    // 🖥️ HTML
    // ======================================================

   contenedorDinamico.innerHTML = `
   <div class="cinta-nav-izq">

    <button class="btn-mini-nav-cinta" onclick="entrarAEspacio('vinilo')">
        VINILO
    </button>

    <button class="btn-mini-nav-cinta" onclick="entrarAEspacio('cassette')">
        CASSETTE
    </button>

    <button class="btn-mini-nav-cinta" onclick="entrarAEspacio('digital')">
        DIGITAL
    </button>

</div>

<div class="cinta-nav-der">
    <button id="btn-detener-mecanismo">
        DETENER EL MECANISMO
    </button>
</div>
    <div class="cinta-layout">
        <div class="cinta-izq">
            <h1>CINTA MECANICA</h1>
            <h2>EL COMIENZO ANALOGICO</h2>
            <div class="cinta-texto">
                La cinta de carrete fue el primer soporte capaz de capturar la música con fidelidad y profundidad. 
                El origen de toda grabación.
            </div>
            <img src="imagen/bobina-cinta.png" class="bobina-img">
        </div>
        
        <div class="cinta-der">
            <div class="marco-info-cinta">

    <div class="fila-info">
        <img src="imagen/cinta-sola.png">
        <p>Décadas de música fueron creadas y preservadas sobre cinta magnética.</p>
    </div>

    <div class="fila-info">
        <img src="imagen/medidor-nivel.png" class="img-medidor">
        <p>Ruido de fondo característico. El famoso soplido de cinta.</p>
    </div>

    <div class="cinta-texto-secundario">
        Cada grabación requería precisión, experiencia y procesos manuales. No existía el deshacer. Solo decisiones reales que quedaban para siempre.
    </div>

    <div class="cinta-imagenes-finales">
        <img src="imagen/volumenotro.png" class="cinta-img-final">
        <img src="imagen/volumenotro.png" class="cinta-img-final">
    </div>

</div>
        </div>
    </div>

    <!-- 👇 IMÁGENES IGUALES AL FINAL -->
    <div class="cinta-imagenes-finales">
        
`;
setTimeout(() => {

    const btnDetener = document.getElementById('btn-detener-mecanismo');

    if(btnDetener){

        btnDetener.addEventListener('click', () => {

            if(audioAmbienteEspacio){
                audioAmbienteEspacio.pause();
            }

            if(intervaloCinta){
                clearInterval(intervaloCinta);
            }

            if(intervaloBobina){
                clearInterval(intervaloBobina);
            }

            if(intervaloCintaPelicula){
                clearInterval(intervaloCintaPelicula);
            }

            pEspacio.classList.remove('activa');

            setTimeout(() => {
                pHub.classList.add('activa');
            }, 500);

        });

    }

}, 100);
    } 
    else if (id === 'vinilo') {
        audioAmbienteEspacio = document.getElementById('fondoVinilo');
        if (audioAmbienteEspacio) {
            audioAmbienteEspacio.volume = 0.4;
            audioAmbienteEspacio.currentTime = 0;
            audioAmbienteEspacio.play().catch(() => {});
        }
    pEspacio.classList.add('espacio-vinilo');
        // Modificado: Ahora inyectamos en contenedorDinamico
     contenedorDinamico.innerHTML= `
            <div class="ritual-vinilo-contenedor">
                <div class="textura-clasica-filtro"></div>
                
                <div class="barra-navegacion-superior-vinilo">
                    <div class="mini-navegacion-nombres-vinilo" id="contenedor-mini-nav"></div>
                    <button class="btn-volver-hub-desde-espacio" id="btn-cerrar-espacio">← LEVANTAR PÚA</button>
                </div>

                <div class="grilla-fanzine-vinilo">
                    
                    <div class="col-fanzine-vinilo-izq">
                        <header class="bloque-titulo-vinilo-fanzine">
                            <span class="subtitulo-fanzine-vinilo">CONCIERTO EN ALTA FIDELIDAD</span>
                            <h2>VINILO</h2>
                        </header>
                        <div class="bloque-parrafo-vinilo-fanzine">
                            <p>UN SURCO TALLADO EN ESPIRAL QUE CONTIENE EL TIEMPO. EL VINILO EXIGE ATENCIÓN, UN RITUAL PAUSADO DE MANOS LIMPIAS, PÚAS DE DIAMANTE Y EL CALOR ACÚSTICO QUE SOLO LA MATERIA PURA PUEDE ENTREGAR AL ENTRAR EN CONTACTO CON LA GEOMETRÍA DEL PLÁSTICO.</p>
                        </div>
                    </div>

                    <div class="col-fanzine-vinilo-derecha-obra">
                     <img src="imagen/disco-giratorio.png"
         class="img-disco-giratorio">

                        <div class="contenedor-vinilo-capsula">

    <div class="notas-vinilo">
        <span>♪</span>
        <span>♫</span>
        <span>♬</span>
        <span>♪</span>
    </div>

    <img src="imagen/vinilo.png" alt="Disco Vinilo" class="img-vinilo-disco bn-filtro">
                            <div class="marco-dorado-fino">
                                <img src="imagen/vinilo-cover.png" alt="Carátula Vinilo" class="img-vinilo-cover">
                                <div class="contenido-texto-portada">
                                    <ul class="lista-caracteristicas-vinilo">
                                        <li><span class="marcador-vinilo-flecha">◇</span> SURCO MECÁNICO CONTÍNUO</li>
                                        <li><span class="marcador-vinilo-flecha">◇</span> FRICCIÓN NATURAL DE AGUJA</li>
                                        <li><span class="marcador-vinilo-flecha">◇</span> CALIDEZ ACÚSTICA ANALÓGICA</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;
      
        setTimeout(() => {
            const viniloExtra = document.querySelector('.img-extra-vinilo'); 
            
            if (viniloExtra) {
                viniloExtra.style.cursor = 'pointer'; 
                viniloExtra.addEventListener('click', () => {
                    reproducirAudioInteraccion('sonido/infoVinilo.mp3');
                });
            }
}, 200);
    }
    else if (id === 'cassette') {
        const audioClack = new Audio('sonido/clack-walkman.mp3');
                audioClack.volume = 0.6;
        audioClack.play().catch(() => {});

        audioAmbienteEspacio = document.getElementById('fondoCassette');
        if (audioAmbienteEspacio) {
            audioAmbienteEspacio.volume = 0.5;
            audioAmbienteEspacio.currentTime = 0;
            setTimeout(() => { audioAmbienteEspacio.play().catch(() => {}); }, 200);
        }
        pEspacio.classList.add('espacio-cassette');
        // Modificado: Ahora inyectamos en contenedorDinamico
        contenedorDinamico.innerHTML = `
       
            <div class="cultura-cassette-contenedor">
                <div class="barra-navegacion-superior">
                    <div class="mini-navegacion-nombres" id="contenedor-mini-nav"></div>
                    <button class="btn-volver-hub-desde-espacio btn-mini-nav-cassette"
                                id="btn-cerrar-espacio">
                            ← STOP / EJECT
                        </button>
                </div>

                <div class="grilla-fanzine-cassette">
                    <div class="col-fanzine-izq">
                        <header class="bloque-titulo-cassette-fanzine">
                            <span class="subtitulo-fanzine">PORTÁTIL Y REBELDE</span>
                            <h2>CASSETTE</h2>
                        </header>
                        <div class="bloque-parrafo-fanzine">
                            <p>EL SONIDO SE HACE PORTÁTIL, REBELDE Y PROPIO. GRABAR DE LA RADIO, ESCRIBIR LA ETIQUETA A MANO CON MARCADOR Y SALIR A LA CALLE. LA LIBERTAD DE LLEVAR TU MÚSICA EN EL BOLSILLO BAJO LAS LUCES DE LA CIUDAD ENREDA LA CINTA CON UNA BIROME.</p>
                        </div>
                        <div class="lista-esquina-cassette">
                            <img src="imagen/lista-cassettes.png" alt="Lista de Cassettes">
                        </div>
                    </div>

                    <div class="col-fanzine-centro">
                        <div class="contenedor-cassette-img-fanzine">
                            <img src="imagen/dibujo-cassette.png" alt="Cassette Amarillo" class="img-cassette-fanzine">
                        </div>
                    </div>

                    <div class="col-fanzine-der">
                        <ul class="lista-caracteristicas-cassette">
                            <li><span class="marcador-vinculo">➔</span> SOPLIDO DE FONDO</li>
                            <li><span class="marcador-vinculo">➔</span> CLICK AL PRESIONAR PLAY</li>
                            <li><span class="marcador-vinculo">➔</span> RUIDO DEL MECANISMO</li>
                        </ul>
                    </div>
                </div>

                <footer class="footer-fanzine-walkman">
                    <div class="espacio-vacio-izq"></div> 
                    <div class="reproductor-walkman-fisico">
                        <div class="controles-mecanicos-botones">
                            <button class="btn-walkman-mecanico btn-w-prev">◀◀</button>
                            <button class="btn-walkman-mecanico btn-w-play-active">● PLAY</button>
                            <button class="btn-walkman-mecanico btn-w-stop">■ STOP</button>
                            <button class="btn-walkman-mecanico btn-w-next">▶▶</button>
                        </div>
                        <div class="ventana-cinta-girando">
                            <div class="carrete-izq"></div>
                            <div class="carrete-der"></div>
                        </div>
                    </div>
                    <div class="contenedor-walkman-auriculares">
                        <img src="imagen/walkman-auriculares.png" alt="Walkman con auriculares" class="img-walkman-retro">
                    </div>
                </footer>
            </div>
        `;
        iniciarEmisorCinta()
        setTimeout(() => {
            const imagenWalkman = document.querySelector('.img-walkman-retro');
            if (imagenWalkman) {
                imagenWalkman.style.cursor = 'pointer';
                imagenWalkman.addEventListener('click', () => {
                    reproducirAudioInteraccion('sonido/infoCassette.mp3');
                });
            }
        }, 200);
    }
    else if (id === 'digital') {
        try {
            audioAmbienteEspacio = document.getElementById('fondoDigital');   
            if (audioAmbienteEspacio) {
                audioAmbienteEspacio.volume = 0.4;
                audioAmbienteEspacio.loop = true;
                audioAmbienteEspacio.currentTime = 0;
                audioAmbienteEspacio.play().catch(() => console.log("Audio esperando interacción"));
            }
        } catch(e) {
            console.error("Error cargando sonido digital:", e);
        }

        // Modificado: Ahora inyectamos en contenedorDinamico
        contenedorDinamico.innerHTML = `
            <button class="btn-volver-hub-desde-espacio" id="btn-cerrar-espacio">← SYSTEM.EXIT()</button>
            <canvas id="canvas-digital"></canvas>

            <div class="menu-formatos-lateral">
                <button class="btn-enlace-formato" onclick="entrarAEspacio('vinilo')">VINILO</button>
                <button class="btn-enlace-formato" onclick="entrarAEspacio('cinta')">CINTA</button>
                <button class="btn-enlace-formato" onclick="entrarAEspacio('cassette')">CASSETTE</button>
            </div>

            <div class="replica-digital-contenedor">
                <div class="columna-info-digital">
                    <div class="bloque-digitalizacion-formatos">
                        <div class="formato-viejo">
                            <img src="imagen/silueta-cinta.png" alt="Cinta" class="img-formato-silueta">
                            <span>CINTA</span>
                        </div>
                        <div class="flecha-flujo">➔</div>
                        <div class="formato-viejo">
                            <img src="imagen/silueta-vinilo.png" alt="Vinilo" class="img-formato-silueta">
                            <span>VINILO</span>
                        </div>
                        <div class="flecha-flujo">➔</div>
                        <div class="formato-viejo">
                            <img src="imagen/silueta-cassette.png" alt="Cassette" class="img-formato-silueta">
                            <span>CASSETTE</span>
                        </div>
                        <div class="flecha-flujo">➔</div>
                        <div class="concepto-digitalizado">
                            <span class="badge-digital" id="disparador-audio-digital">DIGITALIZADO</span>
                        </div>
                    </div>

                    <span class="codigo-bites">01000101 01010010 01000001 00100000 01000101 01010010 01000001</span>
                    <h2 class="titulo-seccion-digital">CD / DIGITAL</h2>
                    <h3 class="sub-seccion-digital">MÚSICA SIN LÍMITES</h3>
                    <p class="texto-futurista">Del disco físico al streaming. La era digital llevó toda la música a cualquier lugar del mundo al instante.</p>
                    
                    <div class="lista-esquina-spotify">
                        <img src="imagen/lista-spotify.jpeg" alt="Lista Spotify">
                    </div>
                </div>

       <div class="columna-mockup-digital">
    <div class="telefono-interfaz" style="position: relative;">
        <img src="imagen/celular-mockup.png" class="img-celular-marco" alt="Smartphone">
    </div>

    <div class="contenido-pantalla-celular-libre">
        <div class="bloque-cel-item">
            <div class="ondas-icono-animado">
                <span></span><span></span><span></span><span></span><span></span>
            </div>
            <div class="texto-cel-item">
                <h4>CALIDAD</h4>
                <p>SONIDO LIMPIO</p>
            </div>
        </div>
        <div class="bloque-cel-item">
            <div class="play-icono-circulo">▶</div>
            <div class="texto-cel-item">
                <h4>ACCESO</h4>
                <p>MILES DE CANCIONES AL INSTANTE</p>
            </div>
        </div>
    </div>
</div>

            <div class="reproductor-barra-inferior simun-player">
                <div class="espacio-vacio-izq"></div>
                <div class="controles-reproductor-central">
                    <div class="botones-control-row">
                        <button class="btn-control-audio shuffle">🔀</button>
                        <button class="btn-control-audio prev">⏮</button>
                        <button class="btn-control-audio play-main">⏸</button>
                        <button class="btn-control-audio next">⏭</button>
                        <button class="btn-control-audio repeat">🔁</button>
                    </div>
                    <div class="progreso-barra-contenedor">
                        <input type="range" class="input-progreso-audio" min="0" max="100" value="45">
                    </div>
                </div>
                <div class="controles-volumen-derecha">
                    <span class="icono-vol">🔊</span>
                    <input type="range" class="input-volumen-slider" min="0" max="1" step="0.1" value="0.7">
                </div>
            </div>
        `;
        iniciarEfectoDigital(contenedorDinamico);

        setTimeout(() => {
            // Buscamos el nuevo ID que creamos
            const triggerAudio = document.getElementById('disparador-audio-digital');
            
            if (triggerAudio) {
                triggerAudio.style.cursor = 'pointer'; // Para que aparezca la manito
                triggerAudio.style.transition = 'color 0.3s'; // Opcional: efecto suave
                
                triggerAudio.addEventListener('click', () => {
                    reproducirAudioInteraccion('sonido/infoDigital.mp3');
                });
                
                // Efecto visual al pasar el mouse (hover)
                triggerAudio.onmouseover = () => triggerAudio.style.color = '#00ff66';
                triggerAudio.onmouseout = () => triggerAudio.style.color = '';
            }
        }, 200);
    }

    // --- ASIGNACIÓN DE EVENTOS INMEDIATA TRAS INYECTAR EL DOM ---
    const btnCerrar = document.getElementById('btn-cerrar-espacio');
    if (audioInfoActivo) {
        audioInfoActivo.pause();
        audioInfoActivo = null;
    }
    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            pEspacio.className = 'pantalla';
            pEspacio.style.color = ""; 
            if (audioAmbienteEspacio) { audioAmbienteEspacio.pause(); }
            if (idAnimacionDigital) { cancelAnimationFrame(idAnimacionDigital); }
            
            if (!laComparacionEstaLiberada && audioInicial) {
                audioInicial.play().catch(() => {});
            }
            setTimeout(() => { pHub.classList.add('activa'); }, 500);
                });
    }

    // --- CREACIÓN DINÁMICA DE LA MINI-NAVEGACIÓN INTERNA ---
    const miniNavContenedor = document.getElementById('contenedor-mini-nav');
    if (miniNavContenedor) {
        if (id === 'cassette') {
            Object.keys(formatosData).forEach(key => {
                if (key !== id) {
                    const item = formatosData[key];
                    const btnLateral = document.createElement('button');
                    btnLateral.className = 'btn-mini-nav-cassette'; 
                    btnLateral.textContent = item.nombre.toUpperCase();
                    btnLateral.addEventListener('click', (e) => {
                        e.stopPropagation();
                        entrarAEspacio(key);
                    });
                    miniNavContenedor.appendChild(btnLateral);
                }
            });
        } 
        else {
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
        }
    }

    comprobarProgresoFormatos();
    setTimeout(() => { pEspacio.classList.add('activa'); }, 150);
}
// --- 🎮 MOTOR GRÁFICO DIGITAL (CANVAS) - ¡ÚNICA VERSIÓN LIMPIA! ---
function iniciarEfectoDigital(contenedor) {
    // 1. Limpiar canvas previo si existe (para evitar duplicados al entrar/salir)
    const existente = document.getElementById('canvas-digital');
    if (existente) existente.remove();

    // 2. Crear y configurar el canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas-digital';
    contenedor.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // 3. Inicializar partículas
    let particulas = [];
    let tiempo = 0;

    for (let i = 0; i < 200; i++) {
        particulas.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1.5, 
            vy: (Math.random() - 0.5) * 1.5,
            size: Math.random() * 2.5 + 1,
            color: Math.random() < 0.5 ? '#0062ff' : '#eeff00', 
            alpha: Math.random() * 0.6 + 0.1
        });
    }

    // 4. Lógica de animación
    function animar() {
        // Fondo con rastro suave
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        tiempo += 0.03;

        // Dibujar partículas
        particulas.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fillRect(p.x, p.y, p.size, p.size); 
        });

        // Dibujar líneas onduladas
        ctx.globalAlpha = 0.4; 
        ctx.beginPath();
        ctx.lineWidth = 2.5;    
        ctx.strokeStyle = '#0066ff'; 
        ctx.shadowBlur = 8;    
        ctx.shadowColor = '#0066ff';

        for (let x = 0; x < canvas.width; x += 2) {
            const y = canvas.height / 2 + 
                      Math.sin(x * 0.01 + tiempo) * 25 * Math.sin(x * 0.002 + tiempo * 0.5) +
                      Math.cos(x * 0.02 - tiempo * 0.8) * 8;
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        ctx.shadowBlur = 0; 
        ctx.globalAlpha = 1.0;

        idAnimacionDigital = requestAnimationFrame(animar);
    }
    
    animar();
}

// --- 🔓 CONTROL DEL PROGRESO Y APERTURA DE LA INCOGNITA ---
function comprobarProgresoFormatos() {
    const todosVisitados = Object.values(formatosVisitados).every(v => v === true);
    
    if (todosVisitados && !laComparacionEstaLiberada) {
        laComparacionEstaLiberada = true;
        
        tarjetaIncognita.classList.remove('bloqueado');
        tarjetaIncognita.innerHTML = `<div class="signo" style="color: #00ff66; font-weight: bold;">!</div>`;
        
        tarjetaIncognita.addEventListener('click', () => {
            if (audioAmbienteEspacio) audioAmbienteEspacio.pause();
            if (audioInicial) audioInicial.pause();
            pHub.classList.remove('activa');
            pEspacio.classList.remove('activa');
            
            setTimeout(() => {
                pFinal.classList.add('activa');
                inicializarVideosInteractivos();
            }, 600);
        });
    }
}

// --- 🎬 MULTIPLEXACIÓN DE AUDIOS EN LA GRILLA FINAL ---
function inicializarVideosInteractivos() {
    const cuadrantes = document.querySelectorAll('.cuadrante-interactivo');

    cuadrantes.forEach(cuadrante => {
        const video = cuadrante.querySelector('video');
        const audio = cuadrante.querySelector('audio');

        // seguridad: el video SIEMPRE sin audio
        if (video) {
            video.muted = true;
            video.volume = 0;
        }

        cuadrante.addEventListener('mouseenter', () => {
            // VIDEO
            if (video) {
                video.currentTime = 0;
                video.play().catch(() => {});
            }

            // AUDIO (el importante)
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(() => {});
            }
        });

        cuadrante.addEventListener('mouseleave', () => {
            // VIDEO
            if (video) {
                video.pause();
                video.currentTime = 0;
            }

            // AUDIO
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
    });
}

// Volver al Hub desde la pantalla final
const btnRegresar = document.getElementById('btn-regresar-a-hub');

if (btnRegresar) {
    btnRegresar.addEventListener('click', () => {

        pFinal.classList.remove('activa');

        document.querySelectorAll('.cuadrante-interactivo video').forEach(v => {
            v.pause();
            v.currentTime = 0;
        });

        setTimeout(() => {
            pHub.classList.add('activa');
        }, 600);
    });
}
function reproducirAudioInteraccion(rutaAudio) {
    // Si ya existe un audio de info sonando, lo detenemos y reseteamos
    if (audioInfoActivo) {
        audioInfoActivo.pause();
        audioInfoActivo.currentTime = 0;
        
        // Si el audio que intentamos apretar es el mismo que suena, solo lo detenemos y salimos
        if (audioInfoActivo.src.includes(rutaAudio)) {
            audioInfoActivo = null;
            if (audioAmbienteEspacio) audioAmbienteEspacio.play().catch(() => {});
            return;
        }
    }

    // Si no es el mismo o es uno nuevo, lo reproducimos
    audioInfoActivo = new Audio(rutaAudio);
    if (audioAmbienteEspacio) audioAmbienteEspacio.pause();
    
    audioInfoActivo.play().catch(e => console.log("Audio de info bloqueado"));

    audioInfoActivo.onended = () => {
        audioInfoActivo = null;
        if (audioAmbienteEspacio) audioAmbienteEspacio.play().catch(() => {});
    };
}

function lanzarCintaCassette() {
    const contenedor = document.getElementById('pantalla-espacio');
    // Asegúrate de tener una clase para identificar tu imagen de walkman
    const walkman = document.querySelector('.img-extra-cassette'); 
    
    if (!contenedor.classList.contains('espacio-cassette') || !walkman) return;

    const cinta = document.createElement('div');
    cinta.className = 'particula-cinta';
    
    // Posición desde el "cabezal" del walkman
    const rect = walkman.getBoundingClientRect();
    cinta.style.left = (rect.left + rect.width / 2) + 'px';
    cinta.style.top = (rect.top + 20) + 'px';
    
    contenedor.appendChild(cinta);
    
    setTimeout(() => cinta.remove(), 2500);
}

// Intervalo para el cassette
let intervaloCinta;
function iniciarEmisorCinta() {
    if (intervaloCinta) clearInterval(intervaloCinta);
    intervaloCinta = setInterval(lanzarCintaCassette, 600);
}function lanzarCintaBobina() {
    const contenedor = document.getElementById('pantalla-espacio');
    const bobina = document.querySelector('.img-volumenotro'); // Asegúrate que tu imagen tenga esta clase
    
    if (!contenedor.classList.contains('espacio-cinta') || !bobina) return;

    const fragmento = document.createElement('div');
    fragmento.className = 'particula-cinta-bobina';
    
    const rect = bobina.getBoundingClientRect();
    fragmento.style.left = (rect.left + rect.width / 2) + 'px';
    fragmento.style.top = (rect.top + rect.height / 2) + 'px';
    
    contenedor.appendChild(fragmento);
    setTimeout(() => fragmento.remove(), 2000);
}

let intervaloBobina;
function iniciarEmisorCintaBobina() {
    if (intervaloBobina) clearInterval(intervaloBobina);
    intervaloBobina = setInterval(lanzarCintaBobina, 500);
}
let intervaloCintaPelicula;

function crearFrameCinta() {
    const contenedor = document.getElementById('pantalla-espacio');
    const cinta = document.querySelector('.cinta-real');

    if (!contenedor || !cinta) return;
    if (!contenedor.classList.contains('espacio-cinta')) return;

    // efecto visual de “frame glitch / película”
    cinta.style.transform = `translateX(${Math.random() * 2 - 1}px)`;
}

function iniciarEmisorCintaPelícula() {
    if (intervaloCintaPelicula) clearInterval(intervaloCintaPelicula);
    intervaloCintaPelicula = setInterval(crearFrameCinta, 40);
}

function detenerEmisorCintaPelícula() {
    if (intervaloCintaPelicula) clearInterval(intervaloCintaPelicula);
    intervaloCintaPelicula = null;
}
document.querySelectorAll('.cuadrante-interactivo video').forEach(video => {
    video.muted = true;
    video.volume = 0;
});