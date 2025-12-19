import { db, storage } from './apiConnection';
import { collection, doc, getDocs, setDoc, query, orderBy, limit, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Player, Game, TeamSettings, Transaction } from '../types';
import { cacheService } from './cacheService';
import { compressImage } from '../utils/imageOptimizer';

const mapDocs = (snapshot: any) => snapshot.docs.map((d: any) => ({ ...d.data(), id: d.id }));

export const firebaseDataService = {
    uploadFile: async (file: File, path: string): Promise<string> => {
        try {
            const optimizedFile = await compressImage(file);
            const storageRef = ref(storage, `${path}/${Date.now()}_${optimizedFile.name}`);
            const snapshot = await uploadBytes(storageRef, optimizedFile);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (e) {
            console.error("Erro no upload:", e);
            throw new Error("Falha ao enviar arquivo para a nuvem.");
        }
    },

    syncPlayers: async (players: Player[]) => {
        try {
            const batch = players.map(p => setDoc(doc(db, 'players', String(p.id)), p));
            await Promise.all(batch);
            cacheService.invalidate('players'); 
        } catch (e) {
            console.error("Erro ao sincronizar players:", e);
        }
    },
    
    getPlayers: async (): Promise<Player[]> => {
        const cached = cacheService.get<Player[]>('players_all');
        if (cached) return cached;

        try {
            const snapshot = await getDocs(collection(db, 'players'));
            const data = mapDocs(snapshot);
            cacheService.set('players_all', data);
            return data;
        } catch (e) {
            console.warn("Firestore offline, usando local.", e);
            return [];
        }
    },
    
    savePlayer: async (player: Player) => {
        await setDoc(doc(db, 'players', String(player.id)), player);
        cacheService.invalidate('players'); 
    },

    syncGames: async (games: Game[]) => {
        const batch = games.map(g => setDoc(doc(db, 'games', String(g.id)), g));
        await Promise.all(batch);
        cacheService.invalidate('games');
    },
    
    getGames: async (): Promise<Game[]> => {
        const cached = cacheService.get<Game[]>('games_all');
        if (cached) return cached;

        try {
            const q = query(collection(db, 'games'), orderBy('date', 'desc'));
            const snapshot = await getDocs(q);
            const data = mapDocs(snapshot).map((g: any) => ({
                ...g,
                date: new Date(g.date.seconds ? g.date.seconds * 1000 : g.date)
            }));
            cacheService.set('games_all', data);
            return data;
        } catch (e) {
            return [];
        }
    },
    
    saveGame: async (game: Game) => {
        await setDoc(doc(db, 'games', String(game.id)), game);
        cacheService.invalidate('games');
    },

    syncTransactions: async (transactions: Transaction[]) => {
        const batch = transactions.map(t => setDoc(doc(db, 'transactions', String(t.id)), t));
        await Promise.all(batch);
        cacheService.invalidate('transactions');
    },
    
    getTransactions: async (): Promise<Transaction[]> => {
        const cached = cacheService.get<Transaction[]>('transactions_all');
        if (cached) return cached;

        try {
            const q = query(collection(db, 'transactions'), orderBy('date', 'desc'), limit(100));
            const snapshot = await getDocs(q);
            const data = mapDocs(snapshot).map((t: any) => ({
                ...t,
                date: new Date(t.date.seconds ? t.date.seconds * 1000 : t.date)
            }));
            cacheService.set('transactions_all', data);
            return data;
        } catch(e) {
            return [];
        }
    },

    saveTeamSettings: async (settings: TeamSettings) => {
        await setDoc(doc(db, 'settings', 'team_config'), settings);
        cacheService.invalidate('settings');
    },
    
    getTeamSettings: async (): Promise<TeamSettings | null> => {
        const cached = cacheService.get<TeamSettings>('settings_config');
        if (cached) return cached;

        try {
            const snap = await getDoc(doc(db, 'settings', 'team_config'));
            if (snap.exists()) {
                const data = snap.data() as TeamSettings;
                cacheService.set('settings_config', data, 10 * 60 * 1000); 
                return data;
            }
            return null;
        } catch (e) {
            return null;
        }
    }
};