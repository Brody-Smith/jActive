/**
   _                      _
  (_)    /\          _   (_)
   _    /  \    ___ | |_  _ __   __ ___
  | |  / /\ \  / __|| __|| |\ \ / // _ \
  | | / ____ \| (__ | |_ | | \ V /|  __/
  | |/_/    \_\\___| \__||_|  \_/  \___|
 _/ |
|__/

 *
 * @author Brody Smith
 * @version 0.6
 * @license GNU General Public License v2.0
 * @description jActive is a simple, yet flexible jquery plugin for applying a class based on the specified criteria.
 * @documentation http://brody-smith.github.io/jActive
 */
;(function($, window){
    $.jActive = function(el, options){

        // Avoid scope issues
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Reverse reference to the DOM object
        base.$el.data("jActive", base);

        // Override the default options, and start running the checks
        base.init = function(){
            base.options = $.extend({
                regex: {
                    getRegex  : /\/\^[\s\S]+\$\//,
                    getAttr   : /(?:\$\(([\s\S]+)\))(?:[\s]?\|[\s]?)([\S]+)/,
                    getString : /(\S+)(?:[\s]?[\|\|]{2}[\s]?)(\S+)?/
                }
            }, $.jActive.defaultOptions, options);

            base._runChecks();
        };

        // Apply the class specified via options
        base._applyClass = function() {
            base.$el.addClass(base.options.class);
        };

        // Test against the specified attribute
        base._testAttr = function(attr) {
            var t = attr[1].slice(1, -1),
                n = attr[2];

            if ($(t, base.el).attr(n) === base.options.match) {
                base._applyClass();
            }
        };

        // Test against the required match using the supplied regex
        base._testRegex = function(regex) {
            // remove slashes at start and end of supplied regex
            regex = new RegExp(regex.slice(1, -1));

            if (regex.test(base.options.match)) {
                base._applyClass();
            }
        };

        // Get all possible matches provided and run checks
        base._testString = function(string) {
            var matches = base.options.regex.getString.exec(string);
                matches.splice(0, 1);

            $.each(matches, function(i, v){
                if (v === base.options.match) {
                    base._applyClass();
                    return false;
                }
            });
        };

        base._runChecks = function() {
            var value = base.$el.data(base.options.name),
                regex = base.options.regex.getRegex.test(value),
                attr  = base.options.regex.getAttr.exec(value);

            if (regex) {
                base._testRegex(value);
            } else if (attr) {
                base._testAttr(attr);
            } else {
                base._testString(value);
            }
        };

        base.init();
    };

    $.jActive.defaultOptions = {
        class : 'active',
        name  : 'jactive',
        match : window.location.pathname
    };

    $.fn.jActive = function(options){
        return this.each(function(){
            if (!$.data(this, "jActive")) {
                $.data(this, "jActive",
                    new $.jActive(this, options)
                );
            }
        });
    };

})(jQuery, window);