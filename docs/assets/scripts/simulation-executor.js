// ========================================
// AEGIS - Simulation Executor
// ========================================

const SimulationExecutor = {
    currentSimulation: null,
    currentQuestionIndex: 0,
    answers: [],
    startTime: null,
    questionStartTime: null,
    questionTimes: [],

    // Initialize simulation
    init(simulationId) {
        this.currentSimulation = StorageManager.getSimulation(simulationId);

        if (!this.currentSimulation) {
            return null;
        }

        const template = SimulationManager.getTemplate(this.currentSimulation.template);
        const questions = SimulationManager.getQuestions(this.currentSimulation.template);

        this.currentQuestionIndex = 0;
        this.answers = [];
        this.startTime = Date.now();
        this.questionStartTime = Date.now();
        this.questionTimes = [];

        // Update simulation status
        StorageManager.updateSimulation(simulationId, {
            status: 'in-progress',
            progress: 0
        });

        return {
            simulation: this.currentSimulation,
            template: template,
            questions: questions,
            totalQuestions: questions.length
        };
    },

    // Get current question
    getCurrentQuestion(questions) {
        return questions[this.currentQuestionIndex];
    },

    // Record answer
    recordAnswer(answer, questions) {
        const questionTime = Date.now() - this.questionStartTime;
        this.questionTimes.push(questionTime);
        this.answers.push(answer);

        // Move to next question
        this.currentQuestionIndex++;

        // Calculate progress
        const progress = Math.round((this.currentQuestionIndex / questions.length) * 100);

        StorageManager.updateSimulation(this.currentSimulation.id, {
            progress: progress
        });

        // Reset question timer
        this.questionStartTime = Date.now();

        return {
            isComplete: this.currentQuestionIndex >= questions.length,
            progress: progress,
            currentIndex: this.currentQuestionIndex
        };
    },

    // Complete simulation and save results
    complete(questions) {
        const totalTime = Date.now() - this.startTime;
        const totalSeconds = Math.floor(totalTime / 1000);

        // Calculate results
        let correctCount = 0;
        let incorrectCount = 0;

        this.answers.forEach((answer, index) => {
            if (questions[index] && answer === questions[index].correctAnswer) {
                correctCount++;
            } else {
                incorrectCount++;
            }
        });

        const precision = Math.round((correctCount / questions.length) * 100);
        const avgTimePerQuestion = Math.floor(totalSeconds / questions.length);
        const points = correctCount * 100;

        // Category performance (mock data)
        const categories = {
            'Detección de Enlaces': Math.round(Math.random() * 30 + 70),
            'Análisis Del Remitente': Math.round(Math.random() * 30 + 70),
            'Identificación De La Urgencia': Math.round(Math.random() * 30 + 70)
        };

        // Detected signals (mock data)
        const detectedSignals = {
            urgencia: Math.floor(Math.random() * 5 + 1),
            correo: Math.floor(Math.random() * 5 + 1),
            estructura: Math.floor(Math.random() * 5 + 1),
            enlace: Math.floor(Math.random() * 5 + 1)
        };

        const resultData = {
            simulationId: this.currentSimulation.id,
            correctAnswers: correctCount,
            incorrectAnswers: incorrectCount,
            totalQuestions: questions.length,
            precision: precision,
            totalTime: totalSeconds,
            timePerQuestion: avgTimePerQuestion,
            points: points,
            categories: categories,
            detectedSignals: detectedSignals,
            answers: this.answers
        };

        // Save result to storage
        const saveResult = StorageManager.saveResult(resultData);

        return {
            success: saveResult.success,
            resultId: saveResult.result ? saveResult.result.id : null,
            data: resultData
        };
    },

    // Get hints for current question
    getHint(question) {
        // For phishing/malicious/fraudulent/unhealthy questions
        if (question.isPhishing || question.isMalicious || question.isFraudulent || question.isHealthy === false || question.isSecure === false) {
            const signal = question.signals && question.signals.length > 0 ? question.signals[0] : '';

            if (question.type === 'email') {
                return {
                    title: 'Pista',
                    text: signal ? `Revisa cuidadosamente: ${signal}` : 'Verifica el remitente y los enlaces cuidadosamente.'
                };
            } else if (question.type === 'link') {
                return {
                    title: 'Pista',
                    text: signal ? `Señal de alerta: ${signal}` : 'Examina la URL con atención, busca errores o dominios sospechosos.'
                };
            } else if (question.type === 'sms') {
                return {
                    title: 'Pista',
                    text: signal ? `Ten cuidado: ${signal}` : 'Los mensajes legítimos no suelen pedir información urgente por SMS.'
                };
            } else if (question.type === 'website') {
                return {
                    title: 'Pista',
                    text: signal ? `Cuidado con: ${signal}` : 'Verifica el dominio y el certificado de seguridad (HTTPS).'
                };
            } else if (question.type === 'scenario') {
                return {
                    title: 'Pista',
                    text: signal ? `Considera esto: ${signal}` : 'Piensa en las consecuencias de esta acción.'
                };
            }
        }

        // For legitimate/safe questions
        if (question.type === 'email') {
            return {
                title: 'Pista',
                text: 'Este mensaje parece legítimo. Verifica el remitente oficial y el dominio del enlace.'
            };
        } else if (question.type === 'link') {
            return {
                title: 'Pista',
                text: 'Este enlace parece seguro. Verifica que el dominio sea oficial.'
            };
        } else if (question.type === 'sms') {
            return {
                title: 'Pista',
                text: 'Este mensaje parece legítimo. Las empresas confiables envían notificaciones esperadas.'
            };
        } else if (question.type === 'website') {
            return {
                title: 'Pista',
                text: 'Este sitio parece seguro. Tiene certificado HTTPS válido y dominio oficial.'
            };
        } else if (question.type === 'scenario') {
            return {
                title: 'Pista',
                text: 'Piensa en los beneficios de esta práctica para tu salud digital y privacidad.'
            };
        }

        return {
            title: 'Pista',
            text: 'Analiza cuidadosamente todos los detalles antes de tomar una decisión.'
        };
    },

    // Analyze answer
    analyzeAnswer(userAnswer, question) {
        const isCorrect = userAnswer === question.correctAnswer;

        return {
            isCorrect: isCorrect,
            correctAnswer: question.correctAnswer,
            signals: question.signals || [],
            explanation: isCorrect
                ? '¡Correcto! Identificaste correctamente esta amenaza.'
                : 'Incorrecto. ' + (question.isPhishing || question.isMalicious ? 'Este era un caso de phishing.' : 'Este mensaje era legítimo.')
        };
    }
};

// Make it globally available
window.SimulationExecutor = SimulationExecutor;
