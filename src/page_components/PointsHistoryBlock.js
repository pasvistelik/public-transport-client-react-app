import React, { Component } from 'react';
import PointsHistoryStorage from 'public-transport-client/lib/pointsHistoryStorage';

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
        var filter_text = "";
        if (this.props.filter) filter_text = this.props.filter.toLowerCase();
        /*console.log(this.state.historyList.filter(function(value){
            return value.description.toLowerCase().indexOf(filter_text) > -1;
        }));*/
        var filteredHistory = this.state.historyList.filter(function(value){
            return !value.isFavorite && value.description.toLowerCase().indexOf(filter_text) > -1;
        });
        var filteredFavorites = this.state.historyList.filter(function(value){
            return value.description.toLowerCase().indexOf(filter_text) > -1 && value.isFavorite;
        });
        var filteredHistoryContent = "";
        var self = this;
        if (filteredHistory.length !== 0){
            filteredHistoryContent = (
                <span>
                <li role="presentation" className="dropdown-header">Недавно использованные:</li>
                {filteredHistory.map(function(item, index){
                    let handler = function() {
                        //console.log(item);
                        setPointHandler({lat: item.lat, lng: item.lng}, item.description);
                    }
                    let deleteHandler = function() {
                        
                    }
                    let favoriteHandler = function() {
                        item.isFavorite = ! item.isFavorite;
                        self.setState({
                            tmp: new Date()
                        });
                    }
                    /*
                    <span className="glyphicon glyphicon-heart-empty"></span>
                    <a role="menuitem" tabIndex="-1" href="#">
                        {item.description}
                    </a>
                    <span className="glyphicon glyphicon-trash"></span>
                    */
                    return (
                        <li 
                            key={index} 
                            
                            role="presentation"
                            className="history-item"
                        >
                            

                            <table className="table table-condensed history-table">

                                <tr>
                                    <td onClick={favoriteHandler} className="with-icon"><span className="glyphicon glyphicon-heart-empty in-table"></span></td>
                                    <td style={{width: '100%'}} className="td-link" onClick={handler}>
                                            {item.description}</td>
                                    <td onClick={deleteHandler} className="with-icon"><span className="glyphicon glyphicon-trash in-table"></span></td>
                                </tr>
                            </table>
                        </li>
                    );//<FindedWay key={index} way={item}/>;
                })}
                </span>
            );
        }
        var filteredFavoritesContent = "";
        if (filteredFavorites && filteredFavorites.length !== 0){
            filteredFavoritesContent = (
                <span>
                <li role="presentation" className="dropdown-header">Избранные места:</li>
                {filteredFavorites.map(function(item, index){
                    let handler = function() {
                        //console.log(item);
                        setPointHandler({lat: item.lat, lng: item.lng}, item.description);
                    }
                    let deleteHandler = function() {
                        
                    }
                    let favoriteHandler = function() {
                        item.isFavorite = ! item.isFavorite;
                        self.setState({
                            tmp: new Date()
                        });
                    }
                    return (
                        <li 
                            key={index} 
                            role="presentation"
                            className="history-item"
                        >
                            <table className="table table-condensed history-table">

                                <tr>
                                    <td onClick={favoriteHandler} className="with-icon"><span className="glyphicon glyphicon-heart in-table"></span></td>
                                    <td style={{width: '100%'}}><a onClick={handler} role="menuitem" tabIndex="-1">
                                            {item.description}
                                        </a></td>
                                    <td onClick={deleteHandler} className="with-icon"><span className="glyphicon glyphicon-trash in-table"></span></td>
                                </tr>
                            </table>
                        </li>
                    );//<FindedWay key={index} way={item}/>;
                })}
                </span>
            );
        }
        if(filteredFavorites.length !== 0 || filteredHistory.length !== 0){
            //dropdown-menu 
            return(<ul className="menu-scroll" role="menu" aria-labelledby="menu1">
                    {filteredFavoritesContent}
                    {filteredHistoryContent}
                </ul>
            );
        }
        else{
            //className="dropdown-menu"
            return(<ul style={{display:'none'}}  role="menu" aria-labelledby="menu1"></ul>);
        }
        /*return(
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
        );*/
    }
}

export default PointsHistoryBlock;