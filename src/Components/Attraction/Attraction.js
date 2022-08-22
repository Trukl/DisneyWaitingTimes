import './Attraction.css'
import {Col} from "react-bootstrap";
import {MdFavorite, MdFavoriteBorder} from "react-icons/md";
import {useLocalStorage} from "../../useLocalStorage";
import {CSSTransition} from 'react-transition-group';
import {useEffect, useState} from "react";

const getDurationClass = (time) => {
  if (time < 30) {
    return 'Green';
  } else if (time < 60) {
    return 'Orange';
  }
  return 'Red';
}

const Attraction = (props) => {
  const {name, waitingTime, isOpen} = props;
  const [isFavorite, setIsFavorite] = useLocalStorage(name, false);
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const elem = document.getElementsByClassName("preload")[0];
    if (elem) {
      const t = setTimeout(() => elem.classList.remove("preload"), 1000);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <Col lg={4} s={1} xs={12} md={6} className={`mb-2 p-2`} >
      <div className={`Attraction ${getDurationClass(waitingTime)} ${isOpen ? 'Open' : 'Closed'}`}>
        <div className={'FlexNormal'}>
          <div className={'WaitingTime'}>{waitingTime}</div>
          <div className={'Name'}>{name}</div>
        </div>
        <div>
          {!isOpen ? <span className={'IsClosed'}>Fermé </span> : ''}
          <span
            className={'Favorite'}
            onClick={() => {
              setAnimated(1);
              setTimeout(() => setIsFavorite(!isFavorite), 300)
            }}
            onAnimationEnd={() => {setAnimated(0)}}
            animated={animated}
          >
            {isFavorite ? <MdFavorite /> : <MdFavoriteBorder/>}
          </span>
        </div>

      </div>

    </Col>
  )
}

export default Attraction;
