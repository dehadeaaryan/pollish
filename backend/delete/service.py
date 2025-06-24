from repository import delete_pollish_from_db, delete_pollish_s3_directory

def delete_pollish_service(pollish_id: str):
    delete_pollish_from_db(pollish_id)
    delete_pollish_s3_directory("pollish-bucket", pollish_id)
