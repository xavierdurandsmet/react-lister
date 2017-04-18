import * as React from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { CarList } from "./carList";
import { AdvancedFilters } from "./filters/advancedFilters"
import { mockCarsList, currentYear, carTypes } from "../mockData";

export interface MainPageProps { }

export interface MainPageState {
    cars: Array<any>
}

export class MainPage extends React.Component<MainPageProps, MainPageState> {

    cars = mockCarsList;
    carTypes = carTypes;
    currentYear = currentYear;

    constructor(props: MainPageProps) {
        super(props);
        this.state = {
            cars: this.cars
        };
        this.updateFilteredCars = this.updateFilteredCars.bind(this);
    }

    updateFilteredCars(filters: any) {
        let self = this;
        return this.setState(
            {
                cars: this.cars.filter(function (car) {
                    return car.mileage <= filters.mileage
                        && car.distance <= filters.distance
                        && (filters.years.indexOf(car.year) != -1 || filters.years.length == 12)
                        && (filters.carTypes.indexOf(car.type.toUpperCase()) != -1 || filters.carTypes.length == self.carTypes.length);
                })
            }
        )
    }

    render() {
        return (
            <Grid>
                <Row className="show-grid">
                    <div>
                        <Col xs={6} md={4}>
                            <AdvancedFilters
                                currentYear={this.currentYear}
                                carTypes={this.carTypes}
                                onChange={this.updateFilteredCars}
                            />
                        </Col>
                        <Col xs={6} md={4}>
                            <CarList cars={this.state.cars} />
                        </Col>
                    </div>
                </Row>
            </Grid>
        );
    }
}