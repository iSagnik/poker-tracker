import { useState } from 'react';
import { GameType, LimitType } from "../data_model/enums.ts"
import { CashGame } from "../data_model/dataModel.ts"

import styled from 'styled-components';

// Inspired from https://github.com/microsoft/TypeScript/issues/30611#issuecomment-570773496
function getEnumKeys<
    T extends string,
    TEnumValue extends string | number,
>(enumVariable: { [key in T]: TEnumValue }) {
    return Object.keys(enumVariable) as Array<T>;
}

const AddCashGameForm = ({ onCancel }: any) => {
    const [gameType, setGameType] = useState(GameType.TEXAS_HOLD_EM);
    const [stake, setStake] = useState({
        smallBlind: 0,
        bigBlind: 0,
        ante: 0,
    });
    const [limitType, setLimitType] = useState(LimitType.NO_LIMIT);
    const [fixedLimit, setFixedLimit] = useState(0);
    const [location, setLocation] = useState('');
    const [buyIn, setBuyIn] = useState(0);
    const [cashedOut, setCashedOut] = useState(0);
    const [playerCount, setPlayerCount] = useState(0);
    const [date, setDate] = useState(new Date());
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [durationMinutes, setDurationMinutes] = useState(0);
    const [notes, setNotes] = useState('');
    const [showFixedLimit, setShowFixedLimit] = useState(false);

    const handleLimitChange = (event: any) => {
        setLimitType(event.target.value)
        console.log(limitType)
        if (limitType === LimitType.FIXED_LIMIT) {
            console.log("came here")
            setShowFixedLimit(true)
        }
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        let cashGame: CashGame = {
            gameType,
            stake,
            limitType,
            fixedLimit,
            location,
            buyIn,
            cashedOut,
            playerCount,
            date,
            startTime,
            endTime,
            durationMinutes,
            notes
        }
        console.log(cashGame)
    };

    return (
        <>
            <CancelButton onClick={onCancel}>
                Cancel
            </CancelButton>
            <FormContainer onSubmit={handleSubmit}>
                <FormLabel>Game Type</FormLabel>
                <SelectField name="gameType"
                    value={gameType}
                    onChange={(event) => setGameType(event.target.value)}>
                    <option value={GameType.TEXAS_HOLD_EM}>Texas Hold'em Poker</option>
                    <option value={GameType.OMAHA}>Omaha</option>
                    <option value={GameType.HORSE}>Horse</option>
                    <option value={GameType.SEVEN_CARD_STUD}>7 Card Stud</option>
                    <option value={GameType.SEVEN_CARD_STUD_EIGHT}>7 Card Stud 8</option>
                </SelectField>
                <br />
                <StakeFieldsContainer>
                    <FormLabel>Stake</FormLabel>
                    <StakeField>
                        <BlindsLabel htmlFor="smallBlind">Small Blind</BlindsLabel>
                        <FormInput
                            id="smallBlind"
                            name="Stake"
                            value={stake.smallBlind}
                            onChange={(event) => setStake({ smallBlind: Number(event.target.value), bigBlind: stake.bigBlind, ante: stake.ante })}
                            type="number"
                            min="0.0"
                            step="0.01"
                        />
                    </StakeField>
                    <StakeField>
                        <BlindsLabel htmlFor="bigBlind">Big Blind</BlindsLabel>
                        <FormInput
                            id="bigBlind"
                            name="Stake"
                            value={stake.bigBlind}
                            onChange={(event) => setStake({ smallBlind: stake.smallBlind, bigBlind: Number(event.target.value), ante: stake.ante })}
                            type="number"
                            min="0.0"
                            step="0.01"
                        />
                    </StakeField>
                    <StakeField>
                        <BlindsLabel htmlFor="ante">Ante</BlindsLabel>
                        <FormInput
                            id="ante"
                            name="stake"
                            value={stake.ante}
                            onChange={(event) => setStake({ smallBlind: stake.smallBlind, bigBlind: stake.bigBlind, ante: Number(event.target.value) })}
                            type="number"
                            min="0.0"
                            step="0.01"
                        />
                    </StakeField>
                </StakeFieldsContainer>
                <br />
                <FormLabel>Limit Type</FormLabel>
                <SelectField
                    name="limitType"
                    value={limitType}
                    onChange={(event) => handleLimitChange(event)}
                >
                    <option value={LimitType.NO_LIMIT}>No Limit</option>
                    <option value={LimitType.FIXED_LIMIT}>Fixed Limit</option>
                    <option value={LimitType.POT_LIMIT}>Pot Limit</option>
                    <option value={LimitType.POT_LIMIT_PRE}>Pot Limit Preflop</option>
                    <option value={LimitType.MIXED_LIMIT}>Mixed Limit</option>
                    <option value={LimitType.SPREAD_LIMIT}>Spread Limit</option>
                </SelectField>
                <br />
                {showFixedLimit && (
                    <>
                        <FormLabel>Fixed Limit</FormLabel>
                        <FormInput
                            name="fixedLimit"
                            value={fixedLimit}
                            onChange={(event) => setFixedLimit(Number(event.target.value))}
                            type="number"
                            min="0.0"
                            step="0.01"
                        />
                    </>)}
                <br />
                <FormLabel>Location</FormLabel>
                <FormInput
                    name="location"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                />
                <br />
                <FormLabel>Buy In</FormLabel>
                <FormInput
                    name="buyIn"
                    value={buyIn}
                    type="number"
                    onChange={(event) => setBuyIn(Number(event.target.value))}
                    min="0.0"
                    step="0.01"
                />
                <br />
                <FormLabel>Cashed Out</FormLabel>
                <FormInput
                    name="cashedOut"
                    value={cashedOut}
                    onChange={(event) => setCashedOut(Number(event.target.value))}
                    type="number"
                    min="0.0"
                    step="0.01"
                />
                <br />
                <FormLabel>Player Count</FormLabel>
                <FormInput
                    name="playerCount"
                    value={playerCount}
                    onChange={(event) => setPlayerCount(Number(event.target.value))}
                    type="number"
                    min="0.0"
                    max="14"
                    step="1"
                />
                {/* <br />
            <label>Date</label>
            <input
                name="date"
                value={cashGame.date}
                type="date"
                onChange={handleChange}
            />
            <br />
            <label>Start Time</label>
            <input
                name="startTime"
                value={cashGame.startTime}
                type="number"
                onChange={handleChange}
            />
            <br />
            <label>End Time</label>
            <input
                name="endTime"
                value={cashGame.endTime}
                type="number"
                onChange={handleChange}
            /> */}
                <br />
                <FormLabel>Duration (Minutes)</FormLabel>
                <FormInput
                    name="durationMinutes"
                    value={durationMinutes}
                    onChange={(event) => setDurationMinutes(Number(event.target.value))}
                    type="number"
                    min="0.0"
                    step="1"
                />
                <br />
                <FormLabel>Notes</FormLabel>
                <TextArea name="notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
                <br />
                <SubmitButton type="submit">Submit</SubmitButton>
                <br />
                <CancelButton onClick={onCancel}>
                    Cancel
                </CancelButton>
            </FormContainer></>
    )
}

const FormContainer = styled.form`
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  max-width: 600px;
`;

const StakeFieldsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const StakeField = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;


const FormLabel = styled.label`
  display: block;
  font-size: 16px;
  margin-bottom: 5px;
  font-weight: bold;
`;

const BlindsLabel = styled.label`
display: block;
font-size: 16px;
margin-bottom: 5px;
`;

const FormInput = styled.input`
  padding: 5px 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const SelectField = styled.select`
  padding: 5px 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const TextArea = styled.textarea`
  padding: 5px 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  height: 100px;
`;

const SubmitButton = styled.button`
  background-color: #0074d9;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background-color: #ddd;
  color: #555;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default AddCashGameForm;
