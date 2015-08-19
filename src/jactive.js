/**
   _                         _
  (_)       /\          _   (_)
   _       /  \    ___ | |_  _ __   __ ___
  | |     / /\ \  / __|| __|| |\ \ / // _ \
  | | _  / ____ \| (__ | |_ | | \ V /|  __/
  | |(_)/_/    \_\\___| \__||_|  \_/  \___|
 _/ |
|__/

 *
 * @author Brody Smith
 * @version 0.5
 * @license GNU General Public License v2.0
 * @description jActive is a simple, yet flexible jquery plugin for applying a class based on the specified criteria.
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
                    getString : /(\S+)(?:[\s]?[\|\|]{2}[\s]?)(\S+)?/
                }
            }, $.jActive.defaultOptions, options);

            base._runChecks();
        };

        // Apply the class specified via options
        base._applyClass = function($el){
            $el.addClass(base.options.class);
        };

        // Test against the required match using the supplied regex
        base._testRegex = function($el, regex) {
            // remove slashes at start and end of supplied regex
            regex = new RegExp(regex.slice(1, -1));

            if (regex.test(base.options.match)) {
                base._applyClass($el);
            }
        };

        // Get all possible matches provided and run checks
        base._testString = function($el, string) {
            var matches = base.options.regex.getString.exec(string);
                matches.splice(0, 1);

            $.each(matches, function(i, v){
                if (v === base.options.match) {
                    base._applyClass($el);
                    return false;
                }
            });
        };

        base._runChecks = function() {
            var value = base.$el.data(base.options.name),
                regex = base.options.regex.getRegex.test(value);

            if (regex) {
                base._testRegex(base.$el, value);
            } else {
                base._testString(base.$el, value);
            }
        };

        // Run initializer
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