import {useEffect, useState} from "react";
import {getQueueTimes} from "../../Services/QueueTimes";
import Lands from "../Lands/Lands";
import "./WaitingTimes.css";
import {FIVE_MINUTES, TabsType} from "../../Utils/constants";

const getParksLandData = async () => {
  const mainPark = await getQueueTimes(4);
  const secondPark = await getQueueTimes(28);

  return {mainPark: mainPark.lands, secondPark: secondPark.lands};
}

const getLands = async (setLands, setLandsData) => {
  const {mainPark, secondPark} = await getParksLandData();

  const landsData = [mainPark, secondPark].flatMap((parkLand, idx) => {
    parkLand.forEach(land => land.parkId = idx);
    return parkLand;
  })
  setLandsData(landsData);
}

const displayLands = (landsData, updateFavorites) => {
  return landsData.map(land => {
    return <Lands key={land.id} name={land.name} rides={land.rides} parkId={land.parkId} favoriteHandle={updateFavorites} />
  });
}

const displayAttractions = (ridesData, updateFavorites) => {
  return <Lands key={-1} rides={ridesData} favoriteHandle={updateFavorites} />;
}

const getOnlyFavoritesLands = (landsData, setLands) => {
  const newLandsData = landsData.map(o => ({...o})).filter(land => {
    land.rides = land.rides.filter(ride => ride.isFavorite);
    return land.rides.length > 0;
  })
  setLands(newLandsData);
}

const displayAlphaOrder = (landsData, updateFavorites) => {
  const allRides = landsData.flatMap(land => land.rides);
  allRides.sort((a,b) => (a.name > b.name ? 1 : -1));

  return displayAttractions(allRides, updateFavorites);
}

const displayWaitingTime = (landsData, updateFavorites) => {
  const allRides = landsData.flatMap(land => land.rides).filter(ride => ride.is_open);
  allRides.sort((a,b) => (a.wait_time > b.wait_time ? 1 : -1));

  return displayAttractions(allRides, updateFavorites);
}

const Content = (props) => {
  const {lands, tabsSelected, updateFavorites} = props;

  switch (tabsSelected) {
    case TabsType.ALL: {
      return displayLands(lands, updateFavorites);
    }
    case TabsType.FAVORITES: {
      return displayLands(lands, updateFavorites);
    }
    case TabsType.A_Z: {
      return displayAlphaOrder(lands, updateFavorites);
    }
    case TabsType.WAITING_TIME: {
      return displayWaitingTime(lands, updateFavorites);
    }
    default: {
      throw new Error('Error with tabs.');
    }
  }
}

const WaitingTimes = (props) => {
  const [lands, setLands] = useState([]);
  const [landsData, setLandsData] = useState([]);
  const [currentSelected, setCurrentSelected] = useState('all');


  useEffect(() => {
    const interval = setInterval(() => getLands(setLands, setLandsData), FIVE_MINUTES);

    getLands(setLands, setLandsData);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    switch (currentSelected) {
      case TabsType.ALL: {
        return setLands(landsData);
      }
      case TabsType.FAVORITES: {
        return getOnlyFavoritesLands(landsData, setLands);
      }
      case TabsType.A_Z: {
        return setLands(landsData);
      }
      case TabsType.WAITING_TIME: {
        return setLands(landsData);
      }
      default: {
        throw new Error('Error with tabs.');
      }
    }
  }, [landsData, currentSelected])

  const updateFavorites = () => {
    if (currentSelected === TabsType.FAVORITES) {
      return getOnlyFavoritesLands(landsData, setLands)
    }
  }
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className="preload">

        <div className="tabs">

          <ul onChange={e => setCurrentSelected(e.target.id)}>
            <li title="All" className={currentSelected === TabsType.ALL ? 'checked' : ''}>
              <input type="radio" id={TabsType.ALL} name="tab-control" />
              <label htmlFor={TabsType.ALL} role="button">
                Tous
              </label>
            </li>
            <li title="Favoris" className={currentSelected === TabsType.FAVORITES ? 'checked' : ''}>
              <input type="radio" id={TabsType.FAVORITES} name="tab-control" />
              <label htmlFor={TabsType.FAVORITES} role="button">
                Favoris
              </label>
            </li>
            <li title="A-Z" className={currentSelected === TabsType.A_Z ? 'checked' : ''}>
              <input type="radio" id={TabsType.A_Z} name="tab-control" />
              <label htmlFor={TabsType.A_Z} role="button">
                A-Z
              </label>
            </li>
            <li title="Temps d'attente" className={currentSelected === TabsType.WAITING_TIME ? 'checked' : ''}>
              <input type="radio" id={TabsType.WAITING_TIME} name="tab-control" />
              <label htmlFor={TabsType.WAITING_TIME} role="button">
                Temps
              </label>
            </li>
          </ul>
        </div>
        <Content lands={lands} tabsSelected={currentSelected} updateFavorites={updateFavorites} />
      </div>
    </div>
  )
}

export default WaitingTimes;
