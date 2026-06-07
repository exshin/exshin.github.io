class Reaction < ApplicationRecord
  belongs_to :message

  validates :emoji, :user_id, presence: true

  # Mirrors the composite unique index in the migration. The model validation
  # gives a friendly error before hitting the DB; the DB constraint catches
  # the race-condition case where two simultaneous requests both pass the
  # validation. Belt and braces.
  validates :user_id, uniqueness: { scope: [:message_id, :emoji] }
end
