<?php

function theme_scripts() {

    wp_enqueue_style(
      'styles',
      get_stylesheet_uri(),
      null,
      filemtime( get_stylesheet_directory() )
    );

    $script = '/assets/js/script.js';
    wp_enqueue_script(
      'script',
      get_template_directory_uri() . $script,
      null,
      filemtime( get_template_directory() . $script ),
      true
    );
}
add_action( 'wp_enqueue_scripts', 'theme_scripts' );
