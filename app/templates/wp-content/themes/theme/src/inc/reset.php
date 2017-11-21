<?php

function remove_menus(){

  // remove_menu_page( 'edit.php' );                   //Posts
  // remove_menu_page( 'upload.php' );                 //Media
  // remove_menu_page( 'edit.php?post_type=page' );    //Pages
  remove_menu_page( 'edit-comments.php' );          //Comments
  // remove_menu_page( 'themes.php' );                 //Appearance
  // remove_menu_page( 'plugins.php' );                //Plugins
  // remove_menu_page( 'users.php' );                  //Users
  // remove_menu_page( 'tools.php' );                  //Tools
  // remove_menu_page( 'options-general.php' );        //Settings
}
add_action( 'admin_menu', 'remove_menus' );


function remove_default_post_taxononomies() {

  unregister_taxonomy_for_object_type('category', 'post');
  unregister_taxonomy_for_object_type('post_tag', 'post');
}
add_action('init', 'remove_default_post_taxononomies');


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


function disable_rest_endpoints( $access ) {

	if( ! is_user_logged_in() ) {
		return new WP_Error( 'rest_cannot_access', __( 'Only authenticated users can access the REST API.', 'disable-json-api' ), array( 'status' => rest_authorization_required_code() ) );
	}
  return $access;
}
add_filter( 'rest_authentication_errors', 'disable_rest_endpoints' );


function async_scripts($tag, $handle) {

    if ( is_admin() ) {
        return $tag;
    }
    else {
      return str_replace( 'src', 'async src', $tag );
    }
}
add_filter('script_loader_tag', 'async_scripts', 10, 2);


remove_action('wp_head', 'wp_generator');
