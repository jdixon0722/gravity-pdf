<?php

namespace GFPDF\Model;

use WP_UnitTestCase;
use GFPDF_Major_Compatibility_Checks;

/**
 * @package     Gravity PDF
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

/**
 * Class Test_Model_System_Report
 *
 * @package GFPDF\Model
 *
 * @group   model
 * @group   pdf
 */
class Test_Model_System_Report extends WP_UnitTestCase {

	/**
	 * @var Model_System_Report
	 */
	protected $model;

	/**
	 * The WP Unit Test Set up function
	 */
	public function setUp() {
		global $gfpdf;

		parent::setUp();

		/* Setup our test classes */
		$this->model = new Model_System_Report( $gfpdf->options, $gfpdf->data, new GFPDF_Major_Compatibility_Checks );
	}

	public function test_get_report_structure() {
		$structure = $this->model->get_report_structure()[0];

		$this->assertArrayHasKey( 'title', $structure );
		$this->assertArrayHasKey( 'title_export', $structure );
		$this->assertArrayHasKey( 'tables', $structure );
		$this->assertSame( 4, count( $structure['tables'] ) );

	}


	public function test_move_gravitypdf_active_plugins_to_gf_addons() {
		$system_report = [];

		foreach ( $this->data_test_move_gravitypdf_active_plugins_to_gf_addons() as $plugin ) {
			$system_report[1]['tables'][2]['items'][] = [ 'label' => $plugin ];
		}

		$system_report[0]['tables'][1]['items'] = [];
		$addons                                 = $this->model->move_gravitypdf_active_plugins_to_gf_addons( $system_report );

		$this->assertSame( 3, count( $addons[0]['tables'][1]['items'] ) );
		$this->assertSame( 2, count( $addons[1]['tables'][2]['items'] ) );

	}


	protected function data_test_move_gravitypdf_active_plugins_to_gf_addons() {
		return [
			'Gravity PDF Plugin',
			'NotGravityPDF Plugin',
			'NotGravityPDF Plugin Again',
			'Gravity PDF Bulk Generator',
			'Gravity PDF Something Plugin',
		];

	}

}
