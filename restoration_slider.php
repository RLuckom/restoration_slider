<?php
/**
 * Plugin Name: restoration_slider
 * Plugin URI: github.com/rluckom/restoration_slider
 * Description: Image transition slider for showing restorations.
 * Version: 1.0
 * Author: raphael luckom
 * Author URI: rluckom.github.io
 * License: A "Slug" license name e.g. GPL2
 */
/*  Copyright 2014  raphael.luckom  (email : raphaelluckom@gmail.com )

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

// [bartag foo="foo-value"]
function restoration_slider( $atts ) {
    wp_enqueue_script("restoration_slider", plugins_url("/js/restoration_slider.js", __FILE__));
    extract( shortcode_atts( array(
        'before_img_id' => 0,
        "before_img_alt" => "Before",
        "before_img_title" => "Before",
        "before_img_align" => "center",
        'after_img_id' => 0,
        'after_img_alt' => "After",
        "after_img_title" => "After",
        "after_image_align" => "center",
    ), $atts ) );

    return '<div id="restoration_slider">'
              . get_image_tag($before_img_id, $before_img_alt, $before_img_title, $before_img_align)
              . get_image_tag($after_img_id, $after_img_alt, $after_img_title, $after_img_align)
           . '</div><script>window.onload=function() {restoration_slider("restoration_slider");}</script>';
}
add_shortcode( 'restoration_slider', 'restoration_slider' );
?>