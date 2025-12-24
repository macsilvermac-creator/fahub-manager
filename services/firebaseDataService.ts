import { db } from './firebaseConfig';
import { doc, getDocs, setDoc, collection } from 'firebase/firestore';
import { Player, Game, TeamSettings, Transaction } from '../types';

export const firebaseDataService = {
    syncPlayers: async (players: Player[]) => {
        try {
            const batch = players.map(p => setDoc(doc(db, 'players', String(p.id)), p));
            await Promise.all(batch);
        } catch (e) {
            console.error("Erro ao sincronizar players:", e);
        }
    },
    
    getPlayers: async (): Promise<Player[]> => {
        try {
            const snapshot = await getDocs(collection(db, 'players'));
            return snapshot.docs.map(d => ({ ...d.data(), id: d.id })) as Player[];
        } catch (e) {
            return [];
        }
    },

    syncGames: async (games: Game[]) => {
        try {
            const batch = games.map(g => setDoc(doc(db, 'games', String(g.id)), g));
            await Promise.all(batch);
        } catch (e) {
            console.error("Erro ao sincronizar jogos:", e);
        }
    },

    saveGame: async (game: Game) => {
        try {
            await setDoc(doc(db, 'games', String(game.id)), game);
        } catch (e) {
            console.error("Erro ao salvar jogo:", e);
        }
    },

    syncTransactions: async (transactions: Transaction[]) => {
        try {
            const batch = transactions.map(t => setDoc(doc(db, 'transactions', String(t.id)), t));
            await Promise.all(batch);
        } catch (e) {
            console.error("Erro ao sincronizar transações:", e);
        }
    },

    saveTeamSettings: async (settings: TeamSettings) => {
        try {
            await setDoc(doc(db, 'settings', 'team_config'), settings);
        } catch (e) {
            console.error("Erro ao salvar settings:", e);
        }
    }
};