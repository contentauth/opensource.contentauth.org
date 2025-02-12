This is how to setup the Python library.

```python
# Import the C2PA Python package
from c2pa import *

# Import standard general-purpose packages
import os
import io
import logging
import json
import base64

# Import web packages used in example implementation
from flask import Flask, request, abort
from flask_cors import CORS
from waitress import serve

# Import AWS SDK package (to use KMS)
import boto3
```
