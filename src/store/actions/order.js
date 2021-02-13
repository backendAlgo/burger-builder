import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (orderId, orderData) => {
	return {
		type: actionTypes.PURCHASE_BURGER_SUCCESS,
		payload: {
			orderId: orderId,
			orderData: orderData
		}
	}
}

export const purchaseBurgerFail = (error) => {
	return {
		type: actionTypes.PURCHASE_BURGER_FAIL,
		payload: {
			error: error
		}
	}
}

export const purchaseBurgerStart = () => {
	return {
		type: actionTypes.PURCHASE_BURGER_START
	}
}

export const purchaseBurger = (orderData) => {
	return dispatch => {
		dispatch(purchaseBurgerStart());
		axios.post('/orders.json', orderData)
			.then(response => {
				dispatch(purchaseBurgerSuccess(response.data.name, orderData));
			})
			.catch(error => {
				dispatch(purchaseBurgerFail(error));
			});
	}
}

export const purchaseInit = () => {
	return {
		type: actionTypes.PURCHASE_INIT
	}
}

export const fetchOrdersSuccess = (orders) => {
	return {
		type: actionTypes.FETCH_ORDERS_SUCCESS,
		payload: {
			orders: orders
		}
	}
}

export const fetchOrdersFail = (error) => {
	return {
		type: actionTypes.FETCH_ORDERS_FAIL,
		payload: {
			error: error
		}
	}
}

export const fetchOrdersStart = () => {
	return {
		type: actionTypes.FETCH_ORDERS_START
	}
}

export const fetchOrders = () => {
	return dispatch => {
		dispatch(fetchOrdersStart());
		axios.get('/orders.json')
			.then(res => {
				const fetchedOrders = [];
				Object.keys(res.data).forEach((key) => {
					fetchedOrders.push({
						...res.data[key],
						id: key
					});
				});
				dispatch(fetchOrdersSuccess(fetchedOrders));
			})
			.catch(error => {
				dispatch(fetchOrdersFail(error));
			});
	}
}
