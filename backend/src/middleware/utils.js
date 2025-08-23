import Rating from '../models/Rating.js';
import { fn, col } from 'sequelize';

export async function getStoreAverage(storeId) {
  const result = await Rating.findAll({
    where: { StoreId: storeId },
    attributes: [[fn('AVG', col('score')), 'avg']]
  });
  const avg = result?.[0]?.get('avg');
  return avg ? Number(avg).toFixed(2) : '0.00';
}
