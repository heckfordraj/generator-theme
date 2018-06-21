<?php

require_once get_template_directory() . '/inc/reset.php';
require_once get_template_directory() . '/inc/scripts.php';

function theme_setup() {

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );

	register_nav_menu( 'nav', __( 'Primary' ) );
}
add_action( 'after_setup_theme', 'theme_setup' );
