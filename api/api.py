import time
from flask import Flask, request
from datetime import datetime

app = Flask(__name__)

# Different Group By Views

# 'By Status'
# 'By Due Date'
# 'By Sprint'

tasks = {
    "task-1": {
        "id": "task-1",
        "description": "Watch a movie",
        "dueDate": datetime.now(),
        "createdDate": datetime.now()
    },
    "task-2": {
        "id": "task-2",
        "description": "Dance in the rain",
        "dueDate": datetime.now(),
        "createdDate": datetime.now()
    },
    "task-3": {
        "id": "task-2",
        "description": "Drop a poop",
        "dueDate": datetime.now(),
        "createdDate": datetime.now()
    }
}

sprints = {}


columns = {
    "column-1": {
        "id": "column-1",
        "title": "To do",
        "taskIds": ["task-1", "task-2"]
    },
    "column-2": {
        "id": "column-2",
        "title": "In Progress",
        "taskIds": ["task-3"]
    }
}



# items = [
#     {
#         "id": "t1",
#         "status": "Not Started",
#         "title": "A task not started",
#         "dueDate": datetime.now(),
#         "description": "The description of said task"
#     },
#     {
#         "id": "t2",
#         "status": "Not Started",
#         "title": "A task not really  started",
#         "dueDate": datetime.now(),
#         "description": "The description of said task"
#     }
# ]

# Structure taken from react drag and drop course video 3
# Use it as an example for structuring your columns data
# const initialData = {
#     tasks: {
#         'task-1': { id: 'task-1', content: 'Take out the garbage' },
#         ...
#     },
#     columns: {
#         'column-1': {
#             id: 'column-1',
#             title: 'To do',
#             taskIds: ['task-1', 'task-2', 'task-3', 'task-4']
#         }
#     }
# }
# Notice how instead of adding the different column attributes to the tasks themselves, 
# a separate piece of data is managed by the columns with links to any relevant task id's
# I think this is probably a better way to do this then to simply add new attributes to the tasks

@app.route('/api/tasks')
def get_all_tasks():
    """
    Methods:
    - GET: Gets all the tasks in the database.
    - POST: Adds new tasks to database.
    """
    if request.method == 'POST':
        pass

    return {"tasks": tasks, "columns": columns}


@app.route('/api/items/<int:item_id>', methods=['GET', 'PUT', 'DELETE'])
def edit_item(item_id):
    """
    Get, edit, or delete an item.
    """
    pass