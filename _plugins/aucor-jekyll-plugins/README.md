Jekyll plugins by Aucor
=======================

Collection of plugins for the Jekyll static site generator.


Overview
--------

Plugins included in this repository:

* **strip.rb** - Block tag for trimming away unwanted newlines and whitespace between them.
* **weighted_pages.rb** - Generates a page listing with pages sorted by a weight attribute.
* **hyphenate.rb** - Provides a hyphenation filter using [text-hyphen](https://rubygems.org/gems/text-hyphen)

Usage
-----

### strip.rb

Using eg. forloops to generate navigation produces often a huge amount of ugly whitespace. Wrapping the section with `{% strip %}{% endstrip %}` replaces the blocks of whitespace with one newline resulting in pretty markup.

### weighted_pages.rb

Add `weight` attribute to the front matter of your pages (like `weight: 1`) and use `site.weighted_pages` instead of `site.pages` in your loops.

Pages without the attribute are sorted to the end of the list (in the default order).

### hyphenate.rb

By default the filter hyphenates content of all paragraph tags, but this can be customized at line 19 using Nokogiri css-selectors. You probably want to use this like `{{ content | hyphenate }}`

Requires [Nokogiri](http://nokogiri.org/) & [text-hyphen](https://rubygems.org/gems/text-hyphen) gems.


Author
------

Plugins written by Janne Ala-Äijälä of [Aucor Oy](http://www.aucor.fi)


Copyright
---------

Copyright (c) 2012 Aucor Oy. Released under MIT Licence (see LICENCE for details).