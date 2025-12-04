// GLOBAL STATE
let currentUser = {
    name: "Usuario Nombre",
    email: "miyaball@gmail.com",
    password: "miyaball",
    phone: "+51 999 777 555",
    country: "pe",
};

let simulations = [
    {
        id: 1,
        type: "email",
        title: "Email Malicioso Bancario",
        description:
            "Identifica correos fraudulentos que intentan robar credenciales bancarias",
        difficulty: 4,
        status: "completed",
        progress: 100,
        score: 85,
        date: "2025-12-01",
        participants: ["user1@example.com", "user2@example.com"],
        startDate: "2025-12-01",
        endDate: "2025-12-05",
    },
    {
        id: 2,
        type: "link",
        title: "Link Malicioso - Compras Online",
        description:
            "Detecta enlaces sospechosos en sitios de comercio electrónico",
        difficulty: 5,
        status: "pending",
        progress: 0,
        score: 0,
        date: "2025-12-03",
        participants: ["Equipo de IT"],
        startDate: "2025-12-03",
        endDate: "2025-12-10",
    },
    {
        id: 3,
        type: "sms",
        title: "SMS Phishing - Delivery",
        description: "Reconoce mensajes falsos de empresas de entrega",
        difficulty: 3,
        status: "completed",
        progress: 100,
        score: 92,
        date: "2025-11-28",
        participants: ["Área Comercial"],
        startDate: "2025-11-28",
        endDate: "2025-12-02",
    },
];

let currentSimulation = null;
let currentQuestion = 0;
let correctAnswersCount = 0;
let selectedAnswer = null;
let simStartTime = null;
let tempSimData = {
    participants: [],
    autoSend: false,
};

