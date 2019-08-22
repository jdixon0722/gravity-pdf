import { Selector, t } from 'testcafe'
import { admin, baseURL } from '../../../auth'
import { link } from '../../helpers/field'

class ConfirmationShortcodes {
  constructor () {
    this.shortcodeField = Selector('.gravitypdf_shortcode')
    this.confirmationText = Selector('#form_confirmation_show_message')
    this.confirmationPage = Selector('#form_confirmation_show_page')
    this.pageSelect = Selector('select').withAttribute('id', 'form_confirmation_page')
    this.queryStringBox = Selector('input').withAttribute('id', 'form_page_use_querystring')
    this.textAreaBox = Selector('textarea').withAttribute('id', 'form_page_querystring')
    this.confirmationRedirect = Selector('#form_confirmation_redirect')
    this.wsiwigEditor = Selector('div').find('[class^="merge-tag-support mt-wp_editor mt-manual_position mt-position-right wp-editor-area ui-autocomplete-input"]')
    this.saveButton = Selector('input').withAttribute('value', 'Save Confirmation')
    this.formInputField = Selector('input').withAttribute('name', 'input_1')
    this.submitButton = Selector('input').withAttribute('value', 'Submit')
  }

  async navigateConfirmationsSection (text) {
    await t
      .useRole(admin)
      .navigateTo(`${baseURL}/wp-admin/admin.php?page=${text}`)
      .click(link('#the-list', 'Default Confirmation'))
  }
}

export default ConfirmationShortcodes
