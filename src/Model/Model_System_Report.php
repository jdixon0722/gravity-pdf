<?php

namespace GFPDF\Model;

use GFPDF\Helper\Helper_Abstract_Model;
use GFPDF\Helper\Helper_Abstract_Options;
use GFPDF\Helper\Helper_Data;
use GFPDF_Major_Compatibility_Checks;
use GPDFAPI;

/**
 * @package     Gravity PDF
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

/* Exit if accessed directly */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Model_System_Report
 *
 * A general class for System Report
 *
 * @since 6.0
 */
class Model_System_Report extends Helper_Abstract_Model {

	/**
	 * @var Helper_Abstract_Options
	 *
	 * @since 6.0
	 */
	protected $options;

	/**
	 * @var Helper_Data
	 *
	 * @since 6.0
	 */
	protected $data;

	/**
	 * @var GFPDF_Major_Compatibility_Checks
	 *
	 * @since 6.0
	 */
	protected $status;

	/**
	 * Setup our class by setting our option with the global var
	 *
	 * @since 6.0
	 */
	public function __construct( Helper_Abstract_Options $options, Helper_Data $data, GFPDF_Major_Compatibility_Checks $status ) {
		$this->options = $options;
		$this->data    = $data;
		$this->status  = $status;
	}

	/**
	 * Build Gravity PDF System Report array.
	 *
	 * @return array
	 * @since 6.0
	 */
	public function build_gravitypdf_report(): array {
		$structure = $this->get_report_structure();
		foreach ( $this->get_report_items() as $index => $report ) {
			foreach ( $report as $id => $info ) {
				$structure[0]['tables'][ $index ]['items'][ $id ] = $info;
			}
		}

		return $structure;
	}

	/**
	 * Set up array structure of Gravity PDF System Report
	 *
	 * @return array
	 * @since 6.0
	 */
	public function get_report_structure(): array {
		$title_export_prefix = 'Gravity PDF - ';
		return [
			[
				'title'        => esc_html__( 'Gravity PDF Environment', 'gravity-forms-pdf-extended' ),
				'title_export' => 'Gravity PDF Environment',
				'tables'       => [
					[
						'title'        => esc_html__( 'PHP', 'gravity-forms-pdf-extended' ),
						'title_export' => $title_export_prefix . 'PHP',
						'items'        => [],
					],

					[
						'title'        => esc_html__( 'Directories and Permissions', 'gravity-forms-pdf-extended' ),
						'title_export' => $title_export_prefix . 'Directories and Permissions',
						'items'        => [],
					],

					[
						'title'        => esc_html__( 'Global Settings', 'gravity-forms-pdf-extended' ),
						'title_export' => $title_export_prefix . 'Global Settings',
						'items'        => [],
					],

					[
						'title'        => esc_html__( 'Security Settings', 'gravity-forms-pdf-extended' ),
						'title_export' => $title_export_prefix . 'Security Settings',
						'items'        => [],
					],
				],
			],
		];
	}

