import * as React from "react";
import { Grid, Row, Col, Glyphicon } from "react-bootstrap";
import { SliderFilter } from "./sliderFilter"
import { ButtonGroupFilter } from "./buttonGroupFilter";

export interface AdvancedFiltersProps {
    onChange: Function,
    currentYear: number,
    carTypes: Array<string>
}

export interface AdvancedFiltersState {
    years: Array<any>,
    carTypes: Array<any>,
    mileage: number,
    distance: number
}

export class AdvancedFilters extends React.Component<AdvancedFiltersProps, AdvancedFiltersState> {

    availableYears = this.getAvailableYears(this.props.currentYear);

    constructor(props: AdvancedFiltersProps) {
        super(props);
        this.state = {
            years: this.availableYears,
            carTypes: this.props.carTypes,
            mileage: 1000,
            distance: 1000
        };
        this.handleChange = this.handleChange.bind(this);
    }

    getAvailableYears(currentYear: number) {
        let years: Array<string> = [];
        for (let i = 0; i < 12; i++) {
            // convert each year number to string, for consistency in filters
            years.push((currentYear - i).toString());
        }
        return years;
    }

    handleChange(filters: Array<any>, filterType: string) {
        // special case for years
        if (filterType === "years") {
            filters = filters.map(function (yearString) { return Number(yearString) });
        }
        this.state[filterType] = filters;
        this.setState({
            years: this.state.years,
            carTypes: this.state.carTypes,
            mileage: this.state.mileage,
            distance: this.state.distance
        }, function () {
            this.props.onChange(this.state);
        })
    }

    render() {

        const titleStyle = {
            fontWeight: "bold"
        }

        return (
            <div>
                <h5 style={titleStyle}>
                    <Glyphicon glyph="cog" /> Advanced filters
                </h5>
                <ButtonGroupFilter
                    filterType="years"
                    availableFilters={this.availableYears}
                    onChange={this.handleChange}>
                </ButtonGroupFilter>
                <SliderFilter
                    filterType="distance"
                    labelName={"Distance"}
                    min={0}
                    max={1000}
                    step={40}
                    onChange={this.handleChange}
                    value={this.state.distance}
                    measureUnit="ml">
                </SliderFilter>
                <SliderFilter
                    filterType="mileage"
                    labelName={"Mileage"}
                    min={0}
                    max={1000}
                    step={40}
                    onChange={this.handleChange}
                    value={this.state.mileage}
                    measureUnit="ml">
                </SliderFilter>
                <ButtonGroupFilter
                    filterType="carTypes"
                    availableFilters={this.props.carTypes}
                    onChange={this.handleChange}>
                </ButtonGroupFilter>
            </div>
        );
    }
}