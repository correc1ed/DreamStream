import { Component } from 'react';
import { Button, Card, CardHeader, CardImg, Container, InputGroup, InputGroupText, Placeholder, Row } from 'reactstrap';
import { PageNavigation } from '../components/PageNavigation';
import UserModel from '../UserModel';
import { AddMusic } from './Add';

interface Audio {
	Id: number;
	MediaId: number;
	Title: string;
}

interface Props {
	user: UserModel;
}

interface State {
	entries?: Audio[];
	page: number;
	count: number;
	addVisible?: boolean;
}

const pageSize = 20;

const placeholder = [undefined, undefined, undefined, undefined, undefined];

export class Music extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			page: 0,
			count: 0
		};
	}

	async componentDidMount() {
		this.#loadPage(0);
	}

	async #loadPage(page: number) {
		const response = await fetch(`/api/media/music?top=${pageSize}&skip=${(page) * pageSize}&count=true`);
		const data = await response.json() as {
			'@odata.count': number,
			value: Audio[];
		};
		this.setState(state => ({
			...state,
			entries: data.value,
			page: page,
			count: data['@odata.count']
		}));
	}

	async #delete(id: number) {
		await fetch(`/api/media/music/${id}`, { method: 'DELETE' });
		this.#loadPage(this.state.page);
	}

	render() {
		return (<Container>
			{this.props.user.isEmployee && (< Row className='d-flex flex-row-reverse'>
				<Button
					className='float-right'
					style={{ width: 'min-content' }}
					onClick={() => this.setState(state => ({ ...state, addVisible: true }))}
				>Добавить</Button>
			</Row>)}
			<hr />
			<Container className='p-0' style={{ display: 'grid', gridTemplateColumns: 'auto', gridTemplateRows: 'auto', gridGap: '1em' }}>
				{(this.state.entries ?? placeholder).map((x, y) => (<Card className='m-0 p-2' key={x?.Id ?? y}>
					<CardHeader style={{ width: 'max-content' }}>{x ? (
						<InputGroup>
							<InputGroupText>{x ? x.Title : (<Placeholder />)}</InputGroupText>
							{this.props.user.isEmployee && x && (
								<Button onClick={() => this.#delete(x.Id)} color='danger'>X</Button>
							)}
						</InputGroup>
					) : (<Placeholder />)}</CardHeader>
					{x ? (<CardImg
						tag='audio'
						src={`/api/media/${x.MediaId}`}
						style={{ objectFit: 'contain' }}
						controls
					/>) : (<Placeholder />)}
				</Card>))}
			</Container>
			<hr />
			<PageNavigation
				current={this.state.page}
				total={Math.ceil(this.state.count / pageSize)}
				onNavigation={this.#loadPage.bind(this)}
			/>
			<AddMusic
				isOpen={this.state.addVisible}
				onSuccess={() => {
					this.setState(state => ({ ...state, addVisible: false }));
					this.#loadPage(this.state.page);
				}}
				onCancell={() => this.setState(state => ({ ...state, addVisible: false }))}
			/>
		</Container>);
	}
}
