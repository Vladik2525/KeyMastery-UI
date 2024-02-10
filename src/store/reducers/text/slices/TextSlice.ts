import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { checkSymbols } from '../TextService';

export interface CheckedSymbol {
    symbol: string
    symbolIndex: number
    currentSymbol: boolean
}

interface TextState {
    checkedSymbols: CheckedSymbol[]
    symbols: string[]
    isLoading: boolean
    error: string
}

const initialState : TextState = {
  checkedSymbols: [],
  symbols: [],
  isLoading: false,
  error: ''
};

export const textSlice = createSlice({
  name: 'text',
  initialState,
  reducers: {
    textFetching(state) {
      state.isLoading = true;
    },
    textFetchingSuccess(state, action: PayloadAction<string[]>) {
      state.symbols = action.payload;
      state.isLoading = false;
      state.error = '';
    },
    textFetchingError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },

    checkSymbol(state, action: PayloadAction<CheckedSymbol>) {
      state.checkedSymbols.push(action.payload);
    },
    removeSymbol(state, action: PayloadAction<string>) {
      const array = action.payload.split('');
      const newCheckedSymbols: CheckedSymbol[] = [];

      array.forEach((symbol, index) => {
        const existingSymbol = state.checkedSymbols.find(
          (checkedSymbol) => checkedSymbol.symbol === symbol && checkedSymbol.symbolIndex === index
        );

        if (existingSymbol && !newCheckedSymbols.some((newSymbol) => newSymbol.symbol === symbol && newSymbol.symbolIndex === index)) {
          newCheckedSymbols.push(existingSymbol);
        }
      });

      state.checkedSymbols = newCheckedSymbols;
    },
    cleanCheckedSymbols(state) {
      state.checkedSymbols = [];
    }

  }
});

export default textSlice.reducer;