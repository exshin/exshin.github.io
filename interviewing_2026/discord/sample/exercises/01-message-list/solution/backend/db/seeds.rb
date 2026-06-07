# Seeds are idempotent: `destroy_all` first so re-running `db:seed` gives the
# same starting state regardless of what's in the table. (Don't do this in
# production — only safe here because the DB only holds demo data.)
Message.destroy_all

[
  ["wumpus", "hey is anyone seeing the new sticker pack?"],
  ["clyde",  "yep just got it, the wave one is great"],
  ["nelly",  "lol the duck"],
  ["wumpus", "we should ship the channel reorder this week"],
  ["clyde",  "+1, I'll open the PR after standup"],
  ["nelly",  "bookmarking this thread"],
  ["wumpus", "thanks both 🫡"]
].each do |author, body|
  Message.create!(author: author, body: body)
end

puts "Seeded #{Message.count} messages"
