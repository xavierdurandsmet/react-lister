import * as React from "react";
import { Row } from "react-bootstrap";
import { ButtonFilter } from "./buttonFilter";

export interface ButtonGroupFilterProps {
    availableFilters: Array<any>,
    filterType: string
    onChange: Function
}

export interface ButtonGroupFilterState {
    activatedFilters: Array<string>
}

export class ButtonGroupFilter extends React.Component<ButtonGroupFilterProps, ButtonGroupFilterState> {

    constructor(props: ButtonGroupFilterProps) {
        super(props);
        this.state = {
            activatedFilters: this.props.availableFilters
        };
        this.toggleFilter = this.toggleFilter.bind(this);
        this.isFilterActivated = this.isFilterActivated.bind(this);
        this.selectOrDeselectAll = this.selectOrDeselectAll.bind(this);
    }

    toggleFilter(e: any) {
        // filter not already activated
        if (this.state.activatedFilters.indexOf(e.target.id) == -1) {
            this.setState({
                activatedFilters: this.state.activatedFilters.concat(e.target.id)
            } as ButtonGroupFilterState, function () {
                this.props.onChange(this.state.activatedFilters, this.props.filterType);
            });
        } else {
            // edge case: where 'all' has been selected, and user decides to click on another filter
            if (this.isAllFilterActivated()) {
                this.setState({
                    activatedFilters: [e.target.id],
                } as ButtonGroupFilterState, function () {
                    this.props.onChange(this.state.activatedFilters, this.props.filterType);
                });
            } else {
                // filter already selected: remove this filter from list of activated filters
                this.state.activatedFilters.splice(this.state.activatedFilters.indexOf(e.target.id), 1);
                this.setState({
                    // edge case: if unclick last active filter, make ALL button filter active
                    activatedFilters: this.state.activatedFilters.length == 0 ? this.props.availableFilters : this.state.activatedFilters
                }, function () {
                    this.props.onChange(this.state.activatedFilters, this.props.filterType);
                });
            }
        }
    }

    selectOrDeselectAll(e: any) {
        if (!this.isAllFilterActivated()) {
            let activatedFilters: Array<any>;
            activatedFilters = [];
            this.props.availableFilters.forEach(function (filter) { 
                activatedFilters.push(filter);
            })
            this.setState({
                activatedFilters: activatedFilters
            }, function () {
                this.props.onChange(this.state.activatedFilters, this.props.filterType);
            });
        }
    }

    isAllFilterActivated() {
        return (this.state.activatedFilters.length === this.props.availableFilters.length)
            || (this.state.activatedFilters.length === 0);
    }

    isFilterActivated(filter: any) {
        return (this.state.activatedFilters.indexOf(filter.toString()) != -1)
            && (this.isAllFilterActivated() === false);
    }

    render() {

        const rowLayoutStyle = {
            marginLeft: -45
        }

        return (
            <Row className="show-grid" style={rowLayoutStyle}>
                <div>
                    <ul>
                        <ButtonFilter
                            id="ALL"
                            key="ALL"
                            action={this.selectOrDeselectAll}
                            isActivated={this.isAllFilterActivated()}>
                        </ButtonFilter>
                        {this.props.availableFilters.map(filter =>
                            <ButtonFilter
                                id={filter}
                                key={filter}
                                action={this.toggleFilter}
                                isActivated={this.isFilterActivated(filter)}>
                            </ButtonFilter>
                        )}
                    </ul>
                </div>
            </Row>
        )
    }
}