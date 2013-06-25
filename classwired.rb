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
    options = {
        :address              => "smtp.gmail.com",
        :port                 => 587,
        :domain               => 'localhost.localdomain',
        :user_name            => 'classwired',#ENV['GMAIL_USERNAME'],
        :password             => 'Gtruckers1e',#ENV['GMAIL_PASSWORD'],
        :authentication       => 'plain',
        :enable_starttls_auto => true
    }
    
    Mail.defaults do
        delivery_method :smtp, options
    end

    recipient = "lindsayrattray@yahoo.com" # test if this is the problem params[:email] # this is bizarrely necessary

    begin
            mailObject = Mail.deliver do
                from 'classwired@gmail.com'
                to 'lindsayrattray@yahoo.com'
                subject 'ClassWired registration'
                body recipient
            end

        content_type :json
        { sent: 'success' }.to_json

        rescue
        halt 500
    end
end
