Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    resources :messages, only: [:index] do
      # `post "reactions/toggle"` inside the messages block creates the
      # route POST /api/messages/:message_id/reactions/toggle. We don't use
      # `resources :reactions` here because the endpoint is a single action,
      # not full CRUD — a member route on the parent reads more honestly.
      post "reactions/toggle", to: "messages/reactions#toggle"
    end
  end
end
