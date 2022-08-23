import './Attraction.css'
import {Col} from "react-bootstrap";
import {MdFavorite, MdFavoriteBorder} from "react-icons/md";
import {useLocalStorage} from "../../useLocalStorage";
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
  const {favoriteHandle, data} = props;
  const {name, 'wait_time': waitingTime, 'is_open': isOpen, id} = data;
  const [isFavorite, setIsFavorite] = useLocalStorage(id, false);
  const [animated, setAnimated] = useState(0);
  props.data.isFavorite = isFavorite

  useEffect(() => {
    const elem = document.getElementsByClassName("preload")[0];
    if (elem) {
      const t = setTimeout(() => elem.classList.remove("preload"), 1000);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    props.data.isFavorite = isFavorite
    favoriteHandle();
  }, [favoriteHandle, isFavorite, props.data]);
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
