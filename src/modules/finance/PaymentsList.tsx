import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CheckCircle, DollarSign } from 'lucide-react';
import type { Payment, Athlete } from '../../types';

interface PaymentWithAthlete extends Payment {
  athlete: Athlete | null;
}

const PaymentsList = () => {
  const [payments, setPayments] = useState<PaymentWithAthlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          athlete:athletes (name, position)
        `)
        .order('due_date', { ascending: false });

      if (error) throw error;
      setPayments(data as any);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'paid', 
          payment_date: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;
      fetchPayments();
      alert('Pagamento confirmado!');
    } catch (error) {
      alert('Erro ao atualizar pagamento');
    }
  };

  const filteredPayments = payments.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'overdue': return 'Atrasado';
      default: return 'Pendente';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Financeiro</h2>
          <p className="text-slate-500">Gestão de mensalidades e caixa</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
          <DollarSign size={20} />
          Novo Lançamento
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex gap-4">
        {['all', 'paid', 'pending', 'overdue'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              filter === f 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f === 'all' ? 'Todos' : getStatusLabel(f)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-600">Atleta / Descrição</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Valor</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Vencimento</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="p-4 text-sm font-semibold text-slate-600 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Carregando...</td></tr>
              ) : filteredPayments.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Nenhum lançamento encontrado.</td></tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-800">
                        {payment.athlete?.name || 'Lançamento Avulso'}
                      </div>
                      <div className="text-xs text-slate-500">{payment.description}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">
                      R$ {payment.amount}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(payment.due_date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {payment.status !== 'paid' && (
                        <button 
                          onClick={() => handleMarkAsPaid(payment.id)}
                          className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
                        >
                          <CheckCircle size={20} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsList;