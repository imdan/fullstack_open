import React from 'react';
// import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { filterChange } from '../reducers/filterReducer';

const Filter = props => {
  // const dispatch = useDispatch();
  const handleChange = event => {
    // dispatch(filterChange(event.target.value));
    props.filterChange(event.target.value);
  };

  const style = {
    marginBottom: '10px'
  };

  return (
    <div style={style}>
      filter <input type='text' onChange={handleChange} />
    </div>
  );
};

const mapDispatchToProps = {
  filterChange
};

const ConnectedFilter = connect(
  null,
  mapDispatchToProps
)(Filter);
export default ConnectedFilter;
