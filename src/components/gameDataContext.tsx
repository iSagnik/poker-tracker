import { createContext, useContext } from 'react';
import { User } from '../data_model/dataModel.ts'
import { getEmptyUserData } from '../util/util.tsx'

interface GameDataContextType {
    gameData: User;
    setGameData: (gameData: User) => void;
}

const GameDataContext = createContext<GameDataContextType>({
    // Default values (to avoid errors before the provider is in place)
    gameData: getEmptyUserData(),
    setGameData: () => { },
});

export const useGameData = () => useContext(GameDataContext);
export default GameDataContext; // You'll need to export this
