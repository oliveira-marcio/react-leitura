import React, { Component } from 'react';
import { connect } from 'react-redux'
import { fetchData, fetchPostComments, addNewComment,
        updateComment, removeComment, voteComment } from '../actions'
import { withRouter } from 'react-router-dom'
import { Grid, Segment, Label, Icon, Comment,
        Header, Button, Message } from 'semantic-ui-react'
import Post from './Post'
import CommentEdit from './CommentEdit'
import DeletionModal from './DeletionModal'
import sortBy from 'sort-by'
import { formatData } from '../utils/helpers'
import PropTypes from 'prop-types'

class PostDetails extends Component {
  state = {
    currentPost: {},
    currentComment: {},
    editModalOpen: false,
    deleteModalOpen: false
  }

  openEditCommentModal = (comment = { parentId: this.state.currentPost.id }) => {
    this.setState(
      {
        editModalOpen: true,
        currentComment: comment }
      )
  }

  closeEditCommentModal = () => this.setState(
    {
      editModalOpen: false,
      currentComment: {}
    }
  )

  openDeleteModal = (comment) => this.setState(
    {
      deleteModalOpen: true,
      currentComment: comment
    }
  )

  closeDeleteModal = () => this.setState(
    {
      deleteModalOpen: false,
      currentComment: {}
    }
  )

  updateComment = (newComment) => {
    const { currentComment } = this.state
    const { updateComment } = this.props
    updateComment(currentComment, newComment)
  }

  handleDeleteModalAction = () => {
    const { removeComment } = this.props
    const { currentComment } = this.state
    removeComment(currentComment)
    this.closeDeleteModal()
  }

  componentDidMount(){
    const { match, posts, fetchPostComments } = this.props
    const currentPost = posts.find(p => p.id === match.params.id)
    if(currentPost){
      fetchPostComments(currentPost)
      this.setState({ currentPost })
    }
  }

  componentDidUpdate(prevProps){
    const { match, posts, fetchPostComments } = this.props
    const currentPost = posts.find(p => p.id === match.params.id)
    if(currentPost && prevProps.posts.length !== posts.length){
      fetchPostComments(currentPost)
      this.setState({ currentPost })
    }
  }

  render() {
    const { comments, sortOrder, addNewComment, voteComment } = this.props
    const { currentPost, currentComment, editModalOpen, deleteModalOpen } = this.state

    const sortedComments = comments
    .filter(c => c.parentId === currentPost.id)
    .sort(sortBy('-' + sortOrder))

    return (
      <Grid.Column>
        {currentPost ? (
          <Segment style={{ padding: '2em' }}>
            <Post
              showDetails = { true }
              selectedPost = { currentPost }
            />

            <Comment.Group>
              <Button
                primary
                content='Adicionar Comentário'
                labelPosition='left'
                icon='edit'
                onClick={ () => this.openEditCommentModal() }
              />
              <Header as='h3' dividing>
                Comentários ({currentPost.commentCount})
              </Header>

              {sortedComments.length ? sortedComments.map(comment => (
                <Comment key={ comment.id }>
                  <Comment.Avatar src='/avatar.jpg' />
                  <Comment.Content>
                    <Comment.Author as='a'>{comment.author}</Comment.Author>
                    <Comment.Metadata>
                      <div>{formatData(comment.timestamp)}</div>
                    </Comment.Metadata>
                    <Comment.Text>{comment.body}</Comment.Text>
                    <Comment.Actions>
                      <Label size='mini'>
                        <Icon name='thumbs up' /> {comment.voteScore}
                      </Label>
                      &nbsp;
                      <Comment.Action onClick={() => voteComment(comment, 'upVote')}>
                        &#9650;
                      </Comment.Action>
                      <Comment.Action onClick={() => voteComment(comment, 'downVote')}>
                        &#9660;
                      </Comment.Action>
                      &#8226;&nbsp;&nbsp;
                      <Comment.Action onClick={() => this.openEditCommentModal()}>
                        Responder
                      </Comment.Action>
                      &#8226;&nbsp;&nbsp;&nbsp;
                      <Comment.Action onClick={() => this.openEditCommentModal(comment)}>
                        Editar
                      </Comment.Action>
                      &#8226;&nbsp;&nbsp;&nbsp;
                      <Comment.Action onClick={() => this.openDeleteModal(comment)}>
                        Apagar
                      </Comment.Action>
                    </Comment.Actions>
                  </Comment.Content>
                </Comment>
              )) : (
                <Message info>
                  <Message.Header>Ainda não há comentários</Message.Header>
                  <p>
                    Contribua e seja o primeiro. Sua participação é muito importante.
                  </p>
                </Message>
              )}
            </Comment.Group>
          </Segment>
        ) : (
          <Segment style={{ padding: '2em' }}><h3>Post não encontrado.</h3></Segment>
        )}

        <CommentEdit
          modalOpen={ editModalOpen }
          onCloseModal={ this.closeEditCommentModal }
          isNewComment={ !currentComment.hasOwnProperty('id') }
          comment={ currentComment }
          onChangeComment={ currentComment.hasOwnProperty('id') ?
            this.updateComment : addNewComment }
        />

        <DeletionModal
          modalOpen={ deleteModalOpen }
          modalBody={ 'Deseja apagar o comentário selecionado?' }
          onCancel={ this.closeDeleteModal }
          onConfirm={ this.handleDeleteModalAction }
        />
      </Grid.Column>
    )
  }
}

function mapStateToProps ({ posts, comments, sortOrder }) {
  return { posts, comments, sortOrder }
}

function mapDispatchToProps (dispatch) {
  return {
    fetchData: () => dispatch(fetchData()),
    fetchPostComments: (data) => dispatch(fetchPostComments(data)),
    addNewComment: (data) => dispatch(addNewComment(data)),
    updateComment: (oldData, newData) => dispatch(updateComment(oldData, newData)),
    removeComment: (data) => dispatch(removeComment(data)),
    voteComment: (comment, option) => dispatch(voteComment(comment, option))
  }
}

PostDetails.propTypes = {
  addNewComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
  fetchData: PropTypes.func.isRequired,
  fetchPostComments: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  posts: PropTypes.array.isRequired,
  removeComment: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  updateComment: PropTypes.func.isRequired,
  voteComment: PropTypes.func.isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostDetails))
