# Creates the `channels` table.
#
# `add_index :channels, :name, unique: true` enforces uniqueness at the DB
# level, not just in the model. Belt-and-suspenders: if two requests race to
# create a channel with the same name, the model validation might both pass
# (read-then-write isn't atomic), but the DB constraint will reject the second
# insert with a UNIQUE violation.
class CreateChannels < ActiveRecord::Migration[8.1]
  def change
    create_table :channels do |t|
      t.string :name, null: false
      t.string :topic
      t.timestamps
    end
    add_index :channels, :name, unique: true
  end
end
