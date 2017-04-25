import React, { Component } from 'react';
import PointsHistoryStorage from './../modules/client/pointsHistoryStorage';

class PointsHistoryBlock extends Component {
    constructor (props) {
        super(props);
        this.state = {
            historyList: []
        };
        this.UpdatePointsHistory = this.UpdatePointsHistory.bind(this);
        //this.changePoint = this.changePoint.bind(this);
        this.UpdatePointsHistory();
    }
    async UpdatePointsHistory() {
        let newHistoryList = await PointsHistoryStorage.getAllPoints();
        this.setState({
            historyList: newHistoryList
        });
    }
    render() {
        var setPointHandler = /*function() {alert('');}/*/ this.props.setPointHandler;
        return(
            <div id="pointsHistoryBlock">
                <details>
                    <summary>История использованных точек</summary>
                    <div>
                        { this.state.historyList.map(function(item, index){
                            let handler = function() {
                                //console.log(item);
                                setPointHandler({lat: item.lat, lng: item.lng}, item.description);
                            }
                            return (
                                <div 
                                    key={index} 
                                    onClick={handler} 
                                    style={{padding: '10px', borderBottom: '1px dotted #ccc'}} 
                                    className="resultLink"
                                >
                                    {item.description}
                                </div>
                            );//<FindedWay key={index} way={item}/>;
                        })}
                    </div>
                </details>
            </div>
        );
    }
}

export default PointsHistoryBlock;