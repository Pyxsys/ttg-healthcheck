// Valid numerical operators other than equal
const validOperators = ['gt', 'gte', 'lt', 'lte']

/**
 * Returns the names of the schema's attrubutes including the embedded schemas.
 *
 * @param {Schema} schema MongoDB Schema
 * @returns an array of the schema attribute names
 */
const getAttributes = (schema) => {
  return Object.values(schema.paths)
    .map((path) =>
      (path.instance === 'Array' || path.instance === 'Embedded') && path.schema
        ? getAttributes(path.schema).map(
            (attrPath) => `${path.path}.${attrPath}`
          )
        : path.path
    )
    .filter((name) => name !== '__v' && name !== '_id')
    .reduce((acc, name) => acc.concat(name), [])
}

/**
 * Parses a query for a given MongoDB schema and returns an array
 * containing a validated query and the option parameters separated.
 *
 * The query will remove any parameters that do not match the schema
 * provided. If a parameter is given in the query but not in the schema,
 * then it will be filtered out. The options will be separated from the
 * query attributes.
 *
 * @param {Object} query Object containing the attributes and options to query
 * @param {Schema} schema MongoDB Schema used to limit the type of attributes
 * @returns the separated valid query and options array
 */
const parseQuery = (query, schema) => {
  const validAttributes = [...getAttributes(schema), 'limit', 'skip', 'orderBy']

  const paramKeyValue = Object.entries(query)
  const validParams = paramKeyValue.reduce((acc, val) => {
    const keyOperator = String(val[0]).split('_')
    const key = keyOperator[0]
    const operator = keyOperator[1] || ''
    const value = validAttributes.includes(key) ? String(val[1]) : null

    if (value) {
      acc[key] = validOperators.includes(operator)
        ? { ...acc[key], [`$${operator}`]: value }
        : value
    }
    return acc
  }, {})

  return splitQuery(validParams)
}

const splitQuery = (query) => {
  const validParams = query
  const options = {}

  if (validParams.limit) {
    options.limit = Number(validParams.limit)
    delete validParams.limit
  }

  if (validParams.skip) {
    options.skip = Number(validParams.skip)
    delete validParams.skip
  }

  if (validParams.orderBy) {
    const orderValue = validParams.orderBy.startsWith('-') ? -1 : 1
    const orderBy =
      orderValue < 0 ? validParams.orderBy.slice(1) : validParams.orderBy
    options.sort = {
      [orderBy]: orderValue,
    }
    delete validParams.orderValue
    delete validParams.orderBy
  } else {
    options.sort = {
      timestamp: -1,
    }
  }
  return [validParams, options]
}

module.exports = { parseQuery, getAttributes }
