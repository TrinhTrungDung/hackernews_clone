import React from 'react';
import classNames from 'classnames';
import { Button } from '../Button';


const Sort = ({
  sortKey,
  activateSortKey,
  onSort,
  children
}) => {
  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activateSortKey }
  );

  return (
    <Button
      onClick={() => onSort(sortKey)}
      className={sortClass}
    >
      {children}
    </Button>
  );
}


export default Sort;
