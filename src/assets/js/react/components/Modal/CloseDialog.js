import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { toggleUpdateFont } from '../../utilities/toggleUpdateFont'
import associatedFontManagerSelectBox from '../../utilities/associatedFontManagerSelectBox'

/**
 * Renders our close dialog element
 *
 * @package     Gravity PDF
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       6.0
 */

/**
 * React Component
 *
 * @since 6.0
 */
export class CloseDialog extends React.Component {
  /**
   * @since 6.0
   */
  static propTypes = {
    id: PropTypes.string,
    closeRoute: PropTypes.string,
    fontList: PropTypes.arrayOf(PropTypes.object).isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  /**
   * Assign keydown listener to document on mount
   *
   * @since 6.0
   */
  componentDidMount () {
    document.addEventListener('keydown', this.handleKeyPress, false)
  }

  /**
   * Remove keydown listener to document on mount
   *
   * @since 6.0
   */
  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyPress, false)

    const { location: { pathname }, fontList } = this.props
    const tabLocation = window.location.search.substr(window.location.search.lastIndexOf('=') + 1)

    /* Ensure associated font manager select box has the latest data */
    if (pathname.includes('/fontmanager/') && tabLocation === 'general') {
      associatedFontManagerSelectBox(fontList)
    }
  }

  /**
   * Check if Escape key pressed and current event target isn't our search box,
   * or the search box is blank already
   *
   * @param {Object} e Event
   *
   * @since 6.0
   */
  handleKeyPress = e => {
    const { id, history } = this.props

    /* Close font manager edit/update state first */
    if (e.keyCode === 27 && id) {
      return toggleUpdateFont(history)
    }

    /* Close modal */
    if (e.keyCode === 27 && (e.target.className !== 'wp-filter-search' || e.target.value === '')) {
      this.handleCloseDialog()
    }
  }

  /**
   * @since 6.0
   */
  handleCloseDialog = () => {
    /* trigger router */
    this.props.history.push(this.props.closeRoute || '/')
  }

  /**
   * @since 6.0
   */
  render () {
    return (
      <button
        data-test='component-CloseDialog'
        className='close dashicons dashicons-no'
        tabIndex='142'
        onClick={this.handleCloseDialog}
        onKeyDown={this.handleKeyPress}
        aria-label='close'
      >
        <span className='screen-reader-text'>Close dialog</span>
      </button>
    )
  }
}

const mapStateToProps = state => ({
  fontList: state.fontManager.fontList
})

export default withRouter(connect(mapStateToProps, {})(CloseDialog))
