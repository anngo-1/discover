from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# define the base URL for the OpenAlex API
INSTITUTION_ID = "I36258959"



@app.route('/api/publications', methods=['GET'])
def get_publications():
    OPENALEX_API_URL = "https://api.openalex.org/works"
    try:
        page = request.args.get('page', type=int, default=1)
        per_page = 20

        response = requests.get(
            OPENALEX_API_URL,
            params={
                'mailto': 'dn007@ucsd.edu',
                'select': 'id,doi,authorships,title,display_name,publication_date,type,cited_by_count',  # Include select here
                'filter': f'authorships.institutions.id:{INSTITUTION_ID}',  # Use dynamic institution ID
                'page': page,
                'per_page': per_page
            }
        )

        response.raise_for_status()
        data = response.json()

        publications = [
            {
                'id': publication['id'],
                'title': publication['title'],
                'cited_by_count': publication['cited_by_count'],
                'doi': publication['doi'],
                'authors': [
                    {'name': authorship['author']['display_name']}
                    for authorship in publication.get('authorships', [])
                ] if publication.get('authorships') else None,
                'publication_date': publication['publication_date'],
                'journal': 'Book' if publication['type'] == 'book' else 'Journal'
            }
            for publication in data['results']
        ]

        return jsonify({
            'publications': publications,
            'total_pages': (min(data['meta']['count'], 10000) // per_page) + (1 if min(data['meta']['count'], 10000) % per_page > 0 else 0)

        })

    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
