const sequelize = require('../config/database');
const User = require('./useModel');
const Store = require('./storeModel');
const Rating = require('./ratingModel');

User.hasMany(Rating, { foreignKey: 'user_id', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Store.hasMany(Rating, { foreignKey: 'store_id', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
User.hasOne(Store, { foreignKey: 'owner_id', as: 'ownedStore' });

module.exports = {
  sequelize,
  User,
  Store,
  Rating
};