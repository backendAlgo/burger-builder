import React, {Component} from 'react';
import {connect} from 'react-redux';

import AuxComponent from '../../hoc/AuxComponent/AuxComponent';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/withErrorHandler';
import * as actions from '../../store/action';

class BurgerBuilder extends Component {

	state = {
		purchasing: false,
		loading: false,
		error: null
	}

	componentDidMount() {
		axios.get('/ingredients.json')
			.then(response => {
				this.props.setNewIngredients(response.data);
			})
			.catch(error => this.setState({error: true}))
	}

	updatePurchaseState(ingredients) {
		const sum = Object.keys(ingredients)
			.map(e => {
				return ingredients[e];
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);
		return sum > 0;
	}

	purchaseHandler = () => {
		this.setState({purchasing: true});
	}

	purchaseCancelHandler = () => {
		this.setState({purchasing: false});
	}
	purchaseContinueHandler = () => {
		this.props.history.push('/checkout');
	}


	render() {
		const disableInfo = {
			...this.props.ingredients
		}
		for (let key in disableInfo) {
			disableInfo[key] = disableInfo[key] <= 0;
		}
		let orderSummary = null;
		let burger = this.state.error ? <p style={{textAlign: 'center'}}>Data cannot loaded</p> : <Spinner/>;
		if (this.props.ingredients) {
			burger = (
				<AuxComponent>
					<Burger ingredients={this.props.ingredients}/>
					<BuildControls
						ingredientAdded={this.props.addIngredient}
						ingredientRemoved={this.props.removeIngredient}
						disabled={disableInfo}
						purchasable={this.updatePurchaseState(this.props.ingredients)}
						price={this.props.totalPrice}
						ordered={this.purchaseHandler}
					/>
				</AuxComponent>
			);
			orderSummary = <OrderSummary
				ingredients={this.props.ingredients}
				price={this.props.totalPrice}
				purchaseCancelled={this.purchaseCancelHandler}
				purchaseContinued={this.purchaseContinueHandler}
			/>;
		}
		if (this.state.loading) {
			orderSummary = <Spinner/>;
		}
		return (
			<AuxComponent>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</AuxComponent>
		);
	}
}

const mapStateToProps = state => {
	return {
		totalPrice: state.ingredients.totalPrice,
		ingredients: state.ingredients.ingredients
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setNewIngredients: newIngredients =>
			dispatch({
				type: actions.SET_INGREDIENTS,
				payload: {ingredients: newIngredients}
			}),
		setNewTotalPrice: newTotalPrice =>
			dispatch({
				type: actions.SET_PRICE,
				payload: {totalPrice: newTotalPrice}
			}),
		addIngredient: ingredientType =>
			dispatch({
				type: actions.ADD_INGREDIENT,
				payload: {ingredient: ingredientType}
			}),
		removeIngredient: ingredientType =>
			dispatch({
				type: actions.REMOVE_INGREDIENT,
				payload: {ingredient: ingredientType}
			}),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
