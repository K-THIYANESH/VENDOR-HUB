from bson import ObjectId


def is_valid_objectid(value):
    return ObjectId.is_valid(value)
