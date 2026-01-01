// Simulação de sessão de usuário. 
// Altere 'gestor' para 'atleta' para testar as permissões em todo o sistema.
export const useUserRole = () => {
  return {
    role: 'atleta' as 'gestor' | 'atleta',
    userId: 'user-123-atleta' // ID único para não confirmar para todos
  };
};