import { Component } from 'react';
import { Button, Container, DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, UncontrolledDropdown } from 'reactstrap';
import UserModel from '../UserModel';
import styles from './index.module.css';

interface Props {
	onUserChanged: (user: UserModel | null) => void;
	onSignUp: () => void;
	user: UserModel | null;
}

interface State {
	username: string;
	password: string;
	failed?: boolean;
}

export class Auth extends Component<Props, State>  {
	constructor(props: Props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		};
	}

	async #onSignIn() {
		const response = await fetch(`/api/auth?username=${encodeURIComponent(this.state.username)}&password=${encodeURIComponent(this.state.password)}`, {
			method: 'POST'
		});
		if (response.status === 200) {
			const user = await response.json();
			this.props.onUserChanged({
				username: user.username as string,
				birthday: new Date(user.birthday),
				isEmployee: user.isEmployee
			});
		} else {
			this.setState(state => ({ ...state, failed: true }));
		}
		return false;
	}

	async #onSignOut() {
		await fetch('/api/auth', {
			method: 'DELETE'
		});
		this.props.onUserChanged(null);
	}

	render() {
		if (this.props.user) {
			return (<UncontrolledDropdown>
				<DropdownToggle caret>
					{this.props.user.username}
				</DropdownToggle>
				<DropdownMenu>
					<DropdownItem onClick={this.#onSignOut.bind(this)}>
						Выйти
					</DropdownItem>
				</DropdownMenu>
			</UncontrolledDropdown>);
		} else {
			return (<Container className={styles.auth}>
				<InputGroup>
					<Input
						type='text'
						invalid={this.state.failed}
						onChange={x => this.setState(state => ({ ...state, username: x.target.value }))}
						placeholder='Логин'
					/>
					<Button onClick={this.#onSignIn.bind(this)}>
						Войти
					</Button>
				</InputGroup>
				<InputGroup>
					<Input
						type='password'
						invalid={this.state.failed}
						onChange={x => this.setState(state => ({ ...state, password: x.target.value }))}
						placeholder='Пароль'
					/>
					<Button onClick={this.props.onSignUp}>Регистрация</Button>
				</InputGroup>
			</Container>);
		}
	}
}
