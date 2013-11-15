require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require 'erb'
require 'json'

# mailchimp integration variables
MAILCHIMP_API_KEY = '1ba7966ebde9df6b1e75da88f1063581-us7'

def build_mailchimp_api_url_from_key(mailchimp_api_key)
    parts = mailchimp_api_key.split('-')
    return 'https://%s.api.mailchimp.com/2.0/' % parts.last
end

get '/' do
    mailchimp_api_key = MAILCHIMP_API_KEY
    mailchimp_api_url = build_mailchimp_api_url_from_key(mailchimp_api_key)

    erb :index, locals: {
                    mailchimp_api_key: mailchimp_api_key,
                    mailchimp_api_url: mailchimp_api_url
                }
end

# old registration process
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

    recipient = params[:email] # this is bizarrely necessary

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

# def tobsonid(id) BSON::ObjectId.fromstring(id) end 
# def frombsonid(obj) obj.merge({'id' => obj['id'].tos}) end