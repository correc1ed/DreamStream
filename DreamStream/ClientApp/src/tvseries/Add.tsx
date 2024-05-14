import { Component } from 'react';
import { Form, Input, InputGroup, InputGroupText, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import styles from './index.module.css';

interface Props {
	onSuccess: () => void;
	onCancell: () => void;
	seriesId?: number,
	isOpen?: boolean;
}

interface State {
}

export class AddSeries extends Component<Props, State>  {
	async #submit(data: BodyInit) {
		const url = '/api/media/series';
		const response = await fetch(this.props.seriesId ? `${url}/${this.props.seriesId}` : url, {
			method: 'POST',
			body: data
		});
		if (response.status === 200) {
			this.props.onSuccess();
		}
	}

	render() {
		return (<Modal isOpen={!!this.props.isOpen}>
			<Form
				onSubmit={x => {
					console.log(x);
					this.#submit(new FormData(x.target as HTMLFormElement));
					x.preventDefault();
				}}
			>
				<ModalHeader toggle={this.props.onCancell}>
					Добавить {this.props.seriesId ? 'эпизод' : 'серию'}
				</ModalHeader>
				<ModalBody className={styles.form}>
					<InputGroup>
						<InputGroupText>Название</InputGroupText>
						<Input name='Title' />
					</InputGroup>
					{this.props.seriesId && (
						<InputGroup>
							<InputGroupText>Файл</InputGroupText>
							<Input name='File' type='file' accept='video/*' />
						</InputGroup>
					)}
				</ModalBody>
				<ModalFooter>
					<Input type='submit' value='Отправить' />
				</ModalFooter>
			</Form>
		</Modal>);
	}
}
