# Creates the `members` table.
#
# Two indexes matter here:
#   - `handle` is unique (one user per handle, like Discord usernames).
#   - `name` is non-unique but indexed because we ORDER BY name. SQLite
#     scans the whole table without it; on a real dataset the index keeps
#     the list fast.
#
# `default: "offline"` and `default: "#5865f2"` save the seeds from having
# to specify every column — also makes the DB self-consistent if someone
# creates a member with raw SQL.
class CreateMembers < ActiveRecord::Migration[8.1]
  def change
    create_table :members do |t|
      t.string :name, null: false
      t.string :handle, null: false
      t.string :status, null: false, default: "offline"
      t.string :avatar_color, null: false, default: "#5865f2"
      t.timestamps
    end
    add_index :members, :handle, unique: true
    add_index :members, :name
  end
end
