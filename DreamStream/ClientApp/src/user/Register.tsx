import { Component } from 'react';
import { Button, CloseButton, Form, FormGroup, FormText, Input, InputGroup, InputGroupText, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import UserModel from '../UserModel';
import styles from './index.module.css';

interface Props {
	onSuccess: (user: UserModel) => void;
	onCancell: () => void;
	isOpen?: boolean;
}

interface State {
	username: string;
	password: string;
	birthday: Date;
}

export class Register extends Component<Props, State>  {
	constructor(props: Props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			birthday: new Date()
		};
	}

	async #signup() {
		const response = await fetch('/api/auth', {
			method: 'PUT',
			body: JSON.stringify({
				username: this.state.username,
				password: this.state.password,
				birthday: this.state.birthday
			}),
			headers: {
				'content-type': 'application/json'
			}
		});
		if (response.status === 200) {
			const user = await response.json();
			this.props.onSuccess({
				username: user.username as string,
				birthday: new Date(user.birthday),
				isEmployee: user.isEmployee
			});
		}
	}

	render() {
		return (
			<Modal isOpen={this.props.isOpen}>
				<ModalHeader toggle={this.props.onCancell}>
					Регистрация
				</ModalHeader>
				<ModalBody className={styles.auth + ' ' + styles.register}>
					<InputGroup>
						<InputGroupText>Логин</InputGroupText>
						<Input onChange={x => this.setState(state => ({ ...state, username: x.target.value }))} />
					</InputGroup>
					<InputGroup>
						<InputGroupText>Пароль</InputGroupText>
						<Input type='password' onChange={x => this.setState(state => ({ ...state, password: x.target.value }))} />
					</InputGroup>
					<InputGroup>
						<InputGroupText>Дата рождения</InputGroupText>
						<Input type='date' onChange={x => this.setState(state => ({ ...state, birthday: new Date(x.target.value) }))} />
					</InputGroup>
				</ModalBody>
				<ModalFooter>
					<Button onClick={this.#signup.bind(this)}>Отправить</Button>
				</ModalFooter>
			</Modal>
		);
	}
}
