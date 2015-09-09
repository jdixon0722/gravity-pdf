<?php

namespace GFPDF\Tests;

use GFPDF\Controller\Controller_Install;
use GFPDF\Model\Model_Install;

use WP_UnitTestCase;

use Exception;

/**
 * Test Gravity PDF Installer functionality
 *
 * @package     Gravity PDF
 * @copyright   Copyright (c) 2015, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/*
    This file is part of Gravity PDF.

    Gravity PDF Copyright (C) 2015 Blue Liquid Designs

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/

/**
 * Test the model / controller for the Installer
 * @since 4.0
 * @group install
 */
class Test_Installer extends WP_UnitTestCase
{
    /**
     * Our Controller
     * @var Object
     * @since 4.0
     */
    public $controller;

    /**
     * Our Model
     * @var Object
     * @since 4.0
     */
    public $model;

    /**
     * The WP Unit Test Set up function
     * @since 4.0
     */
    public function setUp() {
        global $gfpdf;

        /* run parent method */
        parent::setUp();

        /* Setup our test classes */
        $this->model = new Model_Install( $gfpdf->form, $gfpdf->log, $gfpdf->data, $gfpdf->misc, $gfpdf->notices );

        $this->controller = new Controller_Install( $this->model, $gfpdf->form, $gfpdf->log, $gfpdf->notices, $gfpdf->data, $gfpdf->misc );
        $this->controller->init();
    }

    /**
     * Test the appropriate actions are set up
     * @since 4.0
     */
    public function test_actions() {
        $this->assertEquals( 10, has_action( 'admin_init', array( $this->controller, 'maybe_uninstall' ) ) );
        $this->assertEquals( 9999, has_action( 'wp_loaded', array( $this->controller, 'check_install_status' ) ) );

        $this->assertEquals( 10, has_action( 'init', array( $this->model, 'register_rewrite_rules' ) ) );
    }

    /**
     * Test the appropriate filters are set up
     * @since 4.0
     */
    public function test_filters() {
        $this->assertEquals( 10, has_filter( 'query_vars', array( $this->model, 'register_rewrite_tags' ) ) );
    }

    /**
     * Check if the plugin has been installed (otherwise run installer) and the version number is up to date
     * @since 4.0
     */
    public function test_install_status() {
        global $gfpdf;

        /* Check the plugin marks the appropriate data key as true when installed */
        $gfpdf->data->is_installed = false;
        $this->controller->check_install_status();
        $this->assertTrue( $gfpdf->data->is_installed );

        /* Check the current version is tracked correctly */
        delete_option( 'gfpdf_current_version' );
        $this->controller->check_install_status();
        $this->assertEquals( PDF_EXTENDED_VERSION, get_option( 'gfpdf_current_version') );
    }

    /**
     * Check our uninstaller trigger permissions are correct
     * @since 4.0
     */
    public function test_maybe_uninstall() {
        global $gfpdf;
        
        $_POST['gfpdf_uninstall'] = true;

        /* Verify nonce checks work */
        $this->assertFalse( $this->controller->maybe_uninstall() );

        /* Verify user checks work correctly */
        $_POST['gfpdf-uninstall-plugin'] = wp_create_nonce( 'gfpdf-uninstall-plugin' );

        try {
            $this->controller->maybe_uninstall();
        } catch( Exception $e ) {
            /* Expected */
        }

        $this->assertEquals( 'Cheatin&#8217; uh?', $e->getMessage() );
    }

    /**
     * Test we are marking the plugin as installed correctly
     * @since 4.0
     */
    public function test_install_plugin() {
        global $gfpdf;

        delete_option( 'gfpdf_is_installed' );
        $gfpdf->data->is_installed = false;
        $this->assertFalse( get_option( 'gfpdf_is_installed' ) );
        $this->assertFalse( $gfpdf->data->is_installed );

        $this->model->install_plugin();

        $this->assertTrue( get_option( 'gfpdf_is_installed' ) );
        $this->assertTrue( $gfpdf->data->is_installed );
    }

