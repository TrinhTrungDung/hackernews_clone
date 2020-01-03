import React, { Component } from 'react';
import Search from '../Search';
import { LoadingButton } from '../Button';
import Table from '../Table';
import axios from 'axios';
import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP
} from '../../constants';

require('./index.css');


const updateSearchTopStoriesState = (hits, page) => (prevState) => {
  const { searchKey, searchResult } = prevState;
  const oldHits = searchResult && searchResult[searchKey]
    ? searchResult[searchKey].hits
    : [];
  const updatedHits = [
    ...oldHits,
    ...hits
  ];

  return {
    result: {
      ...[searchResult],
      [searchKey]: {
        hits: updatedHits,
        page
      }
    },
    isLoading: false
  }
}


const dismissStory = (id) => (prevState) => {
  const { searchKey, result } = prevState;
  const { hits, page } = result[searchKey];
  const isNotId = item => item.objectID !== id;
  const updatedHits = hits.filter(isNotId);

  return {
    result: {
      ...result,
      [searchKey]: {
        hits: updatedHits,
        page
      }
    }
  }
}


class App extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false
    };

    this.needSearchTopStories = this.needSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  needSearchTopStories(searchTerm) {
    return !this.state.result[searchTerm];
  }

  setSearchTopStories(result) {
    const { hits, page } = result;

    this.setState(updateSearchTopStoriesState(hits, page));
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error }));
  }

  componentDidMount() {
    this._isMounted = true;

    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillMount() {
    this._isMounted = false;
  }

  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;

    this.setState({ searchKey: searchTerm });

    if (this.needSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }

    event.preventDefault();
  }

  onDismiss(id) {
    this.setState(dismissStory(id));
  }

  render() {
    const {
      searchTerm,
      result,
      searchKey,
      error,
      isLoading
    } = this.state;
    const page = (
      result &&
      result[searchKey] &&
      result[searchKey].page
    ) || 0;
    const list = (
      result &&
      result[searchKey] &&
      result[searchKey].hits
    ) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>

        { error
          ? <div className="interactions">
              <p>Something went wrong.</p>
            </div>
          : <Table
            list={list}
            onDismiss={this.onDismiss}
          />
        }

        <div className="interactions">
          <LoadingButton
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </LoadingButton>
        </div>
      </div>
    );
  }
}


export default App;
