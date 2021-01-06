import React from 'react';
import './linkButton.css'
const LinkButton = ({text,click}) => {
    return(
        <button className='link-button' onClick={click}>{text}</button>
    )
}
export default LinkButton