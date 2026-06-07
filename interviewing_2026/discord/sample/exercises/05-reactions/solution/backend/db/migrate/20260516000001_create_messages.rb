# Same Message table as exercise 01 — author + body + timestamps. Reactions
# are stored separately so a message has many reactions (defined on the model).
class CreateMessages < ActiveRecord::Migration[8.1]
  def change
    create_table :messages do |t|
      t.string :author, null: false
      t.text :body, null: false
      t.timestamps
    end
  end
end
