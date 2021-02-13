import * as actions from '../actions/actionTypes';
import {updateObject} from '../utitlity';

//initial state
const initialState = {
	ingredients: null,
	totalPrice: 4,
	error: false
}

//replace later to get server
const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
}

//reducer functions
const setIngredient = (state, action) => {
	return updateObject(state, {
		ingredients: action.payload.ingredients,
		error: false,
		totalPrice: 4
	});
}

const addIngredient = (state, action) => {
	return updateObject(state, {
		ingredients: {
			...state.ingredients,
			[action.payload.ingredient]: state.ingredients[action.payload.ingredient] + 1
		},
		totalPrice: state.totalPrice
			+ INGREDIENT_PRICES[action.payload.ingredient]
	});
}

const removeIngredient = (state, action) => {
	return updateObject(state, {
		ingredients: {
			...state.ingredients,
			[action.payload.ingredient]: state.ingredients[action.payload.ingredient] - 1
		},
		totalPrice: state.totalPrice - INGREDIENT_PRICES[action.payload.ingredient]
	});
}

const fetchIngredientsFailed = (state, action) => {
	return updateObject(state, {
		error: true
	});
}
//end of reducer functions


//main reducer
const burgerBuilder = (state = initialState, action) => {
	switch (action.type) {
		case actions.SET_INGREDIENTS:
			return setIngredient(state, action);
		case actions.ADD_INGREDIENT:
			return addIngredient(state, action);
		case actions.REMOVE_INGREDIENT:
			return removeIngredient(state, action);
		case actions.FETCH_INGREDIENTS_FAILED:
			return fetchIngredientsFailed(state, action);
		default:
			return state;
	}
}

export default burgerBuilder;
