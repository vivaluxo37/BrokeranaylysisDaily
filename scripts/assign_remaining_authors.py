import random

def assign_remaining_authors():
    """
    Assign random authors to all remaining articles without authors
    """
    
    # Author UUIDs from the database
    authors = [
        '030695b2-4c96-4c83-b837-bd11434fe982',  # Adam Lemon
        'b7cb954e-27a1-4895-9b68-6eb9bdb4e897',  # Amir Issa
        'bd08ef61-e6c7-4243-af60-3ed5c9f45bb5',  # Broker Analysis
        'bc1ffac5-0a61-407e-b49e-d223eca56ca9',  # David Bradfield
        'ef54d377-56f8-4a11-b098-5ee450fdd139',  # Eleazar Figueroa
        '1390995c-17de-4f9e-9d9f-598280375bc3',  # Ibeth Rivero
        '1972d21a-84a8-4ad9-a9b0-1defc8732c00',  # James Hyerczyk
        '2b43d904-cafd-4bd2-b260-6fefe30b4583',  # Jim Brown
        '6e31aeda-af70-4160-b378-f371cb2d3691',  # Luc Luyet
        '3b0f0bb0-6498-4755-a03b-e1f58681725e',  # Mahmoud Alkudsi
        'cd73571d-8f37-404e-bfbc-d3f9523bdf0f',  # Marios Hadjikyriacos
        '7fe3a1fd-9379-4b94-a584-48467130f9a3',  # Piero Cingari
        'f6309044-c235-4145-b2d5-386156dcc32a',  # Samer Hasn
        '85df8fd0-47ee-4bbb-ac2e-259b43d71e48',  # Stavros Georgiadis
        '8e44030f-679b-4e3b-92ff-d8f8acc9b970',  # Yohay Elam
        '81dd6558-3345-4b6d-9b06-3f7334304129',  # Yuki Iwamura
        'ab258406-f18d-4b84-a022-9c3b893bacfd',  # Arslan Butt
        '4a384f4a-5ec5-4535-9fbb-c4adec76007b',  # Crispus Nyaga
        'c0870ab6-d417-47b7-9fae-53a25197f573'   # Javier Oliván
    ]
    
    # Generate SQL to update all remaining articles without authors
    sql_query = """
UPDATE articles 
SET author_id = (
    SELECT author_id FROM (
        VALUES 
"""
    
    # Add random author assignments for each possible article
    for i in range(50):  # Cover more than enough articles
        random_author = random.choice(authors)
        sql_query += f"        ('{random_author}'),\n"
    
    # Remove the last comma and close the VALUES clause
    sql_query = sql_query.rstrip(',\n') + "\n"
    sql_query += """    ) AS random_authors(author_id)
    ORDER BY RANDOM()
    LIMIT 1
)
WHERE author_id IS NULL;
"""
    
    # Save the SQL query
    with open('assign_remaining_authors.sql', 'w', encoding='utf-8') as f:
        f.write(sql_query)
    
    print("✓ Generated SQL to assign random authors to all remaining articles")
    print("✓ Saved to: assign_remaining_authors.sql")
    print("\nExecute this SQL in Supabase to complete all author assignments.")

if __name__ == "__main__":
    assign_remaining_authors()