import { useState, SyntheticEvent } from 'react';
import Button from '@mui/material/Button';
import { useGameData } from './gameDataContext.tsx';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const Report = ({ setShowReport }: any) => {
    const [tab, setTab] = useState(0);

    const handleTab = (event: SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    return (
        <>
            <Button variant="outlined" onClick={() => setShowReport(false)}>
                Back
            </Button>
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <Tabs
                    value={tab}
                    onChange={handleTab}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    aria-label="scrollable tabs"
                >
                    <Tab label="Overall" />
                    <Tab label="Charts" />
                </Tabs>
            </Box>
        </>
    );
}

export default Report

