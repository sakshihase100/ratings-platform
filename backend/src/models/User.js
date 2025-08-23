import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  OWNER: 'OWNER'
};

class User extends Model {}

User.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(60), allowNull: false },
  email: { type: DataTypes.STRING(120), allowNull: false, unique: true, validate: { isEmail: true } },
  passwordHash: { type: DataTypes.STRING(120), allowNull: false },
  address: { type: DataTypes.STRING(400), allowNull: true },
  role: { type: DataTypes.ENUM(...Object.values(ROLES)), allowNull: false, defaultValue: ROLES.USER }
}, { sequelize, modelName: 'User', tableName: 'users' });

export default User;
