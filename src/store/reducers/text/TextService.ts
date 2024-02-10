import { createAsyncThunk } from '@reduxjs/toolkit';
import { textSlice } from './slices/TextSlice';
import $api, { $socket } from '../../../http';

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

export const updateText = createAsyncThunk('update/text', async (_, { dispatch }) => {
  try {
    await $api.post('text/update');
  } catch (e) {
    dispatch(textSlice.actions.textFetchingError('error'));
  }
});
