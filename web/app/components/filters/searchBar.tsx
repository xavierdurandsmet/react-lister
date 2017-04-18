import * as React from "react";

const descriptionStyle = {
    float: "left"
}

export interface SearchBarProps {
    filterCars: Function,
    currentInput: string,
    updateQuery: Function
}

export interface SearchBarState {
    queryString: string
}

export class SearchBar extends React.Component<SearchBarProps, SearchBarState> {

    constructor(props: SearchBarProps) {
        super(props);
        this.updateQuery = this.updateQuery.bind(this);
        this.filter = this.filter.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
        // set initial state
        this.state = { queryString: '' };
    }

    updateQuery(e: any) {
        this.props.updateQuery(e);
    }

    //update type of e
    filter(e: any) {
        this.props.filterCars(e);
    }

    render() {
        return <div>
            <form onSubmit={this.filter}>
                <input
                    onChange={this.updateQuery}
                    type="text"
                    value={this.props.currentInput}
                />
                <button> Filter </button>
            </form>
        </div>
    }
}