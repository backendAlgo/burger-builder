import React, {Component} from 'react';
import AuxComponent from '../../../hoc/AuxComponent/AuxComponent';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
	componentDidUpdate(prevProps, prevState, snapshot) {
		console.log('[OrderSummary] will update')
	}

	render() {
		const ingredientsSummary = Object.keys(this.props.ingredients)
			.map(e => {
				return <li key={e}>
					<span style={{textTransform: 'capitalize'}}>{e}</span>: {this.props.ingredients[e]}
				</li>
			});
		return (

			<AuxComponent>
				<h3>Your Order</h3>
				<p>A delicious burger with the following ingredients:</p>
				<ul>
					{ingredientsSummary}
				</ul>
				<p>Continue to Checkout?</p>
				<Button clicked={this.props.purchaseCancelled} btnType={'Danger'}>CANCEL</Button>
				<Button clicked={this.props.purchaseContinued} btnType={'Success'}>CONTINUE</Button>
			</AuxComponent>
		);
	}
}

export default OrderSummary;
