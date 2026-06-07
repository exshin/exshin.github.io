module Api
  # GET /api/messages?user_id=<id>
  class MessagesController < ApplicationController
    def index
      user_id = params[:user_id].to_s
      # `includes(:reactions)` eager-loads reactions in a single extra query,
      # avoiding the N+1 that would happen if `to_payload` lazy-loaded
      # `message.reactions` for each message in turn.
      messages = Message.chronological.includes(:reactions)
      render json: messages.map { |m| m.to_payload(user_id) }
    end
  end
end