    /**
     * Check the multisite template location is set up correctly
     * @since 4.0
     */
    public function test_multisite_template_location() {
        $this->markTestIncomplete( 'Write unit test' );
    }

    /**
     * Check our folder structure is created as expected
     * @since 4.0
     */
    public function test_create_folder_structures() {
        global $gfpdf;

        /* Remove folder structure */
        $gfpdf->misc->rmdir( $gfpdf->data->template_location );

        /* Verify folder structure is nonexistant and then create */
        $this->assertFileNotExists( $gfpdf->data->template_location );
        $this->model->create_folder_structures();

        /* Test the results */
        $this->assertTrue( is_dir( $gfpdf->data->template_location ) );
        $this->assertTrue( is_dir( $gfpdf->data->template_font_location ) );
        $this->assertTrue( is_dir( $gfpdf->data->template_tmp_location ) );

        $this->assertTrue( is_file( $gfpdf->data->template_tmp_location . '.htaccess' ) );
        $this->assertTrue( is_file( $gfpdf->data->template_tmp_location . 'index.html' ) );
        $this->assertTrue( is_file( $gfpdf->data->template_font_location . 'index.html' ) );
        $this->assertTrue( is_file( $gfpdf->data->template_location . 'index.html' ) );
    }

    /**
     * Check our rewrite rules get registered correctly
     * @since 4.0
     */
    public function test_register_rewrite_rules() {
    	global $wp_rewrite, $gfpdf;

        $this->assertEquals( 'index.php?gf_pdf=1&pid=$matches[1]&lid=$matches[2]&action=$matches[3]', $wp_rewrite->extra_rules_top[ $gfpdf->data->permalink ] );
    }


    /**
     * Check we are uninstalling correctly
     * @since 4.0
     */
    public function test_uninstall_plugin() {
        global $gfpdf;

        /* Verify the plugin is installed correctly before removing */
        $this->assertTrue( is_dir( $gfpdf->data->template_location ) );
        $this->assertNotFalse( get_option('gfpdf_current_version') );

        /* Uninstall */
        $this->model->uninstall_plugin();

        /* Check software was uninstalled */
        $this->assertFalse( is_dir( $gfpdf->data->template_location ) );
        $this->assertFalse( get_option('gfpdf_current_version') );

        /* Reinstall */
        $this->controller->setup_defaults();

        /* Verify the install works correctly */
        $this->assertTrue( is_dir( $gfpdf->data->template_location ) );
    }

    /**
     * Check we are removing all traces of our gfpdf options
     * @since 4.0
     */
    public function test_remove_plugin_options() {
        
        $this->assertNotFalse( get_option( 'gfpdf_is_installed' ) );
        $this->assertNotFalse( get_option( 'gfpdf_current_version' ) );
        $this->assertNotFalse( get_option( 'gfpdf_settings' ) );

        $this->model->remove_plugin_options();

        $this->assertFalse( get_option( 'gfpdf_is_installed' ) );
        $this->assertFalse( get_option( 'gfpdf_current_version' ) );
        $this->assertFalse( get_option( 'gfpdf_settings' ) );
    }

    /**
     * Check we are successfully removing our GF PDF Settings
     * @since 4.0
     */
    public function test_remove_plugin_form_settings() {
        global $gfpdf;

        /* Verify the form data is there */
        $forms = $gfpdf->form->get_forms();
        foreach( $forms as $form ) {
            $this->assertTrue( isset( $form['gfpdf_form_settings'] ) );
        }

        /* Verify the form data is removed */
        $this->model->remove_plugin_form_settings();

        $forms = $gfpdf->form->get_forms();
        foreach( $forms as $form ) {
            $this->assertFalse( isset( $form['gfpdf_form_settings'] ) );
        }
    }
}
