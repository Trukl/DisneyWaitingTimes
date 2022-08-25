const FIVE_MINUTES = 1000 * 60 * 5;

const TabsType = {
  ALL: 'all',
  FAVORITES: 'favorites',
  A_Z: 'a-z',
  WAITING_TIME: 'waiting_time',
};

module.exports = Object.freeze({
  FIVE_MINUTES,
  TabsType,
  TabsTypes: Object.values(TabsType),
});
