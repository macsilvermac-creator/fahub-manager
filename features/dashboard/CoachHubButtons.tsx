
import React from 'react';
import CoachCommandCenter from './CoachCommandCenter';

interface CoachHubButtonsProps {
    setActiveHub: (hub: string) => void;
    setActiveModule: (module: string) => void;
    nextGame: any;
    program: string;
}

const CoachHubButtons: React.FC<CoachHubButtonsProps> = (props) => {
    // Redireciona diretamente para o novo layout visual do Coach
    return <CoachCommandCenter program={props.program} nextGame={props.nextGame} />;
};

export default CoachHubButtons;
