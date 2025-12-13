
export const voiceService = {
    isSupported: (): boolean => {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    },

    listenToCommand: (onResult: (text: string) => void, onError: (error: string) => void) => {
        if (!voiceService.isSupported()) {
            onError("Navegador não suporta reconhecimento de voz.");
            return;
        }

        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'pt-BR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onResult(transcript);
        };

        recognition.onerror = (event: any) => {
            onError(event.error);
        };

        recognition.start();
    }
};
