
export const validators = {
    // Algoritmo oficial de validação de CPF (Mod11)
    isValidCPF: (cpf: string): boolean => {
        if (!cpf) return false;
        
        // Remove caracteres não numéricos
        const cleanCPF = cpf.replace(/[^\d]+/g, '');

        // Verifica tamanho e se todos os dígitos são iguais (ex: 111.111.111-11 é inválido mas passa no calculo)
        if (cleanCPF.length !== 11 || /^(\d)\1+$/.test(cleanCPF)) return false;

        let sum = 0;
        let remainder;

        // Validação do 1º Dígito
        for (let i = 1; i <= 9; i++) {
            sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;

        if ((remainder === 10) || (remainder === 11)) remainder = 0;
        if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

        // Validação do 2º Dígito
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
        }
        remainder = (sum * 10) % 11;

        if ((remainder === 10) || (remainder === 11)) remainder = 0;
        if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

        return true;
    },

    formatCPF: (value: string) => {
        return value
            .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
            .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1'); // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
    }
};
