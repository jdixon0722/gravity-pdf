import React from 'react'
import PropTypes from 'prop-types'
import Spinner from '../Spinner'

const AddFontFooter = ({
  id,
  onHandleCancelEditFont,
  msg: { success, error }, loading,
  tabIndexFooterButtons
}) => {
  const cancelButton = document.querySelector('.footer button.cancel')

  return (
    <div className={'footer' + (cancelButton ? ' cancel' : '')}>
      {id && (
        <button
          className='button gfpdf-button primary cancel'
          onClick={onHandleCancelEditFont}
          tabIndex={tabIndexFooterButtons}
        >
          ← Cancel
        </button>
      )}

      <button
        className='button gfpdf-button primary'
        tabIndex={tabIndexFooterButtons}
      >
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
  loading: PropTypes.bool.isRequired,
  tabIndexFooterButtons: PropTypes.string.isRequired
}

export default AddFontFooter
