require 'socket'

server = TCPServer.new(2000)
clients = {}
client_key = 0

loop do

  Thread.start(server.accept) do |client|
    client_key += 1
    current_client_key = client_key
    clients[client_key] = client
    existing_client = clients[client_key]

    existing_client.puts "Welcome to the multithreaded server!"
    
    # Read client input until they type "exit"
    while line = existing_client.gets

      break if line.chomp == "exit"

      clients.map { |k, c| c.puts "You said: #{line}" unless k == current_client_key }
    end
    
    existing_client.close
  end
end
