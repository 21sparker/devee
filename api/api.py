import time
from flask import Flask, request

app = Flask(__name__)

items = [
    {
        "id": "t1",
        "status": "Not Started",
        "title": "A task not started",
        "description": "The description of said task"
    },
        {
        "id": "t2",
        "status": "Not Started",
        "title": "A task not really  started",
        "description": "The description of said task"
    }
]


@app.route('/api/items')
def get_all_items():
    """
    Methods:
    - GET: Gets all the items in the database.
    - POST: Adds new item to database.
    """
    if request.method == 'POST':
        pass

    return {'items': items}


@app.route('/api/items/<int:item_id>', methods=['GET', 'PUT', 'DELETE'])
def edit_item(item_id):
    """
    Get, edit, or delete an item.
    """
    pass