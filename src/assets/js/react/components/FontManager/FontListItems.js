import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { clearAddFontMsg, deleteFont } from '../../actions/fontManager'
import fontManagerHandleKeyPress from '../../utilities/fontManagerHandleKeyPress'
import { toggleUpdateFont } from '../../utilities/toggleUpdateFont'
import FontListIcon from './FontListIcon'

export class FontListItems extends Component {
  static propTypes = {
    id: PropTypes.string,
    history: PropTypes.object.isRequired,
    clearAddFontMsg: PropTypes.func.isRequired,
    msg: PropTypes.object.isRequired,
    deleteFont: PropTypes.func.isRequired,
    fontList: PropTypes.arrayOf(
      PropTypes.shape({
        font_name: PropTypes.string.isRequired,
        shortname: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        useOTL: PropTypes.number.isRequired,
        useKashida: PropTypes.number.isRequired,
        regular: PropTypes.string.isRequired,
        italics: PropTypes.string.isRequired,
        bold: PropTypes.string.isRequired,
        bolditalics: PropTypes.string.isRequired
      })
    ).isRequired,
    searchResult: PropTypes.arrayOf(
      PropTypes.shape({
        font_name: PropTypes.string.isRequired,
        shortname: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        useOTL: PropTypes.number.isRequired,
        useKashida: PropTypes.number.isRequired,
        regular: PropTypes.string.isRequired,
        italics: PropTypes.string.isRequired,
        bold: PropTypes.string.isRequired,
        bolditalics: PropTypes.string.isRequired
      })
    )
  }

  handleFontClick = fontId => {
    const { id, history, clearAddFontMsg, msg: { success, error } } = this.props

    if ((success && success.addFont) || (error && error.addFont)) {
      clearAddFontMsg()
    }

    if (id === fontId) {
      return toggleUpdateFont(history)
    }

    toggleUpdateFont(history, fontId)
  }

  handleDeleteFont = (e, id) => {
    e.stopPropagation()

    const { deleteFont, history } = this.props

    if (window.confirm('Are you sure you want to delete this font?')) {
      deleteFont(id)
    }

    if (history.location.pathname !== '/fontmanager/') {
      history.push('/fontmanager/')
    }
  }

  render () {
    const { id, fontList, searchResult } = this.props
    const list = !searchResult ? fontList : searchResult

    return (
      <div className='font-list-items'>
        {list && list.map(font => {
          return (
            <div
              key={font.id}
              className={'font-list-item' + (font.id === id ? ' active' : '')}
              onClick={() => this.handleFontClick(font.id)}
              onKeyDown={e => fontManagerHandleKeyPress(e, font.id, this.handleFontClick)}
              tabIndex='144'
            >
              <span
                className='dashicons dashicons-trash'
                onClick={e => this.handleDeleteFont(e, font.id)}
                onKeyDown={e => fontManagerHandleKeyPress(e, font.id, this.handleDeleteFont, 'stopPropagation')}
                tabIndex='144'
              />

              <span className='font-name'>{font.font_name}</span>

              <FontListIcon font={font.regular} />
              <FontListIcon font={font.italics} />
              <FontListIcon font={font.bold} />
              <FontListIcon font={font.bolditalics} />
            </div>
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  fontList: state.fontManager.fontList,
  searchResult: state.fontManager.searchResult,
  msg: state.fontManager.msg
})

export default connect(mapStateToProps, { clearAddFontMsg, deleteFont })(FontListItems)
