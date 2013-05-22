require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require 'erb'
require 'json'

# def tobsonid(id) BSON::ObjectId.fromstring(id) end 
# def frombsonid(obj) obj.merge({'id' => obj['id'].tos}) end

get '/' do
  erb :index
end

post '/app/register' do

    require 'mail'
    options = { :address          => "smtp.gmail.com",
            :port                 => 587,
            :domain               => 'heroku.com',
            :user_name            => 'lindsayrattray',#ENV['GMAIL_USERNAME'],
            :password             => 'himan123',#ENV['GMAIL_PASSWORD'],
            :authentication       => 'plain',
            :enable_starttls_auto => true  }
    Mail.defaults do
      delivery_method :smtp, options
    end
    Mail.deliver do
           to 'lindsayrattray@yahoo.com'
         from 'lindsayrattray@gmail.com'
      subject 'testing sendmail'
         body 'testing sendmail'
    end

    content_type :json
    { :sent => 'success' }.to_json
end
