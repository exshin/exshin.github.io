class Message < ApplicationRecord
  # `belongs_to` in Rails 5+ is required-by-default — a Message without a
  # channel_id will fail validation. That's what we want here.
  belongs_to :channel

  validates :author, :body, presence: true

  scope :chronological, -> { order(created_at: :asc) }
end
