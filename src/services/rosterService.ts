
import { Player, StaffMember } from '../types';
import { firebaseDataService } from '@/services/firebaseDataService';
import { validators } from '../utils/validators';

const PLAYERS_KEY = 'gridiron_players';
const STAFF_KEY = 'gridiron_staff';

// Helper for dates
const dateReviver = (key: string, value: any) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        return new Date(value);
    }
    return value;
};

export const rosterService = {
    getPlayers: (): Player[] => {
        const stored = localStorage.getItem(PLAYERS_KEY);
        return stored ? JSON.parse(stored, dateReviver) : [];
    },

    savePlayers: (players: Player[]) => {
        localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
        firebaseDataService.syncPlayers(players).catch(console.error);
    },

    registerAthlete: (player: Player) => {
        const current = rosterService.getPlayers();
        // Validations
        if (player.cpf && current.some(p => p.cpf === player.cpf)) throw new Error('CPF já cadastrado.');
        if (player.cpf && !validators.isValidCPF(player.cpf)) throw new Error('CPF Inválido.');

        const newPlayer = { ...player, nationality: player.nationality || 'BRA', teamId: 'ts-1', rosterCategory: 'ACTIVE' as const };
        const updated = [...current, newPlayer];
        
        rosterService.savePlayers(updated);
        firebaseDataService.savePlayer(newPlayer).catch(console.error);
    },

    updatePlayer: (updatedPlayer: Player) => {
        const current = rosterService.getPlayers();
        const updatedList = current.map(p => p.id === updatedPlayer.id ? updatedPlayer : p);
        rosterService.savePlayers(updatedList);
        firebaseDataService.savePlayer(updatedPlayer).catch(console.error);
    },

    getStaff: (): StaffMember[] => {
        const stored = localStorage.getItem(STAFF_KEY);
        return stored ? JSON.parse(stored, dateReviver) : [];
    },

    saveStaff: (s: StaffMember[]) => {
        localStorage.setItem(STAFF_KEY, JSON.stringify(s));
    }
};
