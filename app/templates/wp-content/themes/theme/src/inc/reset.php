<?php

function remove_menus() {
  if ( current_user_can( 'administrator' ) ) return;

  remove_menu_page( 'edit.php' );
  remove_menu_page( 'edit-comments.php' );
}
add_action( 'admin_menu', 'remove_menus' );


function disable_emojis() {

  remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
  remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
  remove_action( 'wp_print_styles', 'print_emoji_styles' );
  remove_action( 'admin_print_styles', 'print_emoji_styles' );
  remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
  remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
  remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
}
add_action( 'init', 'disable_emojis' );


function disable_user_rest_endpoints( $endpoints ) {

  if ( isset( $endpoints['/wp/v2/users'] ) )
    unset( $endpoints['/wp/v2/users'] );

  if ( isset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] ) )
    unset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] );

  return $endpoints;
}
add_filter( 'rest_endpoints', 'disable_user_rest_endpoints' );


function async_scripts( $tag ) {

  if ( is_admin() ) return $tag;

  if ( strpos( $tag, '#defer' ) ) {

    $tag = str_replace( '#defer', '', $tag );
    return str_replace( 'src=', 'defer src=', $tag );
  }

  return str_replace( 'src=', 'async src=', $tag );
}
add_filter( 'script_loader_tag', 'async_scripts', 10, 2 );


function custom_excerpt_more( $more ) {

  return '…';
}
add_filter( 'excerpt_more', 'custom_excerpt_more' );


function custom_image_sizes() {

	update_option( 'medium_size_w', 1200 );
	update_option( 'large_size_w', 1800 );
}
add_action( 'after_setup_theme', 'custom_image_sizes' );


function attachment_image_lazy( $attributes ) {

  if (
    empty( $attributes['src'] ) ||
    empty( $attributes['srcset'] )
  ) return $attributes;

  $attributes['src'] = '';

  $attributes['data-srcset'] = $attributes['srcset'];
  unset( $attributes['srcset'] );

  return $attributes;
}
add_filter( 'wp_get_attachment_image_attributes', 'attachment_image_lazy' );


remove_action( 'wp_head', 'wp_generator' );
