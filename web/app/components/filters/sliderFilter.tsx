import * as React from "react";
import * as ReactBootstrap from "react-bootstrap";

export interface SliderFilterProps {
    onChange: Function,
    value: number,
    labelName: string,
    min: number,
    max: number,
    step: number,
    measureUnit: string,
    filterType: string
}

export interface SliderFilterState {
    value: number
}

export class SliderFilter extends React.Component<SliderFilterProps, SliderFilterState> {

    constructor(props: SliderFilterProps) {
        super(props);
        this.handleValuesChange = this.handleValuesChange.bind(this);
        this.state = {
            value: this.props.value
        };
    }

    handleValuesChange(e: any) {
        this.setState({
            value: e.target.value,
        }, function () {
            // pass in [this.state.value] to be consistent in parent component's handleChange
            this.props.onChange([this.state.value], this.props.filterType);
        });
    }

    render() {

        const formStyle = {
            height: 50,
            margin: '0 auto',
            marginTop: 30,
            width: '50%'
        }

        const floatStyle = {
            float: "left"
        }

        return (
            <div>
                <span
                    htmlFor={this.props.labelName}
                    style={floatStyle}>{this.props.labelName}
                </span>
                <form style={formStyle}>
                    <div>
                        <input
                            type="range"
                            id={this.props.labelName}
                            style={floatStyle}
                            min={this.props.min} 
                            value={this.props.value} 
                            max={this.props.max} 
                            step={this.props.step} 
                            onChange={this.handleValuesChange} 
                        />
                        <output style={floatStyle}>
                            {this.state.value} {this.props.measureUnit}
                        </output>
                    </div>
                </form>
            </div>
        )
    }
}