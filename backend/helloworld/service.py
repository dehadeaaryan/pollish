def say_hello(name: str) -> str:
    if not name:
        raise ValueError("Name is required")
    return f"Hello, {name}!"
