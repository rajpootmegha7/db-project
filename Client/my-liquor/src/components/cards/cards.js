import React, {Component} from 'react'
import './cards.css'
import{Link} from 'react-router-dom'


/**
* @author Mukesh Mohanty
* @function Cards
**/

class Cards extends Component{
    render(){
        const link_name = { pathname: '/my-liquorstore/' + (this.props.pname).toLowerCase() };
        const pname = this.props.pname;
        return(
            <div className='container'>
                <div className='card'>
                    <div className='face face1'>
                        <div className='content'>
                            <h3>{pname}</h3>
                        </div>
                    </div>
                    <div className='face face2'>
                        <div className='content'>
                            <p className='p1'>{this.props.pdesc}</p>
                            <Link to={link_name} ><button className='button1'>Details</button></Link>
                        </div>
                    </div>
                </div>

            </div>
        );
    }

}

export default Cards