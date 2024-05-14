import { Component } from 'react';
import { Form, Input, InputGroup, InputGroupText, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import styles from './index.module.css';

interface Props {
	onSuccess: () => void;
	onCancell: () => void;
	isOpen?: boolean;
}

interface State {
}

export class AddFilm extends Component<Props, State>  {
	async #submit(data: BodyInit) {
		const response = await fetch('/api/media/films', {
			method: 'POST',
			body: data
		});
		if (response.status === 200) {
			this.props.onSuccess();
		}
	}

	render() {
		return (<Modal isOpen={this.props.isOpen}>
			<Form
				onSubmit={x => {
					console.log(x);
					this.#submit(new FormData(x.target as HTMLFormElement));
					x.preventDefault();
				}}
			>
				<ModalHeader toggle={this.props.onCancell}>
					Добавить фильм
				</ModalHeader>
				<ModalBody className={styles.form}>
					<InputGroup>
						<InputGroupText>Название</InputGroupText>
						<Input name='Title' />
					</InputGroup>
					<InputGroup>
						<InputGroupText>Файл</InputGroupText>
						<Input name='File' type='file' accept='video/*' />
					</InputGroup>
				</ModalBody>
				<ModalFooter>
					<Input type='submit' value='Отправить' />
				</ModalFooter>
			</Form>
		</Modal>);
	}
}
