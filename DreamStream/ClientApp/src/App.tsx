import { Component } from 'react';
import { Navigate, NavLink as RouterNavLink, Route, Routes } from 'react-router-dom';
import { Container, Nav, Navbar, NavbarBrand, NavbarText, NavItem, NavLink, Placeholder } from 'reactstrap';
import './custom.css';
import { Films } from "./films/Films";
import { Home } from './home';
import { Music } from "./music/Music";
import { TVseries } from "./tvseries/TvSeries";
import { Auth } from "./user/Auth";
import { Register } from "./user/Register";
import UserModel from './UserModel';

interface Props {
}

interface State {
	user?: UserModel | null;
	signUpVisible?: boolean;
}

export default class App extends Component<Props, State> {
	#routes;

	constructor(props: Props) {
		super(props);
		this.#routes = [{
			title: 'Сериалы',
			path: '/tv',
			element: () => <TVseries
				user={this.state.user!}
			/>
		}, {
			title: 'Фильмы',
			path: '/films',
			element: () => <Films
				user={this.state.user!}
			/>
		}, {
			title: 'Музыка',
			path: '/music',
			element: () => <Music
				user={this.state.user!}
			/>
		}];
		this.state = {};
	}

	async componentDidMount() {
		const response = await fetch('/api/auth', { redirect: 'manual' });
		if (response.status === 200) {
			const user = await response.json();
			this.setState(state => ({
				...state,
				user: {
					username: user.username as string,
					birthday: new Date(user.birthday),
					isEmployee: user.isEmployee
				}
			}));
		} else {
			this.setState(state => ({ ...state, user: null }));
		}
	}

	get isLoaded() {
		return this.state.user !== undefined;
	}

	#onUserChanged(user: UserModel | null) {
		this.setState(state => ({ ...state, user, signUpVisible: false }));
	}

	#onSignUpOpen() {
		this.setState(state => ({ ...state, signUpVisible: true }));
	}

	#onSignUpClose() {
		this.setState(state => ({ ...state, signUpVisible: false }));
	}

	render() {
		return (
			<Container className='min-vh-100 d-flex flex-column text-sm-center px-5'>
				<Navbar>
					<NavbarBrand tag={RouterNavLink} to="/">DreamStream</NavbarBrand>
					{this.state.user && (<Nav tabs>
						{this.isLoaded && this.#routes.map(x => (
							<NavItem key={x.path}>
								<NavLink tag={RouterNavLink} to={x.path}>{x.title}</NavLink>
							</NavItem>
						))}
					</Nav>)}
					{this.state.user !== undefined && (<Nav>
						<Auth
							onUserChanged={this.#onUserChanged.bind(this)}
							onSignUp={this.#onSignUpOpen.bind(this)}
							user={this.state.user}
						/>
					</Nav>)}
				</Navbar>
				{this.isLoaded ? (
					<Routes>
						{this.state.user && this.#routes.map((x, i) => (<Route
							key={x.path}
							path={x.path + '/*'}
							element={x.element()}
						/>))}
						<Route path='/' element={<Home />} />
						<Route path='*' element={<Navigate to='/' />} />
					</Routes>
				) : (
					<Placeholder color='wheat' size='lg'>Loading...</Placeholder>
				)}
				<Register
					isOpen={this.state.signUpVisible}
					onSuccess={this.#onUserChanged.bind(this)}
					onCancell={this.#onSignUpClose.bind(this)}
				/>
			</Container>
		);
	}
}
