import * as React from "react";
import { CarItem } from "./carItem";
import { Row } from "react-bootstrap";

export interface CarListProps {
    cars: Array<any>
}

export class CarList extends React.Component<CarListProps, {}> {
    render() {
        return (
            <ul>
                {this.props.cars.map(car =>
                    <Row className="show-grid" key={car.vinNumber}>
                        <CarItem
                            image={car.image}
                            title={car.make}
                            year={car.year} 
                            price={car.price} 
                            description={car.description}
                        />
                    </Row>
                )}
            </ul>
        );
    }
}