
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
            onError("Navegador não suporta comandos de voz. Use o Chrome.");
            return;
        }

        try {
            const win = window as unknown as IWindow;
            const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.lang = 'pt-BR';
            recognition.continuous = false; 
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                onResult(transcript);
            };

            recognition.onerror = (event: any) => {
                if (event.error !== 'no-speech') {
                    onError(event.error);
                }
            };

            recognition.start();
        } catch (e: any) {
            console.error("Critical Voice Error:", e);
            onError("Erro interno no reconhecimento de voz.");
        }
    }
};
