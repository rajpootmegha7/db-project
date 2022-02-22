import React, { Component } from 'react'
import Cards from '../components/cards/cards'
import './dashboard.css'

export default class Dashboard extends Component {
    render() {
        return (
            <div className='cont-dashboard'>
                <div className='dash-message'><p>Welcome &nbsp;</p><p className='text-user'>{localStorage.getItem('username')}</p></div>
                <div className='card-conatiner'>
                    <span><Cards pname='Questions' pdesc='Various options for the user to be aware of the details on "where to cheers in!!" '  component={Cards}/></span>
                    <span><Cards pname='Saved Reference' pdesc='Details on the user preferences and search history'  component={Cards}/></span>
                </div>
                
            </div>
        )
    }
}
