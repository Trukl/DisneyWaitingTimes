import React, { useEffect, useState } from 'react';
import getQueueTimes from '../../Services/QueueTimes';
import './WaitingTimes.css';
import { FIVE_MINUTES, TabsType } from '../../Utils/constants';
import { getStorageValue } from '../../useLocalStorage';
import Content from './Content/Content';
import Order from './Order/Order';

const getParksLandData = async () => {
  const mainPark = await getQueueTimes(4);
  const secondPark = await getQueueTimes(28);

  return { mainPark: mainPark.lands, secondPark: secondPark.lands };
};

const getLands = async (setLandsData) => {
  const { mainPark, secondPark } = await getParksLandData();

  const landsData = [mainPark, secondPark].flatMap((parkLand, idx) => {
    parkLand.forEach((land) => {
      land.parkId = idx;
      land.rides.forEach((ride) => {
        ride.isFavorite = getStorageValue(ride.id, false);
      });
    });
    return parkLand;
  });
  setLandsData(landsData);
};

const getOnlyFavoritesLands = (landsData, setLands) => {
  const newLandsData = landsData.map((o) => ({ ...o })).filter((land) => {
    land.rides = land.rides.filter((ride) => ride.isFavorite);
    return land.rides.length > 0;
  });

  setLands(newLandsData);
};

const getAlphaOrder = (landsData, setRides, isAscending) => {
  const allRides = landsData.flatMap((land) => land.rides);
  allRides.sort((a, b) => {
    if (isAscending) {
      return a.name > b.name ? 1 : -1;
    }
    return a.name < b.name ? 1 : -1;
  });

  setRides(allRides);
};

const getTimeOrder = (landsData, setRides, isAscending) => {
  const allRides = landsData.flatMap((land) => land.rides).filter((ride) => ride.is_open);
  allRides.sort((a, b) => {
    if (isAscending) {
      return a.wait_time > b.wait_time ? 1 : -1;
    }
    return a.wait_time < b.wait_time ? 1 : -1;
  });

  setRides(allRides);
};

function WaitingTimes() {
  const [landsData, setLandsData] = useState([]);
  const [landsFav, setLandsFav] = useState([]);
  const [ridesAZ, setRidesAZ] = useState([]);
  const [ridesTime, setRidesTime] = useState([]);
  const [currentSelected, setCurrentSelected] = useState('all');
  const [orderAZ, setOrderAZ] = useState(0);
  const [orderTime, setOrderTime] = useState(0);
  const isAscendingAZ = orderAZ % 2 === 0;
  const isAscendingTime = orderTime % 2 === 0;

  useEffect(() => {
    const interval = setInterval(() => getLands(setLandsData), FIVE_MINUTES);

    getLands(setLandsData);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    getOnlyFavoritesLands(landsData, setLandsFav);
    getAlphaOrder(landsData, setRidesAZ, isAscendingAZ);
    getTimeOrder(landsData, setRidesTime, isAscendingTime);
  }, [isAscendingAZ, isAscendingTime, landsData]);

  const updateFavorites = () => setLandsData([...landsData]);

  return (
    <div className="App">
      <header className="App-header" />
      <div>

        <div className="tabs">

          <ul onChange={(e) => setCurrentSelected(e.target.id)}>
            <li title="All" className={currentSelected === TabsType.ALL ? 'checked' : ''}>
              <input type="radio" id={TabsType.ALL} name="tab-control" />
              <label htmlFor={TabsType.ALL} className="button">
                Tous
              </label>
            </li>
            <li title="Favoris" className={currentSelected === TabsType.FAVORITES ? 'checked' : ''}>
              <input type="radio" id={TabsType.FAVORITES} name="tab-control" />
              <label htmlFor={TabsType.FAVORITES} className="button">
                Favoris
              </label>
            </li>
            <li title="A-Z" className={currentSelected === TabsType.A_Z ? 'checked' : ''}>
              <input type="radio" id={TabsType.A_Z} name="tab-control" />
              <label htmlFor={TabsType.A_Z} className="button">
                A-Z
              </label>
            </li>
            <li title="Temps d'attente" className={currentSelected === TabsType.WAITING_TIME ? 'checked' : ''}>
              <input type="radio" id={TabsType.WAITING_TIME} name="tab-control" />
              <label htmlFor={TabsType.WAITING_TIME} className="button">
                Temps
              </label>
            </li>
          </ul>
          <Order
            currentTab={currentSelected}
            isAscending={{
              [TabsType.A_Z]: isAscendingAZ,
              [TabsType.WAITING_TIME]: isAscendingTime,
            }}
            onClick={{
              [TabsType.A_Z]: () => setOrderAZ((c) => c + 1),
              [TabsType.WAITING_TIME]: () => setOrderTime((c) => c + 1),
            }}
          />
        </div>
        <Content
          data={{
            landsData, landsFav, ridesAZ, ridesTime,
          }}
          tabsSelected={currentSelected}
          isAscending={{ isAscendingAZ, isAscendingTime }}
          updateFavorites={updateFavorites}
        />
      </div>
    </div>
  );
}

export default WaitingTimes;
