import React, {Component} from 'react';

import './styles/base.scss';

export default class Footer extends Component{

    render() {
        return (

            <div className="footer table">
                <div className="table-cell">
                    <div className="copyright">{"© Storm Games. All rights reserved."}</div>
                </div>
            </div>
        );
    }
}