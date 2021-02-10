import React, {Component} from 'react';
import AuxComponent from '../../hoc/AuxComponent/AuxComponent';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
}

class BurgerBuilder extends Component {
	// constructor(props) {
	// 	super(props);
	// 	this.state = {...}
	// }
	state = {
		ingredients: null,
		totalPrice: 4,
		purchasable: false,
		purchasing: false,
		loading: false,
		error: null
	}

	componentDidMount() {
		axios.get('/ingredients.json')
			.then(response => {
				this.setState({ingredients: response.data});
			})
			.catch(error => this.setState({error: true}))
	}

	updatePurchaseState(updatedIngredients) {
		const ingredients = {
			...updatedIngredients
		};
		const sum = Object.keys(ingredients)
			.map(e => {
				return ingredients[e];
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);
		this.setState({purchasable: sum > 0});

	}

	addIngredient = (type) => {
		const oldCount = this.state.ingredients[type];
		const updatedCount = oldCount + 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCount;
		const priceAddition = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice + priceAddition;
		this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
		this.updatePurchaseState(updatedIngredients);
	}
	removeIngredient = (type) => {
		const oldCount = this.state.ingredients[type];
		if (oldCount <= 0) return;
		const updatedCount = oldCount - 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCount;
		const priceReduction = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice - priceReduction;
		this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
		this.updatePurchaseState(updatedIngredients);
	}

	purchaseHandler = () => {
		this.setState({purchasing: true});
	}

	purchaseCancelHandler = () => {
		this.setState({purchasing: false});
	}
	purchaseContinueHandler = () => {
		const queryParams = [];
		Object.keys(this.state.ingredients).forEach(key => {
			queryParams.push(encodeURIComponent(key) + '=' +
				encodeURIComponent(this.state.ingredients[key]));
		});
		queryParams.push('price=' + this.state.totalPrice);
		const queryString = queryParams.join('&');
		this.props.history.push({
			pathname: '/checkout',
			search: `?${queryString}`
		});
	}


	render() {
		const disableInfo = {
			...this.state.ingredients
		}
		for (let key in disableInfo) {
			disableInfo[key] = disableInfo[key] <= 0;
		}
		let orderSummary = null;
		let burger = this.state.error ? <p style={{textAlign: 'center'}}>Data cannot loaded</p> : <Spinner/>;
		if (this.state.ingredients) {
			burger = (
				<AuxComponent>
					<Burger ingredients={this.state.ingredients}/>
					<BuildControls
						ingredientAdded={this.addIngredient}
						ingredientRemoved={this.removeIngredient}
						disabled={disableInfo}
						purchasable={this.state.purchasable}
						price={this.state.totalPrice}
						ordered={this.purchaseHandler}
					/>
				</AuxComponent>
			);
			orderSummary = <OrderSummary
				ingredients={this.state.ingredients}
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

export default withErrorHandler(BurgerBuilder, axios);
