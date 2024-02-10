import React, { FC, useEffect, useState } from 'react';
import './MainPage.css';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchUser } from '../../store/reducers/user/UserService';
import { $socket } from '../../http';
import { CheckedSymbol, textSlice } from '../../store/reducers/text/slices/TextSlice';
import { checkSymbols } from '../../store/reducers/text/TextService';
import { EndTextModal } from './../../components/endTextModal/EndTextModal';

interface MainPageProps {
  children?: React.ReactNode;
}

const MainPage: FC<MainPageProps> = () => {
  const dispatch = useAppDispatch();
  const { symbols, checkedSymbols } = useAppSelector(state => state.textReducer);

  const [timer, setTimer] = useState(-1);
  const [time] = useState(15);
  const [modal, setModal] = useState<boolean>(false);

  const [text, setText] = useState('');

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

  useEffect(() => {
    if (timer === 0) {
      setText('');
      setModal(true);
    }
  }, [timer]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(timer !== 0) {
      dispatch(textSlice.actions.removeSymbol(e.target.value));
      setText(e.target.value);

      if (e.target.value.length === 1 && timer === -1) {
        setTimer(time);

        for (let i = time; i >= 1; i--) {
          setTimeout(() => {
            setTimer((sec) => sec - 1);
          }, 1000 * (time - i));
        }
      }

      dispatch(checkSymbols({ symbol: e.target.value[e.target.value.length - 1], index: e.target.value.length - 1 }));
    }
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
      <input
        className='main-input'
        type="text"
        value={text}
        onChange={(e) => {
          handleTyping(e);
        }}
      />
      {timer >= 0 && <div className='timer'>{timer}</div>}
      <div className='result'>
        {timer === 0 && modal &&
          <EndTextModal
            time={time}
            setTimer={setTimer}
            isModal={modal}
            setIsModal={setModal}
          />
        }
      </div>
    </div>
  );
};

export default MainPage;
