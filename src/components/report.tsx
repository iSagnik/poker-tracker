import Button from '@mui/material/Button';
import { useGameData } from './gameDataContext.tsx';

const Report = ({ setShowReport }: any) => {
    return (
        <>Report
            <Button variant="outlined" onClick={() => setShowReport(false)}>
                Cancel
            </Button>
        </>
    )
}

export default Report

