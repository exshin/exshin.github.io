# Creates the `messages` table.
#
# Schema choices worth noting:
#   - `author` is a plain string because there's no User model in this exercise
#     (the frontend just passes whatever the user typed). In a real app this
#     would be a `belongs_to :user`.
#   - `body` is `text`, not `string`, because `string` maps to VARCHAR(255) on
#     most DBs and a chat body might exceed that. The 2000-char ceiling is
#     enforced in the model.
#   - `null: false` on both columns mirrors the model-level presence validation
#     — a defence-in-depth so bad data can't sneak in via raw SQL.
class CreateMessages < ActiveRecord::Migration[8.1]
  def change
    create_table :messages do |t|
      t.string :author, null: false
      t.text :body, null: false
      t.timestamps
    end
  end
end
