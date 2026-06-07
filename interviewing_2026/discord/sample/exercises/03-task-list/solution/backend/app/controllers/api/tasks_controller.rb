module Api
  # Full RESTful CRUD over tasks.
  class TasksController < ApplicationController
    # `before_action` runs `set_task` before update/destroy and assigns @task
    # (or short-circuits with 404). DRYs out the "find or 404" boilerplate
    # that would otherwise repeat in every action. Not used for create/index
    # because they don't need an existing record.
    before_action :set_task, only: [:update, :destroy]

    def index
      # Newest-first: when you add a task, you want to see it at the top of the
      # list without scrolling.
      render json: Task.order(created_at: :desc).as_json(only: [:id, :title, :done, :created_at])
    end

    def create
      task = Task.new(task_params)
      if task.save
        render json: task.as_json(only: [:id, :title, :done, :created_at]), status: :created
      else
        render json: { errors: task.errors }, status: :unprocessable_entity
      end
    end

    def update
      # PATCH semantics: only the fields in `task_params` are touched. Sending
      # `{ task: { done: true } }` leaves `title` alone. That's why the
      # frontend can do a partial update for the toggle without re-sending the
      # title.
      if @task.update(task_params)
        render json: @task.as_json(only: [:id, :title, :done, :created_at])
      else
        render json: { errors: @task.errors }, status: :unprocessable_entity
      end
    end

    def destroy
      @task.destroy
      # 204 No Content is the conventional response for a successful delete
      # with no body. `head :no_content` is the shorthand. The frontend
      # treats both 204 and any 2xx as success.
      head :no_content
    end

    private

    def set_task
      @task = Task.find_by(id: params[:id])
      # `render` doesn't halt the request automatically — but a `before_action`
      # filter that renders DOES halt the chain, so the main action never runs.
      # That's the implicit early-return that makes this pattern work.
      render(json: { error: "task not found" }, status: :not_found) unless @task
    end

    def task_params
      params.require(:task).permit(:title, :done)
    end
  end
end
