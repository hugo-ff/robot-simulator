/**
 * @name validateNumber
 * @private
 * @description return if arg is a valid number
 * @param {number} num
 * @returns {boolean}
 * @example validateNumber('gm2challenge') // false
 * @example validateNumber(12) // true
 * @module utils
 */
 export const validateNumber = (num) => typeof num === 'number' && !Number.isNaN(Number(num));

 /**
 * @name validateString
 * @private
 * @description return true or false if arg is a valid string
 * @param {string} str
 * @returns {boolean}
 * @example validateString('') // false
 * @example validateString('gm2challenge') // true
 * @module utils
 */
export const validateString = (str) => !!(typeof str === 'string');

/**
 * @name validateObject
 * @param {object} obj
 * @description return true or false if arg is a valid object
 * @example validateObject('gm2challenge') // false
 * @example validateObject({ x: 0, y: 0, direction: 'north' }) // true
 * @returns {boolean}
 * @module utils
 */
export const validateObject = (obj) => !!(obj && obj.constructor === Object);
