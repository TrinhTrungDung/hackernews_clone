import React, { Component } from 'react';

require('./index.css');


class Search extends Component {
  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }

  render() {
    const {
      value,
      onChange,
      onSubmit,
      children
    } = this.props;

    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={element => this.input = element} />
        <button type="submit">
          {children}
        </button>
      </form>
    );
  }
}


export default Search;
