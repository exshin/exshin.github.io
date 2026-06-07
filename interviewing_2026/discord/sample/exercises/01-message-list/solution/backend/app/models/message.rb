# Message model.
#
# Validations live here (not just in the DB) so we can return friendly per-field
# errors to the client on a 422. The controller renders `record.errors` directly,
# so each validation message you see here is what the UI displays.
class Message < ApplicationRecord
  validates :author, presence: true
  validates :body, presence: true, length: { maximum: 2000 }

  # Named scope keeps controllers terse: `Message.chronological` reads better
  # than `Message.order(created_at: :asc)` at the call site, and centralises
  # "what order do we render messages in?" in one place.
  scope :chronological, -> { order(created_at: :asc) }
end
