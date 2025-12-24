
import React, { useState } from 'react';
import Modal from './Modal';
import { paymentService } from '../services/paymentService';
import { CreditCardIcon, QrcodeIcon, CheckCircleIcon } from './icons/UiIcons';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  description: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, amount, description }) => {
  const [method, setMethod] = useState<'PIX' | 'CARD' | null>(null);
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{ qrCodeImage: string; copyPasteCode: string } | null>(null);
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSelectPix = async () => {
    setMethod('PIX');
    setLoading(true);
    const data = await paymentService.generatePix(amount, description);
    setPixData(data);
    setLoading(false);
    
    // Simulate user paying after 5 seconds
    setTimeout(() => {
        handlePaymentSuccess();
    }, 5000);
  };

  const handlePayCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
        await paymentService.processCreditCard(cardData, amount);
        handlePaymentSuccess();
    } catch (err: any) {
        setError(err.message || 'Erro ao processar cartão.');
        setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
          onSuccess();
          // Reset state after close
          setTimeout(() => {
              setMethod(null);
              setSuccess(false);
              setPixData(null);
          }, 500);
      }, 2000);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gridiron Pay: Checkout Seguro" maxWidth="max-w-md">
      {success ? (
          <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <CheckCircleIcon className="w-20 h-20 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-white">Pagamento Confirmado!</h3>
              <p className="text-text-secondary">Sua transação foi processada com sucesso.</p>
          </div>
      ) : (
          <div className="space-y-6">
            <div className="bg-secondary/40 p-4 rounded-lg border border-white/5 flex justify-between items-center">
                <span className="text-sm text-text-secondary">{description}</span>
                <span className="text-xl font-bold text-white">{formatCurrency(amount)}</span>
            </div>

            {!method && (
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={handleSelectPix}
                        className="flex flex-col items-center justify-center p-6 bg-secondary hover:bg-white/5 border border-white/10 rounded-xl transition-all hover:border-highlight"
                    >
                        <QrcodeIcon className="w-10 h-10 text-highlight mb-2" />
                        <span className="font-bold text-white">PIX</span>
                        <span className="text-xs text-text-secondary text-center mt-1">Aprovação Imediata</span>
                    </button>
                    <button 
                        onClick={() => setMethod('CARD')}
                        className="flex flex-col items-center justify-center p-6 bg-secondary hover:bg-white/5 border border-white/10 rounded-xl transition-all hover:border-highlight"
                    >
                        <CreditCardIcon className="w-10 h-10 text-cyan-400 mb-2" />
                        <span className="font-bold text-white">Cartão de Crédito</span>
                        <span className="text-xs text-text-secondary text-center mt-1">Até 12x</span>
                    </button>
                </div>
            )}

            {method === 'PIX' && pixData && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-center bg-white p-4 rounded-lg">
                        <img src={pixData.qrCodeImage} alt="QR Code PIX" className="w-48 h-48" />
                    </div>
                    <div>
                        <label className="text-xs text-text-secondary font-bold uppercase mb-1 block">Pix Copia e Cola</label>
                        <div className="flex gap-2">
                            <input readOnly value={pixData.copyPasteCode} className="flex-1 bg-black/20 border border-white/10 rounded p-2 text-xs text-text-secondary" />
                            <button onClick={() => navigator.clipboard.writeText(pixData.copyPasteCode)} className="bg-highlight px-3 rounded text-white text-xs font-bold">Copiar</button>
                        </div>
                    </div>
                    <div className="text-center text-xs text-text-secondary animate-pulse">
                        Aguardando pagamento...
                    </div>
                    <button onClick={() => setMethod(null)} className="w-full text-text-secondary hover:text-white text-xs mt-2">Voltar</button>
                </div>
            )}

            {method === 'CARD' && (
                <form onSubmit={handlePayCard} className="space-y-4 animate-fade-in">
                    <div>
                        <label className="text-xs text-text-secondary font-bold uppercase mb-1 block">Número do Cartão</label>
                        <input required placeholder="0000 0000 0000 0000" className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-highlight focus:outline-none" value={cardData.number} onChange={e => setCardData({...cardData, number: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-text-secondary font-bold uppercase mb-1 block">Validade</label>
                            <input required placeholder="MM/AA" className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-highlight focus:outline-none" value={cardData.expiry} onChange={e => setCardData({...cardData, expiry: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary font-bold uppercase mb-1 block">CVV</label>
                            <input required placeholder="123" className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-highlight focus:outline-none" value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value})} />
                        </div>
                    </div>
                    <div>
                         <label className="text-xs text-text-secondary font-bold uppercase mb-1 block">Nome no Cartão</label>
                         <input required placeholder="JOAO DA SILVA" className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-highlight focus:outline-none" value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value})} />
                    </div>

                    {error && <p className="text-red-400 text-xs text-center">{error}</p>}

                    <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg disabled:opacity-50">
                        {loading ? 'Processando...' : `Pagar ${formatCurrency(amount)}`}
                    </button>
                    <button type="button" onClick={() => setMethod(null)} className="w-full text-text-secondary hover:text-white text-xs mt-2">Voltar</button>
                </form>
            )}
          </div>
      )}
    </Modal>
  );
};

export default PaymentModal;
