require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require 'erb'
require 'json'
require 'httparty'

# mailchimp integration variables
MAILCHIMP_API_KEY = '1ba7966ebde9df6b1e75da88f1063581-us7'
MAILCHIMP_LISTS = {
    mvp_signup_id: 'f71cd4ae42'
}

## Return response to be near identical to called api response
def construct_response(raw)
    body = ''
    body = raw.body if raw.body
    if(raw.headers['content-type'])
        headers 'Content-Type' => raw.headers['content-type']
        if raw.headers['content-type'] == 'application/json'
            body = JSON.parse(raw.body).to_json
        end
    end
    if(raw.headers['set-cookie'])
        headers 'Set-Cookie' => raw.headers['set-cookie']
    end
    status raw.code
    response.body = body
end

## Mailchimp API Funcs
def build_mailchimp_api_url_from_key(mailchimp_api_key)
    parts = mailchimp_api_key.split('-')
    return 'https://%s.api.mailchimp.com/2.0' % parts.last
end

## App routes

get '/' do
    erb :index
end

post '/app/subscribe_to_mailchimp_list' do

    uri = "#{build_mailchimp_api_url_from_key(MAILCHIMP_API_KEY)}/lists/subscribe"
    payload = {
        apikey: MAILCHIMP_API_KEY,
        id: MAILCHIMP_LISTS[:mvp_signup_id],
        email: {email: params[:email]}
    }
    str_response = HTTParty.post( uri, :body => payload )
    construct_response(str_response)

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

    recipient = params[:email]

    begin
        Mail.deliver do
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