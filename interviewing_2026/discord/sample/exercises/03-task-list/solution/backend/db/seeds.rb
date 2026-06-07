# A mix of done + not-done so the UI shows the strikethrough state out of the
# box. Keep idempotent via destroy_all.
Task.destroy_all

[
  ["Write Q2 planning doc", false],
  ["Reply to design review thread", false],
  ["Push release notes for 2.4", true],
  ["File ticket for the upload retry bug", false],
  ["Schedule 1:1 with manager", true]
].each do |title, done|
  Task.create!(title: title, done: done)
end

puts "Seeded #{Task.count} tasks"