const simulationQuestions = {
    email: [
        {
            title: "Analiza este correo",
            text: "De: seguridad@banco-peru.com\nAsunto: ¡URGENTE! Verifica tu cuenta\n\nEstimado cliente, hemos detectado actividad sospechosa. Haz clic aquí para verificar: http://banco-verify.tk",
            answers: [
                { text: "Hacer clic en el enlace inmediatamente", correct: false },
                { text: "Reportar como spam y eliminar", correct: true },
                { text: "Responder solicitando más información", correct: false },
                { text: "Reenviar a mis contactos", correct: false },
            ],
            feedback:
                "El dominio .tk y la urgencia son señales de phishing. Los bancos nunca piden verificar por correo.",
        },
        {
            title: "Revisa el remitente",
            text: "¿Cuál de estos correos es legítimo del Banco Nacional?",
            answers: [
                { text: "servicios@banconacional.com.pe", correct: true },
                { text: "banco.nacional@gmail.com", correct: false },
                { text: "atencion@banco-nacional.net", correct: false },
                { text: "soporte@bna-cional.com", correct: false },
            ],
            feedback:
                "Los dominios oficiales usan .com.pe, nunca proveedores gratuitos como Gmail.",
        },
        {
            title: "Identifica señales de alerta",
            text: "Un correo dice: 'Tu cuenta será BLOQUEADA en 24 horas si no actúas YA'. ¿Qué técnica usan?",
            answers: [
                { text: "Urgencia artificial para presionarte", correct: true },
                { text: "Verificación de seguridad legítima", correct: false },
                { text: "Actualización de términos", correct: false },
                { text: "Encuesta de satisfacción", correct: false },
            ],
            feedback:
                "La urgencia excesiva es una táctica común de phishing para que actúes sin pensar.",
        },
        {
            title: "Análisis de enlaces",
            text: "Pasas el cursor sobre un enlace que dice 'www.banco.com' pero muestra: http://18.234.12.45/login",
            answers: [
                { text: "Es seguro, el texto coincide", correct: false },
                {
                    text: "Es sospechoso, usa una IP en lugar de dominio",
                    correct: true,
                },
                { text: "Es normal en sitios bancarios", correct: false },
                { text: "Solo importa que tenga https://", correct: false },
            ],
            feedback:
                "Los sitios legítimos usan dominios, no direcciones IP. Esto es una señal clara de phishing.",
        },
        {
            title: "Archivos adjuntos",
            text: "Recibes un correo con 'Factura_2025.exe'. ¿Qué debes hacer?",
            answers: [
                { text: "Abrirlo para ver la factura", correct: false },
                {
                    text: "Eliminarlo, los .exe son ejecutables peligrosos",
                    correct: true,
                },
                { text: "Escanearlo con antivirus y abrirlo", correct: false },
                { text: "Reenviarlo al remitente", correct: false },
            ],
            feedback:
                "Las facturas son PDF o imágenes, nunca archivos .exe. Este es claramente malware.",
        },
    ],
    link: [
        {
            title: "Inspección de URL",
            text: "¿Cuál de estos enlaces es seguro?",
            answers: [
                { text: "https://amazon.com/ofertas", correct: true },
                { text: "http://amaz0n.com/ofertas", correct: false },
                { text: "https://amazon-ofertas.tk", correct: false },
                { text: "https://secure-amazon.net", correct: false },
            ],
            feedback:
                "Solo el dominio oficial amazon.com es legítimo. Los demás usan técnicas de typosquatting.",
        },
        {
            title: "Detecta caracteres sospechosos",
            text: "Un link muestra: https://gооgle.com (con 'o' cirílicas). ¿Es seguro?",
            answers: [
                { text: "Sí, dice Google", correct: false },
                {
                    text: "No, usa caracteres Unicode similares (homograph)",
                    correct: true,
                },
                { text: "Sí, tiene HTTPS", correct: false },
                { text: "Es el dominio oficial", correct: false },
            ],
            feedback:
                "Los atacantes usan caracteres de otros idiomas que se ven iguales pero son diferentes.",
        },
        {
            title: "Enlaces acortados",
            text: "Recibes bit.ly/ganaPremio prometiendo un iPhone gratis. ¿Qué haces?",
            answers: [
                { text: "Hacer clic para ver si es real", correct: false },
                {
                    text: "Desconfiar, los acortadores ocultan el destino real",
                    correct: true,
                },
                { text: "Compartirlo con amigos", correct: false },
                { text: "Ingresar mis datos personales", correct: false },
            ],
            feedback:
                "Los enlaces acortados son peligrosos porque no puedes ver el sitio real de destino.",
        },
        {
            title: "Certificados SSL",
            text: "Un sitio de compras tiene HTTPS pero el navegador muestra una advertencia de certificado. ¿Continúas?",
            answers: [
                { text: "Sí, tiene el candado verde", correct: false },
                {
                    text: "No, el certificado puede ser falso o expirado",
                    correct: true,
                },
                { text: "Sí, si acepto el riesgo", correct: false },
                { text: "Solo si es una compra pequeña", correct: false },
            ],
            feedback:
                "Las advertencias de certificado indican problemas de seguridad graves. Nunca las ignores.",
        },
        {
            title: "QR Codes maliciosos",
            text: "Encuentras un código QR pegado sobre uno oficial en un restaurante. ¿Lo escaneas?",
            answers: [
                { text: "Sí, para ver el menú", correct: false },
                { text: "No, puede redirigir a un sitio falso", correct: true },
                { text: "Sí, pero sin introducir datos", correct: false },
                { text: "Lo escaneo con otra app", correct: false },
            ],
            feedback:
                "Los QR codes pegados sobre otros son un método común de phishing físico (quishing).",
        },
    ],
    sms: [
        {
            title: "SMS de delivery",
            text: "SMS: 'Tu paquete está retenido. Paga 5 soles aquí: bit.ly/track123' - Remitente: +1 555-0123",
            answers: [
                { text: "Pagar para recibir mi paquete", correct: false },
                { text: "Es smishing, eliminarlo", correct: true },
                { text: "Llamar al número para confirmar", correct: false },
                { text: "Hacer clic para rastrear", correct: false },
            ],
            feedback:
                "Las empresas de delivery no piden pagos por SMS ni usan números internacionales.",
        },
        {
            title: "Verificación bancaria",
            text: "'Banco Nacional: Confirma tu identidad con este código: 849271. No lo compartas con nadie'",
            answers: [
                { text: "Responder con mis datos", correct: false },
                {
                    text: "Verificar si pedí algún código, si no, ignorar",
                    correct: true,
                },
                { text: "Compartir el código si me llaman", correct: false },
                { text: "Hacer clic en algún enlace del mensaje", correct: false },
            ],
            feedback:
                "Si no solicitaste un código, alguien más está intentando acceder a tu cuenta.",
        },
        {
            title: "Premio falso",
            text: "'¡FELICIDADES! Ganaste $5000. Reclama aquí: www.premio-gratis.tk Tu código: XYZ123'",
            answers: [
                { text: "Hacer clic para reclamar", correct: false },
                { text: "Es una estafa clásica de SMS", correct: true },
                { text: "Verificar el código primero", correct: false },
                { text: "Compartir con familia", correct: false },
            ],
            feedback:
                "Los premios no solicitados son siempre estafas. Nadie regala dinero por SMS.",
        },
        {
            title: "Urgencia familiar",
            text: "'Mamá, perdí mi teléfono. Este es mi nuevo número. Necesito dinero urgente para emergencia'",
            answers: [
                { text: "Transferir dinero inmediatamente", correct: false },
                { text: "Llamar al número anterior para verificar", correct: true },
                { text: "Responder pidiendo cuenta bancaria", correct: false },
                { text: "Enviar lo que pida", correct: false },
            ],
            feedback:
                "Esta estafa explota emociones. Siempre verifica por otro canal antes de enviar dinero.",
        },
        {
            title: "Actualización de servicio",
            text: "'Tu cuenta Netflix será suspendida. Actualiza tu pago: netflix-update.com'",
            answers: [
                { text: "Hacer clic y actualizar", correct: false },
                { text: "Ir directamente a la app/sitio oficial", correct: true },
                { text: "Responder al SMS", correct: false },
                { text: "Llamar al número del mensaje", correct: false },
            ],
            feedback:
                "Las empresas legítimas no piden actualizar datos por SMS. Usa siempre la app oficial.",
        },
    ],
    web: [
        {
            title: "Sitio de compras falso",
            text: "Un sitio ofrece iPhone a $100. Tiene HTTPS pero el dominio es 'apple-store-oficial.net'",
            answers: [
                { text: "Comprar, es una oferta increíble", correct: false },
                {
                    text: "Es falso, precios imposibles y dominio sospechoso",
                    correct: true,
                },
                { text: "Probar con tarjeta prepago", correct: false },
                { text: "Verificar reseñas en el mismo sitio", correct: false },
            ],
            feedback:
                "Precios demasiado buenos + dominio no oficial = estafa. Apple solo vende en apple.com",
        },
        {
            title: "Formularios de pago",
            text: "Un sitio pide: número de tarjeta, CVV, contraseña bancaria y PIN. ¿Procedes?",
            answers: [
                { text: "Sí, es parte del proceso de pago", correct: false },
                { text: "No, nunca debes dar contraseña y PIN", correct: true },
                { text: "Solo si tiene reviews positivas", correct: false },
                { text: "Sí, si prometen devolución", correct: false },
            ],
            feedback:
                "Los comercios legítimos NUNCA piden contraseñas bancarias ni PIN. Solo tarjeta y CVV.",
        },
        {
            title: "Pop-ups de premio",
            text: "Al navegar, aparece: '¡Eres el visitante 1,000,000! Ganaste un iPad. Haz clic aquí'",
            answers: [
                { text: "Hacer clic para reclamar", correct: false },
                {
                    text: "Cerrar sin interactuar, es publicidad engañosa",
                    correct: true,
                },
                { text: "Ingresar datos para verificar", correct: false },
                { text: "Descargar el premio", correct: false },
            ],
            feedback:
                "Estos pop-ups son scareware o intentos de phishing. Nunca interactúes con ellos.",
        },
        {
            title: "Redes WiFi públicas",
            text: "En un café hay dos WiFi: 'Café_Guest' (requiere contraseña) y 'Café_Free' (abierto). ¿Cuál usas?",
            answers: [
                { text: "Café_Free, es más conveniente", correct: false },
                {
                    text: "Café_Guest después de preguntar la contraseña al personal",
                    correct: true,
                },
                { text: "Cualquiera, no importa", correct: false },
                { text: "Crear mi propio hotspot", correct: false },
            ],
            feedback:
                "Las redes abiertas no oficiales pueden ser trampas (Evil Twin) para interceptar datos.",
        },
        {
            title: "Extensiones del navegador",
            text: "Una extensión promete 'Descuentos automáticos' pero pide acceso a 'Leer y modificar todos los datos'",
            answers: [
                { text: "Instalar, quiero descuentos", correct: false },
                { text: "Rechazar, pide permisos excesivos", correct: true },
                { text: "Instalar si tiene buenas reseñas", correct: false },
                { text: "Instalar y desinstalar después", correct: false },
            ],
            feedback:
                "Extensiones con permisos excesivos pueden robar contraseñas y datos bancarios.",
        },
    ],
    sweep: [
        {
            title: "Ingeniería social",
            text: "Te llaman diciendo ser de soporte técnico: 'Detectamos virus en su PC. Dame acceso remoto para limpiarlo'",
            answers: [
                { text: "Dar acceso para que lo arreglen", correct: false },
                { text: "Colgar, es un intento de estafa", correct: true },
                { text: "Preguntar más detalles primero", correct: false },
                { text: "Pedir que me manden un correo", correct: false },
            ],
            feedback:
                "Las empresas legítimas nunca llaman ofreciendo soporte no solicitado ni piden acceso remoto.",
        },
        {
            title: "Contraseñas seguras",
            text: "¿Cuál es la contraseña MÁS segura?",
            answers: [
                { text: "password123", correct: false },
                { text: "7$mK9#pL2@qR5&wN", correct: true },
                { text: "micumpleaños2000", correct: false },
                { text: "admin2025", correct: false },
            ],
            feedback:
                "Contraseñas seguras: mínimo 12 caracteres, letras mayúsculas/minúsculas, números y símbolos.",
        },
        {
            title: "Autenticación de dos factores",
            text: "Tu banco ofrece 2FA. ¿Cuál es el método MÁS seguro?",
            answers: [
                { text: "SMS con código", correct: false },
                {
                    text: "App autenticadora (Google/Microsoft Authenticator)",
                    correct: true,
                },
                { text: "Correo electrónico", correct: false },
                { text: "Pregunta de seguridad", correct: false },
            ],
            feedback:
                "Las apps autenticadoras son más seguras que SMS (pueden interceptarse) o email.",
        },
        {
            title: "Redes sociales",
            text: "Un 'amigo' te etiqueta en Facebook con: 'Mira este video tuyo' + link. Nunca grabaste videos.",
            answers: [
                { text: "Hacer clic para ver qué es", correct: false },
                { text: "Es cuenta hackeada, reportar y no hacer clic", correct: true },
                { text: "Preguntar al amigo por messenger", correct: false },
                { text: "Compartir para avisar a otros", correct: false },
            ],
            feedback:
                "Cuentas hackeadas esparcen malware etiquetando amigos. Nunca hagas clic en links sospechosos.",
        },
        {
            title: "Actualizaciones de software",
            text: "Tu computadora dice: 'Actualización crítica disponible'. ¿Qué haces?",
            answers: [
                { text: "Ignorar las actualizaciones", correct: false },
                {
                    text: "Instalar inmediatamente desde fuentes oficiales",
                    correct: true,
                },
                { text: "Buscar en Google alternativas", correct: false },
                { text: "Esperar varias semanas", correct: false },
            ],
            feedback:
                "Las actualizaciones de seguridad son críticas. Instálalas pronto, pero solo de fuentes oficiales.",
        },
    ],
};

