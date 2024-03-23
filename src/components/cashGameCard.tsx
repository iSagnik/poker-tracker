import { Fragment } from 'react';
import { LimitType } from "../data_model/enums.ts"
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import {Player } from "../data_model/dataModel.ts"

const CashGameCard = ({ cashGame, showGameCard, setShowGameCard }: any) => {
    const profit: number = cashGame.profit;
    let profitColour = "gray"
    if (profit > 0) {
        profitColour = "green"
    }
    else if (profit < 0) {
        profitColour = "red"
    }

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));

    const style = {
        py: 0,
        width: '100%',
        backgroundColor: 'background.paper',
    };

    return (
        <Fragment>
            <BootstrapDialog
                onClose={() => setShowGameCard(false)}
                aria-labelledby="customized-dialog-title"
                open={showGameCard}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Cash Game Details
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setShowGameCard(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <List sx={style}>
                        <ListItem>
                            <ListItemText primary={new Date(cashGame.date).toDateString()} secondary="Date" />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText primary={cashGame.gameType} secondary="Game Type" />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText primary={cashGame.location} secondary="Location" />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText primary={<Typography variant="h5" style={{ color: profitColour }}>{"$" + profit.toFixed(2)}</Typography>} secondary="Profit" />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText secondary="Stake" primary={"Small blind: $" + cashGame.stake.smallBlind + " | " + "Big blind: $" + cashGame.stake.bigBlind + " | " + "Ante: $" + cashGame.stake.ante} />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText primary={"$" + cashGame.buyIn} secondary="Buy In" />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText primary={"$" + cashGame.cashedOut} secondary="Cashed Out" />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText primary={cashGame.limitType} secondary="Limit Type" />
                        </ListItem>
                        <Divider component="li" />
                        {
                            cashGame.limitType === LimitType.FIXED_LIMIT && (
                                <>
                                    <ListItem>
                                        <ListItemText primary={"$" + cashGame.cashedOut} secondary="Fixed Limit" />
                                    </ListItem>
                                    <Divider component="li" />
                                </>

                            )
                        }
                        <Divider component="li" />
                        <ListItem>
                        <ListItemText primary={"Players"} secondary={cashGame.playerCount} />
                            <List>{cashGame.players.map((player: Player) => (
                                <ListItem key={player.name}>
                                    <ListItemText primary={player.name} />
                                </ListItem>
                            ))}</List>
                            <Divider component="li" />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText primary={cashGame.durationMinutes} secondary="Duration (Minutes)" />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText primary={cashGame.startTime && new Date(cashGame.startTime).toLocaleTimeString()} secondary="Start Time" />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText primary={cashGame.endTime && new Date(cashGame.endTime).toLocaleTimeString()} secondary="End Time" />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText primary={cashGame.notes} secondary="Notes" />
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowGameCard(false)}>
                        Close
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </Fragment>
    );
}

export default CashGameCard