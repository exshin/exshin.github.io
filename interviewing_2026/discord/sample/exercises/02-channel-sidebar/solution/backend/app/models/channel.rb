class Channel < ApplicationRecord
  # `dependent: :destroy` cascades deletes: removing a channel removes its
  # messages. Without it you'd get FK-violation errors on channel destroy.
  has_many :messages, dependent: :destroy

  validates :name, presence: true, uniqueness: true
end