const simulationColors = {
    email: { bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    link: { bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    sms: { bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
    web: { bg: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
    sweep: { bg: "linear-gradient(135deg, #00c853 0%, #00897b 100%)" },
};

const simulationNames = {
    email: "Email Malicioso",
    link: "Link Malicioso",
    sms: "SMS Phishing",
    web: "Sitio Web Fraudulento",
    sweep: "Better Sweep (Avanzado)",
};

// NAVIGATION
let currentScreen = "splashScreen";
const screenHistory = [];

function showScreen(screenId) {
    document
        .querySelectorAll(".screen")
        .forEach((s) => s.classList.remove("active"));
    document.getElementById(screenId).classList.add("active");

    if (currentScreen !== screenId && screenId !== "splashScreen") {
        screenHistory.push(currentScreen);
    }
    currentScreen = screenId;

    const backBtn = document.getElementById("backBtn");
    if (
        screenId === "splashScreen" ||
        screenId === "loginScreen" ||
        screenId === "signupScreen" ||
        screenId === "dashboardScreen"
    ) {
        backBtn.style.display = "none";
    } else {
        backBtn.style.display = "block";
    }

    if (screenId === "dashboardScreen") {
        updateDashboard();
    } else if (screenId === "simulationsScreen") {
        renderSimulationsList();
    } else if (screenId === "profileScreen") {
        updateProfile();
    }

    window.scrollTo(0, 0);
}

function goBack() {
    if (screenHistory.length > 0) {
        const previousScreen = screenHistory.pop();
        currentScreen = previousScreen;
        showScreen(previousScreen);
    }
}

// TIME UPDATE
setInterval(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    document.getElementById("currentTime").textContent = `${hours}:${minutes}`;
}, 1000);

// AUTH
function handleLogin() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (email === currentUser.email && password === currentUser.password) {
        showScreen("dashboardScreen");
    } else {
        alert(
            "Credenciales incorrectas.\n\nPrueba con:\nEmail: " +
            currentUser.email +
            "\nContraseña: " +
            currentUser.password
        );
    }
}

function handleSignup() {
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const terms = document.getElementById("terms").checked;

    if (!name || !email || !password) {
        alert("Por favor completa todos los campos");
        return;
    }

    if (!terms) {
        alert("Debes aceptar los términos y condiciones");
        return;
    }

    currentUser.name = name;
    currentUser.email = email;
    currentUser.password = password;
    alert("¡Cuenta creada exitosamente!");
    showScreen("dashboardScreen");
}

function logout() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        screenHistory.length = 0;
        showScreen("loginScreen");
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    if (input.type === "password") {
        input.type = "text";
        icon.textContent = "🙈";
    } else {
        input.type = "password";
        icon.textContent = "👁️";
    }
}

// PROFILE
function updateProfile() {
    document.getElementById("profileName").textContent = currentUser.name;
    document.getElementById("profileEmail").textContent = currentUser.email;
    document.getElementById("fullName").textContent = currentUser.name;
    document.getElementById("email").textContent = currentUser.email;
    document.getElementById("phone").textContent = currentUser.phone;

    const countryFlags = {
        pe: "🇵🇪 Perú",
        ar: "🇦🇷 Argentina",
        br: "🇧🇷 Brasil",
        mx: "🇲🇽 México",
    };
    document.getElementById("country").textContent =
        countryFlags[currentUser.country] || "🌎 Internacional";

    const initial = currentUser.name.charAt(0).toUpperCase();
    document.getElementById("profileAvatar").textContent = initial;
}

function saveProfile() {
    const newName = document.getElementById("editName").value;
    const newEmail = document.getElementById("editEmail").value;
    const newPhone = document.getElementById("editPhone").value;
    const newCountry = document.getElementById("editCountry").value;

    if (!newName || !newEmail) {
        alert("Por favor completa todos los campos obligatorios");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
        alert("Por favor ingresa un correo electrónico válido");
        return;
    }

    currentUser.name = newName;
    currentUser.email = newEmail;
    currentUser.phone = newPhone;
    currentUser.country = newCountry;

    alert("¡Cambios guardados exitosamente!");
    showScreen("profileScreen");
}

function changePassword() {
    const currentPwd = document.getElementById("currentPassword").value;
    const newPwd = document.getElementById("newPassword").value;
    const confirmPwd = document.getElementById("confirmPassword").value;

    if (!currentPwd || !newPwd || !confirmPwd) {
        alert("Por favor completa todos los campos de contraseña");
        return;
    }

    if (currentPwd !== currentUser.password) {
        alert("❌ La contraseña actual es incorrecta");
        return;
    }

    if (newPwd.length < 6) {
        alert("❌ La nueva contraseña debe tener al menos 6 caracteres");
        return;
    }

    if (newPwd !== confirmPwd) {
        alert(
            "❌ Las contraseñas nuevas no coinciden\n\nAsegúrate de escribir la misma contraseña en ambos campos.\n\nPuedes usar el ícono del ojo 👁️ para verificar que sean iguales."
        );
        return;
    }

    currentUser.password = newPwd;
    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";

    alert(
        "✅ ¡Contraseña cambiada exitosamente!\n\nTu nueva contraseña es: " + newPwd
    );
}

function handleResetFromEmail() {
  const email = document.getElementById("resetEmail").value.trim();
  const newPwd = document.getElementById("resetNewPassword").value;
  const confirmPwd = document.getElementById("resetConfirmPassword").value;

  if (!email || !newPwd || !confirmPwd) {
    alert("Completa todos los campos.");
    return;
  }

  if (email !== currentUser.email) {
    alert("Este correo no está registrado en esta demo.");
    return;
  }

  if (newPwd.length < 6) {
    alert("La nueva contraseña debe tener al menos 6 caracteres.");
    return;
  }

  if (newPwd !== confirmPwd) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  // Actualizamos la “BD” de la demo
  currentUser.password = newPwd;

  // Prellenar login
  document.getElementById("loginEmail").value = email;
  document.getElementById("loginPassword").value = newPwd;

  alert("Listo, tu contraseña fue actualizada. Entrando al panel...");

  // Limpia el hash para que no vuelva a entrar a resetScreen
  if (window.location.hash === "#reset") {
    history.replaceState({}, document.title, window.location.pathname);
  }

  showScreen("dashboardScreen");
}

// DASHBOARD
function updateDashboard() {
    document.getElementById("userName").textContent =
        currentUser.name.split(" ")[0];

    const completed = simulations.filter((s) => s.status === "completed").length;
    const avgScore =
        Math.round(
            simulations
                .filter((s) => s.score > 0)
                .reduce((acc, s) => acc + s.score, 0) / completed
        ) || 0;

    document.getElementById("totalSims").textContent = simulations.length;
    document.getElementById("completedSims").textContent = completed;
    document.getElementById("avgScore").textContent = avgScore + "%";

    const recentList = document.getElementById("recentSimsList");
    recentList.innerHTML = simulations
        .slice(0, 3)
        .map(
            (sim) => `
        <div class="sim-list-item" onclick="viewSimulation(${sim.id})">
            <div class="sim-info">
                <div class="sim-title">${sim.title}</div>
                <div class="sim-stats">${
                sim.status === "completed" ? "Completada" : "Pendiente"
            } • ${sim.date}</div>
            </div>
            <div class="sim-progress">
                <div class="progress-value" style="color:${
                sim.progress === 100 ? "#00c853" : "#2196F3"
            }">${sim.progress}%</div>
                <div class="progress-label">Progreso</div>
            </div>
        </div>
    `
        )
        .join("");
}

// SIMULATIONS LIST
function renderSimulationsList(filter = "all") {
    let filtered = simulations;
    if (filter === "pending") {
        filtered = simulations.filter((s) => s.status === "pending");
    } else if (filter === "completed") {
        filtered = simulations.filter((s) => s.status === "completed");
    }

    const listContainer = document.getElementById("simulationsList");
    if (filtered.length === 0) {
        listContainer.innerHTML =
            '<p style="text-align:center; color:#999; padding:40px 0;">No hay simulaciones en esta categoría</p>';
        return;
    }

    listContainer.innerHTML = filtered
        .map(
            (sim) => `
        <div class="sim-list-item" onclick="viewSimulation(${sim.id})">
            <div class="sim-info">
                <div class="sim-title">${sim.title}</div>
                <div class="sim-stats">
                    ${
                sim.status === "completed"
                    ? "✓ Completada"
                    : "⏱️ Pendiente"
            } • 
                    Dificultad: ${"⭐".repeat(sim.difficulty)} • 
                    ${sim.date}
                </div>
            </div>
            <div class="sim-progress">
                <div class="progress-value" style="color:${
                sim.progress === 100
                    ? "#00c853"
                    : sim.progress > 0
                        ? "#ff9800"
                        : "#2196F3"
            }">${sim.progress}%</div>
                <div class="progress-label">${
                sim.status === "completed" ? sim.score + " pts" : "Progreso"
            }</div>
            </div>
        </div>
    `
        )
        .join("");
}

function filterSimulations(filter) {
    document
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
    event.target.classList.add("active");
    renderSimulationsList(filter);
}

function viewSimulation(simId) {
    const sim = simulations.find((s) => s.id === simId);
    if (!sim) return;

    if (sim.status === "completed") {
        alert(
            `Simulación completada\n\nPuntuación: ${
                sim.score
            }%\nDificultad: ${"⭐".repeat(
                sim.difficulty
            )}\n\n¿Quieres volver a intentarlo?`
        );
        if (confirm("¿Iniciar de nuevo?")) {
            startSimulation(sim);
        }
    } else {
        startSimulation(sim);
    }
}

// CREATE SIMULATION
function selectSimType(type) {
    currentSimulation = {
        type: type,
        title: "",
        description: "",
        difficulty: Math.floor(Math.random() * 3) + 3,
    };
    tempSimData = {
        participants: [],
        autoSend: false,
    };

    document.getElementById("selectedSimType").textContent =
        simulationNames[type];
    document.getElementById("simDifficulty").textContent =
        "Dificultad: " + "⭐".repeat(currentSimulation.difficulty);

    const descriptions = {
        email:
            "Aprende a identificar correos electrónicos fraudulentos que intentan robar tus credenciales o información personal.",
        link: "Desarrolla habilidades para detectar enlaces maliciosos y sitios web falsos antes de hacer clic.",
        sms: "Reconoce mensajes de texto sospechosos que buscan engañarte con urgencias falsas o premios inexistentes.",
        web: "Identifica señales de sitios web fraudulentos diseñados para robar información financiera o personal.",
        sweep:
            "Simulación avanzada que combina múltiples técnicas de ciberseguridad y mejores prácticas.",
    };

    document.getElementById("simDescription").value = descriptions[type];
    document.getElementById("simTitle").value = "";

    showScreen("personalizeScreen");
}

function goToAssignParticipants() {
    const title = document.getElementById("simTitle").value;
    const description = document.getElementById("simDescription").value;

    if (!title) {
        alert("Por favor ingresa un título para la simulación");
        return;
    }

    currentSimulation.title = title;
    currentSimulation.description = description;

    document.getElementById("participantInput").value = "";
    renderParticipants();
    showScreen("assignScreen");
}

function addParticipant() {
    const input = document.getElementById("participantInput");
    const participant = input.value.trim();

    if (!participant) {
        alert("Por favor ingresa un correo o nombre");
        return;
    }

    if (tempSimData.participants.includes(participant)) {
        alert("Este participante ya fue agregado");
        return;
    }

    tempSimData.participants.push(participant);
    input.value = "";
    renderParticipants();
}

function addGroup(groupName) {
    if (tempSimData.participants.includes(groupName)) {
        alert("Este grupo ya fue agregado");
        return;
    }
    tempSimData.participants.push(groupName);
    renderParticipants();
}

function removeParticipant(index) {
    tempSimData.participants.splice(index, 1);
    renderParticipants();
}

function renderParticipants() {
    const container = document.getElementById("participantsList");
    if (tempSimData.participants.length === 0) {
        container.innerHTML =
            '<p style="color:#999; font-size:14px;">No hay participantes agregados</p>';
        return;
    }

    container.innerHTML = tempSimData.participants
        .map(
            (p, i) => `
        <div class="participant-tag">
            ${p} <span class="remove-tag" onclick="removeParticipant(${i})">✕</span>
        </div>
    `
        )
        .join("");
}

function goToSchedule() {
    if (tempSimData.participants.length === 0) {
        alert("Por favor agrega al menos un participante");
        return;
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    document.getElementById("startDate").value = tomorrow
        .toISOString()
        .split("T")[0];
    document.getElementById("endDate").value = nextWeek
        .toISOString()
        .split("T")[0];

    showScreen("scheduleScreen");
}

function toggleSwitch(element) {
    element.classList.toggle("active");
    tempSimData.autoSend = element.classList.contains("active");
}

function goToPreview() {
    const startDate = document.getElementById("startDate").value;
    const startTime = document.getElementById("startTime").value;
    const endDate = document.getElementById("endDate").value;
    const endTime = document.getElementById("endTime").value;

    if (!startDate || !endDate) {
        alert("Por favor completa las fechas de inicio y fin");
        return;
    }

    if (new Date(endDate) < new Date(startDate)) {
        alert("La fecha de fin debe ser posterior a la fecha de inicio");
        return;
    }

    tempSimData.startDate = startDate;
    tempSimData.startTime = startTime;
    tempSimData.endDate = endDate;
    tempSimData.endTime = endTime;

    document.getElementById("previewType").textContent =
        simulationNames[currentSimulation.type];
    document.getElementById("previewTitle").textContent = currentSimulation.title;
    document.getElementById("previewDescription").textContent =
        currentSimulation.description;
    document.getElementById("previewParticipants").textContent =
        tempSimData.participants.length +
        " usuario" +
        (tempSimData.participants.length !== 1 ? "s" : "");
    document.getElementById("previewDifficulty").textContent = "⭐".repeat(
        currentSimulation.difficulty
    );
    document.getElementById("previewStartDate").textContent =
        formatDate(startDate) + " " + startTime;
    document.getElementById("previewEndDate").textContent =
        formatDate(endDate) + " " + endTime;

    showScreen("previewScreen");
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function createSimulation() {
    const newSim = {
        id: simulations.length + 1,
        type: currentSimulation.type,
        title: currentSimulation.title,
        description: currentSimulation.description,
        difficulty: currentSimulation.difficulty,
        status: "pending",
        progress: 0,
        score: 0,
        date: new Date().toISOString().split("T")[0],
        participants: [...tempSimData.participants],
        startDate: tempSimData.startDate,
        endDate: tempSimData.endDate,
        autoSend: tempSimData.autoSend,
    };

    simulations.unshift(newSim);
    alert(
        "✅ ¡Simulación creada exitosamente!\n\n" +
        "Título: " +
        newSim.title +
        "\n" +
        "Participantes: " +
        newSim.participants.length +
        "\n" +
        "Inicio: " +
        formatDate(newSim.startDate)
    );

    currentSimulation = null;
    tempSimData = { participants: [], autoSend: false };

    showScreen("simulationsScreen");
}

// START SIMULATION
function startSimulation(sim) {
    currentSimulation = { ...sim };
    currentQuestion = 0;
    correctAnswersCount = 0;
    selectedAnswer = null;
    simStartTime = Date.now();

    const questions = simulationQuestions[sim.type];
    if (!questions) {
        alert("Preguntas no disponibles para este tipo de simulación");
        return;
    }

    document.getElementById("simScreenBg").style.background =
        simulationColors[sim.type].bg;
    document.getElementById("simTypeTitle").textContent = sim.title;
    document.getElementById("totalQuestions").textContent = questions.length;

    showQuestion();
    showScreen("simExecutionScreen");
}

function showQuestion() {
    const questions = simulationQuestions[currentSimulation.type];
    const question = questions[currentQuestion];

    document.getElementById("currentQuestionNum").textContent =
        currentQuestion + 1;
    document.getElementById("questionTitle").textContent = question.title;
    document.getElementById("questionText").textContent = question.text;

    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById("simProgressFill").style.width = progress + "%";

    const answersContainer = document.getElementById("answersContainer");
    answersContainer.innerHTML = question.answers
        .map(
            (answer, index) => `
        <div class="answer-option" onclick="selectAnswerOption(${index})">
            <span id="answer-icon-${index}">⚪</span>
            <span>${answer.text}</span>
        </div>
    `
        )
        .join("");

    selectedAnswer = null;
    document.getElementById("submitBtn").textContent = "Responder";
}

function selectAnswerOption(index) {
    document.querySelectorAll(".answer-option").forEach((opt, i) => {
        opt.classList.remove("selected");
        document.getElementById(`answer-icon-${i}`).textContent = "⚪";
    });

    document.querySelectorAll(".answer-option")[index].classList.add("selected");
    document.getElementById(`answer-icon-${index}`).textContent = "✓";
    selectedAnswer = index;
}

function submitAnswer() {
    if (selectedAnswer === null) {
        alert("Por favor selecciona una respuesta");
        return;
    }

    const questions = simulationQuestions[currentSimulation.type];
    const question = questions[currentQuestion];
    const isCorrect = question.answers[selectedAnswer].correct;

    document.querySelectorAll(".answer-option").forEach((opt, i) => {
        if (question.answers[i].correct) {
            opt.classList.add("correct");
            document.getElementById(`answer-icon-${i}`).textContent = "✓";
        } else if (i === selectedAnswer && !isCorrect) {
            opt.classList.add("wrong");
            document.getElementById(`answer-icon-${i}`).textContent = "✗";
        }
    });

    if (isCorrect) {
        correctAnswersCount++;
    }



    setTimeout(() => {
        alert(
            isCorrect
                ? "¡Correcto! 🎉\n\n" + question.feedback
                : "❌ Incorrecto\n\n" + question.feedback
        );

        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1000);
}

function exitSimulation() {
    if (confirm("¿Estás seguro de que quieres salir? Perderás tu progreso.")) {
        showScreen("simulationsScreen");
    }
}

// RESULTS
function showResults() {
    const questions = simulationQuestions[currentSimulation.type];
    const totalQuestions = questions.length;
    const score = Math.round((correctAnswersCount / totalQuestions) * 100);
    const timeElapsed = Math.round((Date.now() - simStartTime) / 1000);
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    const points = correctAnswersCount * 100;

    document.getElementById("finalScore").textContent = score + "%";
    document.getElementById(
        "correctAnswers"
    ).textContent = `${correctAnswersCount}/${totalQuestions}`;
    document.getElementById("timeSpent").textContent = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;
    document.getElementById("pointsEarned").textContent = points;

    let feedback = "";
    if (score >= 80) {
        feedback =
            "🎉 ¡Excelente trabajo! Tienes un gran conocimiento de ciberseguridad.";
    } else if (score >= 60) {
        feedback = "👍 Buen trabajo. Hay áreas donde puedes mejorar.";
    } else {
        feedback =
            "📚 Necesitas practicar más. Revisa los conceptos básicos de ciberseguridad.";
    }

    document.getElementById("feedbackSection").innerHTML = `
        <h3 style="font-size:18px; margin-bottom:10px;">Retroalimentación</h3>
        <p style="font-size:14px; line-height:1.6;">${feedback}</p>
        <div style="margin-top:20px;">
            <strong>Áreas evaluadas:</strong><br>
            • Identificación de amenazas<br>
            • Análisis de seguridad<br>
            • Toma de decisiones<br>
            • Reconocimiento de patrones
        </div>
    `;

    const simIndex = simulations.findIndex((s) => s.id === currentSimulation.id);
    if (simIndex !== -1) {
        simulations[simIndex].status = "completed";
        simulations[simIndex].progress = 100;
        simulations[simIndex].score = score;
    }

    showScreen("resultsScreen");
}

function finishSimulation() {
    showScreen("dashboardScreen");
}

function handleRecover() {
  const emailInput = document.getElementById("recoverEmail");
  const emailValue = emailInput.value.trim();

  if (!emailValue) {
    alert("Ingresa un correo válido.");
    return;
  }

  const button = document.getElementById("recoverBtn");
  const originalText = button.textContent;

  button.disabled = true;
  button.textContent = "Enviando...";

  emailjs
    .send("service_aegis", "template_aegispassword", {
      email: emailValue, // debe coincidir con {{email}} en tu template de EmailJS
    })
    .then(() => {
      button.textContent = "Correo enviado ✓";
      alert("Listo. Revisa tu bandeja de entrada o spam.");
      emailInput.value = "";

      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        showScreen("loginScreen");
      }, 2000);
    })
    .catch((error) => {
      console.error("Error al enviar:", error);
      alert("Hubo un problema al enviar el correo. Intenta otra vez.");
      button.textContent = originalText;
      button.disabled = false;
    });
}

const startHash = window.location.hash;

if (startHash === "#reset") {
  // Si viene desde el correo, mostramos directamente la pantalla de reset
  showScreen("resetScreen");
} else {
  // Flujo normal: splash -> login
  setTimeout(() => {
    showScreen("loginScreen");
  }, 2000);
}
