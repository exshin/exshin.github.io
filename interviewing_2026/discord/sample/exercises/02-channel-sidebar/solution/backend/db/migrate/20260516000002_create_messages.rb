# Creates the `messages` table and its association to `channels`.
#
# `t.references :channel` does three things in one line:
#   1. Adds a `channel_id` integer column.
#   2. Adds an index on `channel_id` (critical — every message lookup in this
#      exercise filters by channel, and an unindexed FK turns into a sequential
#      scan once the table grows).
#   3. With `foreign_key: true`, adds a real FK constraint so you can't insert
#      a message pointing at a non-existent channel.
class CreateMessages < ActiveRecord::Migration[8.1]
  def change
    create_table :messages do |t|
      t.references :channel, null: false, foreign_key: true
      t.string :author, null: false
      t.text :body, null: false
      t.timestamps
    end
  end
end
