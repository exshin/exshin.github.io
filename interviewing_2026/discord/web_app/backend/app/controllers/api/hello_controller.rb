module Api
  class HelloController < ApplicationController
    def show
      render json: {
        message: "Hello from Rails!",
        rails_version: Rails::VERSION::STRING,
        ruby_version: RUBY_VERSION,
        time: Time.current.iso8601
      }
    end
  end
end
