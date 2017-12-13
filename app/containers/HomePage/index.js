/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import { makeSelectError, makeSelectLoading, makeSelectRepos } from '../App/selectors';

import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import { FormattedMessage } from 'react-intl';
import H2 from '../../components/H2';
import { Helmet } from 'react-helmet';
import Input from './Input';
import PropTypes from 'prop-types';
import React from 'react';
import ReposList from '../../components/ReposList';
import Section from './Section';
import { changeUsername } from './actions';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import { loadRepos } from '../App/actions';
import { makeSelectUsername } from './selectors';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import styles from './styles.scss'; // eslint-disable-line no-unused-vars

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	/**
	 * when initial state username is not null, submit the form to load repos
	 */
	componentDidMount () {
		if (this.props.username && this.props.username.trim().length > 0) {
			this.props.onSubmitForm();
		}
	}

	render () {
		const { loading, error, repos } = this.props;
		const reposListProps = {
			error,
			loading,
			repos
		};

		return (
			<article>
				<Helmet>
					<title>Home Page</title>
					<meta name="description" content="A React.js Boilerplate application homepage" />
				</Helmet>
				<div>
					<CenteredSection>
						<h1 styleName='styles.text'>Hello</h1>
						<H2>
							<FormattedMessage { ...messages.startProjectHeader } />
						</H2>
						<p>
							<FormattedMessage { ...messages.startProjectMessage } />
						</p>
					</CenteredSection>
					<Section>
						<H2>
							<FormattedMessage { ...messages.trymeHeader } />
						</H2>
						<Form onSubmit={ this.props.onSubmitForm }>
							<label htmlFor="username">
								<FormattedMessage { ...messages.trymeMessage } />
								<AtPrefix>
									<FormattedMessage { ...messages.trymeAtPrefix } />
								</AtPrefix>
								<Input
									id="username"
									type="text"
									placeholder="mxstbr"
									value={ this.props.username }
									onChange={ this.props.onChangeUsername }
								/>
							</label>
						</Form>
						<ReposList { ...reposListProps } />
					</Section>
				</div>
			</article>
		);
	}
}

HomePage.propTypes = {
	error: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.bool
	]),
	loading: PropTypes.bool,
	onChangeUsername: PropTypes.func,
	onSubmitForm: PropTypes.func,
	repos: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.bool
	]),
	username: PropTypes.string
};

export function mapDispatchToProps (dispatch) {
	return {
		onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
		onSubmitForm: evt => {
			if (evt !== undefined && evt.preventDefault) { evt.preventDefault(); }
			dispatch(loadRepos());
		}
	};
}

const mapStateToProps = createStructuredSelector({
	error: makeSelectError(),
	loading: makeSelectLoading(),
	repos: makeSelectRepos(),
	username: makeSelectUsername()
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(HomePage);
