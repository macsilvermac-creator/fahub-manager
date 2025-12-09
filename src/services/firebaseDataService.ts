
import { db, storage } from './apiConnection';
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where, getDoc, limit, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Player, Game, TeamSettings, Transaction } from '../types';
import { cacheService } from './cacheService';
import { compressImage } from '../utils/imageOptimizer';

// Helper to map Firestore docs to our types
const mapDocs = (snapshot: any) => snapshot.docs.map((d: any) => ({ ...d.data(), id: d.id }));

export const firebaseDataService = {
    // --- STORAGE (ARQUIVOS) ---
    uploadFile: async (file: File, path: string): Promise<string> => {
        try {
            // OTIMIZAÇÃO #4: Compressão automática antes do upload
            // Reduz imagens > 5MB para ~300KB
            const optimizedFile = await compressImage(file);

            // Otimização: Adicionar timestamp para evitar colisão e cache do navegador em imagens antigas
            const storageRef = ref(storage, `${path}/${Date.now()}_${optimizedFile.name}`);
            
            const snapshot = await uploadBytes(storageRef, optimizedFile);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (e) {
            console.error("Erro no upload:", e);
            throw new Error("Falha ao enviar arquivo para a nuvem.");
        }
    },

    // --- PLAYERS ---
    syncPlayers: async (players: Player[]) => {
        try {
            const batch = players.map(p => setDoc(doc(db, 'players', String(p.id)), p));
            await Promise.all(batch);
            cacheService.invalidate('players'); // Limpa cache pois dados mudaram
        } catch (e) {
            console.error("Erro ao sincronizar players:", e);
        }
    },
    
    getPlayers: async (): Promise<Player[]> => {
        // 1. Tenta pegar do Cache
        const cached = cacheService.get<Player[]>('players_all');
        if (cached) return cached;

        try {
            // 2. Se não tiver, busca no Firebase
            // Otimização: Buscar apenas jogadores ativos ou limitar se a lista for gigante (futuro)
            const snapshot = await getDocs(collection(db, 'players'));
            const data = mapDocs(snapshot);
            
            // 3. Salva no Cache
            cacheService.set('players_all', data);
            return data;
        } catch (e) {
            console.warn("Firestore offline ou sem permissão, usando local.", e);
            return [];
        }
    },
    
    savePlayer: async (player: Player) => {
        await setDoc(doc(db, 'players', String(player.id)), player);
        cacheService.invalidate('players'); // Força recarga na próxima leitura
    },

    // --- GAMES ---
    syncGames: async (games: Game[]) => {
        const batch = games.map(g => setDoc(doc(db, 'games', String(g.id)), g));
        await Promise.all(batch);
        cacheService.invalidate('games');
    },
    
    getGames: async (): Promise<Game[]> => {
        const cached = cacheService.get<Game[]>('games_all');
        if (cached) return cached;

        try {
            // Otimização: Ordenar por data para garantir consistência
            const q = query(collection(db, 'games'), orderBy('date', 'desc')); // Pega os mais recentes primeiro
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

    // --- FINANCE ---
    syncTransactions: async (transactions: Transaction[]) => {
        const batch = transactions.map(t => setDoc(doc(db, 'transactions', String(t.id)), t));
        await Promise.all(batch);
        cacheService.invalidate('transactions');
    },
    
    getTransactions: async (): Promise<Transaction[]> => {
        const cached = cacheService.get<Transaction[]>('transactions_all');
        if (cached) return cached;

        try {
            // Otimização: Limitar a 100 últimas transações para não travar o dashboard
            // MELHORIA #1 (Parcial): Já preparamos o terreno para paginação limitando a query
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

    // --- TEAM SETTINGS ---
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
                cacheService.set('settings_config', data, 10 * 60 * 1000); // Cache maior (10 min) para configs
                return data;
            }
            return null;
        } catch (e) {
            return null;
        }
    }
};
