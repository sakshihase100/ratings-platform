import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import Store from './Store.js';

class Rating extends Model {}

Rating.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  score: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } }
}, { sequelize, modelName: 'Rating', tableName: 'ratings', indexes: [{ unique: true, fields: ['UserId', 'StoreId'] }] });

User.hasMany(Rating);
Rating.belongsTo(User);

Store.hasMany(Rating);
Rating.belongsTo(Store);

export default Rating;
