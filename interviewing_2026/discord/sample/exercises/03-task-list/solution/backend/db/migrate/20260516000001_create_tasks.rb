# Creates the `tasks` table.
#
# `default: false` on `done` matters: it lets the create endpoint accept just
# `{ title: "..." }` without the client having to send `done: false` explicitly.
# Both NOT NULL constraints mirror model validations.
class CreateTasks < ActiveRecord::Migration[8.1]
  def change
    create_table :tasks do |t|
      t.string :title, null: false
      t.boolean :done, null: false, default: false
      t.timestamps
    end
  end
end
