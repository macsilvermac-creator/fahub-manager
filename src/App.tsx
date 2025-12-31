import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [status, setStatus] = useState('Verificando conexão...')

  useEffect(() => {
    async function checkSupabase() {
      // Tenta pegar a sessão atual para ver se a chave é válida
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Erro:', error)
        setStatus('Erro ao conectar com Supabase 🔴 (Olhe o Console)')
      } else {
        console.log('Sucesso:', data)
        setStatus('Conectado ao Supabase com Sucesso! 🟢')
      }
    }

    checkSupabase()
  }, [])

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>Teste de Sistema FAHUB</h1>
      <h2>Status da Conexão:</h2>
      <h3 style={{ color: status.includes('Sucesso') ? 'green' : 'red' }}>
        {status}
      </h3>
    </div>
  )
}

export default App
