Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    # Nested resources express the "messages belong to a channel" relationship
    # in the URL: /api/channels/:channel_id/messages. The `module: :channels`
    # option tells Rails the controller is Api::Channels::MessagesController
    # (file at app/controllers/api/channels/messages_controller.rb). Without
    # `module:`, Rails would look for Api::MessagesController and your nested
    # controller wouldn't be found.
    resources :channels, only: [:index] do
      resources :messages, only: [:index], module: :channels
    end
  end
end
