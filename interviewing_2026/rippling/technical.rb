class Logger
  def initialize
    @handlers = []
  end

  def add_handler(handler)
    @handlers << handler
    self
  end

  def log(message)
    @handlers.each { |handler| handler.handle(message) }
  end
end

class ConsoleHandler
  attr_reader :message, :results

  def initialize
    @results = []
  end

  def handle(message)
    @message = message
    @results << message
    pp message
  end
end

class FilterHandler
  attr_reader :message, :results

  def initialize(filter)
    @filter = filter
    @results = []
  end

  def handle(message)
    @message = message
    result = message.gsub(@filter, "")
    @results << result
    pp result
  end
end

class TruncationHandler
  attr_reader :message, :results

  def initialize(max_length)
    @max_length = max_length
    @results = []
  end

  def handle(message)
    @message = message
    result = message[0, @max_length]
    @results << result
    pp result
  end
end

class UppercaseHandler
  attr_reader :message, :results

  def initialize
    @results = []
  end

  def handle(message)
    @message = message
    result = message.upcase
    @results << result
    pp result
  end
end

module KeywordFilter
  def matches_keywords?(message)
    return true if @keywords.nil? || @keywords.empty?
    @keywords.any? { |keyword| message.include?(keyword) }
  end
end

class ArrayHandler
  include KeywordFilter

  attr_reader :message, :results

  def initialize(keywords: [])
    @keywords = keywords
    @results = []
  end

  def handle(message)
    @message = message
    return unless matches_keywords?(message)
    @results << message
  end
end
