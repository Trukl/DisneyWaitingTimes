import {useEffect, useRef, useState} from "react";
import {getQueueTimes} from "../../Services/QueueTimes";
import Lands from "../Lands/Lands";
import "./WaitingTimes.css";
import {FIVE_MINUTES, TabsType} from "../../Utils/constants";
import {getStorageValue} from "../../useLocalStorage";
import {BsSortAlphaDown, BsSortAlphaUp, BsSortNumericDown, BsSortNumericUp} from "react-icons/bs";

const getParksLandData = async () => {
  const mainPark = await getQueueTimes(4);
  const secondPark = await getQueueTimes(28);

  return {mainPark: mainPark.lands, secondPark: secondPark.lands};
}

const getLands = async (setLands, setLandsData) => {
  const {mainPark, secondPark} = await getParksLandData();

  const landsData = [mainPark, secondPark].flatMap((parkLand, idx) => {
    parkLand.forEach(land => {
      land.parkId = idx;
      land.rides.forEach(ride => {
        ride.isFavorite = getStorageValue(ride.id, false);
      })
    });
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

const displayAlphaOrder = (landsData, updateFavorites, isAscending) => {
  const allRides = landsData.flatMap(land => land.rides);
  allRides.sort((a,b) => isAscending ? (a.name > b.name ? 1 : -1) : (a.name < b.name ? 1 : -1) );

  return displayAttractions(allRides, updateFavorites);
}

const displayWaitingTime = (landsData, updateFavorites, isAscending) => {
  const allRides = landsData.flatMap(land => land.rides).filter(ride => ride.is_open);
  allRides.sort((a,b) => isAscending ? (a.wait_time > b.wait_time ? 1 : -1) : (a.wait_time < b.wait_time ? 1 : -1));

  return displayAttractions(allRides, updateFavorites);
}

const Content = (props) => {
  const {lands, tabsSelected, isAscending: {isAscendingTime, isAscendingAZ}, updateFavorites} = props;

  switch (tabsSelected) {
    case TabsType.ALL: {
      return displayLands(lands, updateFavorites);
    }
    case TabsType.FAVORITES: {
      return displayLands(lands, updateFavorites);
    }
    case TabsType.A_Z: {
      return displayAlphaOrder(lands, updateFavorites, isAscendingAZ);
    }
    case TabsType.WAITING_TIME: {
      return displayWaitingTime(lands, updateFavorites, isAscendingTime);
    }
    default: {
      throw new Error('Error with tabs.');
    }
  }
}

const Order = (props) => {
  const {isAscending, currentTab, onClick} = props;

  switch (currentTab) {
    case TabsType.A_Z: {
      return (
        <div className={'Order'} onClick={onClick[TabsType.A_Z]}>
          {isAscending[TabsType.A_Z] ? <BsSortAlphaDown />: <BsSortAlphaUp />}
          <span>Trier</span>
        </div>
      );
    }
    case TabsType.WAITING_TIME: {
      return (
        <div className={'Order'} onClick={onClick[TabsType.WAITING_TIME]}>
          {isAscending[TabsType.WAITING_TIME] ? <BsSortNumericDown />: <BsSortNumericUp />}
          <span>Trier</span>
        </div>
      );
    }
    default: {
      return;
    }
  }
}

const WaitingTimes = () => {
  const [lands, setLands] = useState([]);
  const [landsData, setLandsData] = useState([]);
  const [currentSelected, setCurrentSelected] = useState('all');
  const [orderAZ, setOrderAZ] = useState(0);
  const [orderTime, setOrderTime] = useState(0);
  const selected = useRef(currentSelected);
  const isAscendingAZ = orderAZ % 2 === 0;
  const isAscendingTime = orderTime % 2 === 0;

  useEffect(() => {
    const interval = setInterval(() => getLands(setLands, setLandsData), FIVE_MINUTES);

    getLands(setLands, setLandsData);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    selected.current = currentSelected;

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
    if (selected.current === TabsType.FAVORITES) {
      getOnlyFavoritesLands(landsData, setLands)
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
          <Order currentTab={currentSelected}
                 isAscending={{
                   [TabsType.A_Z]: isAscendingAZ,
                   [TabsType.WAITING_TIME]: isAscendingTime
                 }}
                 onClick={{
                   [TabsType.A_Z]: () => setOrderAZ(c => c + 1),
                   [TabsType.WAITING_TIME]: () => setOrderTime(c => c + 1)
                 }}/>
        </div>
        <Content lands={lands} tabsSelected={currentSelected} isAscending={{isAscendingAZ, isAscendingTime}} updateFavorites={updateFavorites} />
      </div>
    </div>
  )
}

export default WaitingTimes;
