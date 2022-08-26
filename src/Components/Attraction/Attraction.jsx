import './Attraction.css';
import { Col } from 'react-bootstrap';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import React, { useState } from 'react';
import { useLocalStorage } from '../../Utils/useLocalStorage';

const getDurationClass = (time) => {
  if (time < 30) {
    return 'Green';
  } if (time < 60) {
    return 'Orange';
  }
  return 'Red';
};

function Attraction(props) {
  const { updateFavorites, data } = props;
  const {
    name, wait_time: waitingTime, is_open: isOpen, id,
  } = data;
  const [isFavoriteStorage, setIsFavoriteStorage] = useLocalStorage(id, false);
  const [isFavorite, setIsFavorite] = useState(isFavoriteStorage);
  const [animated, setAnimated] = useState(0);

  const handleFavoriteClick = () => {
    setAnimated(1);

    setIsFavoriteStorage(!isFavorite);
    setTimeout(() => {
      setIsFavorite(!isFavorite);
      data.isFavorite = !isFavorite;
      updateFavorites();
    }, 300);
  };

  return (
    <Col lg={4} s={1} xs={12} md={6} className="mb-2 p-2">
      <div className={`Attraction ${getDurationClass(waitingTime)} ${isOpen ? 'Open' : 'Closed'}`}>
        <div className="FlexNormal">
          <div className="WaitingTime">{waitingTime}</div>
          <div className="Name">{name}</div>
        </div>
        <div>
          {!isOpen ? <span className="IsClosed">Fermé </span> : ''}
          <span
            className="Favorite"
            role="button"
            onClick={handleFavoriteClick}
            onKeyDown={handleFavoriteClick}
            onAnimationEnd={() => { setAnimated(0); }}
            animated={animated}
            tabIndex={0}
          >
            {isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}
          </span>
        </div>

      </div>

    </Col>
  );
}

export default Attraction;
