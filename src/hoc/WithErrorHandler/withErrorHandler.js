import React, {Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import AuxComponent from '../AuxComponent/AuxComponent';

const withErrorHandler = (WrappedComponent, axios) => {
	return class extends Component {
		state = {
			error: null
		}
		componentWillMount() {
			this.reqIntercetor = axios.interceptors.request.use(request => {
				this.setState({error: null});
				return request;
			})
			this.resIntercetor = axios.interceptors.response.use(res => res, error => {
				this.setState({error: error})
			});
		}
		componentWillUnmount() {
			axios.interceptors.request.eject(this.reqIntercetor);
			axios.interceptors.response.eject(this.resIntercetor);
		}

		errorConfirmHandler = () => {
			this.setState({error: null});
		}

		render() {
			return (
				<AuxComponent>
					<Modal
						show={this.state.error}
						modalClosed={this.errorConfirmHandler}
					>
						{this.state.error && this.state.error.message}
					</Modal>
					<WrappedComponent {...this.props}/>
				</AuxComponent>
			);
		}
	}
}

export default withErrorHandler;
