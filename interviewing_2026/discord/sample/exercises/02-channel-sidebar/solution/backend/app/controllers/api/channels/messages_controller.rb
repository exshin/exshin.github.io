module Api
  # Nested under Api::Channels so the file path mirrors the route nesting
  # (config/routes.rb declares `resources :messages` inside `:channels` with
  # `module: :channels`, which makes Rails look for the controller class here).
  module Channels
    # GET /api/channels/:channel_id/messages
    class MessagesController < ApplicationController
      def index
        # `find_by(id: ...)` returns nil instead of raising, which makes the
        # 404 path explicit. `find` would raise ActiveRecord::RecordNotFound
        # and we'd need a rescue_from. Either is fine; this is a touch clearer.
        channel = Channel.find_by(id: params[:channel_id])
        return render(json: { error: "channel not found" }, status: :not_found) unless channel

        render json: channel.messages.chronological.as_json(only: [:id, :author, :body, :created_at])
      end
    end
  end
end
