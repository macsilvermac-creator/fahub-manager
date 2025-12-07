
import { Game, PracticeSession, CoachGameNote, GameReport, Championship } from '../types';
import { firebaseDataService } from './services/firebaseDataService';

const GAMES_KEY = 'gridiron_games';
const PRACTICE_KEY = 'gridiron_practice';
const COACH_NOTES_KEY = 'gridiron_coach_notes';

// Helper for dates
const dateReviver = (key: string, value: any) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        return new Date(value);
    }
    return value;
};

export const gameService = {
    getGames: (): Game[] => {
        const stored = localStorage.getItem(GAMES_KEY);
        return stored ? JSON.parse(stored, dateReviver) : [];
    },

    saveGames: (games: Game[]) => {
        localStorage.setItem(GAMES_KEY, JSON.stringify(games));
        firebaseDataService.syncGames(games).catch(console.error);
    },

    updateLiveGame: (gameId: number, updates: Partial<Game>) => {
        const games = gameService.getGames();
        const game = games.find(g => g.id === gameId);
        if (game) {
            const updatedGame = { ...game, ...updates };
            const updatedList = games.map(g => g.id === gameId ? updatedGame : g);
            gameService.saveGames(updatedList);
            // Direct update for realtime speed
            firebaseDataService.saveGame(updatedGame).catch(console.error); 
        }
    },

    getPracticeSessions: (): PracticeSession[] => {
        const stored = localStorage.getItem(PRACTICE_KEY);
        return stored ? JSON.parse(stored, dateReviver) : [];
    },

    savePracticeSessions: (p: PracticeSession[]) => {
        localStorage.setItem(PRACTICE_KEY, JSON.stringify(p));
    },

    getCoachGameNotes: (): CoachGameNote[] => {
        const stored = localStorage.getItem(COACH_NOTES_KEY);
        return stored ? JSON.parse(stored, dateReviver) : [];
    },

    saveCoachGameNotes: (n: CoachGameNote[]) => {
        localStorage.setItem(COACH_NOTES_KEY, JSON.stringify(n));
    },

    finalizeGameReport: (gameId: number, report: GameReport, score: string, winner: string) => {
        const games = gameService.getGames();
        const updated = games.map(g => g.id === gameId ? {
            ...g,
            officialReport: report,
            score,
            result: (winner === 'HOME' ? 'W' : winner === 'AWAY' ? 'L' : 'T') as 'W' | 'L' | 'T',
            status: 'FINAL' as const
        } : g);
        gameService.saveGames(updated);
        // Trigger League Update would go here (circular dependency check needed if calling LeagueService)
    },
    
    createChampionship: (name: string, year: number, division: string) => {
        console.log(`Championship Created: ${name}`);
        // Mock logic for now
    },
    
    getChampionships: (): Championship[] => []
};
