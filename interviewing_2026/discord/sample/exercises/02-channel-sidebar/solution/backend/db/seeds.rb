# Seeds: 5 channels with a few messages each. Order matters — destroy messages
# first because of the FK constraint (you can't drop a channel while messages
# reference it, even though `dependent: :destroy` on the model would normally
# handle it, raw destroy_all on Channel would still trip on the constraint if
# we did it the other way around).
Message.destroy_all
Channel.destroy_all

channels = [
  { name: "general",     topic: "the everyday channel" },
  { name: "announcements", topic: "team updates, releases, PSAs" },
  { name: "design",      topic: "mocks, screenshots, figma links" },
  { name: "random",      topic: "anything goes — kept SFW" },
  { name: "incidents",   topic: "active incidents and postmortems" }
].map { |attrs| Channel.create!(attrs) }

# Lookup table keyed by name so each channel gets distinct sample content.
# Makes the sidebar interactive (clicking around shows visibly different data).
samples = {
  "general" => [
    ["wumpus", "morning everyone"],
    ["clyde", "g'morning, ready for standup?"],
    ["nelly", "5 min, refilling coffee"]
  ],
  "announcements" => [
    ["wumpus", "v2.4 ships at noon PT today, queue is ready"],
    ["clyde", "release notes are in the deck pinned above"]
  ],
  "design" => [
    ["nelly", "new sticker peek 👀"],
    ["wumpus", "the duck has range honestly"]
  ],
  "random" => [
    ["clyde", "anyone seen the new pip-boy easter egg"],
    ["nelly", "where?? send screenshot"]
  ],
  "incidents" => [
    ["wumpus", "tracking elevated 5xx on uploads, investigating"],
    ["clyde", "mitigation rolling out, watching graphs"],
    ["wumpus", "all clear, drafting postmortem"]
  ]
}

channels.each do |channel|
  samples.fetch(channel.name, []).each do |author, body|
    channel.messages.create!(author: author, body: body)
  end
end

puts "Seeded #{Channel.count} channels and #{Message.count} messages"
