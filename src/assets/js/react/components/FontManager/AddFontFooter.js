import React from 'react'
import PropTypes from 'prop-types'
import Spinner from '../Spinner'

const AddFontFooter = ({ id, onHandleCancelEditFont, msg: { success, error }, loading }) => {
  const cancelButton = document.querySelector('.footer button.cancel')

  return (
    <div className={'footer' + (cancelButton ? ' cancel' : '')}>
      {id && (
        <button className='button gfpdf-button primary cancel' onClick={onHandleCancelEditFont} tabIndex='147'>
          ← Cancel
        </button>
      )}

      <button className='button gfpdf-button primary' tabIndex='147'>
        {id ? 'Update Font  →' : 'Add Font  →'}
      </button>

      {loading && <Spinner style='add-font' />}

      {success && success.addFont && (
        <span className='msg success' dangerouslySetInnerHTML={{ __html: success.addFont }} />
      )}

      {error && typeof error.addFont === 'string' && (
        <span className='msg error' dangerouslySetInnerHTML={{ __html: error.addFont }} />
      )}
    </div>
  )
}

AddFontFooter.propTypes = {
  id: PropTypes.string,
  onHandleCancelEditFont: PropTypes.func.isRequired,
  msg: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
}

export default AddFontFooter
