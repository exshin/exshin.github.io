module Api
  # GET /api/channels  -> list of channels for the sidebar.
  class ChannelsController < ApplicationController
    def index
      channels = Channel.order(:name)
      render json: channels.as_json(only: [:id, :name, :topic])
    end
  end
end
