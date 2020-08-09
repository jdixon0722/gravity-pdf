import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class Alert extends Component {
  static propTypes = {
    msg: PropTypes.string.isRequired
  }

  state = {
    show: true
  }

  handleCloseAlert = () => {
    this.setState({ show: false })
  }

  render () {
    return (
      <div className={'alert-box danger delete' + (this.state.show ? '' : ' remove')}>
        <div dangerouslySetInnerHTML={{ __html: this.props.msg }} />

        <span className='dashicons dashicons-no-alt' onClick={this.handleCloseAlert} />
      </div>
    )
  }
}

export default Alert
