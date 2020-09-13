import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SearchBox from './SearchBox'
import FontList from './FontList'
import AddFont from './AddFont'
import {
  getCustomFontList,
  addFont,
  editFont,
  clearAddFontMsg,
  clearDropzoneError
} from '../../actions/fontManager'
import Alert from '../Alert/Alert'
import { toggleUpdateFont } from '../../utilities/toggleUpdateFont'

export class FontManagerBody extends Component {
  static propTypes = {
    getCustomFontList: PropTypes.func.isRequired,
    id: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    fontList: PropTypes.arrayOf(PropTypes.object).isRequired,
    msg: PropTypes.object.isRequired,
    clearDropzoneError: PropTypes.func.isRequired,
    clearAddFontMsg: PropTypes.func.isRequired,
    editFont: PropTypes.func.isRequired,
    addFont: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }

  state = {
    label: '',
    fontStyles: {
      regular: '',
      italics: '',
      bold: '',
      bolditalics: ''
    },
    validateLabel: true,
    validateRegular: true
  }

  componentDidMount () {
    this.props.getCustomFontList()
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { id, fontList, msg } = this.props

    if (prevProps.id !== id && id) {
      this.handleRequestFontDetails()
    }

    if (prevProps.id !== id && !id) {
      this.handleRemoveFontDetails()
    }

    if (prevProps.fontList !== fontList && id && fontList) {
      this.handleRequestFontDetails()
    }

    /* Clean/refresh form fields after submission */
    if (prevProps.msg !== msg && msg.success && msg.success.addFont && !id) {
      this.handleRemoveFontDetails()
    }
  }

  handleRequestFontDetails = () => {
    const { fontList, id } = this.props
    const font = fontList.filter(font => font.id === id)[0]

    this.setState({
      label: font.font_name,
      fontStyles: {
        regular: font.regular,
        italics: font.italics,
        bold: font.bold,
        bolditalics: font.bolditalics
      },
      validateLabel: true,
      validateRegular: true
    })
  }

  handleRemoveFontDetails = () => {
    this.setState({
      label: '',
      fontStyles: {
        regular: '',
        italics: '',
        bold: '',
        bolditalics: ''
      },
      validateLabel: true,
      validateRegular: true
    })
  }

  handleDeleteFontStyle = (e, key) => {
    e.preventDefault()

    const { msg: { error }, clearDropzoneError } = this.props

    /* Remove addFont error */
    if (error && error.addFont) {
      const forValue = `gfpdf-font-variant-${key}`
      const dropZone = document.querySelector(`label[for=${forValue}]`)

      dropZone.classList.remove('error')
      clearDropzoneError(key)
    }

    this.state.fontStyles[key] = ''
    this.setState({ validateRegular: true })
    this.forceUpdate()
  }

  handleInputChange = e => {
    this.setState({ label: e.target.value })
  }

  handleUpload = (key, file) => {
    this.setState({ fontStyles: { ...this.state.fontStyles, [key]: file } })
  }

  validateInputFields = (label, regular) => {
    let labelField = false
    let regularField = false

    /* Regex will allow only a-z, A-Z, and 0-9 */
    const checkSpecialCharRegex = /^[0-9a-zA-Z ]*$/

    if (!checkSpecialCharRegex.test(label) || label === '') {
      labelField = false
      this.setState({ validateLabel: false })
    }

    if (checkSpecialCharRegex.test(label) && label !== '') {
      labelField = true
      this.setState({ validateLabel: true })
    }

    if (!regular) {
      regularField = false
      this.setState({ validateRegular: false })
    }

    if (regular) {
      regularField = true
      this.setState({ validateRegular: true })
    }

    if (labelField && regularField) {
      return true
    }

    return false
  }

  handleAddFont = () => {
    const { label, fontStyles } = this.state
    const { clearAddFontMsg, addFont } = this.props

    if (!this.validateInputFields(label, fontStyles.regular)) {
      return clearAddFontMsg()
    }

    addFont({ label, ...fontStyles })
  }

  handleEditFont = id => {
    const { label, fontStyles } = this.state
    const { clearAddFontMsg, fontList, editFont } = this.props
    const data = {}

    if (!this.validateInputFields(label, fontStyles.regular)) {
      return clearAddFontMsg()
    }

    /* Construct the data to be submitted */
    Object.keys(fontStyles).forEach(key => {
      if (typeof fontStyles[key] === 'object' || fontStyles[key] === '') {
        data[key] = fontStyles[key]
      }
    })

    const currentFont = fontList.filter(font => font.id === id)[0]
    const currentFontStyles = {
      regular: currentFont.regular,
      italics: currentFont.italics,
      bold: currentFont.bold,
      bolditalics: currentFont.bolditalics
    }

    /* Check if there's no changes in current font data */
    if (
      label === currentFont.font_name &&
      JSON.stringify(fontStyles) === JSON.stringify(currentFontStyles)
    ) {
      return
    }

    editFont({ id, font: { label, ...data } })
  }

  handleCancelEditFont = () => {
    const { history, clearAddFontMsg } = this.props

    toggleUpdateFont(history)
    clearAddFontMsg()
  }

  handleSubmit = e => {
    e.preventDefault()

    const { id } = this.props

    if (id) {
      return this.handleEditFont(id)
    }

    this.handleAddFont()
  }

  render () {
    const { id, msg, loading, history } = this.props
    const slideFontColumnVisible = document.querySelector('.add-font-column .show')

    return (
      <div id='gfpdf-font-manager-container' className='wp-clearfix theme-about'>
        <div>
          <SearchBox id={id} />

          {msg.error && msg.error.deleteFont && <Alert msg={msg.error.deleteFont} />}

          <FontList id={id} history={history} />
        </div>

        <div className='add-font-column'>
          <AddFont
            style='slide-update-font'
            onHandleInputChange={this.handleInputChange}
            onHandleUpload={this.handleUpload}
            onHandleDeleteFontStyle={this.handleDeleteFontStyle}
            onHandleCancelEditFont={this.handleCancelEditFont}
            onHandleSubmit={this.handleSubmit}
            id={id}
            msg={msg}
            loading={loading}
            tabIndexFontName={slideFontColumnVisible ? '145' : '0'}
            tabIndexFontFiles={slideFontColumnVisible ? '146' : '0'}
            tabIndexFooterButtons={slideFontColumnVisible ? '147' : '0'}
            {...this.state}
          />

          <AddFont
            onHandleInputChange={this.handleInputChange}
            onHandleUpload={this.handleUpload}
            onHandleDeleteFontStyle={this.handleDeleteFontStyle}
            onHandleCancelEditFont={this.handleCancelEditFont}
            onHandleSubmit={this.handleSubmit}
            id={id}
            msg={msg}
            loading={loading}
            tabIndexFontName={!slideFontColumnVisible ? '145' : '0'}
            tabIndexFontFiles={!slideFontColumnVisible ? '146' : '0'}
            tabIndexFooterButtons={!slideFontColumnVisible ? '147' : '0'}
            {...this.state}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loading: state.fontManager.addFontLoading,
  fontList: state.fontManager.fontList,
  searchResult: state.fontManager.searchResult,
  msg: state.fontManager.msg
})

export default connect(mapStateToProps, {
  getCustomFontList,
  addFont,
  editFont,
  clearAddFontMsg,
  clearDropzoneError
})(FontManagerBody)
