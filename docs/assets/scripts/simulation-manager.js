// ========================================
// AEGIS - Simulation Templates Data
// ========================================

const SIMULATION_TEMPLATES = [
    {
        id: 'email-falso',
        name: 'Email Falso',
        description: 'Identifica correos electrónicos de phishing y aprende a reconocer señales de fraude',
        icon: 'fas fa-envelope',
        color: 'blue',
        difficulty: 'medium',
        questions: 10
    },
    {
        id: 'link-malicioso',
        name: 'Link Malicioso',
        description: 'Detecta enlaces peligrosos y aprende a verificar la seguridad de URLs',
        icon: 'fas fa-link',
        color: 'red',
        difficulty: 'hard',
        questions: 10
    },
    {
        id: 'sms-phishing',
        name: 'SMS Phishing',
        description: 'Reconoce mensajes de texto fraudulentos y protege tu información',
        icon: 'fas fa-sms',
        color: 'orange',
        difficulty: 'easy',
        questions: 10
    },
    {
        id: 'sitio-web-fraudulento',
        name: 'Sitio Web Fraudulento',
        description: 'Identifica páginas web falsas y aprende a navegar de forma segura',
        icon: 'fas fa-globe',
        color: 'yellow',
        difficulty: 'medium',
        questions: 10
    },
    {
        id: 'better-sleep',
        name: 'Better Sleep',
        description: 'Simulación de higiene digital y seguridad al usar dispositivos antes de dormir',
        icon: 'fas fa-bed',
        color: 'green',
        difficulty: 'easy',
        questions: 10
    },
    {
        id: 'redes-sociales',
        name: 'Redes Sociales Seguras',
        description: 'Aprende a proteger tu privacidad y seguridad en redes sociales',
        icon: 'fas fa-share-alt',
        color: 'gray',
        difficulty: 'medium',
        questions: 10
    }
];

// ========================================
// AEGIS - Simulation Manager
// ========================================

