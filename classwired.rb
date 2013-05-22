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
    require 'pony'
    
    Pony.mail(
        :to  => 'lindsayrattray@yahoo.com',
        :subject => 'ClassWired registration',
        :body => params[:email],
        :from => 'lindsayrattray@yahoo.com',
        :port => '587',
        :via => :smtp,
        :via_options => { 
            :address              => 'smtp.sendgrid.net', 
            :port                 => '587', 
            :enable_starttls_auto => true, 
            :user_name            => ENV['SENDGRID_USERNAME'], 
            :password             => ENV['SENDGRID_PASSWORD'], 
            :authentication       => :plain, 
            :domain               => ENV['SENDGRID_DOMAIN']
        }
    )

    content_type :json
    { :sent => 'success' }.to_json
end
