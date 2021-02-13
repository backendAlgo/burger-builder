import React, {Component} from 'react';
import {connect} from 'react-redux';

import AuxComponent from '../../hoc/AuxComponent/AuxComponent';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
//by default it takes index.js file in actions
import * as actions from '../../store/actions';

class BurgerBuilder extends Component {

	state = {
		purchasing: false,
	}

	componentDidMount() {
		this.props.onInitIngredients();
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
		this.props.onInitPurchase();
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
		let burger = this.props.error ? <p style={{textAlign: 'center'}}>Data cannot loaded</p> : <Spinner/>;
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
		totalPrice: state.burgerBuilder.totalPrice,
		ingredients: state.burgerBuilder.ingredients,
		error: state.burgerBuilder.error
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addIngredient: ingredientType =>
			dispatch(actions.addIngredient(ingredientType)),
		removeIngredient: ingredientType =>
			dispatch(actions.removeIngredient(ingredientType)),
		onInitIngredients: () =>
			dispatch(actions.initIngredients()),
		onInitPurchase: () =>
			dispatch(actions.purchaseInit())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
