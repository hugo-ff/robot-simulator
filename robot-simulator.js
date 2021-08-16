import { validateNumber, validateString, validateObject } from './utils';

/**
 * @module InvalidInputError
 * @description class to handle Errors related to invalid input data
 */
export class InvalidInputError extends Error {
	constructor(message) {
		super();
		this.name = this.constructor.name;
		this.message = message || 'Invalid input';
	}
}

/**
 * @module Robot
 * @description class to handle Robot actions
 */
export class Robot {
	constructor() {
		this.orientation;
		this.coords;
	}

	static directions = ['north', 'east', 'south', 'west'];

	/**
	 * @function orient
	 * @description method that receives an orientation value and assign it to orientation property
	 * @memberOf Robot
	 * @param {string} orientation
	 * @example orient('north') // this.orientation = 'north'
	 */
	orient(orientation) {
		if(!Robot.directions.includes(orientation))
			throw new InvalidInputError('Must enter a valid orientation');
		this.orientation = orientation;
	}

	/**
	 * @function bearing
	 * @description getter for orientation property data
	 * @memberOf Robot
	 * @return {string} - orientation property value
	 * @example Robot.bearing // 'north'
	 */
	get bearing() {
		return this.orientation;
	}

	/**
	 * @function coordinates
	 * @description getter for coordinates property data
	 * @memberOf Robot
	 * @return {array} - coords property value
	 * @example Robot.coordinates // [0, 0]
	 */
	get coordinates() {
		return this.coords;
	}

	/**
	 * @function turn
	 * @description private method that receives a turn direction and determine the new orientation
	 * @memberOf Robot
	 * @param {string} turnDirection - 'right' or 'left'
	 * @return {function} - calls to orient method with the new orientation as arg
	 * @example turn('right') // this.orient('east')
	 */
	#turn(turnDirection) {
		if (!validateString(turnDirection))
			throw new InvalidInputError('Must enter a valid turn direction');
		const direction = turnDirection === 'right' ? 1 : 3;
		const currentDirectionIndex = Robot.directions.indexOf(this.bearing);
		const newOrientation =
			Robot.directions[(currentDirectionIndex + direction) % Robot.directions.length];
		return this.orient(newOrientation);
	}

	/**
	 * @function turnRight
	 * @memberOf Robot
	 * @description method that calls to 'turn' private method for set a new orientation
	 * @returns {function} - calls to turn private method with the turn direction as arg
	 */
	turnRight() {
		return this.#turn('right');
	}

	/**
	 * @function turnLeft
	 * @memberOf Robot
	 * @description method that calls to 'turn' private method for set a new orientation
	 * @returns {function} - calls to turn private method with the turn direction as arg
	 */
	turnLeft() {
		return this.#turn('left');
	}

	/**
	 * @function at
	 * @memberOf Robot
	 * @description method that receives 'x' and 'y' coords values and assign them to coords property
	 * @param {number} x - this value represents the position between west and east
	 * @param {number} y - this value represents the robot position between north and south
	 * @example at(3, 0) // this.coords = [3, 0]
	 */
	at(x, y) {
		if (!validateNumber(x) || !validateNumber(y))
			throw new InvalidInputError('Must enter valid coordinates');
		this.coords = [x, y];
	}

	/**
	 * @function advance
	 * @memberOf Robot
	 * @description method that contains a switch that take orientation property value and for
	 * every orientation case will modify coords values simulating robot advance
	 * @example switch('north') { case 'north': return this.coords[1]++} // this.coords = [0, 1]
	 */
	advance() {
		switch (this.orientation) {
			case 'north':
				return this.coords[1]++;
			case 'east':
				return this.coords[0]++;
			case 'south':
				return this.coords[1]--;
			case 'west':
				return this.coords[0]--;
			default:
				return this.coords;
		}
	}

	static commands = {
		A: 'advance',
		L: 'turnLeft',
		R: 'turnRight'
	}

	/**
	 * @function instructions
	 * @memberOf Robot
	 * @description static method that receives instructions and returns an array of commands
	 * @param {string} instructions - 'L' for 'turnLeft', 'R' for 'turnRight', 'A' for 'advance'
	 * @returns {array} array of commands based on commands static property
	 * @example instructions('LAAR') // ['turnLeft', 'advance', 'advance', 'turnRight']
	 */
	static instructions(instructions) {
		if (!validateString(instructions) || !/^[ARL]+$/.test(instructions.toUpperCase()))
			throw new InvalidInputError(
				'Must enter a valid instruction command string. Allowed characters are "L", "R" and "A"'
			);

		return [...instructions].map(instruction => Robot.commands[instruction]);
	}

	/**
	 * @function place
	 * @memberOf Robot
	 * @description method that receives a placement object data and set a new positioning
	 * by calling 'at' and 'orient' methods
	 * @param {object} placement - { x, y, direction }
	 * @returns {function} - 'orient' method with direction as argument
	 * @example place({ x: 0, y: 0, direction: 'north' }) // this.at(0, 0); this.orient('north');
	 */
	place(placement) {
		if (!validateObject(placement)) throw new Error('Invalid placement data type');

		if(!Object.keys(placement).length) throw new Error('Placement data must not be empty');

		const { x, y, direction } = placement;

		this.at(x, y);
		return this.orient(direction);
	}

	/**
	 * @function evaluate
	 * @memberOf Robot
	 * @description method that receives an instructions string and for each instruction
	 * calls to the proper method
	 * @param {string} instructions - 'RLAALAL'
	 * @returns {function} - instructionsCommands.forEach(instruction => this\[instruction\]());
	 * @example evaluate('RLA') // this['turnRight'](); this['turnLeft'](); this['advance']();
	 */
	evaluate(instructions) {
		const instructionsCommands = Robot.instructions(instructions);
		return instructionsCommands.forEach(instruction => this[instruction]());
	}
}
