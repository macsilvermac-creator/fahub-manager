
import { Player, StaffMember } from '../types';
import { firebaseDataService } from './firebaseDataService';
import { validators } from '../utils/validators';

const PLAYERS_KEY = 'gridiron_players';
const STAFF_KEY = 'gridiron_staff';

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
        if (player.cpf && current.some(p => p.cpf === player.cpf)) throw new Error('CPF já cadastrado.');
        if (player.cpf && !