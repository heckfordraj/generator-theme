<?php

require get_template_directory() . '/inc/reset.php';
require get_template_directory() . '/inc/scripts.php';

function theme_setup()
{
	add_theme_support('title-tag');
	add_theme_support('post-thumbnails');

	register_nav_menus(array(
		'nav' => esc_html__('Primary', 'theme'),
	));

	add_theme_support('html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	));
}
add_action('after_setup_theme', 'theme_setup');


function custom_image_sizes() {

	update_option( 'medium_size_w', 1200 );
	update_option( 'large_size_w', 1800 );
}
add_action( 'after_setup_theme', 'custom_image_sizes' );


function custom_excerpt_more( $more ) {
	return '…';
}
add_filter( 'excerpt_more', 'custom_excerpt_more' );
