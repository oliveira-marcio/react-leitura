import React, { Component } from 'react';
import * as ServerAPI from '../utils/ServerAPI'
import { connect } from 'react-redux'
import { addAllCategories, addAllPosts, addNewPost, deletePost } from '../actions'
import HeaderMenu from './HeaderMenu'
import CategoryMenu from './CategoryMenu'
import PostList from './PostList'
import { Grid } from 'semantic-ui-react'
import { Route, Redirect, Switch } from 'react-router-dom'

class App extends Component {
  state = {
    selectedCategory: 'all',
    sortOrder: 'voteScore'
  }

  changeCategory = (category) => {
    const { addCategories, addPosts } = this.props
    console.log(category)
    ServerAPI.getAllCategories().then(c => addCategories(c))
    ServerAPI.getAllPosts().then(p => addPosts(p))
    this.setState({ selectedCategory: category })
    // TODO: Tratar .catch()
  }

  changeOrder = (order) => {
    this.setState({ sortOrder: order })
  }

  addNewPost = (post) => {
    this.props.addNewPost(post)
    ServerAPI.addPost(post)
    .then(res => {
      if(!res.hasOwnProperty('id'))
        console.log('erro na inserção')
        // TODO: Fazer Rollback
    })
    // TODO: Tratar .catch()
  }

  deletePost = (post) => {
    this.props.deletePost(post)
  }

  componentDidMount(){
    console.log('all')
    const { addCategories, addPosts } = this.props
    ServerAPI.getAllCategories().then(c => addCategories(c))
    ServerAPI.getAllPosts().then(p => addPosts(p))
    // TODO: Tratar .catch()
  }

  render() {
    const { sortOrder } = this.state

    return (
      <Grid divided='vertically' columns='equal' style={{ padding: '1em' }}>
        <Grid.Row columns={1}>
          <HeaderMenu
            sortOrder = { sortOrder }
            onChangeOrder = { this.changeOrder }
            onAddPost = { this.addNewPost }
          />
        </Grid.Row>
        <Switch>
          <Route exact path = '/' render = { this.doRoute } />
          <Route exact path = '/:category' render = { this.doRoute } />
          <Redirect to="/" />
        </Switch>
      </Grid>
    )
  }

  doRoute = (props) => {
    const { selectedCategory, sortOrder} = this.state

    const matchedCategory = props.match.params.category ? props.match.params.category : 'all'

    return (
      <Grid.Row columns={2}>
        <CategoryMenu
          selectedCategory = { selectedCategory }
          matchedCategory = { matchedCategory }
          history = { props.history }
          onChangeCategory = { this.changeCategory }
        />
        <PostList
          sortOrder={ sortOrder }
          selectedCategory = { selectedCategory }
          onDeletePost = { this.deletePost }
        />
      </Grid.Row>
    )
  }
}

function mapStateToProps ({ categories }) {
  return { categories }
}

function mapDispatchToProps (dispatch) {
  return {
    addCategories: (data) => dispatch(addAllCategories(data)),
    addPosts: (data) => dispatch(addAllPosts(data)),
    addNewPost: (data) => dispatch(addNewPost(data)),
    deletePost: (data) => dispatch(deletePost(data))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
