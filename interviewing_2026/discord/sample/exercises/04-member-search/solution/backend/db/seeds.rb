# 18 members, spread across statuses and palette colours so the UI has visible
# variety. The handle is intentionally a short slug (used in @-mentions) and
# the display name is the full name.
Member.destroy_all

# Eight-colour palette pulled from Discord's brand-ish set. Cycled via modulo.
palette = %w[#5865f2 #57f287 #fee75c #eb459e #ed4245 #f39c12 #1abc9c #9b59b6]
statuses = %w[online idle dnd offline]

rows = [
  ["Wumpus Lee",       "wumpus"],
  ["Clyde Bauer",      "clyde"],
  ["Nelly Ortega",     "nelly"],
  ["Sara Park",        "sara"],
  ["Mateo Cruz",       "mateo"],
  ["Yuki Tanaka",      "yuki"],
  ["Priya Nair",       "priya"],
  ["Dmitri Volkov",    "dmitri"],
  ["Hana Kim",         "hana"],
  ["Liam O'Brien",     "liam"],
  ["Aria Singh",       "aria"],
  ["Noah Wright",      "noah"],
  ["Zoe Caldwell",     "zoe"],
  ["Kenji Mori",       "kenji"],
  ["Amelia Stone",     "amelia"],
  ["Felix Greene",     "felix"],
  ["Iris Holloway",    "iris"],
  ["Theo Maddox",      "theo"]
]

rows.each_with_index do |(name, handle), i|
  Member.create!(
    name: name,
    handle: handle,
    # Modulo cycling distributes statuses + colors evenly across the seed set
    # without needing to think about it row-by-row.
    status: statuses[i % statuses.size],
    avatar_color: palette[i % palette.size]
  )
end

puts "Seeded #{Member.count} members"
