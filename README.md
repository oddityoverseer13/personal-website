Pre-build steps
===============
Make sure after the initial git clone, you also do the following:
 - `git submodule init`
 - `git submodule update`
 - `bundle install`

Build
=====
To build the site, first make sure the variables in `_config.yaml` are correct (specifically `site.url`) and then run `jekyll build`

