import datetime
import pyalex
from pyalex import Works
import pandas as pd
from tqdm import tqdm

pyalex.config.email = "dn007@ucsd.edu"

# ucsd openalex institution ID
institution_id = "I36258959"  

start_date = '2021-01-01'
end_date = '2024-07-31'  # Corrected to use the full date format

all_works = []

# Use tqdm for a progress bar
try:
    for works in tqdm(Works().filter(institutions={'id': institution_id},
                                     from_publication_date=start_date,
                                     to_publication_date=end_date).paginate(per_page=200, n_max=None)):
        all_works.extend(works)
    # Convert to DataFrame
    df = pd.DataFrame(all_works)

    # Save to CSV
    filename = f'institution_papers_{start_date}_to_{end_date}.csv'
    df.to_csv(filename, index=False)

    print(f"Total papers downloaded: {len(df)}")
    print(f"Data saved to {filename}")

except pyalex.api.QueryError as e:
    print(f"An error occurred: {e}")
    print("Please check your institution ID and date format.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")