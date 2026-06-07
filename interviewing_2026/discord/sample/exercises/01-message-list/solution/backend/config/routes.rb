Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # `namespace :api` prefixes every route inside with `/api` AND looks for
  # controllers under `Api::` (in app/controllers/api/...). That keeps our
  # JSON endpoints visually separate from any future HTML routes.
  namespace :api do
    # `only:` is deliberate — we don't want Rails generating /messages/:id (show)
    # or /messages/:id/edit routes that we haven't implemented. Routes you
    # haven't built shouldn't be reachable.
    resources :messages, only: [:index, :create]
  end
end
