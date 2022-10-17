import React from 'react';
import { Link } from 'react-router-dom';

const File404 = () => {
    return (
        <>
            <div className='text-center mt-5 py-3 bg-dark'>
                <h1 className='display-1 text-light mb-4'>Page not found!!</h1>
                <Link className='link-light' to="/">Go to home</Link>
            </div>  
        </>
    );
};

export default File404;