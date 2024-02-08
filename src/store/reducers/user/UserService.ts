import $api from '../../../http';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { userSlice } from './slices/UserSlice';
import { IUser } from '../../../models/user/IUser';
import { textSlice } from '../text/slices/TextSlice';


export const fetchUser = createAsyncThunk('auth/access-token', async (_, { dispatch }) => {
  try {
    dispatch(userSlice.actions.userFetching());
    const response = await $api.get<IUser>('user');
    console.log(response.data);

    dispatch(userSlice.actions.userFetchingSuccess(response.data));
    dispatch(textSlice.actions.textFetchingSuccess(response.data.currentText[0].text));
  } catch (e) {
    dispatch(userSlice.actions.userFetchingError('error'));
  }
});
