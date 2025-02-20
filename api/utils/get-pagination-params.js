/**
 * Expects to have a <page> and <page_size> query parameter
 *
 * @param {Object} query The express request query object from the controller
 * @returns {object} An object containing the limit and offset for pagination
 */
export default function getPaginationParams(query) {
  const { page, page_size } = query;
  let limit = parseInt(page_size) || 10;
  const offset = limit * parseInt(page) || 0;

  if (limit < 1 || limit > 100) {
    limit = 10;
  }

  return { limit, offset };
}
