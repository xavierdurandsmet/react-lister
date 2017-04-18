import * as React from "react";

export interface CarItemProps {
    image: string,
    title: string,
    description: string,
    year: string,
    price: number
}

export class CarItem extends React.Component<CarItemProps, {}> {

    render() {

        const imgStyle = {
            width: "100px",
            height: "100px",
            float: "left"
        };

        const priceStyle = {
            float: "right"    
        }


        return (
            <div>
                <img
                    src={this.props.image}
                    alt={this.props.title}
                    style={imgStyle}
                />
                <div>
                    <span>{this.props.title} </span>
                    <span style={priceStyle}>$ {this.props.price}</span>
                </div>
                <div>{this.props.description}</div>
            </div>
        );
    }
}