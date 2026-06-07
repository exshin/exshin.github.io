class Member < ApplicationRecord
  # A whitelist of allowed status values. `inclusion:` rejects anything else,
  # so the API can't be tricked into storing arbitrary strings.
  STATUSES = %w[online idle dnd offline].freeze

  validates :name, presence: true
  validates :handle, presence: true, uniqueness: true
  validates :status, inclusion: { in: STATUSES }

  # Scope that does the actual filtering. Note `next all if q.blank?` — a
  # blank `q` returns the entire collection (because `all` is the relation
  # builder, NOT a no-op fetch). Without that early return, the WHERE clause
  # would search for "%%" which is technically a match-all but messier.
  #
  # We use LIKE (not ILIKE) because the scaffold's DB is SQLite, where LIKE
  # is case-insensitive for ASCII by default. On Postgres you'd want ILIKE
  # or `LOWER(name) LIKE LOWER(?)`.
  scope :search, ->(q) {
    next all if q.blank?
    pattern = "%#{q}%"
    where("name LIKE :p OR handle LIKE :p", p: pattern)
  }
end
