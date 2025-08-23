import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

class Store extends Model {}

Store.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(120), allowNull: true, validate: { isEmail: true } },
  address: { type: DataTypes.STRING(400), allowNull: false },
  ownerId: { type: DataTypes.INTEGER, allowNull: true }
}, { sequelize, modelName: 'Store', tableName: 'stores' });

Store.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

export default Store;
