require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require 'erb'
require 'json'
require 'pony'

# def tobsonid(id) BSON::ObjectId.fromstring(id) end 
# def frombsonid(obj) obj.merge({'id' => obj['id'].tos}) end

get '/' do
  erb :index
end

post '/app/register' do
    Pony.mail(
        :to  => 'lindsayrattray@yahoo.com',
        :subject => 'ClassWired registration',
        :body => params[:email],
        :from => 'lindsayrattray@yahoo.com'
    )
end