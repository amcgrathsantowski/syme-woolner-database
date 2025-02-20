import { getPaginationParams } from '../utils/index.js';
import { Logger } from '../utils/index.js';

/**
 * Receives an Express request object and a Sequelize model and returns a paginated result
 *
 * @param {Object} query The express request query object from the controller
 * @param {Object} Model The Sequelize model to query
 * @param {Array<Array>} order Optional. The order to sort the results by. Defaults to [['date', 'DESC']]
 * @returns {Object} { rows, count } where rows is an array of the model instances and count is the total number of rows
 */
async function getModelPaginated(query, Model, order = [['date', 'DESC']]) {
  const { limit, offset } = getPaginationParams(query);

  try {
    const { count, rows } = await Model.findAndCountAll({
      order,
      limit,
      offset
    });

    return {
      rows,
      count
    };
  } catch (err) {
    Logger.error(err.message);
    throw new Error('Failed to get paginated model');
  }
}

/**
 * Receives a Sequelize model and an ID and deletes the model with that ID
 * @param {Object} Model The Sequelize model to delete from
 * @param {string | number} id The ID of the model to delete
 * @returns The deleted model
 */
async function deleteModel(Model, id) {
  const model = await Model.findByPk(id);
  if (!model) return null;

  model.destroy();

  return model;
}

export { getModelPaginated, deleteModel };
