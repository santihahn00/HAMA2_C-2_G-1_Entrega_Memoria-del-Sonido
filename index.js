// ==========================================================================
// 🕹️ INTERACCIONES Y LÓGICA DE CONTROL (index.js) - REVISADO Y CORREGIDO
// ==========================================================================

const formatosData = {
    cinta: { nombre: 'Cinta', clase: 'espacio-cinta', img: 'imagen/cinta.png' },
    vinilo: { nombre: 'Vinilo', clase: 'espacio-vinilo', img: 'imagen/vinilo.png' },
    cassette: { nombre: 'Cassette', clase: 'espacio-cassette', img: 'imagen/cassette.png' },
    digital: { nombre: 'Digital', clase: 'espacio-digital', img: 'imagen/digital.png' }
};

const formatosVisitados = { cinta: false, vinilo: false, cassette: false, digital: false };
let laComparacionEstaLiberada = false;
let audioAmbienteEspacio = null; // Guardará el elemento de audio actualmente en reproducción
let idAnimacionDigital = null;   

const pTitulo = document.getElementById('pantalla-titulo');
const pExplicacion = document.getElementById('pantalla-explicacion');
const pHub = document.getElementById('pantalla-hub');
const pEspacio = document.getElementById('pantalla-espacio');
const pFinal = document.getElementById('pantalla-final');
const audioInicial = document.getElementById('audio-cassette-inicial');
const tarjetaIncognita = document.getElementById('tarjeta-incognita');

// --- 1) APARICIÓN DEL TÍTULO ---
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const tituloH1 = document.getElementById('btn-comenzar');
        if (tituloH1) tituloH1.style.opacity = '1';
    }, 1000);
});

// Click para comenzar
document.getElementById('btn-comenzar').addEventListener('click', () => {
    audioInicial.play().catch(e => console.log("Audio esperando interacción del usuario."));
    pTitulo.classList.remove('activa');
    setTimeout(() => {
        pExplicacion.classList.add('activa');
        iniciarAnimacionImagenes(); 
    }, 1000);
});

