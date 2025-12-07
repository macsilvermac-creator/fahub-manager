import { db } from '../firebaseconfig';
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where, getDoc } from 'firebase/firestore';
import { Player, Game, TeamSettings, Transaction } from '../../types';

// Helper to map Firestore docs to our types
const mapDocs = (snapshot: any) => snapshot.docs.map((d: any) => ({ ...d.data(), id: d.id }));

export const firebaseDataService = {
    // --- PLAYERS ---
    syncPlayers: async (players: Player[]) => {
        const batch = players.map(p => setDoc(doc(db, 'players', String(p.id)), p));
        await Promise.all(batch);
    },
    getPlayers: async (): Promise<Player[]> => {
        const snapshot = await getDocs(collection(db, 'players'));
        return mapDocs(snapshot);
    },
    savePlayer: async (player: Player) => {
        await setDoc(doc(db, 'players', String(player.id)), player);
    },

    // --- GAMES ---
    syncGames: async (games: Game[]) => {
        const batch = games.map(g => setDoc(doc(db, 'games', String(g.id)), g));
        await Promise.all(batch);
    },
    getGames: async (): Promise<Game[]> => {
        const snapshot = await getDocs(collection(db, 'games'));
        // Convert timestamps back to Date objects if needed
        return mapDocs(snapshot).map((g: any) => ({
            ...g,
            date: new Date(g.date.seconds ? g.date.seconds * 1000 : g.date)
        }));
    },
    saveGame: async (game: Game) => {
        await setDoc(doc(db, 'games', String(game.id)), game);
    },

    // --- FINANCE ---
    syncTransactions: async (transactions: Transaction[]) => {
        const batch = transactions.map(t => setDoc(doc(db, 'transactions', String(t.id)), t));
        await Promise.all(batch);
    },
    getTransactions: async (): Promise<Transaction[]> => {
        const snapshot = await getDocs(collection(db, 'transactions'));
        return mapDocs(snapshot).map((t: any) => ({
            ...t,
            date: new Date(t.date.seconds ? t.date.seconds * 1000 : t.date)
        }));
    },

    // --- TEAM SETTINGS ---
    saveTeamSettings: async (settings: TeamSettings) => {
        await setDoc(doc(db, 'settings', 'team_config'), settings);
    },
    getTeamSettings: async (): Promise<TeamSettings | null> => {
        const snap = await getDoc(doc(db, 'settings', 'team_config'));
        return snap.exists() ? snap.data() as TeamSettings : null;
    }
};