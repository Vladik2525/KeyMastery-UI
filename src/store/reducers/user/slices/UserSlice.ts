import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../../../models/user/IUser';

interface UserState {
    user: IUser
    isLoading: boolean
    error: string
}

const initialState : UserState = {
  user: {} as IUser,
  isLoading: false,
  error: ''
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userFetching(state) {
      state.isLoading = true;
    },
    userFetchingSuccess(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      state.isLoading = false;
      state.error = '';
    },
    userFetchingError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  }
});

export default userSlice.reducer;