// --- 2) SECCIÓN DE TEXTO EXPLICATIVO: IMÁGENES FLOTANTES ---
function iniciarAnimacionImagenes() {
    const contenedorMosaico = document.getElementById('mosaico-flotante');
    if (!contenedorMosaico) return;

    const fuentesImagenes = [
        'imagen/cinta.png', 'imagen/vinilo.png', 'imagen/cassette.png', 'imagen/digital.png',
        'imagen/ambiente1.jpg', 'imagen/ambiente2.jpg', 'imagen/ambiente3.jpg'
    ];

    fuentesImagenes.forEach((src) => {
        const img = document.createElement('img');
        img.className = 'img-flotante';
        img.src = src;
        
        reubicarImagenAbajo(img);
        img.yPos = window.innerHeight + (Math.random() * window.innerHeight * 1.5);
        contenedorMosaico.appendChild(img);

        const velocidad = 0.4 + Math.random() * 0.7;

        function animarCesta() {
            img.yPos -= velocidad;
            img.style.top = img.yPos + 'px';

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

// --- 3) PANTALLAS CONCEPTUALES EN PROFUNDIDAD ---
function entrarAEspacio(id) {
    formatosVisitados[id] = true; 
    
    if (audioInicial) { audioInicial.pause(); }
    
    pHub.classList.remove('activa');
    pEspacio.classList.remove('activa');

    // Cambiamos la clase de la pantalla y le agregamos estilos forzados de color claro para que el texto no sea invisible
    pEspacio.className = 'pantalla';
    pEspacio.classList.add(formatosData[id].clase);
    pEspacio.style.color = "#f5f1ea"; // Asegura texto claro en fondos oscuros

    // Capturamos el nuevo contenedor interno seguro
    const contenedorDinamico = document.getElementById('contenedor-dinamico-espacio');
    const graffiti = document.querySelector('.img-graffiti-libre');
    
    if (idAnimacionDigital) { cancelAnimationFrame(idAnimacionDigital); }
    if (audioAmbienteEspacio) { audioAmbienteEspacio.pause(); }

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

        // Modificado: Ahora inyectamos en contenedorDinamico
        contenedorDinamico.innerHTML = `
            <button class="btn-volver-hub-desde-espacio" id="btn-cerrar-espacio">← DETENER MECANISMO</button>
            <div class="plano-industrial-contenedor">
                <header class="bloque-titulo-industrial">
                    <span>REGISTRO MAGNÉTICO // INDUSTRIAL</span>
                    <h2>Cinta de Bobina</h2>
                </header>
                <div class="cuerpo-industrial">
                    <div class="columna-grafica">
                        <div class="marco-rustico"><img src="imagen/cinta.png" alt="Bobina"></div>
                        <div class="marco-rustico"><img src="imagen/ambiente1.jpg" alt="Estudio antiguo"></div>
                    </div>
                    <div class="columna-texto">
                        <p class="texto-maquina">LA ERA INDUSTRIAL DEL SONIDO. LA CAPTURA ASUME UN CUERPO FÍSICO DE ÓXIDO DE HIERRO Y PLÁSTICO. LA MÚSICA SE CONVIERTE EN UNA CINTA QUE CORRE INTERMINABLE ANTE CABEZALES MAGNÉTICOS, REGISTRANDO LA VIBRACIÓN DEL AIRE IN IMPERFECCIONES MECÁNICAS ENTRAÑABLES.</p>
                    </div>
                </div>
                <div class="mini-navegacion" id="contenedor-mini-nav"></div>
            </div>
        `;
    } 
    else if (id === 'vinilo') {
        audioAmbienteEspacio = document.getElementById('fondoVinilo');
        if (audioAmbienteEspacio) {
            audioAmbienteEspacio.volume = 0.4;
            audioAmbienteEspacio.currentTime = 0;
            audioAmbienteEspacio.play().catch(() => {});
        }

        // Modificado: Ahora inyectamos en contenedorDinamico
        contenedorDinamico.innerHTML = `
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
                        <div class="contenedor-vinilo-capsula">
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
        graffiti.style.top = '300px';
        graffiti.style.left = '1500px';
        audioClack.volume = 0.6;
        audioClack.play().catch(() => {});

        audioAmbienteEspacio = document.getElementById('fondoCassette');
        if (audioAmbienteEspacio) {
            audioAmbienteEspacio.volume = 0.5;
            audioAmbienteEspacio.currentTime = 0;
            setTimeout(() => { audioAmbienteEspacio.play().catch(() => {}); }, 200);
        }

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
                            <span class="badge-digital">DIGITALIZADO</span>
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

        setTimeout(inicializarEfectoDigital, 100);
        setTimeout(() => {
            const btnPause = document.querySelector('.play-main');
            if (btnPause) {
                btnPause.addEventListener('click', () => {
                    reproducirAudioInteraccion('sonido/infoDigital.mp3');
                });
            }
        }, 200);
    }

    // --- ASIGNACIÓN DE EVENTOS INMEDIATA TRAS INYECTAR EL DOM ---
    const btnCerrar = document.getElementById('btn-cerrar-espacio');
    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            pEspacio.className = 'pantalla';
            pEspacio.style.color = ""; // Limpiamos el estilo inline de color al salir
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
function inicializarEfectoDigital() {
    const canvas = document.getElementById('canvas-digital');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particulas = [];
    let tiempo = 0;

    for (let i = 0; i < 200; i++) {
        particulas.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1.5, 
            vy: (Math.random() - 0.5) * 1.5,
            size: Math.random() * 2.5 + 1,
            color: Math.random() < 0.5 ? '#0066ff' : '#00ff66', 
            alpha: Math.random() * 0.6 + 0.1
        });
    }

    function animar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        tiempo += 0.03;

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

        ctx.globalAlpha = 0.4; 
        ctx.beginPath();
        ctx.lineWidth = 2.5;    
        ctx.strokeStyle = '#0066ff'; 
        ctx.shadowBlur = 8;     
        ctx.shadowColor = '#0066ff'

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

        cuadrante.addEventListener('mouseenter', () => {
            if (video) {
                video.currentTime = 0;
                video.muted = false;
                video.play().catch(() => {});
            }
        });

        cuadrante.addEventListener('mouseleave', () => {
            if (video) {
                video.pause();
                video.currentTime = 0;
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
    const audioPuntual = new Audio(rutaAudio);
    const musicaDeFondo = audioAmbienteEspacio;
    
    // Pausamos la música de fondo si existe
    if (musicaDeFondo) musicaDeFondo.pause();

    audioPuntual.play().catch(e => console.log("Audio de info bloqueado"));

    // Cuando termina la info, reanudamos la música
    audioPuntual.onended = () => {
        if (musicaDeFondo) musicaDeFondo.play().catch(e => console.log("No se pudo reanudar"));
    };
}