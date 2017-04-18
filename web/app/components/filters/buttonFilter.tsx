import * as React from "react";
import { Button } from "react-bootstrap";

export interface ButtonFilterProps {
    action: Function,
    isActivated: boolean,
    id: string
}

export class ButtonFilter extends React.Component<ButtonFilterProps, {}> {

    constructor(props: ButtonFilterProps) {
        super(props);
        this.action = this.action.bind(this);
    }

    action(e: any) {
        this.props.action(e);
    }

    render() {

        const buttonStyle = {
            float: "left",
            margin: 5,
            backgroundColor: this.props.isActivated ? "" : "#818A91",
            color: "white",
            fontWeight: "bold",
            width: this.props.id === "ALL" ? 39 : "auto"
        }

        return (
            <Button
                style={buttonStyle}
                onClick={this.action}
                id={this.props.id}
                bsSize="xsmall" {...this.props.isActivated ? { bsStyle: "primary" } : {}}>
                {this.props.id}
            </Button>
        )
    }
}