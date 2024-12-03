from flask import Blueprint


journal_data_bp = Blueprint('journal_data', __name__)

from .journals_metrics import get_journals_stats