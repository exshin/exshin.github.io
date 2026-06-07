# Order: destroy reactions first (FK constraint — can't drop a message while
# reactions reference it).
Reaction.destroy_all
Message.destroy_all

m1 = Message.create!(author: "wumpus", body: "shipping the redesign today 🚀")
m2 = Message.create!(author: "clyde",  body: "lol clyde escaped containment again")
m3 = Message.create!(author: "nelly",  body: "anyone else seeing slow CI?")
m4 = Message.create!(author: "wumpus", body: "PR is up if anyone wants to take a look")

# Multiple "seed users" so the counts > 1 are visible in the UI. None of these
# user_ids match what the frontend generates via crypto.randomUUID(), so the
# seeded chips render as "not reacted by you" — toggle them to see the
# highlight state flip.
[
  [m1, "🎉", "seed-user-a"],
  [m1, "🎉", "seed-user-b"],
  [m1, "🎉", "seed-user-c"],
  [m1, "❤️", "seed-user-a"],
  [m2, "😂", "seed-user-a"],
  [m2, "😂", "seed-user-b"],
  [m3, "😢", "seed-user-c"],
  [m4, "👍", "seed-user-a"],
  [m4, "👍", "seed-user-b"]
].each do |message, emoji, user_id|
  message.reactions.create!(emoji: emoji, user_id: user_id)
end

puts "Seeded #{Message.count} messages and #{Reaction.count} reactions"
