let reconocimiento, transcripcionFinal = "", conteoMuletillas = 0, pausas = 0;
let tiempoTotal = 0, relojInterval, tiempoRestante = 0, tiempoInicio = 0;

function comenzarGrabacion() {
  const horas = parseInt(document.getElementById("horas").value || 0);
  const minutos = parseInt(document.getElementById("minutos").value || 0);
  const segundos = parseInt(document.getElementById("segundos").value || 0);
  tiempoTotal = (horas * 3600) + (minutos * 60) + segundos;
  tiempoRestante = tiempoTotal;
  tiempoInicio = Date.now();
  iniciarReconocimiento();
  actualizarReloj();
  relojInterval = setInterval(actualizarReloj, 1000);
}

function actualizarReloj() {
  if (tiempoRestante <= 0) {
    clearInterval(relojInterval);
    if (reconocimiento) reconocimiento.stop();
    return;
  }
  tiempoRestante--;
  const hrs = String(Math.floor(tiempoRestante / 3600)).padStart(2, '0');
  const min = String(Math.floor((tiempoRestante % 3600) / 60)).padStart(2, '0');
  const sec = String(tiempoRestante % 60).padStart(2, '0');
  document.getElementById("reloj").textContent = `${hrs}:${min}:${sec}`;
}

function iniciarReconocimiento() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  reconocimiento = new SpeechRecognition();
  reconocimiento.lang = "es-ES";
  reconocimiento.continuous = true;
  reconocimiento.interimResults = false;
  reconocimiento.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const texto = event.results[i][0].transcript.trim();
      analizarTexto(texto);
    }
  };
  reconocimiento.onerror = (e) => {
    reconocimiento.stop();
    setTimeout(() => reconocimiento.start(), 1000);
  };
  reconocimiento.onend = () => {
    if (tiempoRestante > 0) reconocimiento.start();
  };
  reconocimiento.start();
}

function analizarTexto(texto) {
  transcripcionFinal += texto + ". ";
  document.getElementById("transcripcion").value = transcripcionFinal;
  const muletillas = ["eh", "mmm", "este", "osea", "verdad", "pues"];
  muletillas.forEach(m => {
    conteoMuletillas += (texto.toLowerCase().split(m).length - 1);
  });
  if (Date.now() - tiempoInicio > 2500) {
    pausas++;
    tiempoInicio = Date.now();
  }
}

function generarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const nombre = localStorage.getItem("nombre");
  const carrera = localStorage.getItem("carrera");
  const seccion = localStorage.getItem("seccion");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Reporte de Práctica", 20, 20);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Nombre del estudiante: ${nombre}`, 20, 35);
  doc.text(`Carrera: ${carrera}`, 20, 43);
  doc.text(`Sección: ${seccion}`, 20, 51);
  doc.line(20, 58, 190, 58);
  doc.setFont("helvetica", "bold");
  doc.text("Transcripción:", 20, 66);
  doc.setFont("helvetica", "normal");
  let textoLimpio = doc.splitTextToSize(transcripcionFinal || "No se obtuvo transcripción.", 170);
  doc.setFontSize(10);
  doc.text(textoLimpio, 20, 74);
  let y = 74 + textoLimpio.length * 5 + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Análisis:", 20, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`- Muletillas detectadas: ${conteoMuletillas}`, 25, y);
  y += 7;
  doc.text(`- Pausas largas (más de 2.5 segundos): ${pausas}`, 25, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Consejos personalizados:", 20, y);
  y += 8;
  doc.setFont("helvetica", "normal");

  let consejos = [];

  if (conteoMuletillas > 3) {
    consejos.push(
      "• Intenta pensar antes de hablar para evitar muletillas innecesarias.",
      "• Practica frases con fluidez para reducir interrupciones verbales."
    );
  }

if (conteoMuletillas>5){
  consejos.push(
  "• Graba tus prácticas y escucha las muletillas para ser más consciente.",
  "• Escribe guiones previos para controlar lo que vas a decir.",
  "• Aumenta tu vocabulario para expresarte mejor."
);
}

  if (conteoMuletillas>10){
  consejos.push(
  "• Practica con otras personas y pide retroalimentación.",
  "• Haz ejercicios de respiración para mantener la calma.",
  "• Mira tus grabaciones y cuenta cuántas veces usas muletillas."
);
}

  if (conteoMuletillas>15){
    consejos.push(
  "• Usa gestos o expresiones faciales como apoyo en vez de llenar vacíos verbales.",
  "• Ensaya en frente del espejo para ganar seguridad.",
  "• Participa en debates o exposiciones para ganar fluidez."
);
}

  if (conteoMuletillas>20){
    consejos.push(
  "• Evita depender de palabras comodín.",
  "• Cambia muletillas por pausas cortas de silencio.",
  "• Lee en voz alta para mejorar tu dicción."
);
}

if (conteoMuletillas>20){
  consejos.push(
"• Usa pausas naturales en lugar de llenar con 'eh' o 'mmm'.",
"• Evita depender de palabras comodín.",
"• Cambia muletillas por pausas cortas de silencio.",
"• Lee en voz alta para mejorar tu dicción."
);
}

  if (pausas > 3) {
    consejos.push(
      "• Mantén el ritmo de tu discurso con una estructura clara.",
      "• Practica cronometrando tus presentaciones.",
      "• Utiliza tarjetas o guías visuales para no perderte.",
      "• No tengas miedo de equivocarte, ¡la práctica hace al maestro!"
    );
  }

  if (pausas >5){
    consejos.push(
  "• Mejora tu memoria con esquemas y mapas mentales.",
  "• Piensa en transiciones naturales entre ideas.",
  "• Haz ejercicios de improvisación."
    );
  }

  if (pausas >10){
    consejos.push(
  "• Evita memorizar palabra por palabra, enfócate en ideas clave.",
  "• Usa preguntas retóricas para mantenerte activo."
);
}

if (pausas >15){
  consejos.push(
  "• Practica con público para ganar confianza.",
  "• Controla tus nervios con respiración profunda.",
  "• Haz simulacros con temporizador."
);
}

if (pausas >10){
  consejos.push(
  "• Graba y analiza pausas en tu discurso.",
  "• Aumenta tu exposición a hablar en público.",
  "• Ensaya más veces hasta que fluya naturalmente."
);
}

  if (conteoMuletillas <= 5 && pausas <= 3) {
    consejos.push(
      "• Has demostrado buena claridad y control, ¡felicidades!",
      "• ¡Muy bien! Usa este progreso como base para avanzar más."
    );
  }

  let consejosLimpios = doc.splitTextToSize(consejos.join("\n"), 170);
  doc.text(consejosLimpios, 20, y + 2);
  doc.save(`Practica de ${nombre}.pdf`);
}

document.getElementById("btnRepetir").addEventListener("click", () => {
  transcripcionFinal = "";
  conteoMuletillas = 0;
  pausas = 0;
  location.reload();
});

document.getElementById("btnNuevo").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});