	/**
	 * Get array report structure of Gravity PDF System Report
	 *
	 * @return array
	 * @since 6.0
	 */
	protected function get_report_items(): array {
		$items                  = [];
		$memory                 = $this->get_memory_limit();
		$allow_url_fopen        = $this->get_allow_url_fopen();
		$temp_folder_protected  = $this->check_temp_folder_permission();
		$temp_folder_permission = $this->is_temporary_folder_writable();

		/* PHP */
		$items[0] = [
			'memory'            => [
				'label'        => esc_html__( 'WP Memory', 'gravity-forms-pdf-extended' ),
				'value'        => $memory['value'],
				'value_export' => $memory['value_export'],
			],

			'allow_url_fopen'   => [
				'label'        => 'allow_url_fopen',
				'value'        => $allow_url_fopen['value'],
				'value_export' => $allow_url_fopen['value_export'],
			],

			'default_charset'   => [
				'label' => esc_html__( 'Default Charset', 'gravity-forms-pdf-extended' ),
				'value' => ini_get( 'default_charset' ),
			],

			'internal_encoding' => [
				'label' => esc_html__( 'Internal Encoding', 'gravity-forms-pdf-extended' ),
				'value' => ini_get( 'internal_encoding' ) ?: ini_get( 'default_charset' ),
			],
		];

		/* Directory and Permissions */
		$items[1] = [
			'pdf_working_directory'     => [
				'label' => esc_html__( 'PDF Working Directory', 'gravity-forms-pdf-extended' ),
				'value' => $this->data->template_location,
			],

			'pdf_working_directory_url' => [
				'label' => esc_html__( 'PDF Working Directory URL', 'gravity-forms-pdf-extended' ),
				'value' => $this->data->template_location_url,
			],

			'font_folder_location'      => [
				'label' => esc_html__( 'Font Folder location', 'gravity-forms-pdf-extended' ),
				'value' => $this->data->template_font_location,
			],

			'temp_folder_location'      => [
				'label' => esc_html__( 'Temporary Folder location', 'gravity-forms-pdf-extended' ),
				'value' => $this->data->template_tmp_location,
			],

			'temp_folder_permission'    => [
				'label'        => esc_html__( 'Temporary Folder permissions', 'gravity-forms-pdf-extended' ),
				'value'        => $temp_folder_permission['value'],
				'value_export' => $temp_folder_permission['value_export'],
			],

			'temp_folder_protected'     => [
				'label'        => esc_html__( 'Temporary Folder protected', 'gravity-forms-pdf-extended' ),
				'value'        => $temp_folder_protected['value'],
				'value_export' => $temp_folder_protected['value_export'],
			],

			'mpdf_temp_folder_location' => [
				'label' => esc_html__( 'mPDF Temporary location', 'gravity-forms-pdf-extended' ),
				'value' => $this->data->mpdf_tmp_location,
			],
		];

		/* Global Settings */
		$items[2] = [
			'pdf_entry_list_action'         => [
				'label'        => esc_html__( 'PDF Entry List Action', 'gravity-forms-pdf-extended' ),
				'value'        => $this->options->get_option( 'default_action' ) === 'View' ? esc_html__( 'View', 'gravity-forms-pdf-extended' ) : esc_html__( 'Download', 'gravity-forms-pdf-extended' ),
				'value_export' => $this->options->get_option( 'default_action' ),
			],

			'background_processing_enabled' => [
				'label'        => esc_html__( 'Background Processing', 'gravity-forms-pdf-extended' ),
				'value'        => $this->options->get_option( 'background_processing' ) === 'Yes' ? $this->getController()->view->get_icon( true ) : esc_html__( 'Off', 'gravity-forms-pdf-extended' ),
				'value_export' => $this->options->get_option( 'background_processing' ),
			],

			'debug_mode_enabled'            => [
				'label'        => esc_html__( 'Debug Mode', 'gravity-forms-pdf-extended' ),
				'value'        => $this->options->get_option( 'debug_mode' ) === 'Yes' ? $this->getController()->view->get_icon( true ) : esc_html__( 'Off', 'gravity-forms-pdf-extended' ),
				'value_export' => $this->options->get_option( 'debug_mode' ),
			],
		];

		/* Security Settings */
		$items[3] = [
			'user_restrictions'  => [
				'label' => esc_html__( 'User Restrictions', 'gravity-forms-pdf-extended' ),
				'value' => implode( ', ', $this->options->get_option( 'admin_capabilities', [ 'gravityforms_view_entries' ] ) ),
			],

			'logged_out_timeout' => [
				'label'        => esc_html__( 'Logged Out Timeout', 'gravity-forms-pdf-extended' ),
				'value'        => $this->options->get_option( 'logged_out_timeout' ) . ' ' . esc_html__( 'minute(s)', 'gravity-forms-pdf-extended' ),
				'value_export' => $this->options->get_option( 'logged_out_timeout' ) . ' minutes(s)',
			],
		];

		return $items;
	}

	/**
	 * Returns text and dashicon for Memory Limit
	 *
	 * @return string
	 * @since 6.0
	 */
	protected function get_memory_limit(): array {
		$memory = $this->status->get_ram( $this->data->memory_limit );

		return [
			'value'        => $this->getController()->view->memory_limit_markup( $memory ),
			'value_export' => $memory . 'MB',
		];
	}

	/**
	 * @since 6.0
	 */
	protected function get_allow_url_fopen(): array {
		$allow_url_fopen = $this->data->allow_url_fopen;
		$icon            = $this->getController()->view->get_allow_url_fopen( $allow_url_fopen );
		$text            = $allow_url_fopen ? 'Yes' : 'No';

		return [
			'value'        => $icon,
			'value_export' => $text,
		];
	}

	/**
	 * Returns the mark up once the temp folder test is completed.
	 *
	 * @return string
	 * @since 6.0
	 */
	protected function check_temp_folder_permission(): array {
		/** @var Model_Settings $settings */
		$settings   = GPDFAPI::get_mvc_class( 'Model_Settings' );
		$permission = $settings->test_public_tmp_directory_access();

		return [
			'value'        => $this->getController()->view->get_temp_folder_protected( $permission ),
			'value_export' => $permission ? 'Yes' : 'No',
		];
	}

	/**
	 * @since 6.0
	 */
	protected function is_temporary_folder_writable(): array {
		$is_writable = wp_is_writable( $this->data->mpdf_tmp_location );

		$string = $is_writable ? __( 'Writable', 'gravityforms' ) : __( 'Not writable', 'gravityforms' );
		$icon   = $this->getController()->view->get_icon( $is_writable );

		return [
			'value'        => $string . $icon,
			'value_export' => $is_writable ? 'Writable' : 'Not writable',
		];
	}

	/**
	 * Move the Gravity PDF plugins from Active Plugins section to Add-Ons
	 *
	 * @param array $system_report
	 *
	 * @return array
	 * @since 6.0
	 */
	public function move_gravitypdf_active_plugins_to_gf_addons( $system_report ): array {
		$active_plugins = $system_report[1]['tables'][2]['items'] ?? [];

		/* Find any active Gravity PDF plugins and move to GF addons */
		foreach ( $active_plugins as $index => $plugin ) {
			if ( stripos( $plugin['label'], 'Gravity PDF' ) !== false ) {
				$system_report[0]['tables'][1]['items'][] = $plugin;
				unset( $system_report[1]['tables'][2]['items'][ $index ] );
			}
		}

		return $system_report;
	}

	/**
	 * Prepare array for the system_report format
	 *
	 * @since 6.0
	 */
	protected function prepare_report( $item ): array {
		return [
			'label'        => $item['label'],
			'label_export' => $item['label'],
			'value'        => $item['value'],
			'value_export' => $item['value_export'] ?? $item['value'],
		];
	}
}
