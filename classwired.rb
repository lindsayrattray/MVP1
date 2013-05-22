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
            :user_name            => 'classwired',#ENV['GMAIL_USERNAME'],
            :password             => 'classwired1',#ENV['GMAIL_PASSWORD'],
            :authentication       => 'plain',
            :enable_starttls_auto => true  }
    Mail.defaults do
      delivery_method :smtp, options
    end


    recipient = params[:email] # this is bizarrely necessary
    mailObject = Mail.deliver do
         from 'lindsayrattray@gmail.com'
           to 'lindsayrattray@yahoo.com'
      subject 'ClassWired registration'
         body recipient
    end
    #if mailObject then # this is unnecessary and doesn't have the effect it should
        content_type :json
        { sent: 'success' }.to_json
    #end
end
