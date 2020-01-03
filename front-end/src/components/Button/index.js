import React from 'react';
import { withLoading } from '../Loading';

require('./index.css');


const Button = ({ onClick, className = '', children }) => {
  return (
    <button
      onClick={onClick}
      className={className}
      type="button"
    >
      {children}
    </button>
  );
}


const LoadingButton = withLoading(Button);


export { Button, LoadingButton };
