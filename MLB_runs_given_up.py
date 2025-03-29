from pybaseball import schedule_and_record
import pandas as pd

mlb_teams = [
    'ARI', 'ATL', 'BAL', 'BOS', 'CHC', 'CHW', 'CIN', 'CLE', 'COL', 'DET',
    'HOU', 'KCR', 'LAA', 'LAD', 'MIA', 'MIL', 'MIN', 'NYM', 'NYY', 'ATH',
    'PHI', 'PIT', 'SDP', 'SFG', 'SEA', 'STL', 'TBR', 'TEX', 'TOR', 'WSN'
]

# Fetch schedule and record data for all MLB teams
schedule_records = [schedule_and_record(2025, team) for team in mlb_teams]

# Concatenate all schedule records into a single DataFrame
df = pd.concat(schedule_records, ignore_index=True)

#only keep rows with data after Japan series
#change date to string
df['Date'] = df['Date'].astype(str)
#filter out rows with dates before 3/20
df = df[~((df['Date']=='Tuesday, Mar 18') | (df['Date']=='Wednesday, Mar 19'))]

# Add a column for runs given up (opponent's score)
df['Runs Allowed'] = df['RA'].astype(int) 

# Group by team and runs given up and count occurrences
runs_given_up = df.groupby(['Tm', 'Runs Allowed']).size().unstack(fill_value=0)

#create column for games played
#use -1 to keep stats for how many games a team played - need to consider when runs allowed >13
runs_given_up['-1'] = runs_given_up.sum(axis=1) #GAMES PLAYED
#convert columns to numbers (ints)
runs_given_up.columns = runs_given_up.columns.astype(int)
#keep only columns of 13 or less runs
runs_given_up = runs_given_up.loc[:, runs_given_up.columns <= 13]
#add column for matches
runs_given_up['Matches'] = ((runs_given_up > 0).sum(axis=1))-1
#change column name to specify games played
runs_given_up = runs_given_up.rename({-1: 'Games'}, axis=1)

# List of columns
columns = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 'Matches', 'Games']

# Initialize the DataFrame with zeros
data = {col: [0] * len(mlb_teams) for col in columns}

# Create the DataFrame and set the row names to mlb_teams
ryp = pd.DataFrame(data, index=mlb_teams)

#update runs given up using the standard RYP table format
ryp.update(runs_given_up)

#sort by matches
ryp = ryp.sort_values(by='Matches', ascending=False)

# Convert all values in the DataFrame to integers
ryp = ryp.astype(int)

# Convert the DataFrame to an HTML table
html_table = ryp.to_html(table_id="runs_given_up_table")

# Create an HTML page with the table
html_page = f"""
<html>
<head>
    <title>MLB 2025 Runs Given Up</title>
    <link rel="stylesheet" type="text/css" href="mlb_runs_given_up.css">
    <script src="mlb_rgu.js"></script>
</head>
<body>
    <p> 
        <a href="https://andrewscheiner.github.io">Back to Andrew Scheiner's Website</a>
        <a href="https://runyourpool.com">Run Your Pool</a>
        <a href="https://andrewscheiner.github.io/_includes/PROJECTS/MLBRunsGivenUp/mlb_2024_runs_given_up.html">2024 Runs Given Up</a>
    </p>
    <h1>MLB 2025 Runs Given Up</h1>
    {html_table}
    <p>Data source: <a href="https://baseball-reference.com">Baseball Reference</a>, scraped using <a href="https://github.com/jldbc/pybaseball">Pybaseball</a></p>
    <p class='copyright'>© Andrew Scheiner 2025</p>
</body>
</html>
"""

# Save the HTML page to a file
with open("_includes\PROJECTS\MLBRunsGivenUp\mlb_2025_runs_given_up.html", "w") as file:
    file.write(html_page)