import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import pytest
from service import say_hello

def test_say_hello_with_name():
    assert say_hello("Aaryan") == "Hello, Aaryan!"

def test_say_hello_with_empty_string():
    with pytest.raises(ValueError):
        say_hello("")
