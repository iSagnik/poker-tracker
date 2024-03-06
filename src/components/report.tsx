import { useState, SyntheticEvent } from 'react';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import GameStatsCard from './gameStats.tsx'
import Charts from './charts.tsx'
import Typography from '@mui/material/Typography';

const Report = ({ setShowReport }: any) => {
    const [tab, setTab] = useState(0);

    const handleTab = (event: SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }

    const CustomTabPanel = (props: TabPanelProps) => {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        {children}
                    </Box>
                )}
            </div>
        );
    }

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
                    <Tab label="Overall" value={0} />
                    <Tab label="Charts" value={1} />
                </Tabs>
            </Box>
            <CustomTabPanel value={tab} index={0}><GameStatsCard /></CustomTabPanel>
            <CustomTabPanel value={tab} index={1}><Charts /></CustomTabPanel>
        </>
    );
}

export default Report

