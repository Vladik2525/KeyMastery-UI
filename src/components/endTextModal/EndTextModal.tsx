import { FC, useEffect, useState } from 'react';
import './EndTextModal.css';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { textSlice } from '../../store/reducers/text/slices/TextSlice';
import { updateText } from '../../store/reducers/text/TextService';

interface Props {
  time: number
  isModal: boolean
  setIsModal: (value: boolean) => void
  setTimer: (value: number) => void
}

export const EndTextModal: FC<Props> = (props) => {

  const dispatch = useAppDispatch();
  const { checkedSymbols } = useAppSelector(state => state.textReducer);

  const [WPM, setWPM] = useState(0);


  const roundedWPM = ( WPM / 5 * 60 / props.time).toFixed(1);

  const handleRepeat = () => {
    props.setTimer(-1);
    props.setIsModal(false);
    dispatch(textSlice.actions.cleanCheckedSymbols());
  };

  const handleNext = () => {
    dispatch(updateText());
    window.location.reload();
  };

  useEffect(() => {
    checkedSymbols.forEach(symbol => {
      if(symbol.currentSymbol) {
        setWPM(wpm => wpm + 1);
      }
    });
  }, []);

  return (
    <>
      {props.isModal &&
        <div className='end-text-modal-background' onClick={() => props.setIsModal(false)}>
          <div onClick={e => e.stopPropagation()} className='end-text-modal'>
            <div>{roundedWPM}</div>
            <div className='end-text-modal-buttons'>
              <button onClick={handleRepeat}>repeat</button>
              <button onClick={handleNext}>next</button>
            </div>
          </div>
        </div>
      }
    </>
  );
};
