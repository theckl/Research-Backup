/**
 * @file
 * Javascript file for upcoming events.
 */

(function ($, Drupal) {
  "use strict";
  /**
   * Prepares calendar data.
   */
  Drupal.behaviors.ias_calendar_upcoming_events_block = {
    attach: function (context, settings) {
      if ($('#ias-calendar-block').length) {
        $.ajax({
          url: Drupal.settings.basePath + 'calendar/json/block',
          datatype: 'json',
          success: function (events) {
            var html = '';
            var current_day = '';
            var previous_day = '';
            var start_time = '';
            var end_time = '';
            var date_start = new Date();
            var date_end = new Date();
            for (var i = 0; i < events.length; i++) {
              var event = events[i];
              date_start = new Date(event.gmt_start * 1000);
              date_end = new Date(event.gmt_end * 1000);
              current_day = date_start.format('dddd, mmmm dS');
              if (previous_day !== current_day) {
                previous_day = current_day;
                html += '<h3 class="ias-calendar-block-date">' + current_day + '</h3>';
              }
              start_time = date_start.format('h:MMtt');
              end_time = date_end.format('h:MMtt');
              html += '<div class="ias-calendar-block-event">';
              html += '<div class="ias-calendar-block-event-title">' + event.title + '</div>';
              html += '<div class="ias-calendar-block-event-time">' + start_time + ' - ' + end_time + '</div>';
              html += '<div class="ias-calendar-block-event-speaker">' + event.speaker + '</div>';
              html += '<div class="ias-calendar-block-event-location">' + event.location + '</div>';
              html += '</div>';
            }
            $('#ias-calendar-block').append(html + '<p><a href="/calendar/upcoming">More Events</a> | <a href="/calendar">Calendar</a></p>');
          }
        });
      }
    }
  };
}(jQuery, Drupal));
;
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

;
/**
 * @file
 * Javascript file the ias_issues module.
 *
 */

(function ($, Drupal) {
  "use strict";
  Drupal.behaviors.ias_issues = {
    attach: function (context, settings) {
      $.get('/issues.txt', function (data) {
        if (data) {
          $('#main-content').before('<div id="issues" class="messages warning"></div>');
          $("#issues").html(data);
        }
      });
    }
  };
}(jQuery, Drupal));
;
// Image Node Auto-Format with Auto Image Grouping.
// Original version by Steve McKenzie.
// Altered by Stella Power for jQuery version.

