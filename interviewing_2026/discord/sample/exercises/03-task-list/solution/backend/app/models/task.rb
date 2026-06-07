class Task < ApplicationRecord
  # 200 chars is arbitrary but reasonable for a UI-facing field — keeps the row
  # height predictable in the list view. The validation will fire on both
  # create and update.
  validates :title, presence: true, length: { maximum: 200 }
end
