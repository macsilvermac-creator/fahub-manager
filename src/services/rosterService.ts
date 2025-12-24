
import { Player } from '../types';
import { firebaseDataService } from './firebaseDataService';

const PLAYERS_KEY = 'gridiron_players';

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
        if (player.cpf && current.some(p => p.cpf === player.cpf)) {
            throw new Error('CPF já cadastrado.');
        }
        
        const updated = [...current, player];
        rosterService.savePlayers(updated);
    },
    
    getAthleteByUserId: (userId: string) => {
        // Mock implementation for linking auth user to athlete profile
        const players = rosterService.getPlayers();
        return players.find(p => p.name.includes('User')) || players[0];
    },

    getAthleteStatsHistory: (playerId: string | number) => {
        return [
            { date: '2023-01-01', ovr: 70 },
            { date: '2023-02-01', ovr: 72 },
            { date: '2023-03-01', ovr: 75 }
        ];
    }
};
