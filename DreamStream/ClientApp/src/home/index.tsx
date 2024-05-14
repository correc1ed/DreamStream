import { Component } from 'react';
import { Container } from 'reactstrap';
interface Props {
}

interface State {
}

export class Home extends Component<Props, State> {
    constructor(props: Props) {
		super(props);
    }

	render() {
		return (<Container>
			Добро пожаловать в DreamStream.
		</Container>);
    }
}
