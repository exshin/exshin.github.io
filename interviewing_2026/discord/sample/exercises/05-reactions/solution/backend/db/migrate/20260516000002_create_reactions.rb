# Creates the `reactions` table — one row per (message, emoji, user).
#
# The composite unique index is the heart of this schema: a user can react
# with a given emoji to a given message AT MOST ONCE. This is what makes the
# toggle behaviour correct — if the row already exists we delete it; if not
# we create it. The unique constraint also protects us from race conditions
# where two simultaneous POSTs from the same user both try to insert.
class CreateReactions < ActiveRecord::Migration[8.1]
  def change
    create_table :reactions do |t|
      t.references :message, null: false, foreign_key: true
      t.string :emoji, null: false
      t.string :user_id, null: false
      t.timestamps
    end
    add_index :reactions, [:message_id, :emoji, :user_id], unique: true
  end
end
