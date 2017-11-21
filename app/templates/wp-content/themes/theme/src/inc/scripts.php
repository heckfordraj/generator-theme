<?php

function theme_scripts()
{
    wp_enqueue_style('styles', get_stylesheet_uri(), null, '1.0');

    wp_enqueue_script('script', get_template_directory_uri() . '/assets/js/script.js', null, '1.0', true);
}
add_action('wp_enqueue_scripts', 'theme_scripts');
