import React, { Component } from 'react';
import { connect } from 'react-redux'
import { changeCategory } from '../actions'
import { Grid, Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class CategoryMenu extends Component {
  state = { }

  handleItemClick = (e, obj) => this.props.changeCategory(obj.name)

  componentDidUpdate(prevProps){
    const { categories, matchedCategory, selectedCategory, changeCategory, history } = this.props
    if(prevProps.categories !== categories && selectedCategory !== matchedCategory) {
      const validCategoryFound = matchedCategory ==='all' || categories.find(c => c.path === matchedCategory)

      // TODO: Rever essa lógica que falha quando habilita o re-fetch
      if (validCategoryFound){
        changeCategory(matchedCategory)
      } else {
        history.push('/')
      }
    }
  }

  render() {
    const { categories, selectedCategory } = this.props

    return (
      <Grid.Column width={2} stretched>
        <Menu fluid vertical tabular>
          <Menu.Item as={Link} to='/' name='all' active={selectedCategory === 'all'} onClick={this.handleItemClick} >Todos</Menu.Item>
          {categories.map(c => (
            <Menu.Item as={Link} to={'/' + c.path} key={c.path} name={c.path} active={selectedCategory === c.path} onClick={this.handleItemClick} />
          ))}
        </Menu>
      </Grid.Column>
    )
  }
}

function mapStateToProps ({ categories, selectedCategory }) {
  return { categories, selectedCategory }
}

function mapDispatchToProps (dispatch) {
  return {
    changeCategory: (data) => dispatch(changeCategory(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryMenu)
