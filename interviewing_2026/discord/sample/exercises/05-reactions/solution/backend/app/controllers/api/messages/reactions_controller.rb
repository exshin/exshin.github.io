module Api
  module Messages
    # POST /api/messages/:message_id/reactions/toggle
    #
    # Single endpoint instead of separate POST (add) and DELETE (remove): the
    # frontend just wants "make my reaction the opposite of what it is now",
    # which maps to one click handler and one request. Easier to wire end-to-end.
    class ReactionsController < ApplicationController
      def toggle
        message = Message.find_by(id: params[:message_id])
        return render(json: { error: "message not found" }, status: :not_found) unless message

        # Defensive: don't let an empty string become a "valid" user_id or
        # emoji. The DB has NOT NULL, but params[:foo].to_s on a missing key
        # returns "", which would slip past the constraint as a non-null
        # empty string. Reject early.
        emoji   = params[:emoji].to_s
        user_id = params[:user_id].to_s
        return render(json: { error: "emoji and user_id required" }, status: :unprocessable_entity) if emoji.empty? || user_id.empty?

        existing = message.reactions.find_by(emoji: emoji, user_id: user_id)
        if existing
          existing.destroy
        else
          message.reactions.create!(emoji: emoji, user_id: user_id)
        end

        # Reload so the aggregated reaction_summary reflects the create/destroy
        # we just did. Without reload, `message.reactions` is the pre-mutation
        # collection from when we loaded it.
        render json: message.reload.to_payload(user_id)
      end
    end
  end
end
