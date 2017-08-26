import deepCopy from '../../../util/deepCopy'

import parseInputDataAsync from '../async/data'
import parseInputType from '../type'
import {applyGraph, removeGraph} from '../graph'

/**
 * Parse input until success. (async)
 *
 * @access protected
 * @method parseInputAsync
 *
 * @param {String|Array<String>|Object|Array<Object>} input - The input data
 * @param {Object} [options] - Options
 * @param {Number} [options.maxChainLength=10] - Max. number of parsing iterations before giving up
 * @param {Number} [options.generateGraph=true] - Generate a parsing graph
 *
 * @return {Promise} The parsed input
 */
const parseInputAsync = async (input, {maxChainLength = 10, generateGraph = true} = {}) => {
  let type = parseInputType(input)
  let output = type.match(/^(array|object)\//) ? deepCopy(input) : input

  const graph = [{type, data: input}]

  while (type !== 'array/csl') {
    if (maxChainLength-- <= 0) {
      console.error('[set]', 'Max. number of parsing iterations reached')
      return []
    }

    output = await parseInputDataAsync(output, type)
    type = parseInputType(output)
    graph.push({type})
  }

  return output.map(generateGraph ? entry => applyGraph(entry, graph) : removeGraph)
}

export default parseInputAsync
