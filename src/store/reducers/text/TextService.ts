import { createAsyncThunk } from '@reduxjs/toolkit';
import { textSlice } from './slices/TextSlice';
import { $socket } from '../../../http';

export const checkSymbols = createAsyncThunk(
  'check/symbols',
  async (payload: { symbol: string, index: number }, { dispatch }) => {
    try {
      dispatch(textSlice.actions.textFetching());
      await $socket.emit('typing', {
        symbol: payload.symbol,
        symbolIndex: payload.index
      });
    } catch (error) {
      dispatch(textSlice.actions.textFetchingError('error'));
    }
  });