module Api
  # GET /api/members?q=<query>
  class MembersController < ApplicationController
    # Hard cap on result size. Two reasons: (1) prevents a runaway response
    # if someone queries `?q=` against a huge table; (2) gives a deterministic
    # upper bound on payload size for the UI.
    MAX_RESULTS = 50

    def index
      members = Member.search(params[:q]).order(:name).limit(MAX_RESULTS)
      render json: members.as_json(only: [:id, :name, :handle, :status, :avatar_color])
    end
  end
end
