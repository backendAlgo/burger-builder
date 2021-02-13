import * as actions from '../action';

const initialState = {
	ingredients: null,
	totalPrice: 4
}

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
}

const ingredients = (state = initialState, action) => {
	switch (action.type) {
		case actions.SET_INGREDIENTS:
			return {
				...state,
				ingredients: action.payload.ingredients
			}
		case actions.ADD_INGREDIENT:
			return {
				...state,
				ingredients: {
					...state.ingredients,
					[action.payload.ingredient]: state.ingredients[action.payload.ingredient] + 1
				},
				totalPrice: state.totalPrice + INGREDIENT_PRICES[action.payload.ingredient]
			}
		case actions.REMOVE_INGREDIENT:
			return {
				...state,
				ingredients: {
					...state.ingredients,
					[action.payload.ingredient]: state.ingredients[action.payload.ingredient] - 1
				},
				totalPrice: state.totalPrice - INGREDIENT_PRICES[action.payload.ingredient]
			}
		default:
			return state;

	}

}

export default ingredients;