(function ($) {

function parse_url(url, param) {
  param = param.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  url = url.replace(/&amp;/, "&");
  var regexS = "[\\?&]"+param+"=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(url);
  if (results === null) {
    return "";
  }
  else {
    return results[1];
  }
}


function lightbox2_init_triggers(classes, rel_type, custom_class) {
  if (classes == '' || rel_type == 0) {
    return;
  }
  var settings = Drupal.settings.lightbox2;

  var link_target  = "";
  if (settings.node_link_target !== 0) {
    link_target = 'target="'+ settings.node_link_target +'"';
  }

  $("a:has("+classes+")").each(function(i) {
    if ((!settings.disable_for_gallery_lists && !settings.disable_for_acidfree_gallery_lists) || (!$(this).parents("td.giAlbumCell").attr("class") && !$(this).parents(".galleries").length && !$(this).parents(".acidfree-folder").length && !$(this).parents(".acidfree-list").length) || ($(this).parents(".galleries").length && !settings.disable_for_gallery_lists) || (($(this).parents(".acidfree-folder").length || $(this).parents(".acidfree-list").length) && !settings.disable_for_acidfree_gallery_lists)) {
      var child = $(this).find(classes);
      // Ensure the child has a class attribute we can work with.
      if ($(child).attr("class")) {
        // Set the alt text.
        var alt = $(child).attr("alt");
        if (!alt) {
          alt = "";
        }

        // Set the image node link text.
        var link_text = settings.node_link_text;
        var download_link_text = settings.download_link_text;
        var rewrite = 1;

        // Set the rel attribute.
        var rel = "lightbox";
        var lightframe = false;
        if (rel_type == "lightframe_ungrouped") {
          rel = "lightframe[]";
          lightframe = true;
        }
        else if (rel_type == "lightframe") {
          lightframe = true;
        }
        else if (rel_type == "lightbox_ungrouped") {
          rel = "lightbox[]";
        }
        if (rel_type != "lightbox_ungrouped" && rel_type != "lightframe_ungrouped") {
          rel = rel_type + "[" + $(child).attr("class") + "]";
        }

        // Set the basic href attribute - need to ensure there's no language
        // string (e.g. /en) prepended to the URL.
        var id = null;
        var href = $(child).attr("src");
        var download = null;
        var orig_href = $(this).attr("href");
        var pattern = new RegExp(settings.file_path);
        if (orig_href.match(pattern)) {
          var lang_pattern = new RegExp(Drupal.settings.basePath + "\\w\\w\\/");
          orig_href = orig_href.replace(lang_pattern, Drupal.settings.basePath);
        }
        var frame_href = orig_href;
        // Handle flickr images.
        if ($(child).attr("class").match("flickr-photo-img") ||
          $(child).attr("class").match("flickr-photoset-img")) {
          href = $(child).attr("src").replace("_s.", ".").replace("_t.", ".").replace("_m.", ".").replace("_b.", ".");
          if (rel_type != "lightbox_ungrouped" && rel_type != "lightframe_ungrouped") {
            rel = rel_type + "[flickr]";
            if ($(child).parents("div.block-flickr").attr("class")) {
              id = $(child).parents("div.block-flickr").attr("id");
              rel = rel_type + "["+ id +"]";
            }
          }
          download = href;
        }

        // Handle "image-img_assist_custom" images.
        else if ($(child).filter("img[class*=img_assist_custom]").size()) {
          // Image assist uses "+" signs for spaces which doesn't work for
          // normal links.
          if (settings.display_image_size != "original") {
            orig_href = orig_href.replace(/\+/, " ");
            href = $(child).attr("src").replace(new RegExp("\\.img_assist_custom-[0-9]+x[0-9]+"), ((settings.display_image_size === "")?settings.display_image_size:"."+ settings.display_image_size));
            if (rel_type != "lightbox_ungrouped" && rel_type != "lightframe_ungrouped") {
              rel = rel_type + "[node_images]";
            }
            if (lightframe) {
              frame_href = orig_href + "/lightbox2";
            }
          }
          else {
            rewrite = 0;
          }
        }

        // Handle "inline" images.
        else if ($(child).attr("class").match("inline")) {
          href = orig_href;
        }

        // Handle gallery2 block images.
        else if ($(child).attr("class").match("ImageFrame_image") || $(child).attr("class").match("ImageFrame_none")) {
          var thumb_id = parse_url(href, "g2_itemId");
          var new_id = parse_url(orig_href, "g2_itemId");
          if (new_id && thumb_id) {
            var g2pattern = new RegExp("g2_itemId="+thumb_id);
            var replacement = "g2_itemId="+ new_id;
            href = href.replace(g2pattern, replacement);
          }
          rel = rel_type + "[gallery2]";
          if ($(child).parents("div.block-gallery").attr("class")) {
            id = $(child).parents("div.block-gallery").attr("id");
            rel = rel_type + "["+ id +"]";
          }
          download = href;
        }


        // Set the href attribute.
        else if (settings.image_node_sizes != '()' && !custom_class) {
          if (settings.display_image_size != "original") {
            href = $(child).attr("src").replace(new RegExp(settings.image_node_sizes), ((settings.display_image_size === "")?settings.display_image_size:"."+ settings.display_image_size)).replace(/(image\/view\/\d+)(\/[\w\-]*)/, ((settings.display_image_size === "")?"$1/_original":"$1/"+ settings.display_image_size));
            if (rel_type != "lightbox_ungrouped" && rel_type != "lightframe_ungrouped") {
              rel = rel_type + "[node_images]";
              if ($(child).parents("div.block-multiblock,div.block-image").attr("class")) {
                id = $(child).parents("div.block-multiblock,div.block-image").attr("id");
                rel = rel_type + "["+ id +"]";
              }
            }
            download = $(child).attr("src").replace(new RegExp(settings.image_node_sizes), "").replace(/(image\/view\/\d+)(\/[\w\-]*)/, "$1/_original");
            if (lightframe) {
              frame_href = orig_href + "/lightbox2";
            }
          }
          else {
            rewrite = 0;
          }
        }
        // Modify the image url.
        var img_title = $(child).attr("title");
        if (!img_title) {
          img_title = $(this).attr("title");
          if (!img_title) {
            img_title = $(child).attr("alt");
          }
          $(child).attr({title: img_title});
        }
        if (lightframe) {
          href = frame_href;
        }
        if (rewrite) {
          if (!custom_class) {
            var title_link = "";
            if (link_text.length) {
              title_link = "<br /><br /><a href=\"" + orig_href + "\" id=\"lightbox2-node-link-text\" "+ link_target +" >"+ link_text + "</a>";
            }
            if (download_link_text.length && download) {
              title_link = title_link + " - <a href=\"" + download + "\" id=\"lightbox2-download-link-text\" target=\"_blank\">" + download_link_text + "</a>";
            }
            rel = rel + "[" + img_title + title_link + "]";
            $(this).attr({
              rel: rel,
              href: href
            });
          }
          else {
            if (rel_type != "lightbox_ungrouped" && rel_type != "lightframe_ungrouped") {
              rel = rel_type + "[" + $(child).attr("class") + "]";
              if ($(child).parents("div.block-image").attr("class")) {
                id = $(child).parents("div.block-image").attr("id");
                rel = rel_type + "["+ id +"]";
              }
            }
            rel = rel + "[" + img_title + "]";
            $(this).attr({
              rel: rel,
              href: orig_href
            });
          }
        }
      }
    }

  });
}

function lightbox2_image_nodes() {
  var settings = Drupal.settings.lightbox2;

  // Don't do it on the image assist popup selection screen.
  var img_assist = document.getElementById("img_assist_thumbs");
  if (!img_assist) {

    // Select the enabled image types.
    lightbox2_init_triggers(settings.trigger_lightbox_classes, "lightbox_ungrouped");
    lightbox2_init_triggers(settings.custom_trigger_classes, settings.custom_class_handler, true);
    lightbox2_init_triggers(settings.trigger_lightbox_group_classes, "lightbox");
    lightbox2_init_triggers(settings.trigger_slideshow_classes, "lightshow");
    lightbox2_init_triggers(settings.trigger_lightframe_classes, "lightframe_ungrouped");
    lightbox2_init_triggers(settings.trigger_lightframe_group_classes, "lightframe");
  }
}

Drupal.behaviors.initAutoLightbox = {
  attach: function(context, settings) {
    lightbox2_image_nodes();
  }
};

//End jQuery block
}(jQuery));
;
