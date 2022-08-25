import React from 'react';
import Container from 'react-bootstrap/Container';
import { Row } from 'react-bootstrap';
import Attraction from '../Attraction/Attraction';
import './Lands.css';

function Name({ name, parkId }) {
  if (name) {
    return (
      <div className="land-name">
        <h1>{name}</h1>
        {parkId === 0 ? 'Parc DisneyLand' : 'Parc Walt Disney Studios'}
      </div>
    );
  }
}

function Lands(props) {
  const {
    name, rides, parkId, updateFavorites,
  } = props;

  const attractions = rides.map((attraction) => (
    <Attraction
      key={attraction.id}
      data={attraction}
      isFavorite={attraction.isFavorite}
      updateFavorites={updateFavorites}
    />
  ));

  if (attractions.length) {
    return (
      <div>
        <Name name={name} parkId={parkId} />
        <Container fluid>
          <Row className="ps-4 pe-4">
            {attractions}
          </Row>
        </Container>
      </div>
    );
  }
}

export default Lands;
