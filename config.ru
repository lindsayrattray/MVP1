require 'rubygems'
require 'bundler'

Bundler.require

stdout.sync = true

require './classwired.rb'
run Sinatra::Application