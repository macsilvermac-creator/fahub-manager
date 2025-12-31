// Adicione na Interface de Props
interface AthleteFormProps {
  onSubmit: (data: Omit<Athlete, 'id'>) => void;
  onCancel: () => void;
  initialData?: Athlete | null; // Opcional: se existir, é edição
}

// Dentro do componente, use useEffect para popular o form
export const AthleteForm: React.FC<AthleteFormProps> = ({ onSubmit, onCancel, initialData }) => {
  // Seus estados locais do formulário (ex: name, category...)
  
  useEffect(() => {
    if (initialData) {
      // Popule os estados com os dados de initialData
      setName(initialData.name);
      setCategory(initialData.category);
      // ... outros campos
    } else {
      // Limpe o formulário para modo criação
      setName('');
      setCategory('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // A lógica de submit permanece a mesma, passando os dados
    onSubmit({ name, category /* ... */ });
  };
  
  // ... JSX do formulário
  // Dica: Mude o texto do botão de "Salvar" para "Atualizar" se initialData existir
};