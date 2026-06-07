class BadWord
  BAD_WORDS = ['fool', 'silly', 'fork']
  substitutions = {
    'o' => ['0'],
    'l' => ['1', '|'],
    'i' => ['1', '!'],
    's' => ['$', '5'],
    'r' => ['4'],
  }
  # MrFool
  # MrF00l


  bad_names_without_substitutions = [
  'fool', 
  'fork', 
  'silly',
  'fooluser', 
  'forkuser', 
  'sillyuser', 
  'userfool',   
  'userfork', 
  'usersilly', 
  'afooluser', 
  'aforkuser', 
  'asillyuser', 
]

  attr_accessor :word, :bw_tree

  def initialize(word)
    @word = word 
    @bw_tree = build_bw_tree
  end

  def build_bw_tree
    root = {}
    BAD_WORDS.each do |bad_word|
      node = root
      bad_word.each_char do |c|
        node[c] ||= {}
        node = node[c]
      end
      node[:termination] =  true
    end
    root
  end


  def match_words
    word.each_char.with_index do |letter, i|
      return true if check_tree(bw_tree, letter, i) 

    end

    false
  end

  def check_tree(current_tree, letter, i)
    return true if current_tree[:termination]

    if current_tree[letter]
      # if we get to the end of the tree, and it exists, then return true
      next_letter = word[i+1]
      check_tree(current_tree[letter], next_letter, i+1)
    end
  end

end



bad_names_without_substitutions.each do |name| 
  pp BadWord.new(name).match_words
end
