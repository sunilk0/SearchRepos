import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlucoseReading } from '../../types';

interface GlucoseState {
  readings: GlucoseReading[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GlucoseState = {
  readings: [],
  isLoading: false,
  error: null,
};

const glucoseSlice = createSlice({
  name: 'glucose',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setReadings: (state, action: PayloadAction<GlucoseReading[]>) => {
      state.readings = action.payload;
    },
    addReading: (state, action: PayloadAction<GlucoseReading>) => {
      state.readings.unshift(action.payload);
    },
    removeReading: (state, action: PayloadAction<string>) => {
      state.readings = state.readings.filter((reading) => reading.id !== action.payload);
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setReadings, addReading, removeReading, setError } = glucoseSlice.actions;
export default glucoseSlice.reducer;
