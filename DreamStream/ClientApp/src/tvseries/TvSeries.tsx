import { Component } from 'react';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, Container, InputGroup, Placeholder, Row } from 'reactstrap';
import { PageNavigation } from '../components/PageNavigation';
import UserModel from '../UserModel';
import { AddSeries } from './Add';

interface Series {
	Id: number;
	Title: string;
	Episodes: Episode[];
}

interface Episode {
	Id: number;
	MediaId: number;
	Title: string;
}

interface Props {
	user: UserModel;
}

interface State {
	entries?: Series[];
	page: number;
	count: number;
	currentSeriesId?: number;
	currentEpisode?: number;
	addSeriesId?: number;
	addVisible?: boolean;
}

const pageSize = 20;
const placeholder = [undefined, undefined, undefined, undefined];

export class TVseries extends Component<Props, State> {
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
		const response = await fetch(`/api/media/series?top=${pageSize}&skip=${(page) * pageSize}&count=true&expand=episodes`);
		const data = await response.json() as {
			'@odata.count': number,
			value: Series[];
		};
		this.setState(state => ({
			...state,
			entries: data.value,
			page: page,
			count: data['@odata.count']
		}));
	}

	#openSeries(seriesId: string) {
		this.setState(state => ({
			...state,
			currentSeriesId: parseInt(seriesId),
			currentEpisode: undefined
		}));
	}

	#openEpisode(episodeId: string) {
		this.setState(state => ({
			...state,
			currentEpisode: parseInt(episodeId)
		}));
	}

	async #delete(seriesId: number, episodeId?: number) {
		await fetch(`/api/media/series/${seriesId}?episodeId=${episodeId}`, { method: 'DELETE' });
		this.#loadPage(this.state.page);
	}

	render() {
		return (<Container>
			{this.props.user.isEmployee && (< Row className='d-flex flex-row-reverse'>
				<Button
					className='float-right'
					style={{ width: 'min-content' }}
					onClick={() => this.setState(state => ({ ...state, addSeriesId: undefined, addVisible: true }))}
				>Добавить</Button>
			</Row>)}
			<hr />
			<Accordion
				open={this.state.currentSeriesId?.toString() ?? ''}
				{...{ toggle: this.#openSeries.bind(this) }}
			>
				{(this.state.entries ?? placeholder).map((series, y) => {
					return (
						<AccordionItem key={series?.Id ?? y}>
							<AccordionHeader targetId={(series?.Id ?? y).toString()}>
								{series ? series.Title : (<Placeholder className='w-100' />)}
							</AccordionHeader>
							<AccordionBody accordionId={(series?.Id ?? y).toString()}>
								<InputGroup>
									{this.props.user.isEmployee && series && (
										<Button onClick={() => this.setState(state => ({ ...state, addSeriesId: series.Id, addVisible: true }))}>Добавить эпизод</Button>
									)}
									{this.props.user.isEmployee && series && (
										<Button onClick={() => this.#delete(series.Id)} color='danger'>X</Button>
									)}
								</InputGroup>
								{series?.Id === this.state.currentSeriesId && series && series.Episodes.length ? (
									<Accordion
										open={this.state.currentSeriesId === series?.Id ? this.state.currentEpisode?.toString() ?? '' : ''}
										{...{ toggle: this.#openEpisode.bind(this) }}
									>
										{series.Episodes.map(episode => (
											<AccordionItem key={episode.Id}>
												<AccordionHeader targetId={episode.Id.toString()}>{episode.Title}</AccordionHeader>
												<AccordionBody accordionId={episode.Id.toString()}>
													{this.props.user.isEmployee && (<InputGroup>
														<Button onClick={() => this.#delete(series.Id, episode.Id)} color='danger'>X</Button>
													</InputGroup>)}
													<video
														src={`/api/media/${episode.MediaId}`}
														style={{ objectFit: 'contain' }}
														controls
													/>
												</AccordionBody>
											</AccordionItem>
										))}
									</Accordion>
								) : (
									<span>Здесь пока нет серий.</span>
								)}
							</AccordionBody>
						</AccordionItem>
					);
				})}
			</Accordion>
			<hr />
			<PageNavigation
				current={this.state.page}
				total={Math.ceil(this.state.count / pageSize)}
				onNavigation={this.#loadPage.bind(this)}
			/>
			<AddSeries
				isOpen={this.state.addVisible}
				seriesId={this.state.addSeriesId}
				onSuccess={() => {
					this.setState(state => ({ ...state, addVisible: undefined }));
					this.#loadPage(this.state.page);
				}}
				onCancell={() => this.setState(state => ({ ...state, addVisible: undefined }))}
			/>
		</Container>);
	}
}