const SimulationManager = {
    // Get all templates
    getTemplates() {
        return SIMULATION_TEMPLATES;
    },

    // Get template by ID
    getTemplate(id) {
        return SIMULATION_TEMPLATES.find(t => t.id === id);
    },

    // Create simulation workflow state
    createWorkflowState() {
        return {
            template: null,
            name: '',
            difficulty: 'medium',
            description: '',
            participants: [],
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            autoSendEmail: false
        };
    },

    // Save workflow state to sessionStorage
    saveWorkflowState(state) {
        sessionStorage.setItem('aegis_simulation_workflow', JSON.stringify(state));
    },

    // Load workflow state from sessionStorage
    loadWorkflowState() {
        const stateStr = sessionStorage.getItem('aegis_simulation_workflow');
        return stateStr ? JSON.parse(stateStr) : this.createWorkflowState();
    },

    // Clear workflow state
    clearWorkflowState() {
        sessionStorage.removeItem('aegis_simulation_workflow');
    },

    // Complete simulation creation
    completeSimulation(workflowState) {
        const result = StorageManager.createSimulation({
            name: workflowState.name,
            template: workflowState.template,
            difficulty: workflowState.difficulty,
            description: workflowState.description,
            participants: workflowState.participants,
            startDate: workflowState.startDate,
            startTime: workflowState.startTime,
            endDate: workflowState.endDate,
            endTime: workflowState.endTime,
            autoSendEmail: workflowState.autoSendEmail
        });

        if (result.success) {
            this.clearWorkflowState();
        }

        return result;
    },

    // Get sample questions for a template
    getQuestions(templateId) {
        // Sample questions - in real app these would be more comprehensive
        const questions = {
            'email-falso': [
                {
                    id: 1,
                    type: 'email',
                    sender: 'seguridad@bancoperuano.com',
                    subject: 'Verificación urgente de su cuenta',
                    body: 'Estimado cliente,\\n\\nHemos detectado actividad sospechosa en su cuenta. Haga clic en el siguiente enlace para verificar su identidad:\\n\\nhttp://banco-verificacion.xyz/confirmar\\n\\nDe no hacerlo en 24 horas, su cuenta será bloqueada.\\n\\nAtentamente,\\nEquipo de Seguridad',
                    isPhishing: true,
                    signals: ['Urgencia artificial', 'Enlace sospechoso', 'Remitente desconocido'],
                    correctAnswer: 'reportar'
                },
                {
                    id: 2,
                    type: 'email',
                    sender: 'noreply@amazon.com',
                    subject: 'Confirmación de pedido #123456',
                    body: 'Hola,\\n\\nGracias por tu pedido. Tu paquete llegará entre el 10-12 de diciembre.\\n\\nPuedes rastrear tu pedido aquí: https://www.amazon.com/track/123456\\n\\nGracias por comprar con Amazon.',
                    isPhishing: false,
                    signals: [],
                    correctAnswer: 'hacer-click'
                },
                {
                    id: 3,
                    type: 'email',
                    sender: 'soporte@paypa1.com',
                    subject: '¡Has ganado $500!',
                    body: 'Felicidades,\\n\\n¡Has sido seleccionado para recibir $500! Para reclamar tu premio, haz clic aquí:\\n\\nhttp://paypal-premio.net/claim\\n\\nOferta válida por 24 horas únicamente.',
                    isPhishing: true,
                    signals: ['Dominio falso (1 en lugar de l)', 'Promesa de dinero gratis', 'Urgencia artificial'],
                    correctAnswer: 'reportar'
                },
                {
                    id: 4,
                    type: 'email',
                    sender: 'rrhh@empresa.com',
                    subject: 'Recordatorio: Reunión de equipo mañana',
                    body: 'Hola equipo,\\n\\nRecordatorio de nuestra reunión mensual mañana a las 10:00 AM en la sala de conferencias.\\n\\nAgenda adjunta.\\n\\nSaludos,\\nRecursos Humanos',
                    isPhishing: false,
                    signals: [],
                    correctAnswer: 'responder'
                },
                {
                    id: 5,
                    type: 'email',
                    sender: 'no-reply@netflix-seguridad.com',
                    subject: 'Su suscripción ha sido cancelada',
                    body: 'Estimado usuario,\\n\\nSu suscripción a Netflix ha sido cancelada debido a un problema con su método de pago.\\n\\nActualice su información de pago aquí: http://netflix-update.xyz\\n\\nDe lo contrario, perderá acceso a su cuenta.',
                    isPhishing: true,
                    signals: ['Dominio sospechoso', 'Amenaza de pérdida de servicio', 'Solicita información de pago'],
                    correctAnswer: 'reportar'
                },
                {
                    id: 6,
                    type: 'email',
                    sender: 'facturacion@servicio-electrico.gob.pe',
                    subject: 'Factura del mes de diciembre',
                    body: 'Estimado cliente,\\n\\nAdjuntamos su factura correspondiente al consumo de diciembre.\\n\\nTotal a pagar: S/. 145.00\\nFecha de vencimiento: 20/12/2024\\n\\nPuede pagar en línea en www.servicio-electrico.gob.pe',
                    isPhishing: false,
                    signals: [],
                    correctAnswer: 'hacer-click'
                },
                {
                    id: 7,
                    type: 'email',
                    sender: 'urgente@dhl-envios.net',
                    subject: 'Paquete retenido en aduana',
                    body: '¡URGENTE!\\n\\nSu paquete está retenido en aduana. Debe pagar una tarifa de S/. 50 inmediatamente.\\n\\nHaga clic aquí para pagar: http://dhl-customs.xyz\\n\\n¡Acción requerida en 12 horas!',
                    isPhishing: true,
                    signals: ['Urgencia extrema', 'Solicita pago inmediato', 'Dominio no oficial'],
                    correctAnswer: 'reportar'
                },
                {
                    id: 8,
                    type: 'email',
                    sender: 'notifications@linkedin.com',
                    subject: 'Tienes una nueva conexión',
                    body: 'Hola,\\n\\nJuan Pérez ha aceptado tu solicitud de conexión.\\n\\nVer perfil: https://www.linkedin.com/in/juanperez\\n\\nEquipo de LinkedIn',
                    isPhishing: false,
                    signals: [],
                    correctAnswer: 'hacer-click'
                },
                {
                    id: 9,
                    type: 'email',
                    sender: 'administracion@microsoft-security.net',
                    subject: 'Intento de acceso sospechoso',
                    body: 'Seguridad de Microsoft\\n\\nDetectamos un intento de inicio de sesión desde Rusia.\\n\\nSi no fuiste tú, cambia tu contraseña ahora: http://microsoft-secure.xyz/reset\\n\\n¡Protege tu cuenta!',
                    isPhishing: true,
                    signals: ['Dominio falso', 'Crea pánico', 'Solicita cambio de contraseña urgente'],
                    correctAnswer: 'reportar'
                },
                {
                    id: 10,
                    type: 'email',
                    sender: 'noreply@github.com',
                    subject: 'Pull request merged',
                    body: 'Hi,\\n\\nYour pull request #456 has been merged into main branch.\\n\\nView changes: https://github.com/user/repo/pull/456\\n\\nGitHub',
                    isPhishing: false,
                    signals: [],
                    correctAnswer: 'hacer-click'
                }
            ],
            'link-malicioso': [
                {
                    id: 1,
                    type: 'link',
                    url: 'https://www.gooogle.com/login',
                    context: 'Recibiste este enlace por WhatsApp de un número desconocido',
                    isMalicious: true,
                    signals: ['Typo en dominio (tres "o")', 'Solicita login', 'Remitente desconocido'],
                    correctAnswer: 'no-click'
                },
                {
                    id: 2,
                    type: 'link',
                    url: 'https://www.amazon.com/dp/B08N5WRWNW',
                    context: 'Enlace compartido en el grupo de trabajo oficial de tu empresa',
                    isMalicious: false,
                    signals: [],
                    correctAnswer: 'hacer-click'
                },
                {
                    id: 3,
                    type: 'link',
                    url: 'http://faceboook.com/verify-account',
                    context: 'Mensaje directo de Instagram: "Tu cuenta será suspendida, verifica aquí"',
                    isMalicious: true,
                    signals: ['Typo en dominio (tres "o")', 'Amenaza de suspensión', 'HTTP en lugar de HTTPS'],
                    correctAnswer: 'no-click'
                },
                {
                    id: 4,
                    type: 'link',
                    url: 'https://bit.ly/3xK9mP2',
                    context: 'Email de promoción de una tienda que nunca has visitado',
                    isMalicious: true,
                    signals: ['Enlace acortado', 'Remitente desconocido', 'No puedes ver destino real'],
                    correctAnswer: 'verificar'
                },
                {
                    id: 5,
                    type: 'link',
                    url: 'https://support.microsoft.com/es-es/office',
                    context: 'Artículo compartido por tu supervisor sobre nuevas funciones de Office',
                    isMalicious: false,
                    signals: [],
                    correctAnswer: 'hacer-click'
                },
                {
                    id: 6,
                    type: 'link',
                    url: 'https://paypa1-secure.tk/login',
                    context: 'SMS: "Tu cuenta PayPal ha sido bloqueada, ingresa aquí para desbloquear"',
                    isMalicious: true,
                    signals: ['Número "1" en lugar de letra "l"', 'Extensión sospechosa (.tk)', 'Crea urgencia'],
                    correctAnswer: 'no-click'
                },
                {
                    id: 7,
                    type: 'link',
                    url: 'https://github.com/microsoft/vscode',
                    context: 'Enlace en la documentación oficial del proyecto en el que trabajas',
                    isMalicious: false,
                    signals: [],
                    correctAnswer: 'hacer-click'
                },
                {
                    id: 8,
                    type: 'link',
                    url: 'https://netfl1x-payment-update.xyz/account',
                    context: 'Email: "Actualiza tu método de pago para continuar viendo Netflix"',
                    isMalicious: true,
                    signals: ['Número "1" en lugar de "i"', 'Dominio .xyz sospechoso', 'Solicita información de pago'],
                    correctAnswer: 'no-click'
                },
                {
                    id: 9,
                    type: 'link',
                    url: 'http://192.168.1.1/admin',
                    context: 'Estás configurando tu router en casa después de leer el manual',
                    isMalicious: false,
                    signals: [],
                    correctAnswer: 'hacer-click'
                },
                {
                    id: 10,
                    type: 'link',
                    url: 'https://secure-banking-bcp.com.pe.verify-account.ru/login',
                    context: 'SMS del "Banco de Crédito": "Actividad inusual detectada, verifica tu cuenta"',
                    isMalicious: true,
                    signals: ['Dominio sospechoso terminado en .ru', 'Subdominios excesivos', 'Crea pánico'],
                    correctAnswer: 'no-click'
                }
            ],
            'sms-phishing': [
                {
                    id: 1,
                    type: 'sms',
                    sender: '+51 999 123 456',
                    message: 'BCP: Su tarjeta ha sido bloqueada por seguridad. Ingrese a http://bcp-verifica.tk para desbloquear. Caduca en 2 horas.',
                    isPhishing: true,
                    signals: ['Urgencia artificial', 'Enlace sospechoso (.tk)', 'Solicita acción inmediata'],
                    correctAnswer: 'ignorar'
                },
                {
                    id: 2,
                    type: 'sms',
                    sender: 'Movistar',
                    message: 'Tu recibo Movistar de S/. 89.50 está disponible. Paga antes del 15/12 en www.movistar.com.pe o agentes autorizados.',
                    isPhishing: false,
                    signals: [],
                    correctAnswer: 'responder'
                },
                {
                    id: 3,
                    type: 'sms',
                    sender: '+1 555 0198',
                    message: '¡FELICIDADES! Has ganado un iPhone 15 Pro. Reclama tu premio aquí: http://apple-premio.xyz Código: 7834',
                    isPhishing: true,
                    signals: ['Número internacional desconocido', 'Premio no solicitado', 'Dominio sospechoso'],
                    correctAnswer: 'ignorar'
                },
                {
                    id: 4,
                    type: 'sms',
                    sender: 'WhatsApp',
                    message: 'Tu código de verificación de WhatsApp es: 456-892. No compartas este código con nadie.',
                    isPhishing: false,
                    signals: [],
                    correctAnswer: 'responder'
                },
                {
                    id: 5,
                    type: 'sms',
                    sender: '+51 987 654 321',
                    message: 'Hola mamá, perdí mi celular. Este es mi nuevo número. Necesito que me hagas una transferencia urgente. Escríbeme por WhatsApp.',
                    isPhishing: true,
                    signals: ['Solicitud de dinero urgente', 'Número desconocido', 'Tácticas de urgencia'],
                    correctAnswer: 'llamar-empresa'
                },
                {
                    id: 6,
                    type: 'sms',
                    sender: 'Rappi',
                    message: 'Tu pedido #R-4567 está en camino. Llegará en 25 minutos. Rastrear: https://rappi.com.pe/track/4567',
                    isPhishing: false,
                    signals: [],
                    correctAnswer: 'responder'
                },
                {
                    id: 7,
                    type: 'sms',
                    sender: 'SUNAT',
                    message: 'Estimado contribuyente, tiene una devolución de S/. 2,500 pendiente. Ingrese sus datos en http://sunat-devolucion.net para procesarla.',
                    isPhishing: true,
                    signals: ['SUNAT no envía SMS así', 'Dominio no oficial (.net)', 'Solicita datos personales'],
                    correctAnswer: 'ignorar'
                },
                {
                    id: 8,
                    type: 'sms',
                    sender: 'Netflix',
                    message: 'Tu suscripción de Netflix será renovada el 10/12 por S/. 44.90. Para cambios visita netflix.com/account',
                    isPhishing: false,
                    signals: [],
                    correctAnswer: 'responder'
                },
                {
                    id: 9,
                    type: 'sms',
                    sender: '+34 612 345 678',
                    message: 'DHL: Su paquete #DH-8923 está retenido en aduana. Pague S/. 85 en http://dhl-pe.info/customs o será devuelto.',
                    isPhishing: true,
                    signals: ['Número extranjero', 'Solicita pago urgente', 'Dominio no oficial'],
                    correctAnswer: 'llamar-empresa'
                },
                {
                    id: 10,
                    type: 'sms',
                    sender: 'Google',
                    message: 'Alguien intentó acceder a tu cuenta desde Lima, Perú. Si no fuiste tú, asegura tu cuenta en g.co/security',
                    isPhishing: false,
                    signals: [],
                    correctAnswer: 'responder'
                }
            ],
            'sitio-web-fraudulento': [
                {
                    id: 1,
                    type: 'website',
                    url: 'https://www.amaz0n.com/login',
                    description: 'Página de inicio de sesión con el logo de Amazon y campo de usuario/contraseña',
                    isFraudulent: true,
                    signals: ['Número "0" en lugar de letra "o"', 'Diseño muy similar al original', 'Solicita credenciales'],
                    correctAnswer: 'salir'
                },
                {
                    id: 2,
                    type: 'website',
                    url: 'https://www.google.com/search',
                    description: 'Motor de búsqueda de Google con diseño familiar y certificado SSL válido',
                    isFraudulent: false,
                    signals: [],
                    correctAnswer: 'continuar'
                },
                {
                    id: 3,
                    type: 'website',
                    url: 'http://descuentos-falabella.online/ofertas',
                    description: 'Tienda con "mega descuentos del 90%" en productos de marca. Sin HTTPS.',
                    isFraudulent: true,
                    signals: ['Sin certificado HTTPS', 'Descuentos irreales (90%)', 'Dominio no oficial (.online)'],
                    correctAnswer: 'salir'
                },
                {
                    id: 4,
                    type: 'website',
                    url: 'https://portal.bcp.com.pe/banking',
                    description: 'Portal de banca por internet del BCP con certificado EV (Extended Validation)',
                    isFraudulent: false,
                    signals: [],
                    correctAnswer: 'continuar'
                },
                {
                    id: 5,
                    type: 'website',
                    url: 'https://www.micrοsoft.com/download',
                    description: 'Página de descarga de Microsoft. El dominio tiene una letra griega "ο" (omicron) en lugar de "o"',
                    isFraudulent: true,
                    signals: ['Homoglifo: letra griega "ο" en lugar de "o"', 'Difícil de detectar visualmente', 'Solicita descarga'],
                    correctAnswer: 'verificar-url'
                },
                {
                    id: 6,
                    type: 'website',
                    url: 'https://github.com/torvalds/linux',
                    description: 'Repositorio oficial del kernel de Linux en GitHub con historial completo',
                    isFraudulent: false,
                    signals: [],
                    correctAnswer: 'continuar'
                },
                {
                    id: 7,
                    type: 'website',
                    url: 'https://secure-login-interbank.pe.verify.tk/',
                    description: 'Página que solicita tu usuario, contraseña y token de Interbank para "verificación de seguridad"',
                    isFraudulent: true,
                    signals: ['Dominio termina en .tk', 'Múltiples subdominios sospechosos', 'Solicita token de seguridad'],
                    correctAnswer: 'salir'
                },
                {
                    id: 8,
                    type: 'website',
                    url: 'https://www.wikipedia.org/wiki/Ciberseguridad',
                    description: 'Artículo de Wikipedia sobre ciberseguridad con referencias y ediciones verificables',
                    isFraudulent: false,
                    signals: [],
                    correctAnswer: 'continuar'
                },
                {
                    id: 9,
                    type: 'website',
                    url: 'https://apps-whatsapp-web.com/login',
                    description: 'Página que imita WhatsApp Web y solicita escanear un código QR para "actualizar"',
                    isFraudulent: true,
                    signals: ['Dominio no oficial', 'WhatsApp Web real es web.whatsapp.com', 'Solicita escanear QR sospechoso'],
                    correctAnswer: 'salir'
                },
                {
                    id: 10,
                    type: 'website',
                    url: 'https://stackoverflow.com/questions/12345/python-list',
                    description: 'Pregunta en Stack Overflow sobre listas en Python con respuestas votadas',
                    isFraudulent: false,
                    signals: [],
                    correctAnswer: 'continuar'
                }
            ],
            'better-sleep': [
                {
                    id: 1,
                    type: 'scenario',
                    situation: 'Son las 11:00 PM y estás en la cama. Recibes una notificación de Instagram.',
                    question: '¿Qué deberías hacer?',
                    options: ['Revisar la notificación inmediatamente', 'Silenciar las notificaciones y revisar mañana', 'Activar modo "No molestar"'],
                    isHealthy: false,
                    signals: ['La luz azul interfiere con el sueño', 'Las redes sociales pueden activarte', 'Revisar puede extender tu tiempo de pantalla'],
                    correctAnswer: 'mala-practica'
                },
                {
                    id: 2,
                    type: 'scenario',
                    situation: 'Activaste el filtro de luz azul en tu teléfono 2 horas antes de dormir.',
                    question: '¿Es una buena práctica?',
                    options: ['Sí, reduce el impacto de la luz azul', 'No, no hace diferencia', 'Depende del brillo de la pantalla'],
                    isHealthy: true,
                    signals: [],
                    correctAnswer: 'buena-practica'
                },
                {
                    id: 3,
                    type: 'scenario',
                    situation: 'Estás viendo una serie en Netflix en tu teléfono a las 12:30 AM.',
                    question: '¿Cómo afecta esto tu sueño?',
                    options: ['Negativamente - luz azul y contenido estimulante', 'No afecta si uso modo nocturno', 'Solo afecta si veo contenido violento'],
                    isHealthy: false,
                    signals: ['Retrasa la producción de melatonina', 'El contenido puede ser estimulante', 'Desplaza la hora de dormir'],
                    correctAnswer: 'mala-practica'
                },
                {
                    id: 4,
                    type: 'scenario',
                    situation: 'Configuraste tu teléfono para que se apague automáticamente a las 10:00 PM.',
                    question: '¿Es esto beneficioso?',
                    options: ['Sí, establece límites saludables', 'No, es muy restrictivo', 'Depende de tu horario'],
                    isHealthy: true,
                    signals: [],
                    correctAnswer: 'depende'
                },
                {
                    id: 5,
                    type: 'scenario',
                    situation: 'Dejas tu teléfono cargando en tu mesa de noche con todas las notificaciones activadas.',
                    question: '¿Qué impacto tiene esto?',
                    options: ['Negativo - interrumpirá tu sueño', 'Positivo - estará cargado por la mañana', 'Neutral si lo pongo en silencio'],
                    isHealthy: false,
                    signals: ['Notificaciones pueden despertar', 'Luz de pantalla interfiere', 'Tentación de revisar el teléfono'],
                    correctAnswer: 'mala-practica'
                },
                {
                    id: 6,
                    type: 'scenario',
                    situation: 'Lees un libro electrónico en tu Kindle (e-ink) antes de dormir.',
                    question: '¿Es mejor que usar el teléfono?',
                    options: ['Sí, e-ink no emite luz azul', 'No, es lo mismo', 'Solo si no tiene retroiluminación'],
                    isHealthy: true,
                    signals: [],
                    correctAnswer: 'buena-practica'
                },
                {
                    id: 7,
                    type: 'scenario',
                    situation: 'Usas tu teléfono como alarma y lo revisas "rápidamente" si te despiertas de noche.',
                    question: '¿Es esto problemático?',
                    options: ['Sí, dificulta volver a dormir', 'No, solo miro la hora', 'Depende de cuánto tiempo mire'],
                    isHealthy: false,
                    signals: ['La luz activa el cerebro', 'Puede generar ansiedad', 'Interrumpe ciclos de sueño'],
                    correctAnswer: 'mala-practica'
                },
                {
                    id: 8,
                    type: 'scenario',
                    situation: 'Estableces un recordatorio para dejar el teléfono 1 hora antes de dormir y lees un libro físico.',
                    question: '¿Es efectivo para mejor sueño?',
                    options: ['Sí, permite que el cerebro se relaje', 'No, no importa qué hagas antes', 'Solo ayuda si también meditas'],
                    isHealthy: true,
                    signals: [],
                    correctAnswer: 'buena-practica'
                },
                {
                    id: 9,
                    type: 'scenario',
                    situation: 'Usas el modo avión por la noche pero mantienes WiFi activo para la alarma.',
                    question: '¿Tiene sentido esta configuración?',
                    options: ['Parcialmente - reduce interrupciones pero no radiación', 'No tiene sentido', 'Sí, es la configuración ideal'],
                    isHealthy: true,
                    signals: [],
                    correctAnswer: 'depende'
                },
                {
                    id: 10,
                    type: 'scenario',
                    situation: 'Respondes emails de trabajo desde la cama antes de dormir.',
                    question: '¿Cómo afecta tu descanso?',
                    options: ['Muy negativamente - aumenta estrés y luz azul', 'No afecta si los termino rápido', 'Ayuda porque no pensaré en ellos'],
                    isHealthy: false,
                    signals: ['Aumenta cortisol (hormona del estrés)', 'Luz azul interfiere con melatonina', 'El cerebro queda en "modo trabajo"'],
                    correctAnswer: 'mala-practica'
                }
            ],
            'redes-sociales': [
                {
                    id: 1,
                    type: 'scenario',
                    situation: 'Recibes una solicitud de amistad en Facebook de alguien que tiene 3 amigos en común pero su perfil es muy nuevo.',
                    question: '¿Qué deberías hacer?',
                    options: ['Aceptar porque tenemos amigos en común', 'Revisar su perfil cuidadosamente primero', 'Rechazar automáticamente'],
                    isSecure: false,
                    signals: ['Perfil nuevo es sospechoso', 'Pocos amigos es señal de alerta', 'Podría ser cuenta falsa'],
                    correctAnswer: 'revisar-perfil'
                },
                {
                    id: 2,
                    type: 'scenario',
                    situation: 'Configuras tu perfil de Instagram como privado y solo aceptas solicitudes de personas que conoces.',
                    question: '¿Es una buena práctica de seguridad?',
                    options: ['Sí, protege tu privacidad', 'No, limita tu alcance', 'Depende de tus objetivos'],
                    isSecure: true,
                    signals: [],
                    correctAnswer: 'aceptar'
                },
                {
                    id: 3,
                    type: 'scenario',
                    situation: 'Publicas fotos de tus vacaciones en tiempo real con la ubicación activada.',
                    question: '¿Qué tan seguro es esto?',
                    options: ['Muy inseguro - indicas que no estás en casa', 'Seguro si mi perfil es privado', 'Neutral'],
                    isSecure: false,
                    signals: ['Revela que tu casa está vacía', 'Información de ubicación es sensible', 'Puede ser usado por delincuentes'],
                    correctAnswer: 'rechazar'
                },
                {
                    id: 4,
                    type: 'scenario',
                    situation: 'Revisas la configuración de privacidad de Facebook cada 3 meses para ver qué puede ver el público.',
                    question: '¿Es necesario hacer esto?',
                    options: ['Sí, las configuraciones cambian frecuentemente', 'No, con una vez basta', 'Solo después de actualizaciones'],
                    isSecure: true,
                    signals: [],
                    correctAnswer: 'aceptar'
                },
                {
                    id: 5,
                    type: 'scenario',
                    situation: 'Alguien te envía un mensaje directo en Instagram con un enlace: "¡Mira esta foto tuya!"',
                    question: '¿Deberías hacer clic?',
                    options: ['No - probablemente es phishing', 'Sí si es de un amigo', 'Verificar con la persona primero'],
                    isSecure: false,
                    signals: ['Táctica común de phishing', 'Crear curiosidad para hacer clic', 'Cuenta del amigo podría estar comprometida'],
                    correctAnswer: 'revisar-perfil'
                },
                {
                    id: 6,
                    type: 'scenario',
                    situation: 'Activas la autenticación de dos factores en todas tus redes sociales.',
                    question: '¿Mejora tu seguridad?',
                    options: ['Sí, significativamente', 'No, es innecesario', 'Solo en cuentas profesionales'],
                    isSecure: true,
                    signals: [],
                    correctAnswer: 'aceptar'
                },
                {
                    id: 7,
                    type: 'scenario',
                    situation: 'Compartes en Facebook que estarás fuera de la ciudad del 10 al 20 de diciembre.',
                    question: '¿Es esto prudente?',
                    options: ['No - riesgo de seguridad física', 'Sí si solo lo ven amigos cercanos', 'Depende de mi configuración de privacidad'],
                    isSecure: false,
                    signals: ['Información útil para robos', 'Mejor compartir después del viaje', 'Incluso amigos pueden compartir'],
                    correctAnswer: 'rechazar'
                },
                {
                    id: 8,
                    type: 'scenario',
                    situation: 'Limitas quién puede ver tu lista de amigos y la información de tu perfil a "Solo yo".',
                    question: '¿Es esto excesivo?',
                    options: ['No - es una buena práctica', 'Sí - parece sospechoso', 'Depende del contexto'],
                    isSecure: true,
                    signals: [],
                    correctAnswer: 'aceptar'
                },
                {
                    id: 9,
                    type: 'scenario',
                    situation: 'Participas en un "desafío" viral que pide compartir tu primer auto, mascota y calle donde creciste.',
                    question: '¿Deberías participar?',
                    options: ['No - son preguntas de seguridad comunes', 'Sí - es solo diversión', 'Solo con información falsa'],
                    isSecure: false,
                    signals: ['Estas son preguntas típicas de recuperación de cuenta', 'Información útil para ingeniería social', 'Técnica de recolección de datos'],
                    correctAnswer: 'rechazar'
                },
                {
                    id: 10,
                    type: 'scenario',
                    situation: 'Desactivas el etiquetado automático y requieres aprobar cada foto antes de aparecer en tu perfil.',
                    question: '¿Vale la pena el esfuerzo?',
                    options: ['Sí - controlas tu imagen online', 'No - es demasiado trabajo', 'Solo para figuras públicas'],
                    isSecure: true,
                    signals: [],
                    correctAnswer: 'aceptar'
                }
            ]
        };

        return questions[templateId] || [];
    },

    // Calculate results
    calculateResults(answers, questions) {
        const correct = answers.filter((a, i) => a === questions[i].correctAnswer).length;
        const incorrect = answers.length - correct;
        const precision = Math.round((correct / answers.length) * 100);

        return {
            correctAnswers: correct,
            incorrectAnswers: incorrect,
            totalQuestions: answers.length,
            precision: precision,
            answers: answers
        };
    }
};

// Make it globally available
window.SimulationManager = SimulationManager;
window.SIMULATION_TEMPLATES = SIMULATION_TEMPLATES;
