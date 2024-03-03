import Button from '@mui/material/Button';
import { useGameData } from './gameDataContext.tsx';

const AllGames = ({ setShowAllGames }: any) => {
    return (
        <>All Games
            <Button variant="outlined" onClick={() => setShowAllGames(false)}>
                Cancel
            </Button>
        </>
    )
}

export default AllGames

