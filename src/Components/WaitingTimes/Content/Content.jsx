import React from 'react';
import './Content.css';
import { MdFavoriteBorder } from 'react-icons/md';
import { TabsType } from '../../../Utils/constants';
import Lands from '../../Lands/Lands';

const displayLands = (landsData, updateFavorites) => {
  if (landsData.length) {
    return landsData.map((land) => (
      <Lands
        key={land.id}
        name={land.name}
        rides={land.rides}
        parkId={land.parkId}
        updateFavorites={updateFavorites}
      />
    ));
  }
  return null;
};

const displayAttractions = (ridesData, updateFavorites) => (
  <Lands key={-1} rides={ridesData} updateFavorites={updateFavorites} />
);

function Content(props) {
  const {
    data: {
      landsData, landsFav, ridesAZ, ridesTime,
    }, tabsSelected, updateFavorites,
  } = props;

  switch (tabsSelected) {
    case TabsType.ALL: {
      return displayLands(landsData, updateFavorites);
    }
    case TabsType.FAVORITES: {
      return displayLands(landsFav, updateFavorites) || (
        <div className="no-fav">
          <p>
            Vous n'avez aucun favoris. Pour en ajouter appuyez sur le
            {' '}
            <MdFavoriteBorder />
            {' '}
            à coté du nom de l'attraction.
          </p>
        </div>
      );
    }
    case TabsType.A_Z: {
      return displayAttractions(ridesAZ, updateFavorites);
    }
    case TabsType.WAITING_TIME: {
      return displayAttractions(ridesTime, updateFavorites);
    }
    default: {
      throw new Error('Error with tabs.');
    }
  }
}

export default Content;
