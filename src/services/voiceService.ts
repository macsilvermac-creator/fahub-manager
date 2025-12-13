
// Interface explícita para evitar que o TypeScript trave tentando inferir tipos do Window
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

export const voiceService = {
    isSupported: (): boolean => {
        if (typeof window === 'undefined') return false;
        const win = window as unknown as IWindow;
        return !!(win.webkitSpeechRecognition || win.SpeechRecognition);
    },

    listenToCommand: (onResult: (text: string) => void, onError: (error: string) => void) => {
        if (!voiceService.isSupported()) {
            onError("Seu navegador não suporta comandos de voz. Use o Chrome.");
            return;
        }

        try {
            const win = window as unknown as IWindow;
            const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.lang = 'pt-BR';
            recognition.continuous = false; // Importante: false evita loops infinitos
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                console.log('🎤 Escuta iniciada...');
            };

            recognition.onresult = (event: any) => {
                try {
                    const transcript = event.results[0][0].transcript;
                    if (transcript) {
                        onResult(transcript);
                    }
                } catch (e) {
                    console.error("Erro ao processar voz:", e);
                }
            };

            recognition.onerror = (event: any) => {
                // Ignora erro 'no-speech' para não travar a UI com alertas repetidos
                if (event.error !== 'no-speech') {
                    console.warn('Voice error:', event.error);
                    onError(event.error);
                }
            };

            recognition.onend = () => {
                // Limpeza segura
            };

            recognition.start();
        } catch (e: any) {
            console.error("Critical Voice Error:", e);
            onError("Erro interno no reconhecimento de voz.");
        }
    }
};
