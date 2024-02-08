import React, { FC, useEffect, useState } from 'react';
import './MainPage.css';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchUser } from '../../store/reducers/user/UserService';
import { $socket } from '../../http';
import { CheckedSymbol, textSlice } from '../../store/reducers/text/slices/TextSlice';
import { checkSymbols } from '../../store/reducers/text/TextService';

interface MainPageProps {
  children?: React.ReactNode;
}

const MainPage: FC<MainPageProps> = () => {
  const dispatch = useAppDispatch();
  const { symbols, checkedSymbols } = useAppSelector(state => state.textReducer);

  const [timer, setTimer] = React.useState(-1);

  useEffect(() => {
    dispatch(fetchUser());
    console.log(localStorage.getItem('accessToken'));
  }, []);

  useEffect(() => {
    const handleTyping = (data: CheckedSymbol) => {
      dispatch(textSlice.actions.checkSymbol(data));
    };

    $socket.on('typing', handleTyping);
    return () => {
      $socket.removeListener('typing', handleTyping);
    };
  }, []);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(timer !== 0) {
      dispatch(textSlice.actions.removeSymbol(e.target.value));

      if (e.target.value.length === 1 && timer === -1) {
        setTimer(16);

        for (let i = 15; i >= 0; i--) {
          setTimeout(() => {
            setTimer((sec) => sec - 1);
          }, 1000 * (15 - i));
        }
      }

      dispatch(checkSymbols({ symbol: e.target.value[e.target.value.length - 1], index: e.target.value.length - 1 }));
    }
  };

  const [text, setText] = useState('hello');

  const handleEdit = (event) => {
    setText(event.target.textContent);
  };

  const handleSave = () => {
    console.log(2345678);

  };

  return (
    <div className='main'>
      <div className='main-text'>
        {symbols && symbols.map((symbol, index) => {
          if (symbol === ' ') return <p key={index}>&nbsp;</p>;
          return (
            <p key={index} style={{ color:
              index ===  checkedSymbols[index]?.symbolIndex && true === checkedSymbols[index]?.currentSymbol ? 'green' :
                index ===  checkedSymbols[index]?.symbolIndex && false === checkedSymbols[index]?.currentSymbol ? 'red' :
                  'black' }}>
              {symbol}
            </p>
          );
        })}
      </div>
      <div contentEditable onInput={handleEdit}>
        {text}
        <button onClick={handleSave}>Save</button>
      </div>
      <input
        className='main-input'
        type="text"
        onChange={(e) => {
          handleTyping(e);
        }}
      />
      {timer >= 0 && <div className='timer'>{timer}</div>}
      {timer === 0 && <div className='result'>{checkedSymbols.length / 5 * 4}</div>}
    </div>
  );
};

export default MainPage;
