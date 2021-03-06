import time
from flask import Flask, request
from datetime import datetime
import sys

app = Flask(__name__)

# Different Group By Views

# 'By Status'
# 'By Due Date'
# 'By Sprint'

tasks = {
    "task-1": {
        "id": "task-1",
        "description": "Feature: User can switch between different projects/boards.",
        "dueDate": datetime.now(),
        "createdDate": datetime.now(),
    },
    "task-2": {
        "id": "task-2",
        "description": "Feature: User can add additional columns.",
        "dueDate": datetime.now(),
        "createdDate": datetime.now()
    },
    "task-3": {
        "id": "task-3",
        "description": "Fix: New cards are being added to end of column. They should be added to the beginning.",
        "dueDate": datetime.now(),
        "createdDate": datetime.now()
    },
    "task-4": {
        "id": "task-4",
        "description": "Feature: Add 'Start Date' field to tasks.",
        "dueDate": None,
        "createdDate": datetime.now()
    },
    "task-5": {
        "id": "task-5",
        "description": "Fix: 'Due Date' value of task moved one day back when edit dialog is closed.",
        "dueDate": None,
        "createdDate": datetime.now()
    }     
}

sprints = {}


columns = {
    "status-1": {
        "id": "status-1",
        "title": "To do",
        "taskIds": ["task-1", "task-2"]
    },
    "status-2": {
        "id": "status-2",
        "title": "In Progress",
        "taskIds": ["task-3", "task-4", "task-5"]
    },
    "status-3": {
        "id": "status-3",
        "title": "Complete",
        "taskIds": []
    }
}

column_order = ["column-1", "column-2", "column-3"]

groupings = {
    "status" : {
        "id": "status",
        "columns": {
            "status-1": {
                "id": "status-1",
                "title": "To do",
                "taskIds": ["task-1", "task-2"]
            },
            "status-2": {
                "id": "status-2",
                "title": "In Progress",
                "taskIds": ["task-3", "task-4", "task-5"]
            },
            "status-3": {
                "id": "status-3",
                "title": "Complete",
                "taskIds": []
            }            
        },
        "columnOrder": ["status-1", "status-2", "status-3"]
    },
    "bucket" : {
        "id": "bucket",
        "columns": {
            "bucket-1": {
                "id": "bucket-1",
                "title": "Admin",
                "taskIds": ["task-1", "task-2", "task-3"]
            },
            "bucket-2": {
                "id": "bucket-2",
                "title": "Project",
                "taskIds": ["task-4", "task-5"]
            }
        },
        "columnOrder": ["bucket-1", "bucket-2"]
    }
}


@app.route('/api/tasks', methods=('GET', 'POST'))
def get_all_tasks():
    """
    Methods:
    - GET: Gets all the tasks in the database.
    - POST: Adds new tasks to database.
    """
    if request.method == 'POST':
        data = request.json
        task = data["task"]
        columnId = data["columnId"]
        groupingId = data["groupingId"]

        # MOCK ONLY
        task["createdDate"] = datetime.now()
        task["id"] = "task-" + str((len(tasks.keys()) + 1))

        if "description" not in task:
            task["description"] = None

        if "dueDate" not in task:
            task["dueDate"] = None

        tasks[task["id"]] = task
        groupings[groupingId]["columns"][columnId]["taskIds"].insert(0, task["id"])

        # TODO: Add to database

        # TODO: Retrive from database
        return task

    # return {"tasks": tasks, "columns": columns, "columnOrder": column_order}
    return { "tasks": tasks }


@app.route('/api/tasks/<string:task_id>', methods=('GET', 'PUT', 'DELETE'))
def edit_item(task_id):
    """
    Get, edit, or delete an item.
    """
    if request.method == 'PUT':
        data = request.json

        return_dict = {}

        # Task attributes are being updated
        if "task" in data:
            task = data["task"]
            # "Update database"
            tasks[task_id] = task
            return_dict["task"] = task

        # Related task attributes are being updated
        if "taskRelated" in data:
            task_related = data["taskRelated"]
            return_dict["taskRelated"] = {}

            # Status has changed for task
            if "statusId" in task_related:
                status_columns = groupings["status"]["columns"]
                statusId = task_related["statusId"]
                previous_col = status_columns[statusId["previous"]]
                next_col = status_columns[statusId["next"]]
                previous_col["taskIds"].remove(task["id"])
                next_col["taskIds"].append(task["id"])

                return_dict["taskRelated"]["statusId"] = statusId

        return return_dict

    return {}


@app.route('/api/groupings', methods=('GET', 'POST'))
def get_all_groupings():
    """
    Methods:
    - GET: Gets all the groupings in the database.
    - POST: Adds a new grouping to database.
    """
    if request.method == 'POST':
        pass
    
    return { "groupings": groupings }

@app.route('/api/groupings/<string:grouping_id>', methods=('GET', 'PUT', 'DELETE'))
def edit_grouping(grouping_id):
    """
    Get, edit, or delete grouping.
    """
    if request.method == 'PUT':
        data = request.json

        groupings[grouping_id] = data["grouping"]

        return data
    
    return {}

@app.route('/api/groupings/<string:grouping_id>/columns/<string:column_id>', methods=('GET', 'PUT', 'DELETE'))
def edit_column(grouping_id, column_id):
    """
    Get, edit, or delete grouping.
    """
    if request.method == 'PUT':
        data = request.json

        groupings[grouping_id]["columns"][column_id] = data["column"]

        return data
    
    return {}