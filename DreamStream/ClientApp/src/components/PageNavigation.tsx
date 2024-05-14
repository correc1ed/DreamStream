import { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

interface Props {
	current: number,
	total: number,
	onNavigation: (page: number) => void
}

interface State {
}

export class PageNavigation extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
	}

	render() {
		return (<Pagination style={{ justifyContent: 'center' }}>
			<PaginationItem disabled={!this.props.current} key='first'>
				<PaginationLink first onClick={() => this.props.onNavigation(0)} />
			</PaginationItem>
			<PaginationItem disabled={!this.props.current} key='previous'>
				<PaginationLink previous onClick={() => this.props.onNavigation(this.props.current - 1)} />
			</PaginationItem>
			{[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
				.map(x => this.props.current + x)
				.filter(x => this.props.total ? x >= 0 && x < this.props.total : x === 0)
				.map(page => (
					<PaginationItem active={this.props.current === page} key={page}>
						<PaginationLink onClick={() => this.props.onNavigation(page)}>{page}</PaginationLink>
					</PaginationItem>
				))
			}
			<PaginationItem disabled={this.props.current >= this.props.total - 1} key='next'>
				<PaginationLink next onClick={() => this.props.onNavigation(this.props.current + 1)} />
			</PaginationItem>
			<PaginationItem disabled={this.props.current >= this.props.total - 1} key='last'>
				<PaginationLink last onClick={() => this.props.onNavigation(this.props.total - 1)} />
			</PaginationItem>
		</Pagination>);
	}
}
