import React from 'react';
import './Order.css';
import {
  BsSortAlphaDown, BsSortAlphaUp, BsSortNumericDown, BsSortNumericUp,
} from 'react-icons/bs';
import { TabsType } from '../../../Utils/constants';

function Order(props) {
  const { isAscending, currentTab, onClick } = props;

  switch (currentTab) {
    case TabsType.A_Z: {
      return (
        <div className="Order" role="button" onClick={onClick[TabsType.A_Z]} onKeyDown={onClick[TabsType.A_Z]} tabIndex={0}>
          {isAscending[TabsType.A_Z] ? <BsSortAlphaDown /> : <BsSortAlphaUp />}
          <span>Trier</span>
        </div>
      );
    }
    case TabsType.WAITING_TIME: {
      return (
        <div className="Order" role="button" onClick={onClick[TabsType.WAITING_TIME]} onKeyDown={onClick[TabsType.WAITING_TIME]} tabIndex={0}>
          {isAscending[TabsType.WAITING_TIME] ? <BsSortNumericDown /> : <BsSortNumericUp />}
          <span>Trier</span>
        </div>
      );
    }
    default: {
      return null;
    }
  }
}

export default Order;
