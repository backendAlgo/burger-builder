import React, {Component} from 'react';
import {connect} from 'react-redux';

import axios from '../../axios-orders';
import Order from '../../components/Order/Order';
import withErrorHandler from '../../hoc/WithErrorHandler/withErrorHandler';
import * as actions from '../../store/actions';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {

	componentDidMount() {
		this.props.onFetchOrders();
	}

	render() {
		return <div>
			{(this.props.loading) ? <Spinner/> :
				this.props.orders.map(order => (
					<Order
						key={order.id}
						ingredients={order.ingredients}
						price={order.price}
					/>
				))
			}
		</div>
	}
}

const mapStateToProps = state => {
	return {
		orders: state.order.orders,
		loading: state.order.loading
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onFetchOrders: () => dispatch(actions.fetchOrders())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));
