import React, { Component } from 'react';
import SelectPointsBlock from "./SelectPointsBlock";
import FillWayInfoBlock from "./FillWayInfoBlock";

class ConfirmParamsBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {

            pointsSelected: false,
        };
        //this.countWay = this.countWay.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
    }
    handleSelected() {
        this.setState({
            pointsSelected: true
        });
    }
    render() {
        let fillWayInfoBlock;
        if(this.state.pointsSelected) {
            fillWayInfoBlock = (
                <FillWayInfoBlock 
                    onConfirmed={this.props.onConfirmed}
                />
            );
        }
        return (
            <div>
                <SelectPointsBlock 
                    onSelected={this.handleSelected}    
                />
                {fillWayInfoBlock}
            </div>
        );
    }
}

export default ConfirmParamsBlock;