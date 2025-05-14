import React from 'react'

const CustomToolTip = ({active,payload}) => {

if(active && payload && payload.length) {
return (
    <div className=''>
        <p className=''>{payload[0].name}</p>
        <p className=''>
            Count:<span className=''>{payload[0].value}</span>
        </p>
    </div>
);
}  
return null;
}

export default CustomToolTip
