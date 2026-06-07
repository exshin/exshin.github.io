Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    # `resources :tasks` with all four CRUD verbs we need. We skip :show
    # because the frontend never fetches a single task — it always gets the
    # full list and updates state from the create/update responses.
    resources :tasks, only: [:index, :create, :update, :destroy]
  end
end
