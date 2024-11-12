from flask import Blueprint


work_data_bp = Blueprint('work_data', __name__)

OPENALEX_API_URL = "https://api.openalex.org/works"
INSTITUTION_ID = "I36258959"

from .works_data import test, get_publications
from .works_metrics import get_works_metrics, fetch_groupings_endpoint