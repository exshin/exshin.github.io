module Api
  # Endpoints:
  #   GET  /api/messages   -> list, oldest first
  #   POST /api/messages   -> create
  class MessagesController < ApplicationController
    def index
      # `as_json(only: [...])` whitelists the attributes that go over the wire.
      # Without `only:`, ActiveRecord would happily include `updated_at` and any
      # future columns you add — explicit shapes are safer for API contracts.
      render json: Message.chronological.as_json(only: [:id, :author, :body, :created_at])
    end

    def create
      message = Message.new(message_params)
      if message.save
        # 201 Created is the right status for a successful POST that produced
        # a new resource. The body is the created record so the frontend can
        # append it to the list without a second fetch.
        render json: message.as_json(only: [:id, :author, :body, :created_at]), status: :created
      else
        # 422 Unprocessable Entity = "I understood the request but the data is
        # invalid". `message.errors` is a hash like `{ "body" => ["can't be blank"] }`
        # which the frontend turns into inline error messages.
        render json: { errors: message.errors }, status: :unprocessable_entity
      end
    end

    private

    # Strong params: only allow `author` and `body` through. Anything else
    # (e.g. `id`, `created_at`) is silently dropped — prevents a client from
    # forging timestamps or overwriting fields it shouldn't control.
    def message_params
      params.require(:message).permit(:author, :body)
    end
  end
end
