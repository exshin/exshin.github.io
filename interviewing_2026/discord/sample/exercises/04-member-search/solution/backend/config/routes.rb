Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    # Only :index — we don't expose individual member fetches in this exercise.
    # The search endpoint reads the `q` query param from the request, which
    # doesn't need a special route.
    resources :members, only: [:index]
  end
end
