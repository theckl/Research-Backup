/**
 * @file
 * The JavaScript file for the theme.
 */

(function ($, Drupal) {
  "use strict";
  Drupal.behaviors.zen_ias = {
    attach: function (context, settings) {
      var header = $('#header');
      header.css('cursor', 'pointer');
      header.click(function () {
        window.location = '/';
      });
    }
  };
})(jQuery, Drupal);
;
