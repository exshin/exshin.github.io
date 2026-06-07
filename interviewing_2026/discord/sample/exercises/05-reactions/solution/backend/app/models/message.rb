class Message < ApplicationRecord
  has_many :reactions, dependent: :destroy

  validates :author, :body, presence: true

  scope :chronological, -> { order(created_at: :asc) }

  # Aggregates the loaded reactions into the shape the UI wants:
  # `[{ emoji:, count:, reacted_by_me: }, ...]`. Done in Ruby (not SQL) for
  # two reasons:
  #   - We've already loaded the reactions via `includes(:reactions)` in the
  #     controller, so iterating them here is free.
  #   - The `reacted_by_me` field depends on the current user_id — easier to
  #     express as a Ruby predicate than as a SQL CASE expression.
  #
  # Sorted by descending count so the most-reacted emoji shows first.
  def reaction_summary(user_id)
    grouped = reactions.group_by(&:emoji)
    grouped.map do |emoji, list|
      {
        emoji: emoji,
        count: list.size,
        reacted_by_me: list.any? { |r| r.user_id == user_id }
      }
    end.sort_by { |r| -r[:count] }
  end

  # Centralised serializer — both the index endpoint and the toggle endpoint
  # need the same shape, so we define it once here. Avoids drift if you later
  # add a field.
  def to_payload(user_id)
    {
      id: id,
      author: author,
      body: body,
      created_at: created_at,
      reactions: reaction_summary(user_id)
    }
  end
end
